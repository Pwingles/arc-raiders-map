/**
 * ARC Raiders Interactive Map - MapGenie Clone
 */
(() => {
  const config = window.arcMapsConfig;
  if (!config) {
    console.error("Missing arcMapsConfig");
    return;
  }

  // ==========================================================================
  // State
  // ==========================================================================

  const state = {
    map: null,
    markerLayer: null,
    markers: new Map(),
    currentMapId: config.defaultMapId,
    visibleCategories: new Set(Object.keys(config.categories)),
    foundLocations: loadFoundLocations(),
    searchQuery: "",
    selectedLocation: null,
  };

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const els = {
    mapTabs: document.getElementById("mapTabs"),
    categoryList: document.getElementById("categoryList"),
    searchInput: document.getElementById("searchInput"),
    searchBtn: document.getElementById("searchBtn"),
    showAllBtn: document.getElementById("showAllBtn"),
    hideAllBtn: document.getElementById("hideAllBtn"),
    progressValue: document.getElementById("progressValue"),
    progressFill: document.getElementById("progressFill"),
    foundCount: document.getElementById("foundCount"),
    totalCount: document.getElementById("totalCount"),
    locationPanel: document.getElementById("locationPanel"),
    exportBtn: document.getElementById("exportBtn"),
    importInput: document.getElementById("importInput"),
    resetBtn: document.getElementById("resetBtn"),
    zoomInBtn: document.getElementById("zoomInBtn"),
    zoomOutBtn: document.getElementById("zoomOutBtn"),
    leftSidebar: document.getElementById("leftSidebar"),
    rightSidebar: document.getElementById("rightSidebar"),
    toggleLeftSidebar: document.getElementById("toggleLeftSidebar"),
    toggleRightSidebar: document.getElementById("toggleRightSidebar"),
  };

  // ==========================================================================
  // Category Icons (SVG paths)
  // ==========================================================================

  const categoryIcons = {
    location: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
    cargoElevator: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>',
    fieldDepot: '<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>',
    lockedDoor: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>',
    raiderCamp: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
    raiderHatch: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>',
    collectible: '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>',
    ammoBox: '<path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/>',
    arcCourier: '<path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
    baronHusk: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
    container: '<path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z"/>',
    fieldCrate: '<path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 7h6v2H9z"/>',
    grenadeTube: '<path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>',
    item: '<path d="M12 2l-5.5 9h11z"/><path d="M17.5 17.5L12 22l-5.5-4.5h11z"/>',
    medicalBox: '<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>',
    securityLocker: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>',
    weaponCase: '<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>',
    agave: '<path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z"/>',
    apricot: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>',
    fruitBasket: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
    greatMullein: '<path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9zm9-11C6.48 2 2 6.48 2 12c0 .34.02.68.05 1.01C5.55 8.86 10.46 6 16 6c1.82 0 3.56.32 5.17.9C20.49 3.83 16.66 2 12 2z"/>',
    mushroom: '<path d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm1 14h-2v-1h2v1zm-3.57-4.38l.56.34V14h4.02v-2.04l.56-.34C15.45 10.98 16 9.84 16 8.5c0-2.49-2.01-4.5-4.5-4.5S7 6.01 7 8.5c0 1.34.55 2.48 1.43 3.12zM9 20h6c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2z"/>',
    pricklyPear: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>',
    quest: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/>',
    arc: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>',
    enemy: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm1.61-9.96c-2.06-.3-3.88.97-4.43 2.79-.18.58.26 1.17.87 1.17h.2c.41 0 .74-.29.88-.67.32-.89 1.27-1.5 2.3-1.28.95.2 1.65 1.13 1.57 2.1-.1 1.34-1.62 1.63-2.45 2.88 0 .01-.01.01-.01.02-.01.02-.02.03-.03.05-.09.15-.18.32-.25.5-.01.03-.03.05-.04.08-.01.02-.01.04-.02.07-.12.34-.2.75-.2 1.25h2c0-.42.11-.77.28-1.07.02-.03.03-.06.05-.09.08-.14.18-.27.28-.39.01-.01.02-.03.03-.04.1-.12.21-.23.33-.34.96-.91 2.26-1.65 1.99-3.56-.24-1.74-1.61-3.21-3.35-3.47z"/>',
    sentinel: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>',
    surveyor: '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
    miscellaneous: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
    playerSpawn: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>',
    supplyCall: '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>',
    zipline: '<path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58s4.1-.78 5.66-2.34c3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.7 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z"/>',
    raiderCache: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11zm-11.59.59L6 13l4 4 8-8-1.41-1.42L10 14.17z"/>',
    boss: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
    vehicleTrunk: '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
    extraction: '<path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>',
    event: '<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>',
  };

  // ==========================================================================
  // Category Groups
  // ==========================================================================

  const categoryGroups = [
    {
      id: "locations",
      title: "Locations",
      categories: ["cargoElevator", "fieldDepot", "location", "lockedDoor", "raiderCamp", "raiderHatch"],
    },
    {
      id: "collectibles",
      title: "Collectibles",
      categories: ["collectible"],
    },
    {
      id: "loot",
      title: "Loot",
      categories: ["ammoBox", "arcCourier", "baronHusk", "container", "fieldCrate", "grenadeTube", "item", "medicalBox", "securityLocker", "weaponCase"],
    },
    {
      id: "resources",
      title: "Natural Resources",
      categories: ["agave", "apricot", "fruitBasket", "greatMullein", "mushroom", "pricklyPear"],
    },
    {
      id: "missions",
      title: "Missions",
      categories: ["quest"],
    },
    {
      id: "enemies",
      title: "Enemies",
      categories: ["arc", "enemy", "sentinel", "surveyor"],
    },
    {
      id: "other",
      title: "Other",
      categories: ["miscellaneous", "playerSpawn", "supplyCall", "zipline"],
    },
    {
      id: "events",
      title: "Events",
      categories: ["raiderCache", "event"],
    },
  ];

  // ==========================================================================
  // Storage
  // ==========================================================================

  function loadFoundLocations() {
    try {
      const data = localStorage.getItem("arc-raiders-found");
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveFoundLocations() {
    try {
      localStorage.setItem("arc-raiders-found", JSON.stringify(state.foundLocations));
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }

  // ==========================================================================
  // Helpers
  // ==========================================================================

  function getCurrentMap() {
    return config.maps.find(m => m.id === state.currentMapId) || config.maps[0];
  }

  function getCategoryColor(type) {
    const colors = {
      location: "#3b82f6",
      cargoElevator: "#a855f7",
      fieldDepot: "#8b5cf6",
      lockedDoor: "#f97316",
      raiderCamp: "#78716c",
      raiderHatch: "#dc2626",
      collectible: "#06b6d4",
      ammoBox: "#f59e0b",
      arcCourier: "#fbbf24",
      baronHusk: "#a855f7",
      container: "#a78bfa",
      fieldCrate: "#c084fc",
      grenadeTube: "#84cc16",
      item: "#94a3b8",
      medicalBox: "#ef4444",
      securityLocker: "#ec4899",
      weaponCase: "#f472b6",
      agave: "#22c55e",
      apricot: "#f59e0b",
      fruitBasket: "#84cc16",
      greatMullein: "#22c55e",
      mushroom: "#a3a3a3",
      pricklyPear: "#16a34a",
      quest: "#fbbf24",
      arc: "#ef4444",
      enemy: "#dc2626",
      sentinel: "#b91c1c",
      surveyor: "#991b1b",
      miscellaneous: "#6b7280",
      playerSpawn: "#22d3ee",
      supplyCall: "#0ea5e9",
      zipline: "#06b6d4",
      raiderCache: "#f59e0b",
      event: "#a855f7",
      boss: "#c084fc",
      vehicleTrunk: "#14b8a6",
      extraction: "#22c55e",
    };
    return colors[type] || "#6b7280";
  }

  function countByCategory(items) {
    const counts = {};
    items.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }

  // ==========================================================================
  // Map Setup
  // ==========================================================================

  function initMap() {
    const mapConfig = getCurrentMap();
    
    if (state.map) {
      state.map.remove();
    }

    const bounds = mapConfig.image?.bounds || [[0, 0], [1200, 1600]];
    
    state.map = L.map("map", {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 4,
      zoomControl: false,
      attributionControl: false,
    });

    // Add image overlay
    L.imageOverlay(mapConfig.image.url, bounds).addTo(state.map);
    state.map.fitBounds(bounds);

    // Create marker layer
    state.markerLayer = L.layerGroup().addTo(state.map);

    // Render markers
    renderMarkers();
  }

  function renderMarkers() {
    if (!state.markerLayer) return;
    
    state.markerLayer.clearLayers();
    state.markers.clear();

    const mapConfig = getCurrentMap();
    const items = mapConfig.items || [];
    const query = state.searchQuery.toLowerCase();

    items.forEach(item => {
      // Check if category is visible
      if (!state.visibleCategories.has(item.type)) return;

      // Check search query
      if (query && !item.title.toLowerCase().includes(query)) {
        if (!item.description?.toLowerCase().includes(query)) return;
      }

      const isFound = state.foundLocations[item.id];
      const color = getCategoryColor(item.type);
      const iconSvg = categoryIcons[item.type] || categoryIcons.location;

      const icon = L.divIcon({
        className: "marker",
        html: `
          <div class="marker__icon ${isFound ? "marker--found" : ""}" style="background-color: ${color};">
            <svg viewBox="0 0 24 24">${iconSvg}</svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      // coords are [y, x] = [lat, lng] format for Leaflet Simple CRS
      const latLng = item.coords;
      
      const marker = L.marker(latLng, { icon });
      marker.itemData = item;
      
      marker.on("click", () => showLocationPopup(item, marker));
      
      marker.addTo(state.markerLayer);
      state.markers.set(item.id, marker);
    });

    updateProgress();
  }

  function showLocationPopup(item, marker) {
    const isFound = state.foundLocations[item.id];
    const color = getCategoryColor(item.type);
    const categoryLabel = config.categories[item.type]?.label || item.type;

    const popupContent = `
      <div class="popup">
        <div class="popup__header">
          <span class="popup__category" style="background-color: ${color};">
            ${categoryLabel}
          </span>
          <h3 class="popup__title">${item.title}</h3>
        </div>
        ${item.description ? `<p class="popup__description">${item.description}</p>` : ""}
        ${item.mediaUrl ? `<img src="${item.mediaUrl}" alt="${item.title}" class="popup__image" />` : ""}
        <div class="popup__actions">
          <button class="popup__btn popup__btn--found ${isFound ? "is-found" : ""}" data-item-id="${item.id}">
            ${isFound ? "✓ Found" : "Mark as Found"}
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 320,
      minWidth: 280,
    }).openPopup();

    // Bind event after popup opens
    setTimeout(() => {
      const btn = document.querySelector(`.popup__btn--found[data-item-id="${item.id}"]`);
      if (btn) {
        btn.addEventListener("click", () => toggleFound(item.id));
      }
    }, 100);
  }

  function toggleFound(itemId) {
    if (state.foundLocations[itemId]) {
      delete state.foundLocations[itemId];
    } else {
      state.foundLocations[itemId] = true;
    }
    saveFoundLocations();
    renderMarkers();
  }

  // ==========================================================================
  // UI Rendering
  // ==========================================================================

  function renderMapTabs() {
    els.mapTabs.innerHTML = "";
    
    config.maps.forEach(map => {
      const btn = document.createElement("button");
      btn.className = `map-tab ${map.id === state.currentMapId ? "map-tab--active" : ""}`;
      btn.textContent = map.name;
      btn.addEventListener("click", () => switchMap(map.id));
      els.mapTabs.appendChild(btn);
    });
  }

  function renderCategories() {
    const mapConfig = getCurrentMap();
    const items = mapConfig.items || [];
    const counts = countByCategory(items);

    els.categoryList.innerHTML = "";

    categoryGroups.forEach(group => {
      // Check if any categories in this group exist in the current map
      const hasItems = group.categories.some(cat => counts[cat] > 0);
      if (!hasItems) return;

      const groupEl = document.createElement("div");
      groupEl.className = "category-group";
      groupEl.innerHTML = `
        <div class="category-group__header">
          <span class="category-group__title">${group.title}</span>
          <svg class="category-group__toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <div class="category-group__body"></div>
      `;

      const header = groupEl.querySelector(".category-group__header");
      const body = groupEl.querySelector(".category-group__body");

      header.addEventListener("click", () => {
        groupEl.classList.toggle("category-group--collapsed");
      });

      group.categories.forEach(catId => {
        const count = counts[catId] || 0;
        if (count === 0) return;

        const catConfig = config.categories[catId];
        if (!catConfig) return;

        const color = getCategoryColor(catId);
        const iconSvg = categoryIcons[catId] || categoryIcons.location;
        const isVisible = state.visibleCategories.has(catId);

        const itemEl = document.createElement("div");
        itemEl.className = `category-item ${!isVisible ? "category-item--hidden" : ""}`;
        itemEl.innerHTML = `
          <span class="category-item__icon" style="background-color: ${color}; color: white;">
            <svg viewBox="0 0 24 24">${iconSvg}</svg>
          </span>
          <span class="category-item__name">${catConfig.label}</span>
          <span class="category-item__count">${count}</span>
        `;

        itemEl.addEventListener("click", () => {
          toggleCategory(catId);
          itemEl.classList.toggle("category-item--hidden");
        });

        body.appendChild(itemEl);
      });

      els.categoryList.appendChild(groupEl);
    });
  }

  function updateProgress() {
    const mapConfig = getCurrentMap();
    const items = mapConfig.items || [];
    const total = items.length;
    const found = items.filter(item => state.foundLocations[item.id]).length;
    const percent = total > 0 ? (found / total) * 100 : 0;

    els.progressValue.textContent = `${found}/${total}`;
    els.progressFill.style.width = `${percent}%`;
    els.foundCount.textContent = found;
    els.totalCount.textContent = total;
  }

  // ==========================================================================
  // Actions
  // ==========================================================================

  function switchMap(mapId) {
    state.currentMapId = mapId;
    renderMapTabs();
    renderCategories();
    initMap();
  }

  function toggleCategory(catId) {
    if (state.visibleCategories.has(catId)) {
      state.visibleCategories.delete(catId);
    } else {
      state.visibleCategories.add(catId);
    }
    renderMarkers();
  }

  function showAllCategories() {
    state.visibleCategories = new Set(Object.keys(config.categories));
    renderCategories();
    renderMarkers();
  }

  function hideAllCategories() {
    state.visibleCategories.clear();
    renderCategories();
    renderMarkers();
  }

  function handleSearch() {
    state.searchQuery = els.searchInput.value.trim();
    renderMarkers();
  }

  function exportProgress() {
    const data = JSON.stringify(state.foundLocations, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arc-raiders-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        state.foundLocations = data;
        saveFoundLocations();
        renderMarkers();
      } catch (err) {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (confirm("Reset all progress? This cannot be undone.")) {
      state.foundLocations = {};
      saveFoundLocations();
      renderMarkers();
    }
  }

  function toggleSidebar(sidebar, toggle) {
    sidebar.classList.toggle("sidebar--collapsed");
    const isCollapsed = sidebar.classList.contains("sidebar--collapsed");
    toggle.querySelector("svg").style.transform = isCollapsed ? "rotate(180deg)" : "";
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  function initEvents() {
    els.showAllBtn.addEventListener("click", showAllCategories);
    els.hideAllBtn.addEventListener("click", hideAllCategories);
    
    els.searchBtn.addEventListener("click", handleSearch);
    els.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });

    els.exportBtn.addEventListener("click", exportProgress);
    els.importInput.addEventListener("change", importProgress);
    els.resetBtn.addEventListener("click", resetProgress);

    els.zoomInBtn.addEventListener("click", () => state.map?.zoomIn());
    els.zoomOutBtn.addEventListener("click", () => state.map?.zoomOut());

    els.toggleLeftSidebar.addEventListener("click", () => {
      toggleSidebar(els.leftSidebar, els.toggleLeftSidebar);
    });

    els.toggleRightSidebar.addEventListener("click", () => {
      toggleSidebar(els.rightSidebar, els.toggleRightSidebar);
    });
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  function init() {
    renderMapTabs();
    renderCategories();
    initMap();
  initEvents();
  }

  init();
})();
