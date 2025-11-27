(() => {
  const config = window.arcMapsConfig;
  if (!config) {
    console.error("Missing arcMapsConfig in data/maps.js");
    return;
  }

  const els = {
    mapTabs: document.getElementById("mapTabs"),
    mapSelect: document.getElementById("mapSelect"),
    mapDescription: document.getElementById("mapDescription"),
    searchInput: document.getElementById("searchInput"),
    showComplete: document.getElementById("showComplete"),
    showIncomplete: document.getElementById("showIncomplete"),
    categoryGroups: document.getElementById("categoryGroups"),
    itemList: document.getElementById("itemList"),
    collapseList: document.getElementById("collapseList"),
    progressHeadline: document.getElementById("completionHeadline"),
    progressSubtext: document.getElementById("completionSubtext"),
    progressBar: document.getElementById("progressBarValue"),
    activeFilters: document.getElementById("activeFilters"),
    resetProgress: document.getElementById("resetProgress"),
    fitBoundsBtn: document.getElementById("fitBoundsBtn"),
    exportProgressBtn: document.getElementById("exportProgressBtn"),
    importProgressInput: document.getElementById("importProgressInput"),
    mapPreview: document.getElementById("mapPreview"),
    mapThreatBadge: document.getElementById("mapThreatBadge"),
    mapBiome: document.getElementById("mapBiome"),
    mapRecommendedPower: document.getElementById("mapRecommendedPower"),
    mapFeaturedLoot: document.getElementById("mapFeaturedLoot"),
    rarityFilter: document.getElementById("rarityFilter"),
    difficultyFilter: document.getElementById("difficultyFilter"),
    legendItems: document.getElementById("legendItems"),
    mapLegend: document.getElementById("mapLegend"),
    showAllBtn: document.getElementById("showAllBtn"),
    hideAllBtn: document.getElementById("hideAllBtn"),
    expandGroupsBtn: document.getElementById("expandGroupsBtn"),
    collapseGroupsBtn: document.getElementById("collapseGroupsBtn"),
    guideList: document.getElementById("guideList"),
    clearGuideBtn: document.getElementById("clearGuideBtn"),
    poiSectionLabel: document.getElementById("poiSectionLabel"),
    toggleLegendBtn: document.getElementById("toggleLegendBtn"),
    measureToolBtn: document.getElementById("measureToolBtn"),
    radiusToolBtn: document.getElementById("radiusToolBtn")
  };

  const state = {
    mapInstance: null,
    markerLayer: null,
    baseLayer: null,
    imageLayer: null,
    currentMapId: config.defaultMapId,
    bounds: null,
    filters: {
      search: "",
      types: new Set(Object.keys(config.categories)),
      showComplete: true,
      showIncomplete: true,
      rarity: "all",
      difficulty: "all"
    },
    progress: loadProgress(),
    listCollapsed: false,
    groupCollapse: new Set(),
    activeGuide: null,
    activeGuideItems: null,
    toolLayer: null,
    activeTool: null,
    measureStart: null
  };

  const template = document.getElementById("poiTemplate");

  const defaultMetaByType = {
    quest: { rarity: "legendary", difficulty: "high" },
    boss: { rarity: "exotic", difficulty: "elite" },
    weaponCase: { rarity: "rare", difficulty: "medium" },
    fieldCrate: { rarity: "common", difficulty: "low" },
    securityLocker: { rarity: "rare", difficulty: "medium" },
    raiderCache: { rarity: "legendary", difficulty: "medium" },
    vehicleTrunk: { rarity: "uncommon", difficulty: "low" },
    extraction: { rarity: "common", difficulty: "low" },
    collectible: { rarity: "uncommon", difficulty: "low" },
    event: { rarity: "rare", difficulty: "high" },
    location: { rarity: "common", difficulty: "low" }
  };

  const categoryGroupConfig = [
    {
      id: "locations",
      label: "Key Locations",
      categories: ["location", "collectible", "extraction"]
    },
    {
      id: "loot",
      label: "Loot Containers",
      categories: ["weaponCase", "fieldCrate", "securityLocker", "raiderCache", "vehicleTrunk"]
    },
    {
      id: "missions",
      label: "Missions & Events",
      categories: ["quest", "event", "boss"]
    }
  ];

  const guidePresets = [
    {
      id: "rusted-gears",
      title: "Rusted Gear Farm",
      mapId: "blue-gate",
      description: "Follow the ridge caravan route to loot 4 trunks per loop.",
      itemIds: ["blue-vehicle-004", "blue-vehicle-005", "blue-vehicle-006", "blue-vehicle-013"],
      reference: {
        label: "MetaForge Rusted Gear Guide",
        url: "https://metaforge.app/arc-raiders/guides/page/1"
      }
    },
    {
      id: "hidden-bunker",
      title: "Hidden Bunker Puzzle",
      mapId: "dam-battlegrounds",
      description: "Hit the Control Tower, Admin Wing, and Floodgate vault in order.",
      itemIds: ["dam-location-003", "dam-location-004", "dam-locker-012"],
      reference: {
        label: "MetaForge Hidden Bunker Guide",
        url: "https://metaforge.app/arc-raiders/guides/page/1"
      }
    },
    {
      id: "rocketeer-driver",
      title: "Rocketeer Driver Route",
      mapId: "spaceport",
      description: "Clear Launch Towers and Fuel Depot for guaranteed Rocketeers.",
      itemIds: ["space-boss-001", "space-location-004", "space-quest-013"],
      reference: {
        label: "MetaForge Rocketeer Driver Tips",
        url: "https://metaforge.app/arc-raiders/guides/page/1"
      }
    }
  ];

  const categoryCheckboxes = new Map();

  function loadProgress() {
    try {
      const raw = window.localStorage.getItem(config.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.warn("Unable to parse saved progress", err);
      return {};
    }
  }

  function persistProgress() {
    try {
      window.localStorage.setItem(config.storageKey, JSON.stringify(state.progress));
    } catch (err) {
      console.warn("Unable to persist progress", err);
    }
  }

  function hydrateMapSelect() {
    if (!els.mapSelect) return;
    els.mapSelect.innerHTML = "";
    config.maps.forEach((map) => {
      const option = document.createElement("option");
      option.value = map.id;
      option.textContent = map.name;
      if (map.id === state.currentMapId) {
        option.selected = true;
      }
      els.mapSelect.append(option);
    });
  }

  function hydrateMapTabs() {
    if (!els.mapTabs) return;
    els.mapTabs.innerHTML = "";
    config.maps.forEach((map) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `map-tab${map.id === state.currentMapId ? " map-tab--active" : ""}`;
      button.textContent = map.name;
      button.addEventListener("click", () => switchToMap(map.id));
      button.dataset.mapId = map.id;
      els.mapTabs.append(button);
    });
  }

  function setActiveMapTab(mapId) {
    if (els.mapTabs) {
      [...els.mapTabs.children].forEach((child) => {
        child.classList.toggle("map-tab--active", child.dataset.mapId === mapId);
      });
    }
    if (els.mapSelect && els.mapSelect.value !== mapId) {
      els.mapSelect.value = mapId;
    }
  }

  function switchToMap(mapId, options = {}) {
    if (!mapId || mapId === state.currentMapId) return;
    state.currentMapId = mapId;
    setActiveMapTab(mapId);
    if (!options.preserveGuide) {
      state.activeGuide = null;
      state.activeGuideItems = null;
      updateGuideUI();
    }
    renderMap();
  }

  function hydrateCategoryGroups() {
    if (!els.categoryGroups) return;
    els.categoryGroups.innerHTML = "";
    categoryCheckboxes.clear();

    categoryGroupConfig.forEach((group) => {
      const wrapper = document.createElement("div");
      wrapper.className = "category-group";
      wrapper.dataset.group = group.id;

      const header = document.createElement("button");
      header.type = "button";
      header.className = "category-group__header";
      header.innerHTML = `
        <span>${group.label}</span>
        <span class="category-group__count" data-group-count="${group.id}">0</span>
      `;

      const body = document.createElement("div");
      body.className = "category-group__body";

      header.addEventListener("click", () => toggleGroupCollapse(group.id, body));

      group.categories.forEach((type) => {
        const meta = config.categories[type];
        if (!meta) return;
        const row = document.createElement("label");
        row.className = "category-filter";

        const left = document.createElement("span");
        left.className = "category-filter__label";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = state.filters.types.has(type);
        checkbox.addEventListener("change", (event) => {
          event.stopPropagation();
          handleCategoryToggle(type, event.target.checked);
        });

        const swatch = document.createElement("span");
        swatch.className = "category-filter__swatch";
        swatch.style.background = meta.color;

        const label = document.createElement("span");
        label.textContent = meta.label;

        left.append(checkbox, swatch, label);

        const count = document.createElement("span");
        count.className = "category-filter__count";
        count.dataset.countFor = type;
        count.textContent = "0";

        row.append(left, count);
        body.append(row);

        categoryCheckboxes.set(type, { checkbox, countEl: count });
      });

      wrapper.append(header, body);
      els.categoryGroups.append(wrapper);
    });
  }

  function handleCategoryToggle(type, isChecked) {
    if (isChecked) {
      state.filters.types.add(type);
    } else {
      state.filters.types.delete(type);
    }
    render();
  }

  function syncCategoryCheckboxes() {
    categoryCheckboxes.forEach(({ checkbox }, type) => {
      checkbox.checked = state.filters.types.has(type);
    });
  }

  function toggleGroupCollapse(groupId, bodyEl) {
    const isCollapsed = state.groupCollapse.has(groupId);
    if (isCollapsed) {
      state.groupCollapse.delete(groupId);
      bodyEl.classList.remove("is-collapsed");
    } else {
      state.groupCollapse.add(groupId);
      bodyEl.classList.add("is-collapsed");
    }
  }

  function setAllGroupCollapse(collapsed) {
    state.groupCollapse = new Set();
    els.categoryGroups?.querySelectorAll(".category-group__body")?.forEach((body) => {
      const groupId = body.parentElement?.dataset.group;
      if (!groupId) return;
      if (collapsed) {
        body.classList.add("is-collapsed");
        state.groupCollapse.add(groupId);
      } else {
        body.classList.remove("is-collapsed");
      }
    });
  }

  function updateCategoryCounts(items) {
    const counts = {};
    items.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    categoryCheckboxes.forEach(({ countEl }, type) => {
      countEl.textContent = counts[type] ?? 0;
    });
    categoryGroupConfig.forEach((group) => {
      const total = group.categories.reduce((sum, type) => sum + (counts[type] ?? 0), 0);
      const countLabel = els.categoryGroups?.querySelector(`[data-group-count="${group.id}"]`);
      if (countLabel) countLabel.textContent = total;
    });
  }

  function hydrateGuideList() {
    if (!els.guideList) return;
    els.guideList.innerHTML = "";
    guidePresets.forEach((guide) => {
      const card = document.createElement("article");
      card.className = "guide-card";
      card.dataset.guideId = guide.id;

      const title = document.createElement("p");
      title.className = "guide-card__title";
      title.textContent = guide.title;

      const meta = document.createElement("p");
      meta.className = "guide-card__meta";
      meta.textContent = formatLabel(guide.mapId);

      const desc = document.createElement("p");
      desc.className = "guide-card__description";
      desc.textContent = guide.description;

      const actions = document.createElement("div");
      actions.className = "guide-card__actions";
      const button = document.createElement("button");
      button.className = "primary-button primary-button--small";
      button.type = "button";
      button.textContent = "Load Guide";
      button.addEventListener("click", () => applyGuidePreset(guide));
      actions.append(button);

      if (guide.reference?.label && guide.reference?.url) {
        const source = document.createElement("a");
        source.href = guide.reference.url;
        source.target = "_blank";
        source.rel = "noopener noreferrer";
        source.className = "text-button text-button--muted";
        source.textContent = guide.reference.label;
        actions.append(source);
      }

      card.append(title, meta, desc, actions);
      els.guideList.append(card);
    });
    updateGuideUI();
  }

  function applyGuidePreset(guide) {
    if (!guide) return;
    state.activeGuide = guide;
    state.activeGuideItems = new Set(guide.itemIds);
    if (state.currentMapId !== guide.mapId) {
      switchToMap(guide.mapId, { preserveGuide: true });
    } else {
      render();
    }
    updateGuideUI();
  }

  function clearActiveGuide() {
    state.activeGuide = null;
    state.activeGuideItems = null;
    updateGuideUI();
    render();
  }

  function updateGuideUI() {
    if (els.clearGuideBtn) {
      els.clearGuideBtn.disabled = !state.activeGuide;
    }
    if (els.poiSectionLabel) {
      els.poiSectionLabel.textContent = state.activeGuide
        ? `Points of Interest · ${state.activeGuide.title}`
        : "Points of Interest";
    }
    if (els.guideList) {
      els.guideList.querySelectorAll(".guide-card").forEach((card) => {
        card.classList.toggle("guide-card--active", card.dataset.guideId === state.activeGuide?.id);
      });
    }
  }

  function initEvents() {
    els.mapSelect?.addEventListener("change", (event) => {
      switchToMap(event.target.value);
    });

    els.searchInput.addEventListener("input", (event) => {
      state.filters.search = event.target.value.trim().toLowerCase();
      render();
    });

    els.showComplete.addEventListener("change", (event) => {
      state.filters.showComplete = event.target.checked;
      render();
    });

    els.showIncomplete.addEventListener("change", (event) => {
      state.filters.showIncomplete = event.target.checked;
      render();
    });

    els.collapseList.addEventListener("click", () => {
      state.listCollapsed = !state.listCollapsed;
      els.itemList.classList.toggle("hidden", state.listCollapsed);
      els.collapseList.textContent = state.listCollapsed ? "Expand" : "Collapse";
    });

    els.resetProgress?.addEventListener("click", () => {
      if (confirm("Clear all saved progress on this device?")) {
        state.progress = {};
        persistProgress();
        render();
      }
    });

    els.fitBoundsBtn?.addEventListener("click", fitCurrentBounds);

    els.exportProgressBtn?.addEventListener("click", exportProgress);
    els.importProgressInput?.addEventListener("change", importProgress);

    els.rarityFilter?.addEventListener("change", (event) => {
      state.filters.rarity = event.target.value;
      render();
    });

    els.difficultyFilter?.addEventListener("change", (event) => {
      state.filters.difficulty = event.target.value;
      render();
    });

    els.showAllBtn?.addEventListener("click", () => {
      state.filters.types = new Set(Object.keys(config.categories));
      syncCategoryCheckboxes();
      render();
    });

    els.hideAllBtn?.addEventListener("click", () => {
      state.filters.types.clear();
      syncCategoryCheckboxes();
      render();
    });

    els.expandGroupsBtn?.addEventListener("click", () => setAllGroupCollapse(false));
    els.collapseGroupsBtn?.addEventListener("click", () => setAllGroupCollapse(true));

    els.clearGuideBtn?.addEventListener("click", clearActiveGuide);

    els.toggleLegendBtn?.addEventListener("click", () => {
      els.mapLegend?.classList.toggle("hidden");
    });

    els.measureToolBtn?.addEventListener("click", () => toggleTool("measure"));
    els.radiusToolBtn?.addEventListener("click", () => toggleTool("radius"));
  }

  function exportProgress() {
    const payload = JSON.stringify(
      { exportedAt: new Date().toISOString(), progress: state.progress },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "arc-raiders-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.progress && typeof parsed.progress === "object") {
          state.progress = parsed.progress;
          persistProgress();
          render();
        } else {
          alert("Import file is missing a valid progress object.");
        }
      } catch (err) {
        alert("Unable to parse the import file.");
        console.warn(err);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function getCurrentMap() {
    return config.maps.find((map) => map.id === state.currentMapId) ?? config.maps[0];
  }

  function renderMap() {
    const currentMap = getCurrentMap();
    if (!currentMap) return;
    setActiveMapTab(state.currentMapId);
    els.mapDescription.textContent = currentMap.description || "";

    const mapContainer = document.getElementById("map");
    if (state.mapInstance) {
      state.mapInstance.remove();
    }
    mapContainer.innerHTML = "";

    const mapOptions =
      currentMap.projection === "simple"
        ? {
            crs: L.CRS.Simple,
            minZoom: currentMap.zoom?.min ?? -2,
            maxZoom: currentMap.zoom?.max ?? 4,
            zoomControl: false,
            attributionControl: false,
            zoomSnap: 0.5,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 120
          }
        : {
            minZoom: currentMap.zoom?.min ?? 2,
            maxZoom: currentMap.zoom?.max ?? 7,
            zoomControl: false,
            attributionControl: false,
            zoomSnap: 0.5,
            zoomDelta: 0.5
          };

    state.mapInstance = L.map(mapContainer, mapOptions);
    L.control.zoom({ position: "bottomright" }).addTo(state.mapInstance);
    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(state.mapInstance);

    if (currentMap.projection === "simple" && currentMap.image?.bounds) {
      state.imageLayer = L.imageOverlay(currentMap.image.url, currentMap.image.bounds, {
        attribution: currentMap.image.attribution
      });
      state.imageLayer.addTo(state.mapInstance);
      state.mapInstance.fitBounds(currentMap.image.bounds);
      state.bounds = currentMap.image.bounds;
    } else if (currentMap.tileLayer?.url) {
      state.baseLayer = L.tileLayer(currentMap.tileLayer.url, {
        attribution: currentMap.tileLayer.attribution,
        maxZoom: mapOptions.maxZoom
      });
      state.baseLayer.addTo(state.mapInstance);
      const view = currentMap.view ?? { center: [0, 0], zoom: 3 };
      state.mapInstance.setView(view.center, view.zoom);
      state.bounds = null;
    }

    state.markerLayer = L.layerGroup().addTo(state.mapInstance);
    state.toolLayer = L.layerGroup().addTo(state.mapInstance);
    state.measureStart = null;
    syncToolButtons();
    state.mapInstance.on("click", handleMapToolClick);

    updateMapContext();
    render();
  }

  function fitCurrentBounds() {
    if (!state.mapInstance) return;
    if (state.bounds) {
      state.mapInstance.fitBounds(state.bounds, { maxZoom: state.mapInstance.getZoom() });
    } else if (state.markerLayer && state.markerLayer.getLayers().length > 0) {
      state.mapInstance.fitBounds(state.markerLayer.getBounds(), { maxZoom: state.mapInstance.getZoom() });
    }
  }

  function toggleTool(tool) {
    if (state.activeTool === tool) {
      state.activeTool = null;
    } else {
      state.activeTool = tool;
    }
    state.measureStart = null;
    state.toolLayer?.clearLayers();
    syncToolButtons();
  }

  function syncToolButtons() {
    if (els.measureToolBtn) {
      els.measureToolBtn.classList.toggle("is-active", state.activeTool === "measure");
    }
    if (els.radiusToolBtn) {
      els.radiusToolBtn.classList.toggle("is-active", state.activeTool === "radius");
    }
  }

  function handleMapToolClick(event) {
    if (!state.activeTool) return;
    if (state.activeTool === "measure") {
      handleMeasureClick(event.latlng);
    } else if (state.activeTool === "radius") {
      handleRadiusClick(event.latlng);
    }
  }

  function handleMeasureClick(latlng) {
    if (!state.toolLayer) return;
    if (!state.measureStart) {
      state.toolLayer.clearLayers();
      state.measureStart = latlng;
      return;
    }
    const start = state.measureStart;
    const distance = start.distanceTo(latlng);
    state.toolLayer.clearLayers();
    L.polyline([start, latlng], { color: "#22d3ee", dashArray: "6 4" }).addTo(state.toolLayer);
    const midpoint = L.latLng((start.lat + latlng.lat) / 2, (start.lng + latlng.lng) / 2);
    L.marker(midpoint, {
      interactive: false,
      icon: L.divIcon({
        className: "measure-label",
        html: `<span>${formatDistance(distance)}</span>`
      })
    }).addTo(state.toolLayer);
    state.measureStart = null;
  }

  function handleRadiusClick(latlng) {
    if (!state.toolLayer) return;
    state.measureStart = null;
    state.toolLayer.clearLayers();
    const rings = [50, 100, 150, 200, 250, 300];
    rings.forEach((radius) => {
      L.circle(latlng, {
        radius,
        color: "#facc15",
        weight: radius % 100 === 0 ? 2 : 1,
        dashArray: radius % 100 === 0 ? "4 4" : "2 6",
        fillOpacity: 0
      }).addTo(state.toolLayer);
    });
    L.marker(latlng, {
      interactive: false,
      icon: L.divIcon({
        className: "measure-label",
        html: `<span>${formatDistance(rings[rings.length - 1])} radius</span>`
      })
    }).addTo(state.toolLayer);
  }

  function formatDistance(meters) {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  }

  function filteredItems(items) {
    return items.filter((item) => {
      const matchesType = state.filters.types.has(item.type);
      if (!matchesType) return false;

      const completed = Boolean(state.progress[item.id]);

      if (!completed && !state.filters.showIncomplete) return false;
      if (completed && !state.filters.showComplete) return false;

      const rarityValue = getRarityValue(item);
      if (state.filters.rarity !== "all" && rarityValue !== state.filters.rarity) return false;

      const difficultyValue = getDifficultyValue(item);
      if (state.filters.difficulty !== "all" && difficultyValue !== state.filters.difficulty) return false;

      const search = state.filters.search;
      if (search) {
        const haystack = [
          item.title,
          item.description,
          ...(item.tags ?? []),
          ...(Array.isArray(item.rewards) ? item.rewards : [item.rewards])
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(search)) return false;
      }

      if (state.activeGuideItems) {
        return state.activeGuideItems.has(item.id);
      }

      return true;
    });
  }

  function renderMarkers(items) {
    if (!state.mapInstance || !state.markerLayer) return;
    state.markerLayer.clearLayers();
    const mapConfig = getCurrentMap();

    items.forEach((item) => {
      const latLng = toLatLng(item.coords, mapConfig);
      const icon = createMarkerIcon(item);
      const marker = L.marker(latLng, { icon });
      marker.itemId = item.id;
      marker.bindPopup(renderPopupContent(item), { minWidth: 260 });
      marker.on("popupopen", (event) => bindPopupActions(event.popup, item.id));
      marker.addTo(state.markerLayer);
    });
  }

  function toLatLng(coords, mapConfig) {
    if (mapConfig.projection === "simple") {
      const [x, y] = coords;
      return L.latLng(y, x);
    }
    return coords;
  }

  function getMarkerIconSVG(item) {
    const iconMap = {
      quest: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
      weaponCase: '<path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2H8c0-1.1.9-2 2-2zm6 14H6V8h12v10z"/>',
      fieldCrate: '<path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>',
      securityLocker: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>',
      raiderCache: '<path d="M12 2L2 22h20L12 2zm0 3.45l6.27 12.55H5.73L12 5.45zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>',
      event: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
      vehicleTrunk: '<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>',
      extraction: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L11 13.17V7h2v6.17l2.59-2.59L17 12l-5 5z"/>',
      boss: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>',
      collectible: '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>',
      location: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>'
    };
    return iconMap[item.type] || iconMap.location;
  }

  function createMarkerIcon(item) {
    const category = config.categories[item.type];
    const color = category?.color || "#94a3b8";
    const completed = Boolean(state.progress[item.id]);
    const inGuide = state.activeGuideItems?.has(item.id);
    const iconSVG = getMarkerIconSVG(item);

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-icon ${completed ? "marker-icon--complete" : ""} ${
        inGuide ? "marker-icon--featured" : ""
      }" style="--marker-color: ${color};">
          <svg class="marker-icon__svg" viewBox="0 0 24 24" fill="currentColor">
            ${iconSVG}
          </svg>
          ${completed ? '<span class="marker-icon__check">✓</span>' : ""}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  function getRarityValue(item) {
    return item.rarity ?? defaultMetaByType[item.type]?.rarity ?? "common";
  }

  function getDifficultyValue(item) {
    return item.difficulty ?? defaultMetaByType[item.type]?.difficulty ?? "medium";
  }

  function renderPopupContent(item) {
    const completed = Boolean(state.progress[item.id]);
    const objectiveList = (item.objectives ?? [])
      .map((step) => `<li>${step}</li>`)
      .join("");
    
    const rarity = getRarityValue(item);
    const difficulty = getDifficultyValue(item);
    const typeLabel = config.categories[item.type]?.label ?? item.type;

    return `
      <div class="popup">
        <p class="eyebrow">${typeLabel}</p>
        <h3>${item.title}</h3>
        <div class="popup-meta">
          <span style="color: ${rarity === 'legendary' ? '#fbbf24' : rarity === 'rare' ? '#60a5fa' : '#fff'}">${formatLabel(rarity)}</span>
          <span style="color: ${difficulty === 'elite' ? '#fb7185' : '#94a3b8'}">${formatLabel(difficulty)}</span>
        </div>
        <p>${item.description ?? ""}</p>
        ${
          objectiveList
            ? `<ul style="padding-left: 1rem; margin: 0 0 0.5rem; color: var(--text-muted);">${objectiveList}</ul>`
            : ""
        }
        ${
          item.rewards
            ? `<p><strong>Reward:</strong> ${
                Array.isArray(item.rewards) ? item.rewards.join(", ") : item.rewards
              }</p>`
            : ""
        }
        <div class="popup__actions">
          <button class="primary-button popup-toggle" data-item="${item.id}">
            ${completed ? "Mark as in-progress" : "Mark as complete"}
          </button>
        </div>
      </div>
    `;
  }

  function bindPopupActions(popup, itemId) {
    const button = popup.getElement().querySelector(".popup-toggle");
    if (!button) return;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      toggleItemCompletion(itemId);
    });
  }

  function renderList(items) {
    els.itemList.innerHTML = "";
    if (!items.length) {
      const emptyState = document.createElement("p");
      emptyState.className = "panel__hint";
      emptyState.textContent = "No points match the current filters.";
      els.itemList.append(emptyState);
      return;
    }

    const sorted = [...items].sort((a, b) => {
      const aComplete = state.progress[a.id] ? 1 : 0;
      const bComplete = state.progress[b.id] ? 1 : 0;
      if (aComplete !== bComplete) return aComplete - bComplete;
      return a.title.localeCompare(b.title);
    });

    sorted.forEach((item) => els.itemList.append(renderListItem(item)));
  }

  function renderListItem(item) {
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".poi-card");
    const typeEl = clone.querySelector(".poi-card__type");
    const titleEl = clone.querySelector(".poi-card__title");
    const descriptionEl = clone.querySelector(".poi-card__description");
    const metaEl = clone.querySelector(".poi-card__meta");
    const jumpBtn = clone.querySelector(".poi-card__jump");
    const toggleBtn = clone.querySelector(".poi-card__toggle");

    const category = config.categories[item.type];
    typeEl.textContent = category?.label ?? item.type;
    typeEl.style.color = category?.color ?? "var(--text-muted)";
    titleEl.textContent = item.title;
    descriptionEl.textContent = item.description ?? "";

    const metaTags = [];
    if (item.rewards) {
      const rewardText = Array.isArray(item.rewards) ? item.rewards.join(", ") : item.rewards;
      metaTags.push(`Reward: ${rewardText}`);
    }
    if (item.cooldownHours) metaTags.push(`Cooldown: ${item.cooldownHours}h`);
    if (item.schedule) metaTags.push(item.schedule);
    if (item.tags) metaTags.push(...item.tags);
    const rarityLabel = formatLabel(getRarityValue(item));
    const difficultyLabel = formatLabel(getDifficultyValue(item));
    metaTags.unshift(`Difficulty: ${difficultyLabel}`);
    metaTags.unshift(`Rarity: ${rarityLabel}`);

    metaTags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      metaEl.append(li);
    });

    const completed = Boolean(state.progress[item.id]);
    if (completed) {
      card.classList.add("poi-card--complete");
    }
    if (state.activeGuideItems?.has(item.id)) {
      card.classList.add("poi-card--guide");
    }
    toggleBtn.textContent = completed ? "Mark as in-progress" : "Mark as complete";
    if (completed) {
      toggleBtn.classList.add("poi-card__toggle--complete");
    }
    toggleBtn.addEventListener("click", () => toggleItemCompletion(item.id));
    jumpBtn.addEventListener("click", () => focusOnItem(item));

    return clone;
  }

  function focusOnItem(item) {
    const mapConfig = getCurrentMap();
    const latLng = toLatLng(item.coords, mapConfig);
    if (!state.mapInstance) return;
    state.mapInstance.setView(latLng, Math.max(state.mapInstance.getZoom(), 2));
    const targetMarker = state.markerLayer?.getLayers().find((layer) => layer.itemId === item.id);
    if (targetMarker) {
      targetMarker.openPopup();
    }
  }

  function toggleItemCompletion(itemId) {
    if (state.progress[itemId]) {
      delete state.progress[itemId];
    } else {
      state.progress[itemId] = { completedAt: Date.now() };
    }
    persistProgress();
    render();
  }

  function renderProgressSummary(totalItems) {
    const mapItems = getCurrentMap().items ?? [];
    const total = totalItems;
    const totalCompleted = mapItems.filter((item) => Boolean(state.progress[item.id])).length;

    els.progressHeadline.textContent = `${totalCompleted} of ${total} complete`;
    const remaining = Math.max(total - totalCompleted, 0);
    els.progressSubtext.textContent = remaining
      ? `${remaining} remaining on this map`
      : "All objectives cleared for this map!";

    const percent = total === 0 ? 0 : Math.round((totalCompleted / total) * 100);
    els.progressBar.style.width = `${percent}%`;
  }

  function updateToolbarStats(visibleItems) {
    const typeCount = state.filters.types.size;
    const searchActive = state.filters.search ? `Search: "${state.filters.search}"` : null;
    const pieces = [`${visibleItems.length} visible`];
    pieces.push(`${typeCount}/${Object.keys(config.categories).length} types`);
    if (!state.filters.showComplete) pieces.push("Hiding completed");
    if (!state.filters.showIncomplete) pieces.push("Hiding in-progress");
    if (state.filters.rarity !== "all") {
      pieces.push(`Rarity: ${formatLabel(state.filters.rarity)}`);
    }
    if (state.filters.difficulty !== "all") {
      pieces.push(`Difficulty: ${formatLabel(state.filters.difficulty)}`);
    }
    if (state.activeGuide) {
      pieces.push(`Guide: ${state.activeGuide.title}`);
    }
    if (searchActive) pieces.push(searchActive);
    els.activeFilters.textContent = pieces.join(" • ");
  }

  function render() {
    const currentMap = getCurrentMap();
    const items = currentMap.items ?? [];
    const visible = filteredItems(items);
    renderMarkers(visible);
    renderList(visible);
    renderProgressSummary(items.length);
    updateToolbarStats(visible);
    updateCategoryCounts(items);
    updateGuideUI();
  }

  function updateMapContext() {
    const currentMap = getCurrentMap();
    if (!currentMap) return;
    if (els.mapPreview) {
      const previewSrc = currentMap.thumbnail ?? currentMap.image?.url ?? "";
      if (previewSrc) {
        els.mapPreview.src = previewSrc;
      } else {
        els.mapPreview.removeAttribute("src");
      }
    }
    if (els.mapThreatBadge) {
      const threat = currentMap.threatLevel;
      els.mapThreatBadge.textContent = threat?.label ?? "Threat Unknown";
      els.mapThreatBadge.style.setProperty(
        "--threat-color",
        threat?.color ?? "#94a3b8"
      );
    }
    if (els.mapBiome) {
      els.mapBiome.textContent = currentMap.biome ?? "Unknown biome";
    }
    if (els.mapRecommendedPower) {
      els.mapRecommendedPower.textContent = currentMap.recommendedPower
        ? `Power ${currentMap.recommendedPower}+`
        : "--";
    }
    if (els.mapFeaturedLoot) {
      const loot = Array.isArray(currentMap.featuredLoot)
        ? currentMap.featuredLoot.join(", ")
        : currentMap.featuredLoot;
      els.mapFeaturedLoot.textContent = loot || "--";
    }
  }

  function formatLabel(value) {
    if (!value || typeof value !== "string") return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function hydrateLegend() {
    els.legendItems.innerHTML = "";
    Object.entries(config.categories).forEach(([key, meta]) => {
      const item = document.createElement("div");
      item.className = "map-legend__item";
      
      const icon = document.createElement("span");
      icon.className = "map-legend__icon";
      icon.style.setProperty("--marker-color", meta.color);
      
      const iconSVG = getMarkerIconSVG({ type: key });
      icon.innerHTML = `<svg class="map-legend__svg" viewBox="0 0 24 24" fill="currentColor">${iconSVG}</svg>`;
      
      const label = document.createElement("span");
      label.className = "map-legend__label";
      label.textContent = meta.label;
      
      item.append(icon, label);
      els.legendItems.append(item);
    });
  }

  function hydrateFilterOptions() {
    buildFilterSelect(
      els.rarityFilter,
      config.rarityOptions ?? [],
      "All rarities",
      state.filters.rarity
    );
    buildFilterSelect(
      els.difficultyFilter,
      config.difficultyOptions ?? [],
      "All difficulties",
      state.filters.difficulty
    );
  }

  function buildFilterSelect(selectEl, options, defaultLabel, currentValue) {
    if (!selectEl) return;
    selectEl.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = defaultLabel;
    selectEl.append(defaultOption);

    options.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = formatLabel(value);
      selectEl.append(option);
    });

    selectEl.value = currentValue ?? "all";
  }

  hydrateMapSelect();
  hydrateMapTabs();
  hydrateCategoryGroups();
  hydrateGuideList();
  hydrateLegend();
  hydrateFilterOptions();
  initEvents();
  renderMap();
})();

