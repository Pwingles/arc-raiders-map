"""
Sync MapGenie data to maps.js with proper coordinate conversion and category mapping.
"""
import json
import re
import os

# Category ID to internal type mapping
CATEGORY_MAP = {
    # Locations
    13833: "cargoElevator",
    13834: "fieldDepot",
    13840: "location",
    13842: "lockedDoor",
    13837: "raiderCamp",
    13832: "raiderHatch",
    
    # Collectibles
    13816: "collectible",
    
    # Loot
    13823: "ammoBox",
    13940: "arcCourier",
    13946: "baronHusk",
    13817: "container",
    13945: "fieldCrate",
    13822: "grenadeTube",
    13820: "item",
    13825: "medicalBox",
    13838: "securityLocker",
    13821: "weaponCase",
    
    # Natural Resources
    13932: "agave",
    13934: "apricot",
    13839: "fruitBasket",
    13933: "greatMullein",
    13935: "mushroom",
    13931: "pricklyPear",
    
    # Missions
    13827: "quest",
    
    # Enemies
    13841: "arc",
    13828: "enemy",
    14031: "sentinel",
    14030: "surveyor",
    
    # Other
    13831: "miscellaneous",
    13930: "playerSpawn",
    13835: "supplyCall",
    13941: "zipline",
    
    # Events
    13937: "raiderCache",
    
    # Loot Zones (map to location for now)
    13927: "location",  # High Loot
    13928: "location",  # Medium Loot
}

# Map configurations with coordinate bounds
MAP_CONFIGS = {
    "dam-battlegrounds": {
        "file": "mapgenie_dam-battlegrounds.json",
        "id": "dam-battlegrounds",
        "name": "Dam Battlegrounds",
        "description": "Overgrown ruins of the Alcantara Power Plant. Toxic, waterlogged terrain with frequent ARC skirmishes.",
        "biome": "Flooded industrial exclusion zone",
        "thumbnail": "data/Dam_Battlegrounds_Map_(Server_Slam).jpg",
        "threatLevel": {"label": "High Threat", "color": "#f97316"},
        "recommendedPower": 18,
        "featuredLoot": ["Aphelion Blueprint", "Stormglass Core modules"],
        "image_url": "data/Dam_Battlegrounds_Map_(Server_Slam).jpg",
        "image_bounds": [[0, 0], [1200, 1600]],
    },
    "buried-city": {
        "file": "mapgenie_buried-city.json",
        "id": "buried-city",
        "name": "Buried City",
        "description": "A remnant of the old world amidst sand dunes. Underground city reclaimed by nature.",
        "biome": "Subterranean metro ruins",
        "thumbnail": "data/Buried_City_Map.png",
        "threatLevel": {"label": "Medium Threat", "color": "#facc15"},
        "recommendedPower": 16,
        "featuredLoot": ["Espresso Machine Parts", "Urban alloy stockpiles"],
        "image_url": "data/Buried_City_Map.png",
        "image_bounds": [[0, 0], [1200, 1600]],
    },
    "spaceport": {
        "file": "mapgenie_spaceport.json",
        "id": "spaceport",
        "name": "Spaceport",
        "description": "A derelict rocket launch facility reflecting humanity's past ambitions.",
        "biome": "Orbital launch complex",
        "thumbnail": "data/Spaceport_Map.png",
        "threatLevel": {"label": "Severe Threat", "color": "#60a5fa"},
        "recommendedPower": 22,
        "featuredLoot": ["Prototype Mods", "Fuel Depot Access Codes"],
        "image_url": "data/Spaceport_Map.png",
        "image_bounds": [[0, 0], [1200, 1600]],
    },
    "the-blue-gate": {
        "file": "mapgenie_the-blue-gate.json",
        "id": "blue-gate",
        "name": "The Blue Gate",
        "description": "A mountainous region with open hills, small towns, tunnels, and underground complexes.",
        "biome": "Foothills and subterranean caverns",
        "thumbnail": "data/The_Blue_Gate_Map.png",
        "threatLevel": {"label": "Dynamic Threat", "color": "#38bdf8"},
        "recommendedPower": 15,
        "featuredLoot": ["Rusted Gears", "Vehicle salvage"],
        "image_url": "data/The_Blue_Gate_Map.png",
        "image_bounds": [[0, 0], [1200, 1600]],
    },
    "stella-montis": {
        "file": "mapgenie_stella-montis.json",
        "id": "stella-montis",
        "name": "Stella Montis",
        "description": "An isolated mountain facility shrouded in snow, containing long-kept secrets.",
        "biome": "Polar research summit",
        "thumbnail": "data/Stella_Montis_map_lower_level.png",
        "threatLevel": {"label": "Extreme Threat", "color": "#a855f7"},
        "recommendedPower": 24,
        "featuredLoot": ["North Line tech fragments", "Cryonic alloys"],
        "image_url": "data/Stella_Montis_map_lower_level.png",
        "image_bounds": [[0, 0], [1200, 1600]],
    },
}


def get_coordinate_bounds(locations):
    """Calculate the lat/lng bounds from all locations."""
    lats = [float(loc["latitude"]) for loc in locations]
    lngs = [float(loc["longitude"]) for loc in locations]
    
    return {
        "lat_min": min(lats),
        "lat_max": max(lats),
        "lng_min": min(lngs),
        "lng_max": max(lngs),
    }


def convert_coords(lat, lng, bounds, image_bounds):
    """Convert MapGenie lat/lng to pixel coordinates for Leaflet Simple projection."""
    lat = float(lat)
    lng = float(lng)
    
    # Image bounds: [[y_min, x_min], [y_max, x_max]] = [[0, 0], [1200, 1600]]
    y_min, x_min = image_bounds[0]
    y_max, x_max = image_bounds[1]
    
    # Add padding to bounds (5% on each side)
    lat_range = bounds["lat_max"] - bounds["lat_min"]
    lng_range = bounds["lng_max"] - bounds["lng_min"]
    
    lat_min = bounds["lat_min"] - lat_range * 0.05
    lat_max = bounds["lat_max"] + lat_range * 0.05
    lng_min = bounds["lng_min"] - lng_range * 0.05
    lng_max = bounds["lng_max"] + lng_range * 0.05
    
    # Normalize lat/lng to 0-1 range
    lat_norm = (lat - lat_min) / (lat_max - lat_min)
    lng_norm = (lng - lng_min) / (lng_max - lng_min)
    
    # Convert to pixel coordinates
    # X maps from longitude, Y maps from latitude
    x = x_min + lng_norm * (x_max - x_min)
    y = y_min + lat_norm * (y_max - y_min)
    
    return [round(x, 1), round(y, 1)]


def convert_location(loc, bounds, image_bounds, map_slug):
    """Convert a MapGenie location to our format."""
    category_id = loc.get("category_id")
    item_type = CATEGORY_MAP.get(category_id, "miscellaneous")
    
    # Generate a clean ID
    item_id = f"mg-{map_slug}-{loc['id']}"
    
    coords = convert_coords(
        loc["latitude"],
        loc["longitude"],
        bounds,
        image_bounds
    )
    
    item = {
        "id": item_id,
        "title": loc.get("title", "Unknown"),
        "type": item_type,
        "coords": coords,
    }
    
    # Add description if present
    desc = loc.get("description")
    if desc:
        # Clean up markdown formatting
        desc = re.sub(r'\*\*([^*]+)\*\*', r'\1', desc)  # Remove bold
        desc = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', desc)  # Remove links
        desc = desc.replace('\n\n', ' ').replace('\n', ' ').strip()
        if desc:
            item["description"] = desc[:500]  # Limit length
    
    # Add media URL if present
    if loc.get("media") and len(loc["media"]) > 0:
        item["mediaUrl"] = loc["media"][0].get("url")
    
    # Add tags from source
    if loc.get("tags"):
        item["tags"] = loc["tags"]
    
    return item


def process_map(map_slug, config):
    """Process a single map and return the items array."""
    filepath = os.path.join(os.path.dirname(__file__), config["file"])
    
    if not os.path.exists(filepath):
        print(f"  Warning: {filepath} not found")
        return []
    
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    locations = data.get("locations", [])
    if not locations:
        print(f"  Warning: No locations in {config['file']}")
        return []
    
    bounds = get_coordinate_bounds(locations)
    print(f"  Found {len(locations)} locations")
    print(f"  Bounds: lat [{bounds['lat_min']:.4f}, {bounds['lat_max']:.4f}], lng [{bounds['lng_min']:.4f}, {bounds['lng_max']:.4f}]")
    
    items = []
    for loc in locations:
        try:
            item = convert_location(loc, bounds, config["image_bounds"], map_slug)
            items.append(item)
        except Exception as e:
            print(f"  Error converting location {loc.get('id')}: {e}")
    
    return items


def generate_maps_js():
    """Generate the complete maps.js file."""
    maps = []
    
    for map_slug, config in MAP_CONFIGS.items():
        print(f"\nProcessing {config['name']}...")
        items = process_map(map_slug, config)
        
        map_obj = {
            "id": config["id"],
            "name": config["name"],
            "description": config["description"],
            "biome": config["biome"],
            "thumbnail": config["thumbnail"],
            "threatLevel": config["threatLevel"],
            "recommendedPower": config["recommendedPower"],
            "featuredLoot": config["featuredLoot"],
            "projection": "simple",
            "zoom": {"min": -1, "max": 3, "initial": 0},
            "image": {
                "url": config["image_url"],
                "bounds": config["image_bounds"],
                "attribution": f"ARC Raiders - {config['name']}"
            },
            "items": items
        }
        maps.append(map_obj)
        print(f"  Generated {len(items)} items for {config['name']}")
    
    # Generate the JS file content
    config_obj = {
        "storageKey": "arc-raiders-progress-v1",
        "defaultMapId": "dam-battlegrounds",
        "rarityOptions": ["common", "uncommon", "rare", "legendary", "exotic"],
        "difficultyOptions": ["low", "medium", "high", "elite"],
        "categories": {
            "location": {"label": "Location", "color": "#60a5fa"},
            "cargoElevator": {"label": "Cargo Elevator", "color": "#a855f7"},
            "fieldDepot": {"label": "Field Depot", "color": "#8b5cf6"},
            "lockedDoor": {"label": "Locked Door", "color": "#ef4444"},
            "raiderCamp": {"label": "Raider Camp", "color": "#f87171"},
            "raiderHatch": {"label": "Raider Hatch", "color": "#dc2626"},
            "collectible": {"label": "Mission Objective", "color": "#38bdf8"},
            "ammoBox": {"label": "Ammo Box", "color": "#fb923c"},
            "arcCourier": {"label": "ARC Courier", "color": "#fbbf24"},
            "baronHusk": {"label": "Baron Husk", "color": "#f59e0b"},
            "container": {"label": "Container", "color": "#d97706"},
            "fieldCrate": {"label": "Field Crate", "color": "#f97316"},
            "grenadeTube": {"label": "Grenade Tube", "color": "#ea580c"},
            "item": {"label": "Item", "color": "#94a3b8"},
            "medicalBox": {"label": "Medical Box", "color": "#ef4444"},
            "securityLocker": {"label": "Security Locker", "color": "#a855f7"},
            "weaponCase": {"label": "Weapon Crate", "color": "#fb7185"},
            "agave": {"label": "Agave", "color": "#84cc16"},
            "apricot": {"label": "Apricot", "color": "#bef264"},
            "fruitBasket": {"label": "Fruit Basket", "color": "#a3e635"},
            "greatMullein": {"label": "Great Mullein", "color": "#65a30d"},
            "mushroom": {"label": "Mushroom", "color": "#4d7c0f"},
            "pricklyPear": {"label": "Prickly Pear", "color": "#3f6212"},
            "quest": {"label": "Mission", "color": "#facc15"},
            "arc": {"label": "ARC", "color": "#ef4444"},
            "enemy": {"label": "Enemy", "color": "#b91c1c"},
            "sentinel": {"label": "Sentinel", "color": "#991b1b"},
            "surveyor": {"label": "Surveyor", "color": "#7f1d1d"},
            "boss": {"label": "Boss", "color": "#c084fc"},
            "miscellaneous": {"label": "Miscellaneous", "color": "#94a3b8"},
            "playerSpawn": {"label": "Player Spawn", "color": "#22d3ee"},
            "supplyCall": {"label": "Supply Call Station", "color": "#0ea5e9"},
            "zipline": {"label": "Zipline", "color": "#0284c7"},
            "raiderCache": {"label": "Raider Cache", "color": "#ec4899"},
            "event": {"label": "Event", "color": "#d946ef"},
            "vehicleTrunk": {"label": "Vehicle Trunk", "color": "#14b8a6"},
            "extraction": {"label": "Extraction Point", "color": "#34d399"}
        },
        "maps": maps
    }
    
    js_content = f"window.arcMapsConfig = {json.dumps(config_obj, indent=2)};\n"
    
    output_path = os.path.join(os.path.dirname(__file__), "data", "maps.js")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    
    print(f"\nGenerated {output_path}")
    
    # Count totals
    total_items = sum(len(m["items"]) for m in maps)
    print(f"Total: {total_items} markers across {len(maps)} maps")


if __name__ == "__main__":
    generate_maps_js()

