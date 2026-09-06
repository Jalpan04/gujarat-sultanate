// ==========================================================================
// GUJARAT SULTANATE TIMELINE CONTROLLER
// STREAMLINED, INTUITIVE NAVIGATION, COLOR-CODED ERAS & CATEGORIES
// ZERO ANIMATIONS, ZERO EMOJIS, ZERO GRADIENTS
// ==========================================================================

(function () {
  'use strict';

  const state = {
    events: window.GUJARAT_SULTANATE_DATA || [],
    phases: window.GUJARAT_PHASES || [],
    filteredEvents: [],
    activePhase: 'all',
    activeCategory: 'all',
    searchQuery: '',
    currentView: 'timeline', // 'timeline' | 'ledger' | 'grid'
    sortOrder: 'asc',
    activeModalEventId: null,
    theme: 'light'
  };

  const elements = {
    searchInput: document.getElementById('search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    printBtn: document.getElementById('print-btn'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    viewTimelineBtn: document.getElementById('view-timeline-btn'),
    viewLedgerBtn: document.getElementById('view-ledger-btn'),
    viewGridBtn: document.getElementById('view-grid-btn'),
    phaseTabs: document.querySelectorAll('.phase-tab'),
    categoryPillsContainer: document.getElementById('category-pills'),
    activeFilterSummary: document.getElementById('active-filter-summary'),
    mainDisplayContainer: document.getElementById('main-display-container'),
    eventModal: document.getElementById('event-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalPrevBtn: document.getElementById('modal-prev-btn'),
    modalNextBtn: document.getElementById('modal-next-btn'),
    modalCopyBtn: document.getElementById('modal-copy-btn'),
    modalContentBody: document.getElementById('modal-content-body'),
    toast: document.getElementById('toast-msg')
  };

  function init() {
    loadPreferences();
    setupEventListeners();
    buildCategoryPills();
    applyFilters();
  }

  function loadPreferences() {
    try {
      const savedTheme = localStorage.getItem('gs_theme');
      if (savedTheme) {
        state.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButtonLabel();
      }

      const savedView = localStorage.getItem('gs_view');
      if (savedView && ['timeline', 'ledger', 'grid'].includes(savedView)) {
        state.currentView = savedView;
      }
      updateViewButtons();
    } catch (err) {
      console.warn('Could not access localStorage:', err);
    }
  }

  function updateThemeButtonLabel() {
    if (!elements.themeToggleBtn) return;
    elements.themeToggleBtn.textContent = state.theme === 'dark' ? 'Light Mode' : 'Dark Mode';
  }

  function updateViewButtons() {
    [elements.viewTimelineBtn, elements.viewLedgerBtn, elements.viewGridBtn].forEach(function (btn) {
      if (btn) btn.classList.remove('active');
    });
    if (state.currentView === 'timeline' && elements.viewTimelineBtn) {
      elements.viewTimelineBtn.classList.add('active');
    } else if (state.currentView === 'ledger' && elements.viewLedgerBtn) {
      elements.viewLedgerBtn.classList.add('active');
    } else if (state.currentView === 'grid' && elements.viewGridBtn) {
      elements.viewGridBtn.classList.add('active');
    }
  }

  // Build clean category pills without count clutter
  function buildCategoryPills() {
    const container = elements.categoryPillsContainer;
    if (!container) return;
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'cat-pill' + (state.activeCategory === 'all' ? ' active' : '');
    allBtn.textContent = 'All Categories';
    allBtn.addEventListener('click', function () {
      state.activeCategory = 'all';
      updateCategoryPillsActive();
      applyFilters();
    });
    container.appendChild(allBtn);

    const categories = Array.from(new Set(state.events.map(function (e) { return e.primaryCategory; }))).sort();

    categories.forEach(function (cat) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat-pill' + (state.activeCategory === cat ? ' active' : '');
      btn.dataset.category = cat;
      btn.textContent = cat;
      btn.addEventListener('click', function () {
        state.activeCategory = (state.activeCategory === cat) ? 'all' : cat;
        updateCategoryPillsActive();
        applyFilters();
      });
      container.appendChild(btn);
    });
  }

  function updateCategoryPillsActive() {
    if (!elements.categoryPillsContainer) return;
    const pills = elements.categoryPillsContainer.querySelectorAll('.cat-pill');
    pills.forEach(function (p) {
      if (p.dataset.category) {
        if (p.dataset.category === state.activeCategory) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      } else {
        if (state.activeCategory === 'all') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      }
    });
  }

  function updatePhaseTabsActive() {
    elements.phaseTabs.forEach(function (tab) {
      const p = tab.dataset.phase;
      if (String(p) === String(state.activePhase)) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  function setupEventListeners() {
    // Phase tabs
    elements.phaseTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        state.activePhase = this.dataset.phase;
        updatePhaseTabsActive();
        applyFilters();
      });
    });

    // Search input
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', function (e) {
        state.searchQuery = e.target.value.trim().toLowerCase();
        applyFilters();
      });
    }

    // Clear search
    if (elements.searchClearBtn) {
      elements.searchClearBtn.addEventListener('click', function () {
        if (elements.searchInput) elements.searchInput.value = '';
        state.searchQuery = '';
        applyFilters();
      });
    }

    // View toggles
    if (elements.viewTimelineBtn) {
      elements.viewTimelineBtn.addEventListener('click', function () { setView('timeline'); });
    }
    if (elements.viewLedgerBtn) {
      elements.viewLedgerBtn.addEventListener('click', function () { setView('ledger'); });
    }
    if (elements.viewGridBtn) {
      elements.viewGridBtn.addEventListener('click', function () { setView('grid'); });
    }

    // Reset button
    if (elements.resetFiltersBtn) {
      elements.resetFiltersBtn.addEventListener('click', resetAllFilters);
    }

    // Theme toggle
    if (elements.themeToggleBtn) {
      elements.themeToggleBtn.addEventListener('click', function () {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', state.theme);
        try {
          localStorage.setItem('gs_theme', state.theme);
        } catch (err) {}
        updateThemeButtonLabel();
      });
    }

    // Print
    if (elements.printBtn) {
      elements.printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    // Event Delegation on Main Display Container for reliability
    if (elements.mainDisplayContainer) {
      elements.mainDisplayContainer.addEventListener('click', function (e) {
        const detailBtn = e.target.closest('.view-detail-btn');
        if (detailBtn) {
          const id = detailBtn.dataset.id;
          if (id) openModal(id);
          return;
        }

        const figChip = e.target.closest('.figure-chip');
        if (figChip) {
          const fig = figChip.dataset.figure;
          if (fig && elements.searchInput) {
            elements.searchInput.value = fig;
            state.searchQuery = fig.toLowerCase();
            applyFilters();
          }
        }
      });
    }

    // Modal controls
    if (elements.modalCloseBtn) {
      elements.modalCloseBtn.addEventListener('click', closeModal);
    }

    if (elements.eventModal) {
      elements.eventModal.addEventListener('click', function (e) {
        if (e.target === elements.eventModal) closeModal();
      });
    }

    if (elements.modalPrevBtn) {
      elements.modalPrevBtn.addEventListener('click', function () { navigateModal(-1); });
    }

    if (elements.modalNextBtn) {
      elements.modalNextBtn.addEventListener('click', function () { navigateModal(1); });
    }

    if (elements.modalCopyBtn) {
      elements.modalCopyBtn.addEventListener('click', copyEventCitation);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (state.activeModalEventId) {
          closeModal();
        } else if (state.searchQuery) {
          elements.searchInput.value = '';
          state.searchQuery = '';
          applyFilters();
        }
      } else if (e.key === '/' && document.activeElement !== elements.searchInput) {
        e.preventDefault();
        elements.searchInput.focus();
      } else if (state.activeModalEventId) {
        if (e.key === 'ArrowLeft' || e.key === 'j') navigateModal(-1);
        if (e.key === 'ArrowRight' || e.key === 'k') navigateModal(1);
      }
    });
  }

  function setView(view) {
    state.currentView = view;
    try {
      localStorage.setItem('gs_view', view);
    } catch (err) {}
    updateViewButtons();
    renderActiveView();
  }

  function resetAllFilters() {
    state.activePhase = 'all';
    state.activeCategory = 'all';
    state.searchQuery = '';
    if (elements.searchInput) elements.searchInput.value = '';
    updatePhaseTabsActive();
    updateCategoryPillsActive();
    applyFilters();
  }

  function applyFilters() {
    let result = state.events.slice();

    // 1. Phase Filter
    if (state.activePhase !== 'all') {
      result = result.filter(function (e) { return e.phaseId === Number(state.activePhase); });
    }

    // 2. Category Filter
    if (state.activeCategory !== 'all') {
      result = result.filter(function (e) { return e.primaryCategory === state.activeCategory; });
    }

    // 3. Search query
    if (state.searchQuery) {
      const q = state.searchQuery;
      result = result.filter(function (e) {
        return (
          e.year.toLowerCase().includes(q) ||
          (e.hijri && e.hijri.toLowerCase().includes(q)) ||
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q) ||
          (e.figures && e.figures.some(function (f) { return f.toLowerCase().includes(q); }))
        );
      });
    }

    // Sort by chronological year
    result.sort(function (a, b) {
      return state.sortOrder === 'asc' ? a.numericYear - b.numericYear : b.numericYear - a.numericYear;
    });

    state.filteredEvents = result;
    updateStatusUI();
    renderActiveView();
  }

  function updateStatusUI() {
    if (!elements.activeFilterSummary) return;

    const parts = [];
    if (state.activePhase !== 'all') {
      const ph = state.phases.find(function (p) { return p.id === Number(state.activePhase); });
      parts.push(ph ? ph.title.split(':')[0] : `Phase ${state.activePhase}`);
    }
    if (state.activeCategory !== 'all') parts.push(`Category: ${state.activeCategory}`);
    if (state.searchQuery) parts.push(`"${state.searchQuery}"`);

    if (parts.length > 0) {
      elements.activeFilterSummary.textContent = `Showing: ${parts.join(' • ')} (${state.filteredEvents.length} matches)`;
    } else {
      elements.activeFilterSummary.textContent = 'Showing All Events';
    }
  }

  function renderActiveView() {
    if (!elements.mainDisplayContainer) return;

    if (state.filteredEvents.length === 0) {
      elements.mainDisplayContainer.innerHTML = `
        <div class="empty-state">
          <h2 class="empty-state-title">No events found</h2>
          <p class="empty-state-desc">Try clearing the search query or selecting a different era tab.</p>
          <button type="button" class="btn" id="empty-reset-btn">Reset Filters</button>
        </div>
      `;
      const btn = document.getElementById('empty-reset-btn');
      if (btn) btn.addEventListener('click', resetAllFilters);
      return;
    }

    if (state.currentView === 'timeline') {
      renderTimelineView();
    } else if (state.currentView === 'ledger') {
      renderLedgerView();
    } else if (state.currentView === 'grid') {
      renderGridView();
    }
  }

  // ==========================================================================
  // VIEW 1: COLOR-ACCENTED CHRONOLOGICAL TIMELINE
  // ==========================================================================
  function renderTimelineView() {
    const container = elements.mainDisplayContainer;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'timeline-view';

    const eventsByPhase = {};
    state.filteredEvents.forEach(function (evt) {
      if (!eventsByPhase[evt.phaseId]) eventsByPhase[evt.phaseId] = [];
      eventsByPhase[evt.phaseId].push(evt);
    });

    state.phases.forEach(function (phase) {
      const phaseEvents = eventsByPhase[phase.id];
      if (!phaseEvents || phaseEvents.length === 0) return;

      const phaseSection = document.createElement('section');

      // Phase Header Banner with Phase Specific Color Tone
      const banner = document.createElement('div');
      banner.className = `phase-banner phase-banner-${phase.id}`;
      banner.innerHTML = `
        <div class="phase-banner-top">
          <h2 class="phase-title">${escapeHtml(phase.title)}</h2>
          <span class="phase-span">${escapeHtml(phase.span)}</span>
        </div>
        <p class="phase-desc">${escapeHtml(phase.summary)}</p>
      `;
      phaseSection.appendChild(banner);

      // Timeline List
      const list = document.createElement('div');
      list.className = 'timeline-list';

      phaseEvents.forEach(function (evt) {
        const item = document.createElement('article');
        const catClass = `cat-${evt.primaryCategory.toLowerCase()}`;
        item.className = `timeline-card ${catClass}` + (evt.isKeyMilestone ? ' milestone' : '');
        const badgeClass = getCategoryBadgeClass(evt.primaryCategory);

        item.innerHTML = `
          <div class="timeline-dot"></div>
          <div class="card-top">
            <div class="card-year-group">
              <span class="card-year">${escapeHtml(evt.year)}</span>
              ${evt.hijri ? `<span class="card-hijri">(${escapeHtml(evt.hijri)})</span>` : ''}
            </div>
            <div class="card-badges">
              <span class="badge ${badgeClass}">${escapeHtml(evt.category)}</span>
              ${evt.isKeyMilestone ? '<span class="badge badge-milestone">Key Milestone</span>' : ''}
            </div>
          </div>
          <h3 class="card-title">${escapeHtml(evt.title)}</h3>
          ${renderFigures(evt.figures)}
          <p class="card-narrative">${escapeHtml(evt.details)}</p>
          <div class="card-bottom">
            <button type="button" class="btn btn-sm view-detail-btn" data-id="${evt.id}">
              Details & Citation
            </button>
          </div>
        `;
        list.appendChild(item);
      });

      phaseSection.appendChild(list);
      wrapper.appendChild(phaseSection);
    });

    container.appendChild(wrapper);
  }

  // ==========================================================================
  // VIEW 2: TABLE
  // ==========================================================================
  function renderLedgerView() {
    const container = elements.mainDisplayContainer;
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'table-view';

    const sortText = state.sortOrder === 'asc' ? 'Year (Ascending)' : 'Year (Descending)';

    wrapper.innerHTML = `
      <table class="events-table">
        <thead>
          <tr>
            <th class="sortable" id="table-sort-year" title="Sort by Year">${sortText}</th>
            <th>Category</th>
            <th>Event & Figures</th>
            <th>Historical Significance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="table-tbody"></tbody>
      </table>
    `;

    const tbody = wrapper.querySelector('#table-tbody');

    state.filteredEvents.forEach(function (evt) {
      const tr = document.createElement('tr');
      const badgeClass = getCategoryBadgeClass(evt.primaryCategory);

      tr.innerHTML = `
        <td style="font-family:var(--font-mono);font-weight:700;white-space:nowrap;">
          ${escapeHtml(evt.year)}
          ${evt.hijri ? `<div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(evt.hijri)}</div>` : ''}
        </td>
        <td>
          <span class="badge ${badgeClass}">${escapeHtml(evt.category)}</span>
        </td>
        <td>
          <div style="font-weight:700;font-size:0.95rem;margin-bottom:4px;">${escapeHtml(evt.title)}</div>
          ${renderFigures(evt.figures)}
        </td>
        <td style="color:var(--text-secondary);line-height:1.5;">
          ${escapeHtml(evt.details)}
        </td>
        <td style="white-space:nowrap;">
          <button type="button" class="btn btn-sm view-detail-btn" data-id="${evt.id}">Details</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    container.appendChild(wrapper);

    const sortBtn = wrapper.querySelector('#table-sort-year');
    if (sortBtn) {
      sortBtn.addEventListener('click', function () {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
        applyFilters();
      });
    }
  }

  // ==========================================================================
  // VIEW 3: CARDS GRID VIEW
  // ==========================================================================
  function renderGridView() {
    const container = elements.mainDisplayContainer;
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'cards-view';

    state.filteredEvents.forEach(function (evt) {
      const card = document.createElement('article');
      const catClass = `cat-${evt.primaryCategory.toLowerCase()}`;
      card.className = `grid-item ${catClass}` + (evt.isKeyMilestone ? ' milestone' : '');
      const badgeClass = getCategoryBadgeClass(evt.primaryCategory);

      card.innerHTML = `
        <div>
          <div class="card-top">
            <span class="card-year">${escapeHtml(evt.year)}</span>
            <span class="badge ${badgeClass}">${escapeHtml(evt.category)}</span>
          </div>
          <h3 class="card-title">${escapeHtml(evt.title)}</h3>
          ${renderFigures(evt.figures)}
          <p class="card-narrative">${escapeHtml(evt.details)}</p>
        </div>
        <div class="card-bottom">
          <button type="button" class="btn btn-sm view-detail-btn" data-id="${evt.id}">Details</button>
        </div>
      `;
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function renderFigures(figures) {
    if (!figures || figures.length === 0) return '';
    const items = figures.map(function (f) {
      return `<span class="figure-chip" data-figure="${escapeHtml(f)}">${escapeHtml(f)}</span>`;
    }).join('');
    return `<div class="card-figures">${items}</div>`;
  }

  function getCategoryBadgeClass(primaryCat) {
    switch (primaryCat) {
      case 'Military': return 'badge-military';
      case 'Political': return 'badge-political';
      case 'Dynastic': return 'badge-dynastic';
      case 'Architectural': return 'badge-architectural';
      case 'Spiritual': return 'badge-spiritual';
      case 'Maritime': return 'badge-maritime';
      case 'Geopolitical': return 'badge-geopolitical';
      case 'Treaty': return 'badge-treaty';
      case 'Assassination': return 'badge-assassination';
      case 'Cultural': return 'badge-cultural';
      default: return '';
    }
  }

  // ==========================================================================
  // MODAL / FULL EVENT DOSSIER
  // ==========================================================================
  function openModal(id) {
    const evt = state.events.find(function (e) { return e.id === id; });
    if (!evt) return;

    state.activeModalEventId = id;
    renderModalContent(evt);

    if (elements.eventModal) {
      elements.eventModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    state.activeModalEventId = null;
    if (elements.eventModal) {
      elements.eventModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function navigateModal(direction) {
    if (!state.activeModalEventId) return;
    const list = state.filteredEvents.length > 0 ? state.filteredEvents : state.events;
    const idx = list.findIndex(function (e) { return e.id === state.activeModalEventId; });
    if (idx === -1) return;

    let nextIdx = idx + direction;
    if (nextIdx < 0) nextIdx = list.length - 1;
    if (nextIdx >= list.length) nextIdx = 0;

    const nextEvt = list[nextIdx];
    state.activeModalEventId = nextEvt.id;
    renderModalContent(nextEvt);
  }

  function renderModalContent(evt) {
    if (!elements.modalContentBody) return;

    const phase = state.phases.find(function (p) { return p.id === evt.phaseId; });
    const badgeClass = getCategoryBadgeClass(evt.primaryCategory);

    elements.modalContentBody.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <div style="display:flex;gap:6px;align-items:center;">
          <span class="badge ${badgeClass}">${escapeHtml(evt.category)}</span>
          ${evt.isKeyMilestone ? '<span class="badge badge-milestone">Key Milestone</span>' : ''}
        </div>
        <div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:700;">
          ${escapeHtml(evt.year)}
          ${evt.hijri ? `<span style="font-size:0.85rem;color:var(--text-muted);font-weight:normal;">(${escapeHtml(evt.hijri)})</span>` : ''}
        </div>
      </div>

      <h2 class="modal-title" id="modal-event-title">${escapeHtml(evt.title)}</h2>

      <div class="modal-narrative">
        <p>${escapeHtml(evt.details)}</p>
      </div>

      <div class="modal-section">
        <h4 class="modal-section-title">Key Figures & Historical Actors</h4>
        ${renderFigures(evt.figures)}
      </div>

      <div class="modal-section">
        <h4 class="modal-section-title">Dynastic Era Context</h4>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.45;">
          <strong>${phase ? escapeHtml(phase.title) : ''} (${phase ? escapeHtml(phase.span) : ''})</strong><br>
          ${phase ? escapeHtml(phase.summary) : ''}
        </p>
      </div>
    `;

    // Bind figure tags in modal
    elements.modalContentBody.querySelectorAll('.figure-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const fig = this.dataset.figure;
        closeModal();
        if (elements.searchInput) {
          elements.searchInput.value = fig;
          state.searchQuery = fig.toLowerCase();
          applyFilters();
        }
      });
    });
  }

  function copyEventCitation() {
    if (!state.activeModalEventId) return;
    const evt = state.events.find(function (e) { return e.id === state.activeModalEventId; });
    if (!evt) return;

    const citationText = `Gujarat Sultanate Record: ${evt.year} - ${evt.title}. Category: ${evt.category}. Details: ${evt.details} (Source: Mirat-i-Sikandari)`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(citationText).then(function () {
        showToast('Citation copied to clipboard.');
      }).catch(function () {
        fallbackCopy(citationText);
      });
    } else {
      fallbackCopy(citationText);
    }
  }

  function fallbackCopy(text) {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand('copy');
      showToast('Citation copied to clipboard.');
    } catch (e) {
      showToast('Could not copy automatically.');
    }
    document.body.removeChild(temp);
  }

  let toastTimer = null;
  function showToast(msg) {
    if (!elements.toast) return;
    elements.toast.textContent = msg;
    elements.toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      elements.toast.classList.remove('show');
    }, 2200);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
