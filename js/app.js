/**
 * ARC Raiders Interactive Map - Mapbox GL JS Version
 * Uses MapGenie's tile server with matching configuration
 */

(function () {
  "use strict";

  // ==========================================================================
  // State Management
  // ==========================================================================
  const state = {
    currentMapId: null,
    map: null,
    markers: [],
    markerElements: new Map(),
    foundItems: new Set(),
    visibleCategories: new Set(),
    searchQuery: "",
    activePopup: null,
  };

  // DOM element cache
  const els = {};

  // ==========================================================================
  // Initialization
  // ==========================================================================
  function init() {
    cacheElements();
    loadProgress();
    setupEventListeners();
    
    // Load first map
    const mapKeys = Object.keys(window.arcMapsConfig || {});
    if (mapKeys.length > 0) {
      renderMapTabs();
      loadMap(mapKeys[0]);
    }
  }

  function cacheElements() {
    els.map = document.getElementById("map");
    els.mapTabs = document.getElementById("mapTabs");
    els.categoryList = document.getElementById("categoryList");
    els.searchInput = document.getElementById("searchInput");
    els.searchBtn = document.getElementById("searchBtn");
    els.showAllBtn = document.getElementById("showAllBtn");
    els.hideAllBtn = document.getElementById("hideAllBtn");
    els.progressFill = document.getElementById("progressFill");
    els.progressValue = document.getElementById("progressValue");
    els.foundCount = document.getElementById("foundCount");
    els.totalCount = document.getElementById("totalCount");
    els.locationPanel = document.getElementById("locationPanel");
    els.exportBtn = document.getElementById("exportBtn");
    els.importInput = document.getElementById("importInput");
    els.resetBtn = document.getElementById("resetBtn");
    els.zoomInBtn = document.getElementById("zoomInBtn");
    els.zoomOutBtn = document.getElementById("zoomOutBtn");
    els.leftSidebar = document.getElementById("leftSidebar");
    els.rightSidebar = document.getElementById("rightSidebar");
    els.toggleLeftSidebar = document.getElementById("toggleLeftSidebar");
    els.toggleRightSidebar = document.getElementById("toggleRightSidebar");
  }

  // ==========================================================================
  // Map Loading
  // ==========================================================================
  function loadMap(mapId) {
    const mapConfig = window.arcMapsConfig[mapId];
    if (!mapConfig) return;

    state.currentMapId = mapId;
    
    // Update tab states
    document.querySelectorAll(".map-tab").forEach((tab) => {
      tab.classList.toggle("map-tab--active", tab.dataset.mapId === mapId);
    });

    // Clear existing markers
    state.markers.forEach(({ marker }) => marker.remove());
    state.markers = [];
    state.markerElements.clear();
    
    // Close any active popup
    if (state.activePopup) {
      state.activePopup.remove();
      state.activePopup = null;
    }

    // Initialize visible categories from saved state
    state.visibleCategories.clear();
    mapConfig.categories.forEach((cat) => {
      state.visibleCategories.add(cat.id);
    });

    // Create Mapbox GL map
    initMapboxMap(mapConfig);
    
    // Render categories
    renderCategories(mapConfig);
    
    // Update progress
    updateProgress(mapConfig);
  }

  function initMapboxMap(mapConfig) {
    // Remove existing map if any
    if (state.map) {
      state.map.remove();
    }

    const mapBounds = mapConfig.bounds
      ? [
          [mapConfig.bounds.minLng, mapConfig.bounds.minLat],
          [mapConfig.bounds.maxLng, mapConfig.bounds.maxLat],
        ]
      : null;

    // Create Mapbox GL map using MapGenie's raster tiles
    // MapGenie uses standard XYZ tiles with EPSG3857 projection
    state.map = new mapboxgl.Map({
      container: "map",
      style: {
        version: 8,
        sources: {
          "mapgenie-tiles": {
            type: "raster",
            tiles: [mapConfig.tileUrl],
            tileSize: 256,
            minzoom: mapConfig.zoom.min,
            maxzoom: mapConfig.zoom.max,
          },
        },
        layers: [
          {
            id: "mapgenie-layer",
            type: "raster",
            source: "mapgenie-tiles",
            paint: {
              "raster-opacity": 1,
              "raster-fade-duration": 0, // Disable tile fade to prevent seam artifacts
            },
          },
        ],
      },
      center: mapConfig.center, // [lng, lat] format - same as MapGenie
      zoom: mapConfig.zoom.initial,
      minZoom: mapConfig.zoom.min,
      maxZoom: mapConfig.zoom.max,
      maxBounds: mapBounds || undefined,
      attributionControl: false,
      fadeDuration: 0, // Disable symbol/label fade
      preserveDrawingBuffer: true, // Better rendering quality
      renderWorldCopies: false,
    });

    // Add markers after map loads
    state.map.on("load", () => {
      addMarkers(mapConfig);
    });

    // Close popup on map click
    state.map.on("click", (e) => {
      // Only close if not clicking on a marker
      if (!e.originalEvent.target.closest(".marker")) {
        if (state.activePopup) {
          state.activePopup.remove();
          state.activePopup = null;
        }
      }
    });
  }

  function addMarkers(mapConfig) {
    const items = mapConfig.items || [];
    
    items.forEach((item) => {
      const category = mapConfig.categories.find((c) => c.id === item.categoryId);
      if (!category) return;

      const isFound = state.foundItems.has(`${state.currentMapId}-${item.id}`);
      
      // Create marker element
      const el = document.createElement("div");
      el.className = `marker ${isFound ? "marker--found" : ""}`;
      el.innerHTML = `
        <div class="marker__icon" style="background-color: ${category.color};">
          <span class="marker__icon-inner">${getIconForType(category.type)}</span>
        </div>
      `;

      // Create Mapbox marker at [lng, lat] - same format as MapGenie
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat(item.coords)
        .addTo(state.map);

      // Store references
      marker.itemId = item.id;
      marker.categoryId = item.categoryId;
      marker._element = el;

      // Click handler
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        showItemPopup(item, category, marker);
      });

      state.markers.push({ marker, item, element: el });
      state.markerElements.set(item.id, marker);
    });

    updateMarkerVisibility();
  }

  function showItemPopup(item, category, marker) {
    if (state.activePopup) {
      state.activePopup.remove();
    }

    const isFound = state.foundItems.has(`${state.currentMapId}-${item.id}`);
    
    const popupContent = `
      <div class="popup">
        <div class="popup__header">
          <span class="popup__category" style="background-color: ${category.color};">
            ${category.name}
          </span>
        </div>
        <h3 class="popup__title">${item.name}</h3>
        ${item.description ? `<div class="popup__description">${formatDescription(item.description)}</div>` : ""}
        <div class="popup__actions">
          <button class="popup__btn ${isFound ? "popup__btn--found" : ""}" 
                  onclick="window.toggleItemFound(${item.id})">
            ${isFound ? "✓ Found" : "Mark as Found"}
          </button>
        </div>
      </div>
    `;

    state.activePopup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      className: "custom-popup",
      maxWidth: "300px",
      offset: [0, -10],
    })
      .setLngLat(item.coords)
      .setHTML(popupContent)
      .addTo(state.map);
  }

  // Global functions for popup buttons
  window.toggleItemFound = function(itemId) {
    const key = `${state.currentMapId}-${itemId}`;
    const marker = state.markerElements.get(itemId);
    
    if (state.foundItems.has(key)) {
      state.foundItems.delete(key);
      if (marker && marker._element) {
        marker._element.classList.remove("marker--found");
      }
    } else {
      state.foundItems.add(key);
      if (marker && marker._element) {
        marker._element.classList.add("marker--found");
      }
    }
    
    saveProgress();
    updateProgress(window.arcMapsConfig[state.currentMapId]);
    
    // Refresh popup if open
    const markerData = state.markers.find(m => m.item.id === itemId);
    if (markerData && state.activePopup) {
      const category = window.arcMapsConfig[state.currentMapId].categories.find(
        c => c.id === markerData.item.categoryId
      );
      showItemPopup(markerData.item, category, markerData.marker);
    }
  };

  // ==========================================================================
  // UI Rendering
  // ==========================================================================
  function renderMapTabs() {
    const maps = window.arcMapsConfig || {};
    
    els.mapTabs.innerHTML = Object.entries(maps)
      .map(([id, config]) => `
        <button class="map-tab" data-map-id="${id}">
          ${config.name}
        </button>
      `)
      .join("");
  }

  function renderCategories(mapConfig) {
    // Group categories
    const groups = {};
    mapConfig.categories.forEach((cat) => {
      if (!groups[cat.group]) {
        groups[cat.group] = [];
      }
      groups[cat.group].push(cat);
    });

    els.categoryList.innerHTML = Object.entries(groups)
      .map(([groupName, cats]) => {
        const groupItems = mapConfig.items.filter((item) =>
          cats.some((cat) => cat.id === item.categoryId)
        );
        const foundCount = groupItems.filter((item) =>
          state.foundItems.has(`${state.currentMapId}-${item.id}`)
        ).length;

        return `
          <div class="category-group">
            <div class="category-group__header">
              <span class="category-group__name">${groupName}</span>
              <span class="category-group__count">${foundCount}/${groupItems.length}</span>
              <button class="category-group__toggle" data-group="${groupName}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <div class="category-group__items">
              ${cats.map((cat) => {
                const catItems = mapConfig.items.filter((i) => i.categoryId === cat.id);
                const catFound = catItems.filter((i) =>
                  state.foundItems.has(`${state.currentMapId}-${i.id}`)
                ).length;
                const isVisible = state.visibleCategories.has(cat.id);

                return `
                  <label class="category-item ${!isVisible ? "category-item--hidden" : ""}">
                    <input type="checkbox" ${isVisible ? "checked" : ""} 
                           data-category-id="${cat.id}" class="category-checkbox" />
                    <span class="category-item__icon" style="background-color: ${cat.color};">
                      ${getIconForType(cat.type)}
                    </span>
                    <span class="category-item__name">${cat.name}</span>
                    <span class="category-item__count">${catFound}/${catItems.length}</span>
                  </label>
                `;
              }).join("")}
            </div>
          </div>
        `;
      })
      .join("");
  }

  function updateProgress(mapConfig) {
    const items = mapConfig?.items || [];
    const total = items.length;
    const found = items.filter((item) =>
      state.foundItems.has(`${state.currentMapId}-${item.id}`)
    ).length;
    const percent = total > 0 ? (found / total) * 100 : 0;

    els.progressFill.style.width = `${percent}%`;
    els.progressValue.textContent = `${found}/${total}`;
    els.foundCount.textContent = found;
    els.totalCount.textContent = total;
  }

  function updateMarkerVisibility() {
    const query = state.searchQuery.toLowerCase();

    state.markers.forEach(({ marker, item, element }) => {
      const category = window.arcMapsConfig[state.currentMapId]?.categories.find(
        (c) => c.id === item.categoryId
      );
      
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) ||
        category?.name.toLowerCase().includes(query);
      
      const categoryVisible = state.visibleCategories.has(item.categoryId);
      const visible = matchesSearch && categoryVisible;

      element.style.display = visible ? "" : "none";
    });
  }

  // ==========================================================================
  // Event Handlers
  // ==========================================================================
  function setupEventListeners() {
    // Map tabs
    els.mapTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".map-tab");
      if (tab) {
        loadMap(tab.dataset.mapId);
      }
    });

    // Category toggles
    els.categoryList.addEventListener("change", (e) => {
      if (e.target.classList.contains("category-checkbox")) {
        const catId = parseInt(e.target.dataset.categoryId, 10);
        if (e.target.checked) {
          state.visibleCategories.add(catId);
        } else {
          state.visibleCategories.delete(catId);
        }
        updateMarkerVisibility();
        e.target.closest(".category-item").classList.toggle("category-item--hidden", !e.target.checked);
      }
    });

    // Group collapse toggles
    els.categoryList.addEventListener("click", (e) => {
      const toggle = e.target.closest(".category-group__toggle");
      if (toggle) {
        const group = toggle.closest(".category-group");
        const items = group.querySelector(".category-group__items");
        const isCollapsed = items.style.display === "none";
        items.style.display = isCollapsed ? "" : "none";
        toggle.querySelector("svg").style.transform = isCollapsed ? "" : "rotate(180deg)";
      }
    });

    // Show/Hide All
    els.showAllBtn.addEventListener("click", () => {
      const mapConfig = window.arcMapsConfig[state.currentMapId];
      mapConfig?.categories.forEach((cat) => {
        state.visibleCategories.add(cat.id);
      });
      document.querySelectorAll(".category-checkbox").forEach((cb) => {
        cb.checked = true;
        cb.closest(".category-item")?.classList.remove("category-item--hidden");
      });
      updateMarkerVisibility();
    });

    els.hideAllBtn.addEventListener("click", () => {
      state.visibleCategories.clear();
      document.querySelectorAll(".category-checkbox").forEach((cb) => {
        cb.checked = false;
        cb.closest(".category-item")?.classList.add("category-item--hidden");
      });
      updateMarkerVisibility();
    });

    // Search
    els.searchBtn.addEventListener("click", performSearch);
    els.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") performSearch();
    });

    // Zoom controls
    els.zoomInBtn.addEventListener("click", () => {
      state.map?.zoomIn();
    });
    els.zoomOutBtn.addEventListener("click", () => {
      state.map?.zoomOut();
    });

    // Sidebar toggles
    els.toggleLeftSidebar.addEventListener("click", () => {
      els.leftSidebar.classList.toggle("sidebar--collapsed");
    });
    els.toggleRightSidebar.addEventListener("click", () => {
      els.rightSidebar.classList.toggle("sidebar--collapsed");
    });

    // Export/Import/Reset
    els.exportBtn.addEventListener("click", exportProgress);
    els.importInput.addEventListener("change", importProgress);
    els.resetBtn.addEventListener("click", resetProgress);
  }

  function performSearch() {
    state.searchQuery = els.searchInput.value.trim();
    updateMarkerVisibility();
  }

  // ==========================================================================
  // Progress Management
  // ==========================================================================
  function saveProgress() {
    localStorage.setItem("arcMapProgress", JSON.stringify([...state.foundItems]));
  }

  function loadProgress() {
    try {
      const saved = localStorage.getItem("arcMapProgress");
      if (saved) {
        state.foundItems = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
  }

  function exportProgress() {
    const data = {
      version: 1,
      timestamp: new Date().toISOString(),
      foundItems: [...state.foundItems],
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arc-raiders-progress-${new Date().toISOString().split("T")[0]}.json`;
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
        if (data.foundItems) {
          state.foundItems = new Set(data.foundItems);
          saveProgress();
          loadMap(state.currentMapId);
        }
      } catch (err) {
        alert("Invalid progress file");
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (confirm("Are you sure you want to reset all progress?")) {
      state.foundItems.clear();
      saveProgress();
      loadMap(state.currentMapId);
    }
  }

  // ==========================================================================
  // Utilities
  // ==========================================================================
  function getIconForType(type) {
    const icons = {
      cargoElevator: "⬆",
      fieldDepot: "📦",
      location: "📍",
      lockedDoor: "🔒",
      raiderCamp: "⛺",
      raiderHatch: "🚪",
      collectible: "⭐",
      ammoBox: "🎯",
      arcCourier: "📧",
      baronHusk: "💀",
      container: "📦",
      fieldCrate: "📥",
      grenadeTube: "💣",
      item: "◆",
      medicalBox: "➕",
      securityLocker: "🔐",
      weaponCase: "🔫",
      agave: "🌵",
      apricot: "🍑",
      fruitBasket: "🧺",
      greatMullein: "🌿",
      mushroom: "🍄",
      naturalResource: "🌱",
      enemy: "⚠",
      misc: "•",
    };
    return icons[type] || "•";
  }

  function formatDescription(desc) {
    if (!desc) return "";
    // Convert markdown-like formatting
    return desc
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>")
      .replace(/- (.+)/g, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
