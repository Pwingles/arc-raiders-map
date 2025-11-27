"""
Compare locked door coordinates between MapGenie and our conversion.
"""
import json
import re

# Read MapGenie raw data
with open('mapgenie_dam-battlegrounds.json', 'r', encoding='utf-8') as f:
    mg_data = json.load(f)

# Read our converted data
with open('data/maps.js', 'r', encoding='utf-8') as f:
    content = f.read()

json_str = re.search(r'window\.arcMapsConfig = ({.*});', content, re.DOTALL).group(1)
our_data = json.loads(json_str)

# Find locked doors in MapGenie data (category_id 13842)
mg_locked_doors = [loc for loc in mg_data['locations'] if loc['category_id'] == 13842]

# Find locked doors in our data
dam_map = next(m for m in our_data['maps'] if m['id'] == 'dam-battlegrounds')
our_locked_doors = [item for item in dam_map['items'] if item['type'] == 'lockedDoor']

print("=" * 80)
print("MapGenie Locked Doors (Raw Coordinates)")
print("=" * 80)
for door in mg_locked_doors:
    print(f"ID: {door['id']}")
    print(f"  Title: {door['title']}")
    print(f"  Lat: {door['latitude']}, Lng: {door['longitude']}")
    print()

print("=" * 80)
print("Our Locked Doors (Converted Coordinates)")
print("=" * 80)
for door in our_locked_doors:
    print(f"ID: {door['id']}")
    print(f"  Title: {door['title']}")
    print(f"  Coords: {door['coords']}")
    print()

# Calculate the coordinate ranges for all markers in MapGenie data
all_lats = [float(loc['latitude']) for loc in mg_data['locations']]
all_lngs = [float(loc['longitude']) for loc in mg_data['locations']]

print("=" * 80)
print("MapGenie Coordinate Ranges (All Markers)")
print("=" * 80)
print(f"Latitude:  min={min(all_lats):.6f}, max={max(all_lats):.6f}")
print(f"Longitude: min={min(all_lngs):.6f}, max={max(all_lngs):.6f}")

# Our image bounds
img_bounds = [[0, 0], [1200, 1600]]
print(f"\nOur Image Bounds: {img_bounds}")
print(f"Width: {img_bounds[1][1]}, Height: {img_bounds[1][0]}")

