"""
Sync MapGenie data to maps.js with proper coordinate conversion.
Uses pixel-based coordinate system for Leaflet CRS.Simple.
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

# Map configurations with calibration settings
# offset_x/y: Shift markers (positive = right/up, negative = left/down) in 0-1000 space
# scale_x/y: Scale marker spread (>1 = wider spread, <1 = tighter cluster)
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
        # Calibration: Our image shows more area than the playable zone
        # Need to scale down and offset to fit markers into the playable area
        "padding": 0.35,  # Large padding to push markers toward center
        "offset_x": 50,   # Shift right slightly
        "offset_y": 80,   # Shift up
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
        "padding": 0.25,
        "offset_x": 0,
        "offset_y": 0,
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
        "padding": 0.30,
        "offset_x": 30,
        "offset_y": 60,
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
        "padding": 0.20,
        "offset_x": 0,
        "offset_y": 0,
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
        "padding": 0.15,
        "offset_x": 0,
        "offset_y": 0,
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


def convert_coords(lat, lng, bounds, config, img_size=1000):
    """
    Convert MapGenie lat/lng to pixel coordinates with calibration.
    """
    lat = float(lat)
    lng = float(lng)
    
    lat_min = bounds["lat_min"]
    lat_max = bounds["lat_max"]
    lng_min = bounds["lng_min"]
    lng_max = bounds["lng_max"]
    
    # Add padding to bounds
    lat_range = lat_max - lat_min
    lng_range = lng_max - lng_min
    padding = config.get("padding", 0.05)
    
    lat_min -= lat_range * padding
    lat_max += lat_range * padding
    lng_min -= lng_range * padding
    lng_max += lng_range * padding
    
    # Normalize to 0-1 range
    lat_norm = (lat - lat_min) / (lat_max - lat_min) if lat_max != lat_min else 0.5
    lng_norm = (lng - lng_min) / (lng_max - lng_min) if lng_max != lng_min else 0.5
    
    # Convert to pixel coordinates
    y = lat_norm * img_size
    x = lng_norm * img_size
    
    # Apply offset calibration
    x += config.get("offset_x", 0)
    y += config.get("offset_y", 0)
    
    # Clamp to valid range
    x = max(0, min(img_size, x))
    y = max(0, min(img_size, y))
    
    return [round(y, 1), round(x, 1)]


def convert_location(loc, bounds, config, map_slug):
    """Convert a MapGenie location to our format."""
    category_id = loc.get("category_id")
    item_type = CATEGORY_MAP.get(category_id, "miscellaneous")
    
    # Generate a clean ID
    item_id = f"mg-{map_slug}-{loc['id']}"
    
    coords = convert_coords(loc["latitude"], loc["longitude"], bounds, config)
    
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
    print(f"  Calibration: padding={config.get('padding', 0.05)}, offset_x={config.get('offset_x', 0)}, offset_y={config.get('offset_y', 0)}")
    
    items = []
    for loc in locations:
        try:
            item = convert_location(loc, bounds, config, map_slug)
            items.append(item)
        except Exception as e:
            print(f"  Error converting location {loc.get('id')}: {e}")
    
    return items


def generate_maps_js():
    """Generate the complete maps.js file."""
    maps = []
    
    # Standard image size for coordinate space
    IMG_SIZE = 1000
    
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
            "zoom": {"min": -2, "max": 4, "initial": 0},
            "image": {
                "url": config["image_url"],
                "bounds": [[0, 0], [IMG_SIZE, IMG_SIZE]],
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
            "location": {"label": "Location", "color": "#3b82f6"},
            "cargoElevator": {"label": "Cargo Elevator", "color": "#a855f7"},
            "fieldDepot": {"label": "Field Depot", "color": "#8b5cf6"},
            "lockedDoor": {"label": "Locked Door", "color": "#f97316"},
            "raiderCamp": {"label": "Raider Camp", "color": "#78716c"},
            "raiderHatch": {"label": "Raider Hatch", "color": "#dc2626"},
            "collectible": {"label": "Mission Objective", "color": "#06b6d4"},
            "ammoBox": {"label": "Ammo Box", "color": "#f59e0b"},
            "arcCourier": {"label": "ARC Courier", "color": "#fbbf24"},
            "baronHusk": {"label": "Baron Husk", "color": "#a855f7"},
            "container": {"label": "Container", "color": "#a78bfa"},
            "fieldCrate": {"label": "Field Crate", "color": "#c084fc"},
            "grenadeTube": {"label": "Grenade Tube", "color": "#84cc16"},
            "item": {"label": "Item", "color": "#94a3b8"},
            "medicalBox": {"label": "Medical Box", "color": "#ef4444"},
            "securityLocker": {"label": "Security Locker", "color": "#ec4899"},
            "weaponCase": {"label": "Weapon Crate", "color": "#f472b6"},
            "agave": {"label": "Agave", "color": "#22c55e"},
            "apricot": {"label": "Apricot", "color": "#f59e0b"},
            "fruitBasket": {"label": "Fruit Basket", "color": "#84cc16"},
            "greatMullein": {"label": "Great Mullein", "color": "#22c55e"},
            "mushroom": {"label": "Mushroom", "color": "#a3a3a3"},
            "pricklyPear": {"label": "Prickly Pear", "color": "#16a34a"},
            "quest": {"label": "Mission", "color": "#fbbf24"},
            "arc": {"label": "ARC", "color": "#ef4444"},
            "enemy": {"label": "Enemy", "color": "#dc2626"},
            "sentinel": {"label": "Sentinel", "color": "#b91c1c"},
            "surveyor": {"label": "Surveyor", "color": "#7f1d1d"},
            "miscellaneous": {"label": "Miscellaneous", "color": "#6b7280"},
            "playerSpawn": {"label": "Player Spawn", "color": "#22d3ee"},
            "supplyCall": {"label": "Supply Call Station", "color": "#0ea5e9"},
            "zipline": {"label": "Zipline", "color": "#06b6d4"},
            "raiderCache": {"label": "Raider Cache", "color": "#f59e0b"},
            "event": {"label": "Event", "color": "#a855f7"},
            "boss": {"label": "Boss", "color": "#c084fc"},
            "vehicleTrunk": {"label": "Vehicle Trunk", "color": "#14b8a6"},
            "extraction": {"label": "Extraction Point", "color": "#22c55e"}
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
