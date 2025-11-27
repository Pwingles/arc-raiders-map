import requests
import json
import re
import os

# Maps to extract
MAPS = [
    "dam-battlegrounds",
    "buried-city", 
    "spaceport",
    "the-blue-gate",
    "stella-montis"
]

BASE_URL = "https://mapgenie.io/arc-raiders/maps/"

def extract_json_object(text, start_pos):
    """Extract a complete JSON object starting at start_pos by counting braces"""
    if text[start_pos] != '{':
        return None
    
    depth = 0
    in_string = False
    escape_next = False
    
    for i in range(start_pos, len(text)):
        char = text[i]
        
        if escape_next:
            escape_next = False
            continue
            
        if char == '\\' and in_string:
            escape_next = True
            continue
            
        if char == '"' and not escape_next:
            in_string = not in_string
            continue
            
        if in_string:
            continue
            
        if char == '{':
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0:
                return text[start_pos:i+1]
    
    return None

def extract_map_data(slug):
    """Extract mapData from a MapGenie page"""
    url = BASE_URL + slug
    print(f"Fetching {url}...")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"  Error: Status {response.status_code}")
        return None
    
    content = response.text
    
    # Find the start of mapData
    marker = 'window.mapData = '
    start_idx = content.find(marker)
    
    if start_idx == -1:
        print("  Could not find window.mapData")
        return None
    
    json_start = start_idx + len(marker)
    json_str = extract_json_object(content, json_start)
    
    if json_str:
        try:
            data = json.loads(json_str)
            locations_count = len(data.get('locations', []))
            categories_count = sum(len(g.get('categories', [])) for g in data.get('groups', []))
            print(f"  Found {locations_count} locations, {categories_count} categories")
            return data
        except json.JSONDecodeError as e:
            print(f"  JSON parse error: {e}")
            # Save raw for debugging
            with open(f"raw_{slug}.txt", "w", encoding="utf-8") as f:
                f.write(json_str[:10000])
            return None
    else:
        print("  Could not extract JSON object")
        return None

def main():
    all_data = {
        "game": "ARC Raiders",
        "source": "MapGenie (mapgenie.io/arc-raiders)",
        "extraction_notes": "Contains marker categories, groups, and location data",
        "maps": {}
    }
    
    for slug in MAPS:
        data = extract_map_data(slug)
        if data:
            all_data["maps"][slug] = data
    
    # Save combined data
    output_file = "mapgenie_arc_raiders_data.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved combined data to {output_file}")
    
    # Also save individual map files for easier access
    for slug, data in all_data["maps"].items():
        output_file = f"mapgenie_{slug}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved {output_file}")
    
    # Print summary
    print("\n=== SUMMARY ===")
    for slug, data in all_data["maps"].items():
        locations = data.get('locations', [])
        groups = data.get('groups', [])
        print(f"\n{slug}:")
        print(f"  - {len(locations)} total location markers")
        for group in groups:
            cat_count = len(group.get('categories', []))
            if cat_count > 0:
                print(f"  - Group '{group['title']}': {cat_count} categories")
        
        # Count locations by category
        category_counts = {}
        for loc in locations:
            cat_id = loc.get('category_id')
            category_counts[cat_id] = category_counts.get(cat_id, 0) + 1
        
        # Map category IDs to names
        cat_names = {}
        for group in groups:
            for cat in group.get('categories', []):
                cat_names[cat['id']] = cat['title']
        
        print("  Location counts by type:")
        for cat_id, count in sorted(category_counts.items(), key=lambda x: -x[1]):
            name = cat_names.get(cat_id, f"Unknown ({cat_id})")
            print(f"    - {name}: {count}")

if __name__ == "__main__":
    main()
