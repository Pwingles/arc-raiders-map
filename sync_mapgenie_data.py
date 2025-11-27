"""
Sync MapGenie data to maps.js using Mapbox GL with MapGenie's tile server.
Uses raw lat/lng coordinates - no conversion needed.
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
    13931: "naturalResource",
    
    # Enemy
    13836: "enemy",
    
    # Misc
    13841: "misc",
}

# Group configurations
GROUP_MAP = {
    2420: {"name": "Locations", "color": "#223034"},
    2417: {"name": "Collectibles", "color": "#3b82f6"},
    2419: {"name": "Loot", "color": "#f59e0b"},
    2424: {"name": "Natural Resources", "color": "#22c55e"},
    2418: {"name": "Enemy", "color": "#ef4444"},
    2423: {"name": "Misc", "color": "#64748b"},
}

# Map configurations using MapGenie's tile server
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
        "tile_url": "https://tiles.mapgenie.io/games/arc-raiders/dam-battlegrounds/default-v1/{z}/{x}/{y}.jpg",
    },
    "buried-city": {
        "file": "mapgenie_buried-city.json",
        "id": "buried-city",
        "name": "Buried City",
        "description": "Once a thriving city, now buried under layers of sand and debris.",
        "biome": "Desert urban ruins",
        "thumbnail": "data/Buried_City_Map.png",
        "threatLevel": {"label": "Moderate Threat", "color": "#eab308"},
        "recommendedPower": 15,
        "featuredLoot": ["Lost Tech Components", "Buried Artifacts"],
        "tile_url": "https://tiles.mapgenie.io/games/arc-raiders/buried-city/default-v1/{z}/{x}/{y}.jpg",
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
        "tile_url": "https://tiles.mapgenie.io/games/arc-raiders/spaceport/default-v1/{z}/{x}/{y}.jpg",
    },
    "the-blue-gate": {
        "file": "mapgenie_the-blue-gate.json",
        "id": "the-blue-gate",
        "name": "The Blue Gate",
        "description": "A mysterious area with strange energy signatures and hidden dangers.",
        "biome": "Industrial zone",
        "thumbnail": "data/The_Blue_Gate_Map.png",
        "threatLevel": {"label": "Extreme Threat", "color": "#ef4444"},
        "recommendedPower": 25,
        "featuredLoot": ["Advanced ARC Tech", "Rare Materials"],
        "tile_url": "https://tiles.mapgenie.io/games/arc-raiders/the-blue-gate/default-v1/{z}/{x}/{y}.jpg",
    },
    "stella-montis": {
        "file": "mapgenie_stella-montis.json",
        "id": "stella-montis",
        "name": "Stella Montis",
        "description": "A mountainous region with treacherous terrain and valuable resources.",
        "biome": "Alpine peaks",
        "thumbnail": "data/Stella_Montis_Map.png",
        "threatLevel": {"label": "Variable Threat", "color": "#a855f7"},
        "recommendedPower": 20,
        "featuredLoot": ["Mountain Crystals", "Rare Ores"],
        "tile_url": "https://tiles.mapgenie.io/games/arc-raiders/stella-montis/default-v1/{z}/{x}/{y}.jpg",
    },
}

def load_json_file(filepath):
    """Load a JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_bounds_from_locations(locations):
    """Get the coordinate bounds from all locations."""
    if not locations:
        return {"minLat": 0, "maxLat": 1, "minLng": -1, "maxLng": 0}
    
    lats = [float(loc["latitude"]) for loc in locations]
    lngs = [float(loc["longitude"]) for loc in locations]
    
    return {
        "minLat": min(lats),
        "maxLat": max(lats),
        "minLng": min(lngs),
        "maxLng": max(lngs),
    }

def process_map_data(map_key, config):
    """Process a single map's data file."""
    filepath = config["file"]
    
    if not os.path.exists(filepath):
        print(f"Warning: {filepath} not found, skipping...")
        return None
    
    data = load_json_file(filepath)
    
    # Extract locations
    locations = data.get("locations", [])
    groups_data = data.get("groups", [])
    
    # Get coordinate bounds for the map center
    bounds = get_bounds_from_locations(locations)
    center_lat = (bounds["minLat"] + bounds["maxLat"]) / 2
    center_lng = (bounds["minLng"] + bounds["maxLng"]) / 2
    
    # Process categories from groups
    categories = []
    category_lookup = {}
    
    for group in groups_data:
        group_id = group.get("id")
        group_info = GROUP_MAP.get(group_id, {"name": group.get("title", "Unknown"), "color": "#64748b"})
        
        for cat in group.get("categories", []):
            cat_id = cat.get("id")
            cat_type = CATEGORY_MAP.get(cat_id, cat.get("icon", "unknown"))
            
            category = {
                "id": cat_id,
                "name": cat.get("title", "Unknown"),
                "icon": cat.get("icon", "marker"),
                "type": cat_type,
                "group": group_info["name"],
                "color": group_info["color"],
                "visible": True,
            }
            categories.append(category)
            category_lookup[cat_id] = category
    
    # Process locations - use RAW coordinates for Mapbox
    items = []
    for loc in locations:
        cat_id = loc.get("category_id")
        category = category_lookup.get(cat_id)
        
        if not category:
            continue
        
        # Use raw lat/lng - Mapbox will handle them directly
        lat = float(loc["latitude"])
        lng = float(loc["longitude"])
        
        item = {
            "id": loc.get("id"),
            "name": loc.get("title", "Unknown"),
            "description": loc.get("description", ""),
            "categoryId": cat_id,
            "type": category["type"],
            "coords": [lng, lat],  # Mapbox uses [lng, lat] format!
            "media": loc.get("media", []),
        }
        items.append(item)
    
    # Build map configuration
    map_config = {
        "id": config["id"],
        "name": config["name"],
        "description": config["description"],
        "biome": config["biome"],
        "thumbnail": config["thumbnail"],
        "threatLevel": config["threatLevel"],
        "recommendedPower": config["recommendedPower"],
        "featuredLoot": config["featuredLoot"],
        "tileUrl": config["tile_url"],
        "center": [center_lng, center_lat],  # Mapbox uses [lng, lat]
        "bounds": bounds,
        "zoom": {
            "min": 9,
            "max": 14,
            "initial": 11,
        },
        "categories": categories,
        "items": items,
    }
    
    return map_config

def generate_maps_js(maps_data):
    """Generate the maps.js file content."""
    js_content = """// Auto-generated from MapGenie data - DO NOT EDIT MANUALLY
// Uses Mapbox GL with MapGenie's tile server for perfect alignment

window.arcMapsConfig = """
    
    # Convert to JSON with proper formatting
    json_str = json.dumps(maps_data, indent=2)
    
    js_content += json_str + ";\n"
    
    return js_content

def main():
    """Main entry point."""
    print("Syncing MapGenie data to maps.js...")
    
    maps_data = {}
    
    for map_key, config in MAP_CONFIGS.items():
        print(f"Processing {map_key}...")
        map_config = process_map_data(map_key, config)
        
        if map_config:
            maps_data[map_key] = map_config
            print(f"  - {len(map_config['items'])} items, {len(map_config['categories'])} categories")
    
    # Write the maps.js file
    js_content = generate_maps_js(maps_data)
    
    output_path = "data/maps.js"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\nWrote {output_path}")
    print("Sync complete!")

if __name__ == "__main__":
    main()
