window.arcMapsConfig = {
  storageKey: "arc-raiders-progress-v1",
  defaultMapId: "dam-battlegrounds",
  rarityOptions: ["common", "uncommon", "rare", "legendary", "exotic"],
  difficultyOptions: ["low", "medium", "high", "elite"],
  categories: {
    // Locations
    location: { label: "Location", color: "#60a5fa" },
    cargoElevator: { label: "Cargo Elevator", color: "#a855f7" },
    fieldDepot: { label: "Field Depot", color: "#8b5cf6" },
    lockedDoor: { label: "Locked Door", color: "#ef4444" },
    raiderCamp: { label: "Raider Camp", color: "#f87171" },
    raiderHatch: { label: "Raider Hatch", color: "#dc2626" },
    
    // Collectibles
    collectible: { label: "Mission Objective", color: "#38bdf8" },
    
    // Loot
    ammoBox: { label: "Ammo Box", color: "#fb923c" },
    arcCourier: { label: "ARC Courier", color: "#fbbf24" },
    baronHusk: { label: "Baron Husk", color: "#f59e0b" },
    container: { label: "Container", color: "#d97706" },
    fieldCrate: { label: "Field Crate", color: "#f97316" },
    grenadeTube: { label: "Grenade Tube", color: "#ea580c" },
    item: { label: "Item", color: "#94a3b8" },
    medicalBox: { label: "Medical Box", color: "#ef4444" },
    securityLocker: { label: "Security Locker", color: "#a855f7" },
    weaponCase: { label: "Weapon Crate", color: "#fb7185" },
    
    // Natural Resources
    agave: { label: "Agave", color: "#84cc16" },
    apricot: { label: "Apricot", color: "#bef264" },
    fruitBasket: { label: "Fruit Basket", color: "#a3e635" },
    greatMullein: { label: "Great Mullein", color: "#65a30d" },
    mushroom: { label: "Mushroom", color: "#4d7c0f" },
    pricklyPear: { label: "Prickly Pear", color: "#3f6212" },
    
    // Missions
    quest: { label: "Mission", color: "#facc15" },
    
    // Enemies
    arc: { label: "ARC", color: "#ef4444" },
    enemy: { label: "Enemy", color: "#b91c1c" },
    sentinel: { label: "Sentinel", color: "#991b1b" },
    surveyor: { label: "Surveyor", color: "#7f1d1d" },
    boss: { label: "Boss", color: "#c084fc" },
    
    // Other
    miscellaneous: { label: "Miscellaneous", color: "#94a3b8" },
    playerSpawn: { label: "Player Spawn", color: "#22d3ee" },
    supplyCall: { label: "Supply Call Station", color: "#0ea5e9" },
    zipline: { label: "Zipline", color: "#0284c7" },
    
    // Events
    raiderCache: { label: "Raider Cache", color: "#ec4899" },
    event: { label: "Event", color: "#d946ef" },
    
    // Legacy mappings (kept for compatibility, remapped in UI)
    vehicleTrunk: { label: "Vehicle Trunk", color: "#14b8a6" },
    extraction: { label: "Extraction Point", color: "#34d399" }
  },
  maps: [
    {
      id: "dam-battlegrounds",
      name: "Dam Battlegrounds",
      description:
        "Overgrown ruins of the Alcantara Power Plant. Toxic, waterlogged terrain with frequent ARC skirmishes. Features the Control Tower, Research & Administration Building, and Pumping Station.",
      biome: "Flooded industrial exclusion zone",
      thumbnail: "data/Dam_Battlegrounds_Map_(Server_Slam).jpg",
      threatLevel: { label: "High Threat", color: "#f97316" },
      recommendedPower: 18,
      featuredLoot: ["Aphelion Blueprint", "Stormglass Core modules"],
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "data/Dam_Battlegrounds_Map_(Server_Slam).jpg",
        bounds: [
          [0, 0],
          [1200, 1600]
        ],
        attribution: "ARC Raiders - Dam Battlegrounds"
      },
      items: [
        {
          id: "dam-quest-001",
          title: "The Major's Footlocker",
          type: "quest",
          coords: [420, 580],
          description: "Locate Major Aiva's Mementos in the Ruby Residence area.",
          objectives: [
            "Find the Ruby Residence building",
            "Locate Major Aiva's footlocker",
            "Retrieve the mementos"
          ],
          rewards: ["Major Aiva's Mementos", "Faction reputation"],
          tags: ["story quest"]
        },
        {
          id: "dam-boss-002",
          title: "Matriarch Boss",
          type: "boss",
          coords: [680, 320],
          description: "Elite boss that appears under specific map conditions at The Breach. Defeat to obtain Aphelion Blueprint.",
          objectives: [
            "Locate The Breach area",
            "Defeat the Matriarch",
            "Collect Aphelion Blueprint"
          ],
          rewards: ["Aphelion Blueprint", "Rare materials"],
          tags: ["elite", "fireteam recommended"]
        },
        {
          id: "dam-location-003",
          title: "Control Tower",
          type: "location",
          coords: [520, 440],
          description: "Central command structure overlooking the power plant ruins.",
          tags: ["landmark", "high ground"]
        },
        {
          id: "dam-location-004",
          title: "Research & Administration Building",
          type: "location",
          coords: [380, 620],
          description: "Multi-story facility containing research data and administrative records.",
          tags: ["indoor", "loot rich"]
        },
        {
          id: "dam-location-005",
          title: "Pumping Station",
          type: "location",
          coords: [720, 780],
          description: "Waterlogged facility with flooded lower levels.",
          tags: ["hazardous", "underwater"]
        },
        {
          id: "dam-weapon-006",
          title: "Weapon Case - Control Tower",
          type: "weaponCase",
          coords: [540, 460],
          description: "High-tier weapon container on the Control Tower upper level.",
          rewards: ["Random high-tier weapon", "Ammunition"],
          tags: ["elevated"]
        },
        {
          id: "dam-crate-007",
          title: "Field Crate - Pumping Station",
          type: "fieldCrate",
          coords: [700, 800],
          description: "General loot container near the pumping station entrance.",
          rewards: ["Mixed materials", "Components"],
          tags: ["ground level"]
        },
        {
          id: "dam-locker-008",
          title: "Security Locker - Admin Building",
          type: "securityLocker",
          coords: [390, 640],
          description: "Locked container requiring a key or lockpick. Found in the Research & Administration Building.",
          rewards: ["Rare components", "Crafting materials"],
          tags: ["requires key", "indoor"]
        },
        {
          id: "dam-cache-009",
          title: "Raider Cache - Ruby Residence",
          type: "raiderCache",
          coords: [410, 590],
          description: "Premium stash left by another raider in the Ruby Residence area.",
          rewards: ["High-value loot", "Rare items"],
          tags: ["premium"]
        },
        {
          id: "dam-extraction-010",
          title: "Extraction Point Alpha",
          type: "extraction",
          coords: [280, 360],
          description: "Primary evacuation zone for completing missions.",
          tags: ["extraction"]
        },
        {
          id: "dam-extraction-011",
          title: "Extraction Point Beta",
          type: "extraction",
          coords: [920, 840],
          description: "Secondary extraction point near the pumping station.",
          tags: ["extraction"]
        },
        {
          id: "dam-locker-012",
          title: "Floodgate Vault Locker",
          type: "securityLocker",
          coords: [610, 520],
          description:
            "Deep locker wedged beneath the turbine gantry highlighted on GameRant's Dam Battlegrounds map.",
          rewards: ["Floodgate Cipher", "Epic components"],
          tags: ["requires key", "turbine wing"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "dam-event-013",
          title: "Ashen Siphon Convoy",
          type: "event",
          coords: [780, 620],
          description:
            "Timed convoy skirmish that rotates between the Research Building and Pumping Station per Raiders of Arc command briefs.",
          schedule: "Spawns on the half hour",
          tags: ["fireteam", "public event"],
          rarity: "rare",
          difficulty: "high"
        },
        // Additional items from guide scraping
        {
          id: "dam-location-014",
          title: "Hydroponic Dome Complex",
          type: "location",
          coords: [180, 280],
          description: "High-tier loot zone in the top-left corner of the map. Known for industrial batteries and advanced components.",
          tags: ["landmark", "high-tier loot", "TheGamer Guide"],
          rarity: "rare",
          difficulty: "high",
          guideRef: { source: "TheGamer", url: "https://www.thegamer.com/arc-raiders-complete-map-unlock-guide" }
        },
        {
          id: "dam-weapon-015",
          title: "Weapon Case - Hydroponic Dome",
          type: "weaponCase",
          coords: [200, 290],
          description: "High-tier weapon container inside the Hydroponic Dome Complex.",
          rewards: ["Random high-tier weapon", "Industrial Batteries"],
          tags: ["elevated", "guide location"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "dam-crate-016",
          title: "Field Crate - Industrial Catwalks",
          type: "fieldCrate",
          coords: [450, 380],
          description: "Loot container on elevated industrial catwalks with good sightlines.",
          rewards: ["Mixed materials", "ARC Parts"],
          tags: ["elevated", "sniping position"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "dam-location-017",
          title: "North Elevator Area",
          type: "cargoElevator",
          coords: [620, 200],
          description: "Cargo elevator area mentioned in PCGamer's Rusted Gears guide. Vehicle trunks nearby may contain Rusted Gears.",
          tags: ["farming", "rusted gears", "PCGamer Guide"],
          rarity: "uncommon",
          difficulty: "medium",
          guideRef: { source: "PCGamer", url: "https://www.pcgamer.com/games/third-person-shooter/arc-raiders-rusted-gears-locations" }
        },
        {
          id: "dam-trunk-018",
          title: "Vehicle Trunk - North Elevator",
          type: "vehicleTrunk",
          coords: [630, 210],
          description: "Vehicle trunk near North Elevator. PCGamer notes mixed results for Rusted Gear drops here.",
          rewards: ["Rusted Gears (variable)", "Scrap Metal"],
          tags: ["farming", "variable drops"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "dam-quest-019",
          title: "Celeste's Journals",
          type: "quest",
          coords: [350, 500],
          description: "Recover journals from Raider outposts scattered across Dam Battlegrounds. Referenced in PCGamer quest guide.",
          objectives: [
            "Locate Raider outpost Alpha",
            "Retrieve first journal",
            "Find second outpost near Ruby Residence",
            "Collect all journals and extract"
          ],
          rewards: ["Celeste's Journals", "Story progression", "Faction reputation"],
          tags: ["story quest", "multi-part", "PCGamer Guide"],
          rarity: "legendary",
          difficulty: "high",
          guideRef: { source: "PCGamer", url: "https://www.pcgamer.com/games/third-person-shooter/arc-raiders-celestes-journals-location" }
        },
        {
          id: "dam-locker-020",
          title: "Security Locker - Hydroponic Wing",
          type: "securityLocker",
          coords: [190, 300],
          description: "Locked container in the Hydroponic Dome requiring key access. Contains advanced electronics.",
          rewards: ["Advanced Electrical Components", "Sensors"],
          tags: ["requires key", "high-tier"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "dam-medbox-021",
          title: "Medical Box - Research Building",
          type: "medicalBox",
          coords: [385, 630],
          description: "Medical supplies in the Research & Administration Building ground floor.",
          rewards: ["Medical Supplies", "Antiseptic"],
          tags: ["healing", "indoor"],
          rarity: "common",
          difficulty: "low"
        },
        {
          id: "dam-ammo-022",
          title: "Ammo Box - Control Tower Base",
          type: "ammoBox",
          coords: [525, 450],
          description: "Ammunition cache at the base of the Control Tower.",
          rewards: ["Mixed Ammunition"],
          tags: ["resupply"],
          rarity: "common",
          difficulty: "low"
        }
      ]
    },
    {
      id: "buried-city",
      name: "Buried City",
      description:
        "A remnant of the old world amidst sand dunes. Underground city reclaimed by nature with narrow streets and empty plazas. Features Sunken Plaza, Subway Tunnels, and Central Hub.",
      biome: "Subterranean metro ruins",
      thumbnail: "data/Buried_City_Map.png",
      threatLevel: { label: "Medium Threat", color: "#facc15" },
      recommendedPower: 16,
      featuredLoot: ["Espresso Machine Parts", "Urban alloy stockpiles"],
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "data/Buried_City_Map.png",
        bounds: [
          [0, 0],
          [1200, 1600]
        ],
        attribution: "ARC Raiders - Buried City"
      },
      items: [
        {
          id: "city-quest-001",
          title: "Espresso Quest",
          type: "quest",
          coords: [640, 520],
          description: "Retrieve espresso machine parts from Caffe Da Rosa in Plaza Rosa.",
          objectives: [
            "Locate Plaza Rosa area",
            "Find Caffe Da Rosa",
            "Collect espresso machine parts"
          ],
          rewards: ["Espresso Machine Parts", "Quest completion reward"],
          tags: ["story quest"]
        },
        {
          id: "city-location-002",
          title: "Sunken Plaza",
          type: "location",
          coords: [580, 680],
          description: "Central gathering area partially buried beneath the sand.",
          tags: ["landmark", "open area"]
        },
        {
          id: "city-location-003",
          title: "Subway Tunnels",
          type: "location",
          coords: [480, 720],
          description: "Underground transit network connecting different city sectors.",
          tags: ["underground", "maze-like"]
        },
        {
          id: "city-location-004",
          title: "Central Hub",
          type: "location",
          coords: [620, 600],
          description: "Main transportation hub of the buried city.",
          tags: ["landmark", "multi-level"]
        },
        {
          id: "city-location-005",
          title: "Plaza Rosa",
          type: "location",
          coords: [640, 540],
          description: "Historic plaza area containing Caffe Da Rosa and other shops.",
          tags: ["quest location"]
        },
        {
          id: "city-weapon-006",
          title: "Weapon Case - Central Hub",
          type: "weaponCase",
          coords: [630, 610],
          description: "Weapon container in the Central Hub upper level.",
          rewards: ["Random weapon", "Ammunition"],
          tags: ["elevated"]
        },
        {
          id: "city-crate-007",
          title: "Field Crate - Sunken Plaza",
          type: "fieldCrate",
          coords: [590, 690],
          description: "Loot container in the Sunken Plaza area.",
          rewards: ["Mixed materials"],
          tags: ["ground level"]
        },
        {
          id: "city-crate-008",
          title: "Field Crate - Subway Tunnels",
          type: "fieldCrate",
          coords: [490, 730],
          description: "Hidden container in the subway tunnel network.",
          rewards: ["Components", "Materials"],
          tags: ["underground", "hidden"]
        },
        {
          id: "city-cache-009",
          title: "Raider Cache - Plaza Rosa",
          type: "raiderCache",
          coords: [650, 550],
          description: "Premium stash near Plaza Rosa.",
          rewards: ["High-value items"],
          tags: ["premium"]
        },
        {
          id: "city-extraction-010",
          title: "Extraction Point - North",
          type: "extraction",
          coords: [360, 280],
          description: "Northern extraction zone.",
          tags: ["extraction"]
        },
        {
          id: "city-extraction-011",
          title: "Extraction Point - South",
          type: "extraction",
          coords: [840, 1120],
          description: "Southern extraction zone near the city outskirts.",
          tags: ["extraction"]
        },
        {
          id: "city-collect-012",
          title: "Sunken Subway Relay",
          type: "collectible",
          coords: [500, 740],
          description:
            "Encrypted lore cache tucked inside the buried subway relay noted on the official ARC Raiders site.",
          rewards: ["Lore: Collapse Echoes"],
          tags: ["underground", "lore"],
          rarity: "uncommon",
          difficulty: "medium"
        },
        {
          id: "city-event-013",
          title: "Plaza Rosa Skirmish",
          type: "event",
          coords: [660, 560],
          description:
            "Faction clash that GameRant's Buried City map marks as a high-yield public event.",
          tags: ["crowd control", "public event"],
          rarity: "rare",
          difficulty: "high"
        },
        // Additional items from guide scraping
        {
          id: "city-location-014",
          title: "Space Travel Hub",
          type: "location",
          coords: [220, 340],
          description: "Former space travel facility in the northwest. Rich in commercial and technological loot per TheGamer guide.",
          tags: ["landmark", "high-tier loot", "TheGamer Guide"],
          rarity: "rare",
          difficulty: "medium",
          guideRef: { source: "TheGamer", url: "https://www.thegamer.com/arc-raiders-complete-map-unlock-guide" }
        },
        {
          id: "city-location-015",
          title: "Hospital",
          type: "location",
          coords: [840, 480],
          description: "Medical facility in the east sector. Primary source of medical supplies and Antiseptic.",
          tags: ["medical supplies", "TheGamer Guide"],
          rarity: "uncommon",
          difficulty: "medium"
        },
        {
          id: "city-location-016",
          title: "Town Hall",
          type: "location",
          coords: [600, 580],
          description: "Central administrative building containing old world artifacts and valuable keys.",
          tags: ["landmark", "high-tier loot"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "city-location-017",
          title: "Warehouse",
          type: "location",
          coords: [400, 900],
          description: "Industrial storage in the south. PCGamer identifies this as primary Rusted Gears farming location.",
          tags: ["farming", "rusted gears", "PCGamer Guide"],
          rarity: "uncommon",
          difficulty: "low",
          guideRef: { source: "PCGamer", url: "https://www.pcgamer.com/games/third-person-shooter/arc-raiders-rusted-gears-locations" }
        },
        {
          id: "city-trunk-018",
          title: "Vehicle Trunk - Warehouse",
          type: "vehicleTrunk",
          coords: [410, 910],
          description: "Vehicle trunk inside the Warehouse. Check generators nearby for additional Rusted Gears.",
          rewards: ["Rusted Gears", "Industrial Materials"],
          tags: ["farming", "rusted gears"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "city-location-019",
          title: "Marano Station",
          type: "location",
          coords: [820, 640],
          description: "Transit station in the east. Vehicles and generators here may contain Rusted Gears.",
          tags: ["farming", "rusted gears", "PCGamer Guide"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "city-trunk-020",
          title: "Vehicle Trunk - Marano Station",
          type: "vehicleTrunk",
          coords: [830, 650],
          description: "Vehicle trunk at Marano Station. Part of the Industrial Triangle farming route.",
          rewards: ["Rusted Gears", "Vehicle Parts"],
          tags: ["farming route"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "city-location-021",
          title: "Parking Garage",
          type: "location",
          coords: [760, 980],
          description: "Multi-level parking structure in the southeast. Multiple vehicle trunks for Rusted Gears.",
          tags: ["farming", "rusted gears", "PCGamer Guide"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "city-trunk-022",
          title: "Vehicle Trunk - Parking Garage",
          type: "vehicleTrunk",
          coords: [770, 990],
          description: "Vehicle trunk in the Parking Garage. Final stop on the Industrial Triangle route.",
          rewards: ["Rusted Gears", "Scrap Metal"],
          tags: ["farming route"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "city-medbox-023",
          title: "Medical Box - Hospital Wing",
          type: "medicalBox",
          coords: [845, 490],
          description: "Primary medical supplies cache in the Hospital. Best location for Antiseptic.",
          rewards: ["Medical Supplies", "Antiseptic", "Chemicals"],
          tags: ["healing", "indoor"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "city-weapon-024",
          title: "Weapon Case - Space Travel Hub",
          type: "weaponCase",
          coords: [230, 350],
          description: "Weapon container in the Space Travel Hub. Commercial area with high-tier items.",
          rewards: ["Random weapon", "Tech Components"],
          tags: ["commercial area"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "city-locker-025",
          title: "Security Locker - Town Hall",
          type: "securityLocker",
          coords: [605, 590],
          description: "Locked container in Town Hall basement. May contain keys for other areas.",
          rewards: ["Old World Artifacts", "Keys"],
          tags: ["requires key", "valuable"],
          rarity: "rare",
          difficulty: "medium"
        }
      ]
    },
    {
      id: "spaceport",
      name: "Spaceport",
      description:
        "A derelict rocket launch facility reflecting humanity's past ambitions. Multi-level buildings and tight corridors. Features Launch Pad, Assembly Building, and Fuel Depot.",
      biome: "Orbital launch complex",
      thumbnail: "data/Spaceport_Map.png",
      threatLevel: { label: "Severe Threat", color: "#60a5fa" },
      recommendedPower: 22,
      featuredLoot: ["Prototype Mods", "Fuel Depot Access Codes"],
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "data/Spaceport_Map.png",
        bounds: [
          [0, 0],
          [1200, 1600]
        ],
        attribution: "ARC Raiders - Spaceport"
      },
      items: [
        {
          id: "space-boss-001",
          title: "Matriarch Boss - Launch Towers",
          type: "boss",
          coords: [720, 480],
          description: "Elite Matriarch boss that spawns at Launch Towers. Defeat to obtain Aphelion Blueprint.",
          objectives: [
            "Locate Launch Towers area",
            "Defeat the Matriarch",
            "Collect Aphelion Blueprint"
          ],
          rewards: ["Aphelion Blueprint", "Rare materials"],
          tags: ["elite", "fireteam recommended"]
        },
        {
          id: "space-location-002",
          title: "Launch Pad",
          type: "location",
          coords: [680, 440],
          description: "Main rocket launch platform, now derelict.",
          tags: ["landmark", "open area"]
        },
        {
          id: "space-location-003",
          title: "Assembly Building",
          type: "location",
          coords: [560, 600],
          description: "Large facility where rockets were assembled. Multi-level structure.",
          tags: ["indoor", "multi-level"]
        },
        {
          id: "space-location-004",
          title: "Fuel Depot",
          type: "location",
          coords: [840, 680],
          description: "Storage facility for rocket fuel. Hazardous area.",
          tags: ["hazardous", "explosive"]
        },
        {
          id: "space-location-005",
          title: "Launch Towers",
          type: "location",
          coords: [720, 500],
          description: "Towering structures used for rocket launches. Boss spawn location.",
          tags: ["boss location", "elevated"]
        },
        {
          id: "space-weapon-006",
          title: "Weapon Case - Assembly Building",
          type: "weaponCase",
          coords: [570, 610],
          description: "High-tier weapon container in the Assembly Building.",
          rewards: ["Random high-tier weapon"],
          tags: ["indoor"]
        },
        {
          id: "space-weapon-007",
          title: "Weapon Case - Launch Pad",
          type: "weaponCase",
          coords: [690, 450],
          description: "Weapon case near the launch pad control area.",
          rewards: ["Random weapon", "Ammunition"],
          tags: ["elevated"]
        },
        {
          id: "space-crate-008",
          title: "Field Crate - Fuel Depot",
          type: "fieldCrate",
          coords: [850, 690],
          description: "Loot container in the Fuel Depot area.",
          rewards: ["Mixed materials"],
          tags: ["hazardous area"]
        },
        {
          id: "space-locker-009",
          title: "Security Locker - Assembly Building",
          type: "securityLocker",
          coords: [560, 620],
          description: "Locked container requiring a key or lockpick in the Assembly Building.",
          rewards: ["Rare components"],
          tags: ["requires key", "indoor"]
        },
        {
          id: "space-cache-010",
          title: "Raider Cache - Launch Towers",
          type: "raiderCache",
          coords: [710, 510],
          description: "Premium stash near the Launch Towers.",
          rewards: ["High-value loot"],
          tags: ["premium"]
        },
        {
          id: "space-extraction-011",
          title: "Extraction Point - East",
          type: "extraction",
          coords: [1080, 520],
          description: "Eastern extraction zone.",
          tags: ["extraction"]
        },
        {
          id: "space-extraction-012",
          title: "Extraction Point - West",
          type: "extraction",
          coords: [240, 680],
          description: "Western extraction zone near the facility entrance.",
          tags: ["extraction"]
        },
        {
          id: "space-quest-013",
          title: "Fuel Siphon Operation",
          type: "quest",
          coords: [850, 700],
          description:
            "Infiltrate the Fuel Depot siphon rigs documented on the official ARC Raiders map overview.",
          objectives: [
            "Disable the depot sentries without triggering alarms",
            "Siphon three fuel tanks before ARC reinforcements arrive"
          ],
          rewards: ["Depot access codes", "Faction rep: ARC Splicers"],
          tags: ["stealth optional", "time sensitive"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "space-locker-014",
          title: "Hangar Epsilon Locker",
          type: "securityLocker",
          coords: [420, 1040],
          description:
            "High-security locker tucked inside Hangar Epsilon, the same bay referenced on GameRant's Spaceport map.",
          rewards: ["Arc Driver barrel", "Rare crafting kit"],
          tags: ["requires key", "hangar row"],
          rarity: "rare",
          difficulty: "medium"
        },
        // Additional items from guide scraping
        {
          id: "space-location-015",
          title: "Departure Building",
          type: "location",
          coords: [240, 320],
          description: "Former passenger departure terminal in the top-left. High-tier items per TheGamer guide.",
          tags: ["landmark", "high-tier loot", "TheGamer Guide"],
          rarity: "rare",
          difficulty: "medium",
          guideRef: { source: "TheGamer", url: "https://www.thegamer.com/arc-raiders-complete-map-unlock-guide" }
        },
        {
          id: "space-location-016",
          title: "Arrival Building",
          type: "location",
          coords: [280, 380],
          description: "Former passenger arrival terminal. Adjacent to Departure Building with similar loot quality.",
          tags: ["landmark", "high-tier loot"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "space-location-017",
          title: "Control Tower A6",
          type: "location",
          coords: [920, 880],
          description: "Security control tower in the bottom-right. Requires key for upper levels.",
          tags: ["landmark", "requires key", "TheGamer Guide"],
          rarity: "rare",
          difficulty: "high"
        },
        {
          id: "space-location-018",
          title: "Container Storage",
          type: "location",
          coords: [980, 920],
          description: "Large container storage yard in the bottom-right. Rich in bulk materials.",
          tags: ["farming", "industrial"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "space-location-019",
          title: "Rocket Assembly",
          type: "location",
          coords: [540, 640],
          description: "Main rocket assembly facility. Industrial batteries and ARC tech spawn here.",
          tags: ["landmark", "ARC tech"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "space-location-020",
          title: "Residential Quarter",
          type: "location",
          coords: [480, 880],
          description: "Former worker housing area. ARC Raiders Cheatsheet notes Dog Collars spawn here.",
          tags: ["dog collars", "residential", "ARC Raiders Cheatsheet"],
          rarity: "uncommon",
          difficulty: "low",
          guideRef: { source: "ARC Raiders Cheatsheet", url: "https://arcraiderscheatsheet.org/map" }
        },
        {
          id: "space-item-021",
          title: "Dog Collar Spawn",
          type: "item",
          coords: [490, 890],
          description: "Common spawn point for Dog Collars needed for specific quests.",
          rewards: ["Dog Collar"],
          tags: ["quest item", "residential"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "space-weapon-022",
          title: "Weapon Case - Departure Terminal",
          type: "weaponCase",
          coords: [250, 330],
          description: "High-tier weapon container in the Departure Building.",
          rewards: ["Random high-tier weapon"],
          tags: ["commercial area"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "space-weapon-023",
          title: "Weapon Case - Rocket Assembly",
          type: "weaponCase",
          coords: [550, 650],
          description: "Weapon container in the Rocket Assembly facility. May contain exotic blueprints.",
          rewards: ["Random weapon", "Possible blueprint"],
          tags: ["industrial"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "space-locker-024",
          title: "Security Locker - Control Tower A6",
          type: "securityLocker",
          coords: [925, 890],
          description: "Locked container in Control Tower A6 requiring Spaceport Control Tower Key.",
          rewards: ["Security Equipment", "Keys"],
          tags: ["requires key"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "space-crate-025",
          title: "Field Crate - Container Storage",
          type: "fieldCrate",
          coords: [985, 930],
          description: "Industrial crate in the container storage yard. Bulk materials available.",
          rewards: ["Bulk Materials", "Industrial Components"],
          tags: ["farming"],
          rarity: "common",
          difficulty: "low"
        },
        {
          id: "space-enemy-026",
          title: "Sentinel Patrol Route",
          type: "sentinel",
          coords: [700, 540],
          description: "Regular Sentinel patrol between Launch Towers and Assembly. Drops ARC Alloy.",
          tags: ["patrol", "ARC drops"],
          rarity: "rare",
          difficulty: "high"
        },
        // Locked Doors - Calibrated to match Spaceport_Map.png landmark positions
        {
          id: "space-door-027",
          title: "North Trench Tower Locked Door",
          type: "lockedDoor",
          coords: [150, 800],
          description: "Locked door at North Trench Tower requiring Spaceport Trench Tower Key.",
          rewards: ["High-value loot", "ARC tech components"],
          tags: ["requires key", "trench area"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "space-door-028",
          title: "West Hangar Locked Door",
          type: "lockedDoor",
          coords: [80, 725],
          description: "Locked door in the West Hangar area.",
          rewards: ["Industrial components", "Rare materials"],
          tags: ["requires key", "hangar"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "space-door-029",
          title: "South Trench Tower Locked Door",
          type: "lockedDoor",
          coords: [185, 760],
          description: "Secured room at South Trench Tower.",
          rewards: ["Tech blueprints", "Crafting materials"],
          tags: ["requires key", "trench area"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "space-door-030",
          title: "The Trench Locked Door",
          type: "lockedDoor",
          coords: [265, 810],
          description: "Locked door in The Trench sector between towers.",
          rewards: ["Security keys", "Ammunition"],
          tags: ["requires key", "trench"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "space-door-031",
          title: "Fuel Control Locked Door",
          type: "lockedDoor",
          coords: [400, 805],
          description: "Secured room in the Fuel Control area. Contains rare fuel components.",
          rewards: ["Fuel components", "Industrial salvage"],
          tags: ["requires key", "fuel depot"],
          rarity: "rare",
          difficulty: "high"
        },
        {
          id: "space-door-032",
          title: "East Container Yard Locked Door",
          type: "lockedDoor",
          coords: [375, 915],
          description: "Locked storage container in the East Container Yard.",
          rewards: ["Bulk materials", "Crates"],
          tags: ["requires key", "container yard"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "space-door-033",
          title: "Vehicle Maintenance Locked Door",
          type: "lockedDoor",
          coords: [735, 625],
          description: "Locked maintenance bay with vehicle parts and tools.",
          rewards: ["Vehicle parts", "Tools"],
          tags: ["requires key", "maintenance"],
          rarity: "uncommon",
          difficulty: "medium"
        },
        {
          id: "space-door-034",
          title: "Control Tower A6 Locked Door",
          type: "lockedDoor",
          coords: [660, 720],
          description: "High-security door in Control Tower A6 requiring special clearance.",
          rewards: ["Top-tier equipment", "Security codes"],
          tags: ["requires key", "high security"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "space-door-035",
          title: "East Plains Warehouses Locked Door",
          type: "lockedDoor",
          coords: [430, 1010],
          description: "Locked warehouse door in the East Plains industrial sector.",
          rewards: ["Industrial equipment", "Raw materials"],
          tags: ["requires key", "industrial"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "space-door-036",
          title: "Communications Tower Locked Door",
          type: "lockedDoor",
          coords: [685, 1000],
          description: "Secured communications equipment room.",
          rewards: ["Comms equipment", "Data chips"],
          tags: ["requires key", "communications"],
          rarity: "rare",
          difficulty: "medium"
        }
      ]
    },
    {
      id: "blue-gate",
      name: "The Blue Gate",
      description:
        "A mountainous region with open hills, small towns, tunnels, and underground complexes. Excellent for farming Rusted Gears from vehicle trunks.",
      biome: "Foothills and subterranean caverns",
      thumbnail: "data/The_Blue_Gate_Map.png",
      threatLevel: { label: "Dynamic Threat", color: "#38bdf8" },
      recommendedPower: 15,
      featuredLoot: ["Rusted Gears", "Vehicle salvage"],
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "data/The_Blue_Gate_Map.png",
        bounds: [
          [0, 0],
          [1200, 1600]
        ],
        attribution: "ARC Raiders - The Blue Gate"
      },
      items: [
        {
          id: "blue-location-001",
          title: "Mountain Pass",
          type: "location",
          coords: [520, 440],
          description: "Main passage through the mountain range.",
          tags: ["landmark", "route"]
        },
        {
          id: "blue-location-002",
          title: "Underground Complex",
          type: "location",
          coords: [680, 720],
          description: "Extensive underground facility beneath the mountains.",
          tags: ["underground", "multi-level"]
        },
        {
          id: "blue-location-003",
          title: "Small Town",
          type: "location",
          coords: [420, 580],
          description: "Abandoned settlement in the foothills.",
          tags: ["loot rich", "vehicles"]
        },
        {
          id: "blue-vehicle-004",
          title: "Vehicle Trunk - Town",
          type: "vehicleTrunk",
          coords: [430, 590],
          description: "Searchable vehicle in the small town. Excellent for farming Rusted Gears.",
          rewards: ["Rusted Gears", "Random materials"],
          tags: ["farming", "rusted gears"]
        },
        {
          id: "blue-vehicle-005",
          title: "Vehicle Trunk - Mountain Pass",
          type: "vehicleTrunk",
          coords: [510, 450],
          description: "Abandoned vehicle along the mountain pass route.",
          rewards: ["Rusted Gears", "Components"],
          tags: ["farming"]
        },
        {
          id: "blue-vehicle-006",
          title: "Vehicle Trunk - Roadside",
          type: "vehicleTrunk",
          coords: [360, 640],
          description: "Vehicle wreck along the roadside. Good for Rusted Gear farming.",
          rewards: ["Rusted Gears"],
          tags: ["farming", "rusted gears"]
        },
        {
          id: "blue-weapon-007",
          title: "Weapon Case - Underground Complex",
          type: "weaponCase",
          coords: [690, 730],
          description: "Weapon container in the underground complex.",
          rewards: ["Random weapon"],
          tags: ["underground"]
        },
        {
          id: "blue-crate-008",
          title: "Field Crate - Town",
          type: "fieldCrate",
          coords: [425, 585],
          description: "Loot container in the abandoned town.",
          rewards: ["Mixed materials"],
          tags: ["ground level"]
        },
        {
          id: "blue-cache-009",
          title: "Raider Cache - Mountain Pass",
          type: "raiderCache",
          coords: [515, 455],
          description: "Premium stash hidden along the mountain pass.",
          rewards: ["High-value items"],
          tags: ["premium"]
        },
        {
          id: "blue-extraction-010",
          title: "Extraction Point - Valley",
          type: "extraction",
          coords: [280, 360],
          description: "Valley extraction zone.",
          tags: ["extraction"]
        },
        {
          id: "blue-extraction-011",
          title: "Extraction Point - Foothills",
          type: "extraction",
          coords: [920, 1040],
          description: "Foothills extraction zone.",
          tags: ["extraction"]
        },
        {
          id: "blue-event-012",
          title: "Tunnel Raiders Ambush",
          type: "event",
          coords: [700, 760],
          description:
            "Recurring event inside the underground complex highlighted on GameRant's Blue Gate interactive map.",
          tags: ["public event", "underground"],
          rarity: "rare",
          difficulty: "high"
        },
        {
          id: "blue-vehicle-013",
          title: "Ridgeline Caravan",
          type: "vehicleTrunk",
          coords: [360, 680],
          description:
            "Triple trunk route used by community farming guides on arcraidersmaps.app for accelerated Rusted Gear loops.",
          rewards: ["Rusted Gears", "Vehicle salvage"],
          tags: ["farming route"],
          rarity: "uncommon",
          difficulty: "low"
        },
        // Additional items from guide scraping
        {
          id: "blue-location-014",
          title: "Pilgrim's Peak",
          type: "location",
          coords: [920, 280],
          description: "High-ground position in the top-right with top-tier loot. Heavy enemy presence per TheGamer guide.",
          tags: ["landmark", "high-tier loot", "high threat", "TheGamer Guide"],
          rarity: "legendary",
          difficulty: "elite",
          guideRef: { source: "TheGamer", url: "https://www.thegamer.com/arc-raiders-complete-map-unlock-guide" }
        },
        {
          id: "blue-location-015",
          title: "Central Checkpoint",
          type: "location",
          coords: [600, 600],
          description: "Heavily guarded central checkpoint. High rewards but significant enemy threat.",
          tags: ["landmark", "high threat", "TheGamer Guide"],
          rarity: "rare",
          difficulty: "high"
        },
        {
          id: "blue-location-016",
          title: "Communication Tower",
          type: "location",
          coords: [780, 380],
          description: "Radio communication tower. Requires Blue Gate Communication Tower Key for access.",
          tags: ["requires key", "elevated"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "blue-weapon-017",
          title: "Weapon Case - Pilgrim's Peak",
          type: "weaponCase",
          coords: [930, 290],
          description: "High-tier weapon container at Pilgrim's Peak. Expect heavy resistance.",
          rewards: ["Random high-tier weapon", "Rare materials"],
          tags: ["high risk high reward"],
          rarity: "legendary",
          difficulty: "elite"
        },
        {
          id: "blue-locker-018",
          title: "Security Locker - Communication Tower",
          type: "securityLocker",
          coords: [785, 390],
          description: "Locked container requiring Blue Gate Communication Tower Key.",
          rewards: ["Communication Equipment", "Advanced Components"],
          tags: ["requires key"],
          rarity: "rare",
          difficulty: "medium"
        },
        {
          id: "blue-crate-019",
          title: "Field Crate - Checkpoint",
          type: "fieldCrate",
          coords: [610, 610],
          description: "Loot container at Central Checkpoint. Guard patrols nearby.",
          rewards: ["Military Equipment", "Mixed materials"],
          tags: ["guarded"],
          rarity: "uncommon",
          difficulty: "medium"
        },
        {
          id: "blue-spawn-020",
          title: "Player Spawn - Valley",
          type: "playerSpawn",
          coords: [260, 340],
          description: "Valley spawn point. Start of recommended Rusted Gear farming route.",
          tags: ["spawn", "farming start"],
          rarity: "common",
          difficulty: "low"
        },
        {
          id: "blue-resource-021",
          title: "Agave Patch",
          type: "agave",
          coords: [380, 520],
          description: "Natural Agave spawn in the foothills. More abundant during 'Lush Blooms' condition.",
          tags: ["natural resource", "crafting"],
          rarity: "common",
          difficulty: "low"
        },
        {
          id: "blue-resource-022",
          title: "Great Mullein Meadow",
          type: "greatMullein",
          coords: [540, 380],
          description: "Medicinal herb spawn in the highland meadows.",
          tags: ["natural resource", "medicine"],
          rarity: "common",
          difficulty: "low"
        },
        {
          id: "blue-enemy-023",
          title: "ARC Patrol Route",
          type: "arc",
          coords: [700, 500],
          description: "Regular ARC patrol between Checkpoint and Underground Complex.",
          tags: ["patrol", "medium threat"],
          rarity: "uncommon",
          difficulty: "medium"
        },
        {
          id: "blue-zipline-024",
          title: "Ridge Zipline",
          type: "zipline",
          coords: [480, 320],
          description: "Zipline connecting mountain pass to lower areas. Quick escape route.",
          tags: ["traversal", "escape"],
          rarity: "common",
          difficulty: "low"
        }
      ]
    },
    {
      id: "stella-montis",
      name: "Stella Montis",
      description:
        "An isolated mountain facility shrouded in snow, containing long-kept secrets. Introduced in the North Line update. Harsh arctic environment with hidden facilities.",
      biome: "Polar research summit",
      thumbnail: "data/Stella_Montis_map_lower_level.png",
      threatLevel: { label: "Extreme Threat", color: "#a855f7" },
      recommendedPower: 24,
      featuredLoot: ["North Line tech fragments", "Cryonic alloys"],
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "data/Stella_Montis_map_lower_level.png",
        bounds: [
          [0, 0],
          [1200, 1600]
        ],
        attribution: "ARC Raiders - Stella Montis"
      },
      items: [
        {
          id: "stella-location-001",
          title: "Mountain Facility",
          type: "location",
          coords: [600, 500],
          description: "Main isolated facility hidden in the mountains.",
          tags: ["landmark", "secret facility"]
        },
        {
          id: "stella-location-002",
          title: "Snowfield",
          type: "location",
          coords: [480, 680],
          description: "Open snow-covered area with limited cover.",
          tags: ["open area", "hazardous"]
        },
        {
          id: "stella-location-003",
          title: "Ice Caves",
          type: "location",
          coords: [720, 840],
          description: "Network of ice caves beneath the mountain.",
          tags: ["underground", "maze-like"]
        },
        {
          id: "stella-weapon-004",
          title: "Weapon Case - Mountain Facility",
          type: "weaponCase",
          coords: [610, 510],
          description: "Weapon container in the mountain facility.",
          rewards: ["Random high-tier weapon"],
          tags: ["indoor"]
        },
        {
          id: "stella-crate-005",
          title: "Field Crate - Snowfield",
          type: "fieldCrate",
          coords: [490, 690],
          description: "Loot container partially buried in the snowfield.",
          rewards: ["Mixed materials"],
          tags: ["snow", "exposed"]
        },
        {
          id: "stella-crate-006",
          title: "Field Crate - Ice Caves",
          type: "fieldCrate",
          coords: [730, 850],
          description: "Hidden container deep in the ice caves.",
          rewards: ["Components", "Rare materials"],
          tags: ["underground", "hidden"]
        },
        {
          id: "stella-cache-007",
          title: "Raider Cache - Facility",
          type: "raiderCache",
          coords: [600, 520],
          description: "Premium stash in the mountain facility.",
          rewards: ["High-value loot"],
          tags: ["premium"]
        },
        {
          id: "stella-collectible-008",
          title: "Lore Fragment - North Line",
          type: "collectible",
          coords: [580, 480],
          description: "Lore fragment related to the North Line update and facility secrets.",
          rewards: ["Lore: North Line Secrets"],
          tags: ["lore", "one-time"]
        },
        {
          id: "stella-extraction-009",
          title: "Extraction Point - Base",
          type: "extraction",
          coords: [360, 320],
          description: "Base camp extraction zone.",
          tags: ["extraction"]
        },
        {
          id: "stella-extraction-010",
          title: "Extraction Point - Summit",
          type: "extraction",
          coords: [840, 280],
          description: "High-altitude extraction point near the summit.",
          tags: ["extraction", "elevated"]
        },
        {
          id: "stella-quest-011",
          title: "North Line Uplink",
          type: "quest",
          coords: [600, 520],
          description:
            "Reactivate the uplink nodes described in TechRadar's coverage of the North Line update to summon the Matriarch variant.",
          objectives: [
            "Synchronize three uplink pylons without letting ARC drones reset them",
            "Hold the mountain facility roof until the uplink stabilizes"
          ],
          rewards: ["North Line tech fragments", "Faction rep: Pilots"],
          tags: ["multi-stage", "defense"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "stella-collect-012",
          title: "Frozen Data Cache",
          type: "collectible",
          coords: [780, 920],
          description:
            "Lore shard buried inside the ice caves that the official ARC Raiders wiki labels as a scanner target.",
          rewards: ["Lore: Polaris Vault"],
          tags: ["ice caves", "scanner"],
          rarity: "uncommon",
          difficulty: "medium"
        },
        // Additional items from guide scraping
        {
          id: "stella-location-013",
          title: "Uplink Pylon Alpha",
          type: "location",
          coords: [520, 440],
          description: "First uplink pylon for North Line quest. Must synchronize without ARC drones resetting.",
          tags: ["quest objective", "North Line"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "stella-location-014",
          title: "Uplink Pylon Beta",
          type: "location",
          coords: [680, 480],
          description: "Second uplink pylon. Part of the three-pylon synchronization for North Line quest.",
          tags: ["quest objective", "North Line"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "stella-location-015",
          title: "Uplink Pylon Gamma",
          type: "location",
          coords: [600, 560],
          description: "Third uplink pylon. Completing all three summons the Matriarch variant.",
          tags: ["quest objective", "North Line", "boss trigger"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "stella-boss-016",
          title: "Matriarch Variant",
          type: "boss",
          coords: [600, 500],
          description: "Special Matriarch variant summoned after completing North Line Uplink quest. Drops unique materials.",
          rewards: ["North Line Tech Fragments", "Cryonic Alloys", "Exotic Materials"],
          tags: ["elite", "fireteam recommended", "TechRadar Guide"],
          rarity: "exotic",
          difficulty: "elite",
          guideRef: { source: "TechRadar", url: "https://www.techradar.com/gaming/arc-raiders-north-line-update" }
        },
        {
          id: "stella-weapon-017",
          title: "Weapon Case - Facility Armory",
          type: "weaponCase",
          coords: [620, 520],
          description: "Secure armory in the Mountain Facility. High-tier weapons in arctic conditions.",
          rewards: ["Random high-tier weapon", "Cold-resistant gear"],
          tags: ["indoor", "high-tier"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "stella-locker-018",
          title: "Research Vault",
          type: "securityLocker",
          coords: [580, 500],
          description: "Secure research vault containing North Line secrets. Requires special access.",
          rewards: ["North Line Tech Fragments", "Research Data"],
          tags: ["requires key", "story relevant"],
          rarity: "legendary",
          difficulty: "high"
        },
        {
          id: "stella-crate-019",
          title: "Field Crate - Summit Approach",
          type: "fieldCrate",
          coords: [780, 320],
          description: "Supply cache on the approach to the summit. Extreme weather conditions.",
          rewards: ["Survival gear", "Cryonic Materials"],
          tags: ["exposed", "arctic"],
          rarity: "uncommon",
          difficulty: "medium"
        },
        {
          id: "stella-resource-020",
          title: "Mushroom Cluster",
          type: "mushroom",
          coords: [740, 880],
          description: "Rare mushroom spawn in the ice caves. Used in crafting recipes.",
          tags: ["natural resource", "cave"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "stella-enemy-021",
          title: "Arctic Sentinel",
          type: "sentinel",
          coords: [640, 400],
          description: "Cold-adapted Sentinel guarding facility perimeter. Enhanced armor.",
          tags: ["patrol", "enhanced", "arctic"],
          rarity: "rare",
          difficulty: "high"
        },
        {
          id: "stella-spawn-022",
          title: "Player Spawn - Base Camp",
          type: "playerSpawn",
          coords: [340, 300],
          description: "Primary spawn at base camp. Shelter from extreme weather.",
          tags: ["spawn", "safe zone"],
          rarity: "common",
          difficulty: "low"
        },
        {
          id: "stella-spawn-023",
          title: "Player Spawn - Summit Station",
          type: "playerSpawn",
          coords: [860, 260],
          description: "Secondary spawn at summit station. Quick access to high-tier areas.",
          tags: ["spawn", "advanced"],
          rarity: "common",
          difficulty: "low"
        },
        {
          id: "stella-depot-024",
          title: "Field Depot - Research Wing",
          type: "fieldDepot",
          coords: [560, 540],
          description: "Supply depot in the research wing of the Mountain Facility.",
          tags: ["resupply", "indoor"],
          rarity: "uncommon",
          difficulty: "low"
        },
        {
          id: "stella-hatch-025",
          title: "Emergency Hatch",
          type: "raiderHatch",
          coords: [680, 860],
          description: "Hidden emergency exit from ice caves. Quick escape route to extraction.",
          tags: ["escape", "underground"],
          rarity: "uncommon",
          difficulty: "low"
        }
      ]
    }
  ]
};

