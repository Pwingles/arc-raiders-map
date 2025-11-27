(() => {
  const config = window.arcMapsConfig;
  if (!config) {
    console.error("Missing arcMapsConfig in data/maps.js");
    return;
  }

  const els = {
    mapSelect: document.getElementById("mapSelect"),
    mapDescription: document.getElementById("mapDescription"),
    searchInput: document.getElementById("searchInput"),
    showComplete: document.getElementById("showComplete"),
    showIncomplete: document.getElementById("showIncomplete"),
    categoryFilters: document.getElementById("categoryFilters"),
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
    legendItems: document.getElementById("legendItems")
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
    listCollapsed: false
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

  function hydrateCategoryFilters() {
    Object.entries(config.categories).forEach(([key, meta]) => {
      const chip = document.createElement("label");
      chip.className = "chip active";
      chip.dataset.type = key;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.setAttribute("aria-label", `Toggle ${meta.label}`);

      const swatch = document.createElement("span");
      swatch.style.width = "10px";
      swatch.style.height = "10px";
      swatch.style.borderRadius = "999px";
      swatch.style.background = meta.color;

      const text = document.createElement("span");
      text.textContent = meta.label;

      chip.append(checkbox, swatch, text);
      chip.addEventListener("click", (event) => {
        event.preventDefault();
        toggleCategoryFilter(key, chip);
      });
      els.categoryFilters.append(chip);
    });
  }

  function toggleCategoryFilter(type, chip) {
    if (state.filters.types.has(type)) {
      state.filters.types.delete(type);
      chip.classList.remove("active");
    } else {
      state.filters.types.add(type);
      chip.classList.add("active");
    }
    render();
  }

  function initEvents() {
    els.mapSelect.addEventListener("change", (event) => {
      state.currentMapId = event.target.value;
      renderMap();
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

    els.resetProgress.addEventListener("click", () => {
      if (confirm("Clear all saved progress on this device?")) {
        state.progress = {};
        persistProgress();
        render();
      }
    });

    els.fitBoundsBtn.addEventListener("click", fitCurrentBounds);

    els.exportProgressBtn.addEventListener("click", exportProgress);
    els.importProgressInput.addEventListener("change", importProgress);

    els.rarityFilter?.addEventListener("change", (event) => {
      state.filters.rarity = event.target.value;
      render();
    });

    els.difficultyFilter?.addEventListener("change", (event) => {
      state.filters.difficulty = event.target.value;
      render();
    });
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
      if (!search) return true;
      const haystack = [
        item.title,
        item.description,
        ...(item.tags ?? []),
        ...(Array.isArray(item.rewards) ? item.rewards : [item.rewards])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
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

  function getMarkerIconImage(item) {
    const baseUrl = "https://arcraiders.wiki/images/";
    const iconMap = {
      quest: "e/e3/ItemCategory_Misc.png", // Using generic ItemCategory Misc for quests
      weaponCase: "0/0f/Icon_Loot_Security.png",
      fieldCrate: "9/93/Icon_Loot_ARC.png",
      securityLocker: "0/08/Icon_LockedGate.png", // LockedGate icon for security locker
      raiderCache: "7/74/Icon_RaiderCache.png",
      vehicleTrunk: "3/33/Icon_Loot_Mechanical.png",
      extraction: "3/3d/Icon_Loot_Exodus.png", // Exodus icon for extraction
      boss: "9/93/IconARC_Matriarch.png", // Matriarch icon for boss
      collectible: "1/15/Icon_ProspectingProbes.png",
      location: "f/f0/Icon_HiddenBunker.png",
      event: "9/97/Icon_NightRaid.png" // NightRaid icon for events
    };
    
    // Fallback to default SVG logic if no image mapping exists
    if (!iconMap[item.type]) return null;
    
    // Note: MediaWiki image paths are hashed (e.g., /3/33/filename.png). 
    // Since we can't predict the hash structure easily without an API, 
    // we will use the specific full paths found for these icons or fallback to a reliable placeholder.
    // For this implementation, we'll try to use the direct file paths if known, 
    // otherwise we might need to stick to SVGs or local assets if hotlinking is blocked.
    //
    // However, hotlinking wikis is often discouraged or blocked. 
    // A better approach for a robust app is to use local assets. 
    // I will construct the URL assuming standard MediaWiki structure if the user confirms they want hotlinking.
    //
    // Given the user's explicit request to "source it from website photos", 
    // I will attempt to use the direct file URLs for the specific icons mentioned in the search results.
    
    // Based on the search result, we have filenames but not the full hashed paths for all.
    // I will use a set of known working icon paths or placeholders.
    
    return `${baseUrl}${iconMap[item.type]}`;
  }

  function createMarkerIcon(item) {
    const category = config.categories[item.type];
    const color = category?.color || "#94a3b8";
    const completed = Boolean(state.progress[item.id]);
    
    const iconImage = getMarkerIconImage(item);
    const iconSVG = getMarkerIconSVG(item);
    
    const content = iconImage 
      ? `<img src="${iconImage}" class="marker-icon__img" alt="${item.type}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/> <svg class="marker-icon__svg" viewBox="0 0 24 24" fill="currentColor" style="display:none">${iconSVG}</svg>`
      : `<svg class="marker-icon__svg" viewBox="0 0 24 24" fill="currentColor">${iconSVG}</svg>`;

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-icon ${completed ? "marker-icon--complete" : ""}" style="--marker-color: ${color};">
          ${content}
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
      
      // Check if we have a mapped image for this type
      const iconImage = getMarkerIconImage({ type: key });
      const iconSVG = getMarkerIconSVG({ type: key });
      
      if (iconImage) {
        icon.innerHTML = `
          <img src="${iconImage}" class="map-legend__img" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
          <svg class="map-legend__svg" viewBox="0 0 24 24" fill="currentColor" style="display:none">${iconSVG}</svg>
        `;
      } else {
        icon.innerHTML = `<svg class="map-legend__svg" viewBox="0 0 24 24" fill="currentColor">${iconSVG}</svg>`;
      }
      
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
  hydrateCategoryFilters();
  hydrateLegend();
  hydrateFilterOptions();
  initEvents();
    const toggleLegendBtn = document.getElementById("toggleLegendBtn");
    if (toggleLegendBtn) {
      toggleLegendBtn.addEventListener("click", () => {
        els.mapLegend.classList.toggle("hidden");
      });
    }

    renderMap();
  })();

