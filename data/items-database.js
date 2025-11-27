/**
 * ARC Raiders Complete Items Database
 * Scraped and compiled from MapGenie, ARC Raiders Hub, TheGamer, PCGamer, and community guides
 * Educational project - comprehensive game data reference
 */

window.arcItemsDatabase = {
  version: "1.0.0",
  lastUpdated: "2024-11-27",
  sources: [
    { name: "MapGenie", url: "https://mapgenie.io/arc-raiders" },
    { name: "ARC Raiders Hub", url: "https://www.arc-raiders.org/en" },
    { name: "ARC Raiders Cheatsheet", url: "https://arcraiderscheatsheet.org" },
    { name: "TheGamer", url: "https://www.thegamer.com/arc-raiders-complete-map-unlock-guide" },
    { name: "PCGamer", url: "https://www.pcgamer.com/games/third-person-shooter/arc-raiders" },
    { name: "ARC DB", url: "https://arcdb.gg" }
  ],

  // ==========================================
  // CRAFTING & MATERIALS
  // ==========================================
  materials: {
    // Basic Materials
    basic: [
      { id: "canister", name: "Canister", rarity: "common", recyclable: true, spawnLocations: ["containers", "field crates"] },
      { id: "chemicals", name: "Chemicals", rarity: "common", recyclable: true, spawnLocations: ["medical boxes", "research facilities"] },
      { id: "fabric", name: "Fabric", rarity: "common", recyclable: true, spawnLocations: ["residential areas", "containers"] },
      { id: "scrap-metal", name: "Scrap Metal", rarity: "common", recyclable: true, spawnLocations: ["vehicle trunks", "industrial areas"] },
      { id: "electronic-parts", name: "Electronic Parts", rarity: "common", recyclable: true, spawnLocations: ["control towers", "research buildings"] }
    ],

    // Advanced Materials
    advanced: [
      { id: "adv-electrical", name: "Advanced Electrical Components", rarity: "rare", recyclable: false, spawnLocations: ["Hydroponic Dome Complex", "Control Tower", "Research & Administration Building"], guide: "Found in industrial zones, particularly in Dam Battlegrounds upper levels" },
      { id: "adv-mechanical", name: "Advanced Mechanical Components", rarity: "rare", recyclable: false, spawnLocations: ["Assembly Building", "Fuel Depot", "Industrial Catwalks"], guide: "High spawn rate in Spaceport mechanical areas" },
      { id: "arc-alloy", name: "ARC Alloy", rarity: "legendary", recyclable: false, spawnLocations: ["ARC Courier drops", "Boss defeats", "Security Lockers"], guide: "Rare drop from ARC enemies and high-tier containers" },
      { id: "arc-circuitry", name: "ARC Circuitry", rarity: "legendary", recyclable: false, spawnLocations: ["ARC enemies", "Sentinel defeats", "Exodus Modules"], guide: "Primary source is defeating ARC units" },
      { id: "arc-powercell", name: "Advanced ARC Powercell", rarity: "legendary", recyclable: false, spawnLocations: ["Baron Husk", "Matriarch Boss"], guide: "Rare drop from elite enemies" }
    ],

    // Refined Materials
    refined: [
      { id: "antiseptic", name: "Antiseptic", rarity: "uncommon", recyclable: false, spawnLocations: ["Hospital", "Medical facilities", "Medical Boxes"], guide: "Common in Buried City hospital area" },
      { id: "adhesive", name: "Adhesive", rarity: "uncommon", recyclable: true, spawnLocations: ["Industrial areas", "Warehouses"] },
      { id: "refined-metal", name: "Refined Metal", rarity: "uncommon", recyclable: false, spawnLocations: ["Foundries", "Industrial complexes"] }
    ],

    // Topside Materials (ARC Tech)
    topside: [
      { id: "arc-coolant", name: "ARC Coolant", rarity: "rare", recyclable: true, spawnLocations: ["ARC enemies", "Crashed ships"] },
      { id: "arc-flex-rubber", name: "ARC Flex Rubber", rarity: "rare", recyclable: true, spawnLocations: ["ARC tech crates", "Sentinels"] },
      { id: "arc-optics", name: "ARC Optics", rarity: "legendary", recyclable: false, spawnLocations: ["Surveyor defeats", "High-security areas"] }
    ],

    // Special Quest Materials
    special: [
      { id: "rusted-gears", name: "Rusted Gears", rarity: "uncommon", recyclable: false, spawnLocations: ["Vehicle Trunks", "The Blue Gate", "Buried City Warehouse"], guide: "Essential for gunsmith bench upgrades. Best farming route: Blue Gate ridge caravan (3 vehicles in sequence). Also found in Buried City: Warehouse, Marano Station, Parking Garage" },
      { id: "dog-collar", name: "Dog Collar", rarity: "uncommon", recyclable: false, spawnLocations: ["Residential Quarter (Spaceport)", "Town Hall (Buried City)"], guide: "Required for specific quests. Look in residential areas and near pet-related locations" },
      { id: "espresso-parts", name: "Espresso Machine Parts", rarity: "rare", recyclable: false, spawnLocations: ["Plaza Rosa", "Caffe Da Rosa (Buried City)"], guide: "Quest item for Espresso Quest in Buried City" }
    ]
  },

  // ==========================================
  // WEAPONS & EQUIPMENT
  // ==========================================
  weapons: {
    primary: [
      { id: "aphelion", name: "Aphelion", type: "energy rifle", rarity: "exotic", blueprintLocation: "Matriarch Boss (Dam Battlegrounds, Spaceport)", guide: "Defeat the Matriarch boss to obtain the blueprint. Boss spawns at The Breach (Dam) or Launch Towers (Spaceport)" },
      { id: "rattler", name: "Rattler", type: "assault rifle", rarity: "rare", blueprintLocation: "Weapon Cases" },
      { id: "coyote", name: "Coyote", type: "marksman rifle", rarity: "rare", blueprintLocation: "Security Lockers" },
      { id: "blackjack", name: "Blackjack", type: "shotgun", rarity: "rare", blueprintLocation: "Weapon Cases" },
      { id: "wasp", name: "Wasp", type: "SMG", rarity: "uncommon", blueprintLocation: "Field Crates" }
    ],
    secondary: [
      { id: "viper", name: "Viper", type: "pistol", rarity: "common", blueprintLocation: "Starter weapon" },
      { id: "stinger", name: "Stinger", type: "machine pistol", rarity: "uncommon", blueprintLocation: "Weapon Cases" }
    ],
    special: [
      { id: "arc-driver", name: "ARC Driver", type: "energy cannon", rarity: "legendary", blueprintLocation: "Hangar Epsilon Locker (Spaceport)", guide: "Requires key. Located in hangar row" },
      { id: "rocketeer", name: "Rocketeer", type: "rocket launcher", rarity: "legendary", blueprintLocation: "Launch Towers, Fuel Depot (Spaceport)", guide: "Clear Launch Towers and Fuel Depot for guaranteed drops" }
    ]
  },

  // ==========================================
  // NATURAL RESOURCES
  // ==========================================
  naturalResources: [
    { id: "agave", name: "Agave", category: "plant", uses: ["crafting", "healing"], spawnLocations: ["Desert areas", "Blue Gate foothills"], mapCondition: "Increased during 'Lush Blooms'" },
    { id: "apricot", name: "Apricot", category: "fruit", uses: ["consumable", "crafting"], spawnLocations: ["Orchards", "Buried City outskirts"], mapCondition: "Increased during 'Lush Blooms'" },
    { id: "lemon", name: "Lemon", category: "fruit", uses: ["consumable", "crafting"], spawnLocations: ["Agricultural areas"], mapCondition: "Increased during 'Lush Blooms'" },
    { id: "olive", name: "Olive", category: "fruit", uses: ["consumable", "crafting"], spawnLocations: ["Mediterranean zones"], mapCondition: "Increased during 'Lush Blooms'" },
    { id: "prickly-pear", name: "Prickly Pear", category: "cactus", uses: ["healing", "hydration"], spawnLocations: ["Desert biomes", "Buried City"] },
    { id: "mushroom", name: "Mushroom", category: "fungi", uses: ["crafting", "consumable"], spawnLocations: ["Caves", "Underground areas", "Stella Montis ice caves"] },
    { id: "great-mullein", name: "Great Mullein", category: "herb", uses: ["medicine", "crafting"], spawnLocations: ["Highlands", "Blue Gate meadows"] }
  ],

  // ==========================================
  // KEYS & ACCESS ITEMS
  // ==========================================
  keys: [
    { id: "blue-gate-tower-key", name: "Blue Gate Communication Tower Key", rarity: "rare", unlocks: "Communication Tower (Blue Gate)", spawnLocations: ["Random enemy drops", "Containers"] },
    { id: "spaceport-control-key", name: "Spaceport Control Tower Key", rarity: "rare", unlocks: "Control Tower A6 (Spaceport)", spawnLocations: ["Security personnel", "Locked containers"] },
    { id: "dam-admin-key", name: "Research Admin Key", rarity: "rare", unlocks: "Research & Administration upper floors", spawnLocations: ["Dam Battlegrounds security guards"] },
    { id: "hangar-epsilon-key", name: "Hangar Epsilon Key", rarity: "legendary", unlocks: "Hangar Epsilon Locker (contains ARC Driver barrel)", spawnLocations: ["Spaceport elite enemies"] },
    { id: "floodgate-cipher", name: "Floodgate Cipher", rarity: "legendary", unlocks: "Floodgate Vault Locker", spawnLocations: ["Dam Battlegrounds turbine wing"] }
  ],

  // ==========================================
  // RECYCLABLE/TRINKETS
  // ==========================================
  recyclables: [
    { id: "alarm-clock", name: "Alarm Clock", components: ["Electronic Parts", "Scrap Metal"], value: 5 },
    { id: "air-freshener", name: "Air Freshener", components: ["Chemicals"], value: 2 },
    { id: "bloated-tuna", name: "Bloated Tuna Can", components: ["Scrap Metal"], value: 1 },
    { id: "blown-fuses", name: "Blown Fuses", components: ["Electronic Parts"], value: 3 },
    { id: "broken-radio", name: "Broken Radio", components: ["Electronic Parts", "Scrap Metal"], value: 8 },
    { id: "ceramic-plate", name: "Ceramic Plate", components: ["Basic Materials"], value: 2 },
    { id: "vintage-camera", name: "Vintage Camera", components: ["Electronic Parts", "Advanced Components"], value: 15 },
    { id: "gold-watch", name: "Gold Watch", components: ["Advanced Mechanical Components"], value: 25 }
  ],

  // ==========================================
  // AMMUNITION
  // ==========================================
  ammunition: [
    { id: "light-ammo", name: "Light Ammo", weapons: ["SMGs", "Pistols", "Machine Pistols"], spawnLocations: ["Ammo Boxes", "Containers", "Enemy drops"] },
    { id: "medium-ammo", name: "Medium Ammo", weapons: ["Assault Rifles", "Marksman Rifles"], spawnLocations: ["Ammo Boxes", "Weapon Cases"] },
    { id: "heavy-ammo", name: "Heavy Ammo", weapons: ["Shotguns", "Sniper Rifles"], spawnLocations: ["Ammo Boxes", "Security Lockers"] },
    { id: "special-ammo", name: "Special Ammo", weapons: ["Energy Weapons", "Launchers"], spawnLocations: ["Rare containers", "Boss drops"] }
  ],

  // ==========================================
  // QUEST ITEMS
  // ==========================================
  questItems: [
    { 
      id: "major-aiva-mementos", 
      name: "Major Aiva's Mementos", 
      quest: "The Major's Footlocker",
      map: "dam-battlegrounds",
      location: "Ruby Residence area",
      guide: "Find the Ruby Residence building, locate Major Aiva's footlocker, retrieve the mementos. Marked near the residential towers in Dam Battlegrounds."
    },
    {
      id: "celeste-journals",
      name: "Celeste's Journals",
      quest: "Celeste's Journals",
      map: "dam-battlegrounds",
      location: "Raider outposts",
      guide: "Recover journals from multiple Raider outposts scattered across Dam Battlegrounds. Check near Raider Camp locations."
    },
    {
      id: "espresso-machine",
      name: "Espresso Machine Parts",
      quest: "Espresso Quest",
      map: "buried-city",
      location: "Plaza Rosa - Caffe Da Rosa",
      guide: "Locate Plaza Rosa area, find Caffe Da Rosa, collect espresso machine parts. One of the early quests in Buried City."
    },
    {
      id: "uplink-codes",
      name: "North Line Uplink Codes",
      quest: "North Line Uplink",
      map: "stella-montis",
      location: "Mountain Facility",
      guide: "Reactivate three uplink nodes, hold the mountain facility roof until uplink stabilizes. Summons Matriarch variant."
    },
    {
      id: "depot-codes",
      name: "Depot Access Codes",
      quest: "Fuel Siphon Operation",
      map: "spaceport",
      location: "Fuel Depot",
      guide: "Infiltrate the Fuel Depot siphon rigs. Disable depot sentries without triggering alarms, siphon three fuel tanks before ARC reinforcements arrive."
    }
  ],

  // ==========================================
  // LORE COLLECTIBLES
  // ==========================================
  loreItems: [
    { id: "lore-collapse", name: "Lore: Collapse Echoes", map: "buried-city", location: "Sunken Subway Relay", description: "Encrypted lore cache tucked inside the buried subway relay" },
    { id: "lore-north-line", name: "Lore: North Line Secrets", map: "stella-montis", location: "Mountain Facility", description: "Lore fragment related to the North Line update and facility secrets" },
    { id: "lore-polaris", name: "Lore: Polaris Vault", map: "stella-montis", location: "Ice Caves (Frozen Data Cache)", description: "Lore shard buried inside the ice caves, scanner target" }
  ],

  // ==========================================
  // ENEMIES
  // ==========================================
  enemies: {
    arc: [
      { id: "arc-grunt", name: "ARC Grunt", threat: "low", drops: ["Light Ammo", "Scrap Metal"], spawnLocations: ["All maps"] },
      { id: "arc-soldier", name: "ARC Soldier", threat: "medium", drops: ["Medium Ammo", "ARC Circuitry"], spawnLocations: ["All maps"] },
      { id: "surveyor", name: "Surveyor", threat: "high", drops: ["ARC Optics", "ARC Tech"], spawnLocations: ["Patrol routes", "High-value areas"] },
      { id: "sentinel", name: "Sentinel", threat: "high", drops: ["ARC Alloy", "Advanced Components"], spawnLocations: ["Key locations", "Boss areas"] },
      { id: "arc-courier", name: "ARC Courier", threat: "medium", drops: ["High-value loot", "Keys"], spawnLocations: ["Random spawns", "Event triggers"], guide: "Mobile target that flees when spotted. Chase down for guaranteed rare drops." }
    ],
    bosses: [
      { 
        id: "matriarch", 
        name: "Matriarch", 
        threat: "elite", 
        drops: ["Aphelion Blueprint", "ARC Powercell", "Legendary Materials"],
        spawnLocations: [
          { map: "dam-battlegrounds", location: "The Breach", coords: [680, 320] },
          { map: "spaceport", location: "Launch Towers", coords: [720, 480] }
        ],
        guide: "Elite boss requiring fireteam coordination. Spawns under specific map conditions. Primary source of Aphelion Blueprint."
      },
      {
        id: "baron-husk",
        name: "Baron Husk",
        threat: "elite",
        drops: ["Advanced ARC Powercell", "Exotic Materials"],
        spawnLocations: ["Random elite spawns"],
        guide: "Extremely rare spawn. High reward but very dangerous."
      }
    ]
  },

  // ==========================================
  // ZONE DETAILS BY MAP
  // ==========================================
  zoneDetails: {
    "dam-battlegrounds": {
      name: "Dam Battlegrounds (Alcantara Power Plant)",
      biome: "Flooded industrial exclusion zone",
      threatLevel: "High",
      recommendedPower: 18,
      regions: [
        { name: "Urban Towers", description: "Apartment buildings with rooftop access", lootTier: "medium" },
        { name: "Flooded Forest", description: "Waterlogged terrain with toxic hazards", lootTier: "low" },
        { name: "Industrial Catwalks", description: "Elevated walkways with good sightlines", lootTier: "high" },
        { name: "The Dam", description: "Central structure with multiple levels", lootTier: "high" },
        { name: "Research Complex", description: "Advanced tech and components", lootTier: "legendary" }
      ],
      keyLocations: [
        { name: "Hydroponic Dome Complex", lootTier: "high", items: ["Industrial Batteries", "Advanced Components"], position: "top-left" },
        { name: "Control Tower", lootTier: "high", items: ["Weapon Caches", "ARC Parts"], position: "center" },
        { name: "Research & Administration", lootTier: "high", items: ["Sensors", "Advanced Electronics"], position: "center" },
        { name: "Ruby Residence", lootTier: "medium", items: ["Quest Items", "Residential Loot"], position: "center-east" },
        { name: "The Breach", lootTier: "legendary", items: ["Matriarch Boss", "Aphelion Blueprint"], position: "north" },
        { name: "Pumping Station", lootTier: "medium", items: ["Industrial Materials", "Hazmat Gear"], position: "south" }
      ]
    },
    "buried-city": {
      name: "Buried City",
      biome: "Subterranean metro ruins",
      threatLevel: "Medium",
      recommendedPower: 16,
      regions: [
        { name: "Sunken Plaza", description: "Central gathering area partially buried", lootTier: "medium" },
        { name: "Subway Tunnels", description: "Underground transit network", lootTier: "medium" },
        { name: "Old Town", description: "Abandoned shops and residences", lootTier: "low" },
        { name: "Commercial District", description: "Former shopping areas", lootTier: "high" }
      ],
      keyLocations: [
        { name: "Space Travel Hub", lootTier: "high", items: ["Commercial Loot", "Tech Components"], position: "northwest" },
        { name: "Hospital", lootTier: "high", items: ["Medical Supplies", "Antiseptic"], position: "east" },
        { name: "Town Hall", lootTier: "high", items: ["Old World Artifacts", "Keys"], position: "center" },
        { name: "Plaza Rosa", lootTier: "medium", items: ["Espresso Quest Items", "Residential Loot"], position: "center" },
        { name: "Warehouse", lootTier: "medium", items: ["Rusted Gears", "Industrial Materials"], position: "south" },
        { name: "Marano Station", lootTier: "medium", items: ["Rusted Gears", "Vehicle Parts"], position: "east" },
        { name: "Parking Garage", lootTier: "medium", items: ["Rusted Gears", "Vehicle Trunks"], position: "southeast" }
      ]
    },
    "spaceport": {
      name: "Spaceport (Acerra Spaceport)",
      biome: "Orbital launch complex",
      threatLevel: "Severe",
      recommendedPower: 22,
      regions: [
        { name: "Launch Platform", description: "Open area with rocket infrastructure", lootTier: "high" },
        { name: "Terminal Buildings", description: "Multi-story structures with tight corridors", lootTier: "medium" },
        { name: "Hangars", description: "Large open spaces with vehicle access", lootTier: "high" },
        { name: "Fuel Storage", description: "Hazardous explosive materials", lootTier: "high" }
      ],
      keyLocations: [
        { name: "Departure & Arrival Buildings", lootTier: "high", items: ["Commercial Loot", "Passenger Effects"], position: "top-left" },
        { name: "Launch Towers", lootTier: "legendary", items: ["Matriarch Boss", "Rocketeer Parts"], position: "top-left" },
        { name: "Control Tower A6", lootTier: "high", items: ["Security Equipment", "Keys"], position: "bottom-right" },
        { name: "Container Storage", lootTier: "high", items: ["Bulk Materials", "Industrial Components"], position: "bottom-right" },
        { name: "Rocket Assembly", lootTier: "legendary", items: ["Industrial Batteries", "ARC Tech"], position: "center" },
        { name: "Residential Quarter", lootTier: "medium", items: ["Dog Collars", "Household Items"], position: "south" },
        { name: "Fuel Depot", lootTier: "high", items: ["Depot Access Codes", "Quest Items"], position: "east" },
        { name: "Hangar Epsilon", lootTier: "legendary", items: ["ARC Driver Barrel", "Rare Crafting Kit"], position: "south" }
      ]
    },
    "blue-gate": {
      name: "The Blue Gate",
      biome: "Foothills and subterranean caverns",
      threatLevel: "Dynamic",
      recommendedPower: 15,
      regions: [
        { name: "Open Hills", description: "Rolling terrain with scattered cover", lootTier: "low" },
        { name: "Small Towns", description: "Abandoned settlements with vehicles", lootTier: "medium" },
        { name: "Tunnel Network", description: "Underground passages connecting areas", lootTier: "medium" },
        { name: "Mountain Peaks", description: "High ground with long sightlines", lootTier: "high" }
      ],
      keyLocations: [
        { name: "Pilgrim's Peak", lootTier: "high", items: ["Top-tier Loot", "Sniper Positions"], position: "top-right" },
        { name: "Central Checkpoint", lootTier: "high", items: ["Military Equipment", "High Enemy Threat"], position: "center" },
        { name: "Ridge Caravan Route", lootTier: "medium", items: ["Rusted Gears (3 vehicles)", "Vehicle Salvage"], position: "west", guide: "Best farming route for Rusted Gears - 4 trunk locations in sequence" },
        { name: "Underground Complex", lootTier: "high", items: ["Weapons", "Tunnel Raiders Event"], position: "south" }
      ]
    },
    "stella-montis": {
      name: "Stella Montis",
      biome: "Polar research summit",
      threatLevel: "Extreme",
      recommendedPower: 24,
      regions: [
        { name: "Snowfield", description: "Open snow-covered terrain with exposure risk", lootTier: "low" },
        { name: "Research Facility", description: "Main building with North Line secrets", lootTier: "legendary" },
        { name: "Ice Caves", description: "Natural cave network beneath the mountain", lootTier: "high" },
        { name: "Summit", description: "Highest point with extreme conditions", lootTier: "legendary" }
      ],
      keyLocations: [
        { name: "Mountain Facility", lootTier: "legendary", items: ["North Line Tech Fragments", "Cryonic Alloys"], position: "center" },
        { name: "Ice Caves", lootTier: "high", items: ["Frozen Data Cache", "Lore Items"], position: "south" },
        { name: "Uplink Pylons", lootTier: "legendary", items: ["North Line Quest", "Matriarch Variant"], position: "roof" }
      ]
    }
  },

  // ==========================================
  // FARMING GUIDES
  // ==========================================
  farmingGuides: [
    {
      id: "rusted-gears-farm",
      title: "Rusted Gears Farming (Gunsmith Bench Upgrade)",
      maps: ["blue-gate", "buried-city"],
      description: "Rusted Gears are essential for upgrading the gunsmith bench. Here are the best routes:",
      routes: [
        {
          map: "blue-gate",
          name: "Ridge Caravan Route",
          efficiency: "high",
          steps: [
            "Spawn at Valley extraction point",
            "Head west to the Small Town - check first vehicle trunk",
            "Follow the ridge road north to Mountain Pass - second vehicle",
            "Continue to Roadside location - third vehicle",
            "Optional: Check Ridgeline Caravan for bonus trunk",
            "Extract or loop back"
          ],
          estimatedTime: "8-10 minutes per loop",
          expectedYield: "3-4 Rusted Gears"
        },
        {
          map: "buried-city",
          name: "Industrial Triangle",
          efficiency: "medium",
          steps: [
            "Start at Warehouse location",
            "Check all vehicle trunks and generators",
            "Move to Marano Station",
            "Finish at Parking Garage",
            "Extract at South point"
          ],
          estimatedTime: "12-15 minutes",
          expectedYield: "2-3 Rusted Gears"
        }
      ],
      tips: [
        "Vehicle trunks respawn on map reset",
        "Generators also drop Rusted Gears occasionally",
        "North Elevator area in Dam Battlegrounds has mixed results",
        "Avoid high-threat areas if solo farming"
      ]
    },
    {
      id: "aphelion-farm",
      title: "Aphelion Blueprint Acquisition",
      maps: ["dam-battlegrounds", "spaceport"],
      description: "The Aphelion is one of the most sought-after weapons. Here's how to obtain its blueprint:",
      routes: [
        {
          map: "dam-battlegrounds",
          name: "The Breach Method",
          efficiency: "high",
          steps: [
            "Form a fireteam (recommended 3+ players)",
            "Enter during specific map conditions that spawn Matriarch",
            "Navigate to The Breach area (north section)",
            "Clear surrounding enemies first",
            "Focus fire on Matriarch, avoid her AOE attacks",
            "Collect Aphelion Blueprint drop"
          ]
        },
        {
          map: "spaceport",
          name: "Launch Towers Method",
          efficiency: "medium",
          steps: [
            "Form fireteam",
            "Head to Launch Towers (top-left)",
            "Trigger Matriarch spawn conditions",
            "Use tower structures for cover",
            "Defeat Matriarch for blueprint"
          ]
        }
      ],
      tips: [
        "Matriarch spawns are not guaranteed every run",
        "Check map conditions before entering",
        "Bring high DPS weapons and healing items",
        "Blueprint is a guaranteed drop on first kill"
      ]
    }
  ],

  // ==========================================
  // GUIDE REFERENCES
  // ==========================================
  guideReferences: [
    { 
      id: "thegamer-map-guide",
      title: "Complete Map Unlock Guide",
      source: "TheGamer",
      url: "https://www.thegamer.com/arc-raiders-complete-map-unlock-guide",
      topics: ["Map unlocking", "Zone overviews", "Loot tier information"]
    },
    {
      id: "pcgamer-rusted-gears",
      title: "Rusted Gears Locations Guide",
      source: "PCGamer",
      url: "https://www.pcgamer.com/games/third-person-shooter/arc-raiders-rusted-gears-locations",
      topics: ["Rusted Gears farming", "Vehicle trunk locations", "Gunsmith upgrades"]
    },
    {
      id: "pcgamer-aphelion",
      title: "Aphelion Blueprint Location",
      source: "PCGamer",
      url: "https://www.pcgamer.com/games/third-person-shooter/arc-raiders-aphelion-blueprint-location",
      topics: ["Aphelion acquisition", "Matriarch boss", "Exotic weapons"]
    },
    {
      id: "pcgamer-majors-footlocker",
      title: "The Major's Footlocker Quest",
      source: "PCGamer",
      url: "https://www.pcgamer.com/games/third-person-shooter/arc-raiders-the-majors-footlocker",
      topics: ["Quest walkthrough", "Ruby Residence", "Dam Battlegrounds"]
    },
    {
      id: "pcgamer-celeste-journals",
      title: "Celeste's Journals Location",
      source: "PCGamer",
      url: "https://www.pcgamer.com/games/third-person-shooter/arc-raiders-celestes-journals-location",
      topics: ["Journal collection", "Raider outposts", "Story quests"]
    },
    {
      id: "youtube-crucial-items",
      title: "Every CRUCIAL Item & Their Exact Locations",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=MgjnW1WF-oQ",
      topics: ["Item locations", "Visual guide", "Gameplay footage"]
    },
    {
      id: "youtube-scrappy-upgrades",
      title: "EXACT Locations Of All Scrappy's Upgrade Materials",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=QnK42niOatU",
      topics: ["Scrappy upgrades", "Material farming", "Companion system"]
    }
  ]
};



