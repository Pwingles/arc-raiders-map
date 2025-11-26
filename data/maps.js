window.arcMapsConfig = {
  storageKey: "arc-raiders-progress-v1",
  defaultMapId: "caligo-basin",
  categories: {
    quest: {
      label: "Quest",
      color: "#facc15",
      description: "Story beats, faction contracts, or multi-step missions."
    },
    loot: {
      label: "Loot Cache",
      color: "#fb7185",
      description: "Weapon cases, supply drops, and crafting material stashes."
    },
    event: {
      label: "World Event",
      color: "#34d399",
      description: "Timed events or public activities that rotate on the map."
    },
    boss: {
      label: "Boss Hunt",
      color: "#c084fc",
      description: "High value targets that typically need a fireteam."
    },
    collectible: {
      label: "Collectible",
      color: "#38bdf8",
      description: "Lore fragments, intel logs, or other one-time pickups."
    }
  },
  maps: [
    {
      id: "caligo-basin",
      name: "Caligo Basin",
      description:
        "Simulated overlay of the Basin's storm-swept scrapyards. Coordinates are pixel based so you can swap in your own stitched map art later.",
      projection: "simple",
      zoom: {
        min: -1,
        max: 3,
        initial: 0
      },
      image: {
        url: "assets/maps/caligo-basin.svg",
        bounds: [
          [0, 0],
          [1200, 1600]
        ],
        attribution: "Placeholder tactical chart"
      },
      items: [
        {
          id: "cal-quest-001",
          title: "Signal Heist",
          type: "quest",
          coords: [520, 440],
          description: "Seize the collapsed arc relay embedded in Signal Ridge.",
          objectives: [
            "Disable the Dominion jammer scaffold",
            "Hack the relay core before reinforcements arrive"
          ],
          rewards: ["Stormglass Core", "Faction rep: ARC Splicers"],
          tags: ["solo-friendly", "stealth"],
          link: "https://arcraiders.com/"
        },
        {
          id: "cal-loot-002",
          title: "Deep Cradle Cache",
          type: "loot",
          coords: [720, 650],
          description:
            "Buried supply chest between two collapsed walker limbs. Bring a cutting torch.",
          rewards: ["x3 Rare Components", "x1 Prototype Mod"],
          cooldownHours: 20,
          tags: ["requires torch"]
        },
        {
          id: "cal-collect-003",
          title: "Ghostline Archive",
          type: "collectible",
          coords: [280, 500],
          description: "Encrypted lore log near abandoned comms tower.",
          rewards: ["Lore: Ghostline Uprising"],
          tags: ["audio log"]
        },
        {
          id: "cal-event-004",
          title: "Ashen Run Convoy",
          type: "event",
          coords: [1240, 890],
          description: "Dynamic convoy escort. Expect heavy drones.",
          schedule: "Spawns every even hour on public servers.",
          tags: ["fireteam"]
        },
        {
          id: "cal-boss-005",
          title: "Stormbreaker Warmind",
          type: "boss",
          coords: [1020, 360],
          description: "Prototype warmind turret with rotating shield arcs.",
          objectives: [
            "Disable the shield pylons",
            "Focus core when vents open"
          ],
          rewards: ["Unique cosmetic: Cyclone Visor"],
          tags: ["fireteam", "lvl 25+"]
        },
        {
          id: "cal-loot-006",
          title: "Ridgeback Caches",
          type: "loot",
          coords: [560, 390],
          description: "Three small lockers tucked underneath the broken monorail.",
          rewards: ["x8 Crafting Alloys"],
          tags: ["grapple hook"]
        },
        {
          id: "cal-collect-007",
          title: "Archive Shard: Grav Scars",
          type: "collectible",
          coords: [900, 850],
          description: "Scan the crater wall for glyphs to reveal the shard.",
          rewards: ["Lore: Graviton Faultline"],
          tags: ["scanner pulse"]
        },
        {
          id: "cal-event-008",
          title: "Emergency Drop",
          type: "event",
          coords: [420, 360],
          description: "Distress beacon that can be re-routed for rapid extraction.",
          tags: ["duo recommended"]
        }
      ]
    },
    {
      id: "orbital-link",
      name: "Orbital Link Testbed",
      description:
        "Example of using a standard geographic basemap (OpenStreetMap tiles). Replace with your own tile server or Mapbox key if needed.",
      projection: "geo",
      view: {
        center: [59.3293, 18.0686],
        zoom: 6
      },
      tileLayer: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      },
      items: [
        {
          id: "orb-event-001",
          title: "Aurora Sweep",
          type: "event",
          coords: [59.8586, 17.6389],
          description:
            "Track falling debris signatures along the Swedish coastline.",
          rewards: ["Orbit Dust sample"],
          tags: ["public event"]
        },
        {
          id: "orb-quest-002",
          title: "Relay Hijack",
          type: "quest",
          coords: [60.1699, 24.9384],
          description: "Secure a rogue relay hidden within Helsinki's skylink.",
          objectives: [
            "Locate uplink nodes across the harbor",
            "Synchronize phase pattern before the sweep completes"
          ],
          tags: ["network trace"]
        },
        {
          id: "orb-boss-003",
          title: "Stratos Hydra",
          type: "boss",
          coords: [57.7089, 11.9746],
          description: "Multi-headed drone cluster orbiting the Göteborg hub.",
          rewards: ["Hydra plating"],
          tags: ["fireteam", "anti-air"]
        }
      ]
    }
  ]
};

