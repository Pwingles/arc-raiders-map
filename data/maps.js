window.arcMapsConfig = {
  storageKey: "arc-raiders-progress-v1",
  defaultMapId: "dam-battlegrounds",
  categories: {
    quest: {
      label: "Quest",
      color: "#facc15",
      description: "Story missions, faction contracts, and multi-step objectives."
    },
    weaponCase: {
      label: "Weapon Case",
      color: "#fb7185",
      description: "High-tier weapons and ammunition containers."
    },
    fieldCrate: {
      label: "Field Crate",
      color: "#f97316",
      description: "General loot containers with mixed items."
    },
    securityLocker: {
      label: "Security Locker",
      color: "#a855f7",
      description: "Locked containers requiring keys or lockpicks."
    },
    raiderCache: {
      label: "Raider Cache",
      color: "#ec4899",
      description: "Premium loot stashes left by other raiders."
    },
    vehicleTrunk: {
      label: "Vehicle Trunk",
      color: "#14b8a6",
      description: "Searchable vehicles, excellent for farming Rusted Gears."
    },
    extraction: {
      label: "Extraction Point",
      color: "#34d399",
      description: "Evacuation zones for completing missions."
    },
    boss: {
      label: "Boss",
      color: "#c084fc",
      description: "Elite enemies and high value targets."
    },
    collectible: {
      label: "Collectible",
      color: "#38bdf8",
      description: "Lore fragments, intel logs, and one-time pickups."
    },
    location: {
      label: "Key Location",
      color: "#60a5fa",
      description: "Important landmarks and points of interest."
    }
  },
  maps: [
    {
      id: "dam-battlegrounds",
      name: "Dam Battlegrounds",
      description:
        "Overgrown ruins of the Alcantara Power Plant. Toxic, waterlogged terrain with frequent ARC skirmishes. Features the Control Tower, Research & Administration Building, and Pumping Station.",
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "assets/maps/dam-battlegrounds.svg",
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
        }
      ]
    },
    {
      id: "buried-city",
      name: "Buried City",
      description:
        "A remnant of the old world amidst sand dunes. Underground city reclaimed by nature with narrow streets and empty plazas. Features Sunken Plaza, Subway Tunnels, and Central Hub.",
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "assets/maps/buried-city.svg",
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
        }
      ]
    },
    {
      id: "spaceport",
      name: "Spaceport",
      description:
        "A derelict rocket launch facility reflecting humanity's past ambitions. Multi-level buildings and tight corridors. Features Launch Pad, Assembly Building, and Fuel Depot.",
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "assets/maps/spaceport.svg",
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
        }
      ]
    },
    {
      id: "blue-gate",
      name: "The Blue Gate",
      description:
        "A mountainous region with open hills, small towns, tunnels, and underground complexes. Excellent for farming Rusted Gears from vehicle trunks.",
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "assets/maps/blue-gate.svg",
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
        }
      ]
    },
    {
      id: "stella-montis",
      name: "Stella Montis",
      description:
        "An isolated mountain facility shrouded in snow, containing long-kept secrets. Introduced in the North Line update. Harsh arctic environment with hidden facilities.",
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "assets/maps/stella-montis.svg",
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
        }
      ]
    }
  ]
};

