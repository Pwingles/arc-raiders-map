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
    importProgressInput: document.getElementById("importProgressInput")
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
      showIncomplete: true
    },
    progress: loadProgress(),
    listCollapsed: false
  };

  const template = document.getElementById("poiTemplate");

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
            zoomControl: false
          }
        : {
            minZoom: currentMap.zoom?.min ?? 2,
            maxZoom: currentMap.zoom?.max ?? 7,
            zoomControl: false
          };

    state.mapInstance = L.map(mapContainer, mapOptions);
    L.control.zoom({ position: "bottomright" }).addTo(state.mapInstance);

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

  function createMarkerIcon(item) {
    const baseClass = `marker-pill marker-pill--${item.type}`;
    return L.divIcon({
      className: "",
      html: `<span class="${baseClass}">${config.categories[item.type]?.label ?? item.type}</span>`,
      iconSize: [120, 32],
      iconAnchor: [60, 16]
    });
  }

  function renderPopupContent(item) {
    const completed = Boolean(state.progress[item.id]);
    const objectiveList = (item.objectives ?? [])
      .map((step) => `<li>${step}</li>`)
      .join("");

    return `
      <div class="popup">
        <p class="eyebrow">${config.categories[item.type]?.label ?? item.type}</p>
        <h3>${item.title}</h3>
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
        <button class="primary-button popup-toggle" data-item="${item.id}">
          ${completed ? "Mark as in-progress" : "Mark as complete"}
        </button>
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

  hydrateMapSelect();
  hydrateCategoryFilters();
  initEvents();
  renderMap();
})();

