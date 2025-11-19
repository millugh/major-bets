const fallbackParlays = {
  meta: {
    lastUpdated: '2024-08-10T14:00:00Z',
  },
  stats: {
    record30: '18-12',
    closingValue: '+3120',
    avgLegs: 23,
    hitRate: '47%',
  },
  spotlight: {
    title: 'Neon Tower 25-leg SGP',
    sport: 'NFL Mega Mix',
    tagline: 'Primetime TDs, alt lines, and QB legs',
    risk: '$50',
    toWin: '$18,750',
    confidence: '3 🔥',
    notes: [
      'Weather clear across all stadiums; lean pass-heavy.',
      'Two ladder spots built with live hedge opportunities.',
      'Late steam on WR yards already locking in CLV.',
    ],
    marketPulse: {
      movement: 'Lions -2.5 → -3.5',
      tempo: 'All overs tied to top-15 pace teams',
      weather: 'No wind games; turf advantage',
    },
    legs: [
      { selection: 'Chiefs -2.5 alt spread', detail: 'Mahomes primetime', odds: '-134' },
      { selection: 'Josh Allen 25+ rushing yards', detail: 'QB legs when lights on', odds: '-120' },
      { selection: 'Lions / 49ers over 38.5 alt', detail: 'Pace mismatch', odds: '-110' },
      { selection: 'Kelce 60+ receiving yards', detail: 'Slot leverage', odds: '-104' },
      { selection: 'Amon-Ra TD', detail: 'Red-zone target share', odds: '+145' },
    ],
  },
  daily: [
    {
      title: 'Blitz Special',
      sport: 'NFL',
      legs: 12,
      odds: '+3250',
      risk: '$25',
      win: '$831',
      confidence: '4 🔥',
      window: '1:00 PM ET',
      note: 'QB rushing ladders + WR alt yardage',
    },
    {
      title: 'Hardwood Halo',
      sport: 'NBA',
      legs: 9,
      odds: '+2100',
      risk: '$10',
      win: '$210',
      confidence: '3 🔥',
      window: '7:30 PM ET',
      note: 'Assist ladders + pace ups',
    },
    {
      title: 'Diamond Dust',
      sport: 'MLB',
      legs: 7,
      odds: '+1800',
      risk: '$20',
      win: '$360',
      confidence: '2 🔥',
      window: '4:05 PM ET',
      note: 'Pitcher Ks + total bases',
    },
  ],
  weekly: [
    {
      title: 'Heat Check Stack',
      sport: 'Mixed',
      legs: 25,
      odds: '+52000',
      risk: '$15',
      win: '$7,800',
      confidence: '3 🔥',
      window: 'All week',
      note: 'Cross-sport anchor',
    },
    {
      title: 'Underdog Uprising',
      sport: 'NFL',
      legs: 6,
      odds: '+4800',
      risk: '$20',
      win: '$960',
      confidence: '2 🔥',
      window: 'Sun slate',
      note: 'Alt spreads + sprinkle MLs',
    },
  ],
  history: [
    { title: 'Tower 7/12', result: 'Hit', roi: '+$6,200', highlight: 'MLB/NFL hybrid', stamp: 'Jul 12' },
    { title: 'Late-night Ladder', result: '1 leg short', roi: '-$25', highlight: 'West coast NBA', stamp: 'Jul 9' },
    { title: 'Metro Mash', result: 'Hedge profit', roi: '+$410', highlight: 'Live hedged 4th quarter', stamp: 'Jul 2' },
  ],
  teasers: [
    '25 legs. Champagne energy. Tap in before kickoff.',
    'FanDuel pulse locked. Daily card + weekly stack live now.',
    'Major is cooking: TD ladders, pace plays, and CLV already bagged.',
  ],
};

const fallbackOdds = {
  football: [
    { matchup: 'Chiefs @ Bills', market: 'Spread', line: 'KC -2.5', odds: '-110', startTime: '8:20 PM ET' },
    { matchup: 'Cowboys @ Eagles', market: 'Total', line: 'O 49.5', odds: '-108', startTime: '4:25 PM ET' },
  ],
  basketball: [
    { matchup: 'Lakers @ Warriors', market: 'Player Pts', line: 'LeBron 28.5', odds: '-102', startTime: '10:00 PM ET' },
    { matchup: 'Celtics @ Heat', market: 'Spread', line: 'BOS -4.5', odds: '-112', startTime: '7:30 PM ET' },
  ],
  baseball: [
    { matchup: 'Yankees @ Astros', market: 'Moneyline', line: 'NYY -118', odds: '-118', startTime: '7:10 PM ET' },
  ],
};

let teaserCache = [];
let oddsInterval;
let customSlips = [];
let currentParlays = fallbackParlays;
let currentOdds = fallbackOdds;
let sourceParlays = fallbackParlays;

const CUSTOM_SLIPS_KEY = 'majorsBetsCustomSlips';
const PENDING_LEGS_KEY = 'majorsBetsPendingLegs';
const MANUAL_PARLAYS_KEY = 'majorsBetsManualParlays';

const isBrowser = typeof window !== 'undefined';

const loadStored = (key, fallback = []) => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Failed to load ${key}:`, error.message);
    return fallback;
  }
};

const saveStored = (key, value) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write ${key}:`, error.message);
  }
};

const removeStored = (key) => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key}:`, error.message);
  }
};

const oddsSource = 'data/odds.json';

const fetchJson = async (url) => {
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn(`Falling back for ${url}:`, error.message);
    return null;
  }
};

const hydrateParlays = (parlays) => {
  if (!parlays) return;
  currentParlays = parlays;
  renderSpotlight(parlays.spotlight, parlays.meta);
  renderStats(parlays);
  renderBoard(parlays);
  renderTeasers(parlays);
  renderTicker(parlays, currentOdds);
};

const hydrateOdds = (odds) => {
  currentOdds = odds;
  renderOdds(odds);
  renderTicker(currentParlays, odds);
};

const init = async () => {
  customSlips = loadStored(CUSTOM_SLIPS_KEY, []);
  const manualOverride = loadStored(MANUAL_PARLAYS_KEY, null);
  const [parlaysData, oddsData] = await Promise.all([
    fetchJson('data/parlays.json'),
    fetchJson(oddsSource),
  ]);

  sourceParlays = parlaysData || fallbackParlays;
  const parlays = manualOverride || sourceParlays;
  const odds = oddsData || fallbackOdds;

  hydrateParlays(parlays);
  hydrateOdds(odds);
  wireBoardControls();
  wireButtons();
  wireUploads();
  wireManualEntry();
  setFooterYear();

  if (oddsInterval) clearInterval(oddsInterval);
  oddsInterval = setInterval(async () => {
    const nextOdds = (await fetchJson(oddsSource)) || currentOdds;
    hydrateOdds(nextOdds);
  }, 1000 * 60 * 5);
};

const renderSpotlight = (spotlight, meta = {}) => {
  if (!spotlight) return;
  document.getElementById('spotlight-title').textContent = spotlight.title;
  document.getElementById('spotlight-sport').textContent = spotlight.sport;
  document.getElementById('spotlight-tagline').textContent = spotlight.tagline;
  document.getElementById('spotlight-risk').textContent = spotlight.risk;
  document.getElementById('spotlight-win').textContent = spotlight.toWin;
  document.getElementById('spotlight-confidence').textContent = spotlight.confidence;
  document.getElementById('spotlight-updated').textContent = meta.lastUpdated
    ? new Date(meta.lastUpdated).toLocaleString()
    : new Date().toLocaleString();

  const legList = document.getElementById('spotlight-legs');
  legList.innerHTML = '';
  spotlight.legs?.forEach((leg, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${index + 1}. ${leg.selection}</strong>
        <span>${leg.detail}</span>
      </div>
      <div class="odds">${leg.odds}</div>
    `;
    legList.appendChild(li);
  });

  const notes = document.getElementById('spotlight-notes');
  notes.innerHTML = '';
  spotlight.notes?.forEach((note) => {
    const li = document.createElement('li');
    li.textContent = note;
    notes.appendChild(li);
  });

  const pulse = spotlight.marketPulse || {};
  const metaBox = document.getElementById('market-meta');
  metaBox.innerHTML = `
    <p>Movement: <strong>${pulse.movement || 'TBD'}</strong></p>
    <p>Tempo: <strong>${pulse.tempo || 'TBD'}</strong></p>
    <p>Weather: <strong>${pulse.weather || 'TBD'}</strong></p>
  `;
};

const renderStats = (parlays) => {
  const statStack = document.getElementById('stat-stack');
  statStack.innerHTML = '';
  const stats = [
    { label: 'Last 30', value: parlays.stats?.record30 || '—' },
    { label: 'Closing value', value: parlays.stats?.closingValue || '—' },
    { label: 'Avg legs', value: parlays.stats?.avgLegs || '—' },
    { label: 'Hit rate', value: parlays.stats?.hitRate || '—' },
  ];
  stats.forEach((stat) => {
    const div = document.createElement('div');
    div.className = 'stat';
    div.innerHTML = `<strong>${stat.value}</strong><p>${stat.label}</p>`;
    statStack.appendChild(div);
  });
};

const createCard = (entry) => {
  const article = document.createElement('article');
  article.className = 'card';
  article.innerHTML = `
    <header>
      <div>
        <h3>${entry.title}</h3>
        <p class="props">${entry.note || ''}</p>
      </div>
      <span class="badge">${entry.sport}</span>
    </header>
    <p class="roi">${entry.odds}</p>
    <p>Legs: ${entry.legs}</p>
    <footer>
      <span>Risk ${entry.risk}</span>
      <span>${entry.win} to win</span>
    </footer>
    <small>${entry.window || ''} · ${entry.confidence || ''}</small>
  `;
  return article;
};

const renderBoard = (parlays) => {
  const dailyWrap = document.getElementById('daily-parlays');
  const weeklyWrap = document.getElementById('weekly-parlays');
  const historyWrap = document.getElementById('history-list');

  dailyWrap.innerHTML = '';
  weeklyWrap.innerHTML = '';
  historyWrap.innerHTML = '';

  parlays.daily?.forEach((entry) => dailyWrap.appendChild(createCard(entry)));
  parlays.weekly?.forEach((entry) => weeklyWrap.appendChild(createCard(entry)));

  parlays.history?.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <header>
        <div>
          <h3>${item.title}</h3>
          <p class="props">${item.highlight}</p>
        </div>
        <span class="badge">${item.result}</span>
      </header>
      <p class="roi">${item.roi}</p>
      <footer>
        <span>${item.stamp}</span>
        <span>${item.result === 'Hit' ? '🥂' : '🔁'}</span>
      </footer>
    `;
    historyWrap.appendChild(card);
  });
};

const renderOdds = (odds) => {
  const grid = document.getElementById('odds-grid');
  grid.innerHTML = '';
  Object.entries(odds || {}).forEach(([sport, markets]) => {
    markets.forEach((market) => {
      const card = document.createElement('article');
      card.className = 'odds-card';
      card.innerHTML = `
        <p class="eyebrow">${sport}</p>
        <h4>${market.matchup}</h4>
        <p class="market">${market.market}</p>
        <p class="line">${market.line}</p>
        <p>${market.odds} · ${market.startTime}</p>
      `;
      grid.appendChild(card);
    });
  });
};

const renderTeasers = (parlays) => {
  const teasersWrap = document.getElementById('teasers');
  const base = parlays.teasers?.length ? parlays.teasers : buildTeasers(parlays);
  teaserCache = base;
  teasersWrap.innerHTML = '';
  base.forEach((teaser) => {
    const div = document.createElement('div');
    div.className = 'teaser';
    div.textContent = teaser;
    teasersWrap.appendChild(div);
  });
};

const buildTeasers = (parlays) => {
  const items = [];
  if (parlays.spotlight) {
    items.push(
      `${parlays.spotlight.title}: ${parlays.spotlight.legs?.length || 0} legs at ${parlays.spotlight.toWin}. Tap in.`
    );
  }
  parlays.daily?.slice(0, 2).forEach((entry) => {
    items.push(`${entry.title} (${entry.legs} legs ${entry.odds}) ${entry.note || ''}`);
  });
  return items;
};

const renderTicker = (parlays, odds) => {
  const ticker = document.getElementById('ticker-track');
  const phrases = [];
  parlays.daily?.forEach((card) => {
    phrases.push(`${card.title} · ${card.legs} legs · ${card.odds}`);
  });
  Object.entries(odds || {}).forEach(([sport, markets]) => {
    markets.forEach((market) => {
      phrases.push(`${sport.toUpperCase()} ${market.matchup} ${market.line} @ ${market.odds}`);
    });
  });
  const loop = [...phrases, ...phrases];
  ticker.innerHTML = loop.map((text) => `<span>${text}</span>`).join('');
};

const wireBoardControls = () => {
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      document.querySelectorAll('.card-grid').forEach((grid) => grid.classList.add('hidden'));
      const target = document.getElementById(chip.dataset.target);
      target?.classList.remove('hidden');
    });
  });
};

const wireButtons = () => {
  document.getElementById('notify-btn')?.addEventListener('click', () => {
    alert('Link your email or SMS service to start alerts.');
  });

  document.getElementById('export-copy')?.addEventListener('click', async () => {
    const teaser = teaserCache[0] || 'Major\'s Bets is live.';
    try {
      await navigator.clipboard.writeText(teaser);
      alert('Teaser copied. Paste into X!');
    } catch (error) {
      alert(teaser);
    }
  });
};

const wireManualEntry = () => {
  const textarea = document.getElementById('manual-parlay-input');
  if (!textarea) return;

  const applyBtn = document.getElementById('manual-parlay-apply');
  const loadBtn = document.getElementById('manual-parlay-load');
  const clearBtn = document.getElementById('manual-parlay-clear');

  const storedManual = loadStored(MANUAL_PARLAYS_KEY, null);
  if (storedManual) {
    textarea.value = JSON.stringify(storedManual, null, 2);
  }

  loadBtn?.addEventListener('click', () => {
    textarea.value = JSON.stringify(currentParlays, null, 2);
  });

  applyBtn?.addEventListener('click', () => {
    const raw = textarea.value.trim();
    if (!raw) {
      alert('Add JSON before applying.');
      return;
    }
    try {
      const nextParlays = JSON.parse(raw);
      hydrateParlays(nextParlays);
      saveStored(MANUAL_PARLAYS_KEY, nextParlays);
      alert('Manual parlays applied locally.');
    } catch (error) {
      alert('Invalid JSON. Fix the formatting and try again.');
    }
  });

  clearBtn?.addEventListener('click', () => {
    removeStored(MANUAL_PARLAYS_KEY);
    textarea.value = '';
    hydrateParlays(sourceParlays);
    alert('Manual parlays cleared. Live data restored.');
  });
};

const wireUploads = () => {
  const form = document.getElementById('slip-form');
  const preview = document.getElementById('slip-preview');
  if (!form || !preview) return;

  const titleInput = document.getElementById('slip-title');
  const oddsInput = document.getElementById('slip-odds');
  const riskInput = document.getElementById('slip-risk');
  const payoutInput = document.getElementById('slip-payout');
  const notesInput = document.getElementById('slip-notes');
  const photoInput = document.getElementById('slip-photo');
  const legSelectionInput = document.getElementById('leg-selection');
  const legDetailInput = document.getElementById('leg-detail');
  const legOddsInput = document.getElementById('leg-odds');
  const legList = document.getElementById('leg-list');
  const addLegBtn = document.getElementById('add-leg-btn');

  let currentPhoto = null;
  const pendingLegs = loadStored(PENDING_LEGS_KEY, []);

  const renderLegList = () => {
    if (!legList) return;
    legList.innerHTML = '';
    if (!pendingLegs.length) {
      const li = document.createElement('li');
      li.className = 'empty-state';
      li.textContent = 'No legs added yet.';
      legList.appendChild(li);
      return;
    }

    pendingLegs.forEach((leg, index) => {
      const li = document.createElement('li');
      const textWrap = document.createElement('div');
      textWrap.innerHTML = `<strong>${leg.selection}</strong>${leg.detail ? `<span>${leg.detail}</span>` : ''}`;
      li.appendChild(textWrap);

      const odds = document.createElement('div');
      odds.className = 'leg-odds';
      odds.textContent = leg.odds || '—';
      li.appendChild(odds);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'leg-remove';
      removeBtn.dataset.index = index;
      removeBtn.innerHTML = '&times;';
      li.appendChild(removeBtn);

      legList.appendChild(li);
    });
  };

  const renderSlips = () => {
    preview.innerHTML = '';
    if (!customSlips.length) {
      preview.innerHTML = '<p class="empty-state">Drop a photo and odds to generate a fresh card preview.</p>';
      return;
    }

    customSlips.forEach((slip) => {
      const card = document.createElement('article');
      card.className = 'custom-slip-card';

      if (slip.image) {
        const img = document.createElement('img');
        img.src = slip.image;
        img.alt = `${slip.title} upload`;
        card.appendChild(img);
      } else {
        const fallback = document.createElement('div');
        fallback.className = 'custom-slip-placeholder';
        fallback.textContent = 'Preview shows here';
        card.appendChild(fallback);
      }

      const title = document.createElement('strong');
      title.textContent = slip.title;
      card.appendChild(title);

      const odds = document.createElement('p');
      odds.textContent = `Odds ${slip.odds || '—'}`;
      card.appendChild(odds);

      const details = document.createElement('footer');
      details.innerHTML = `<span>Risk ${slip.risk || '—'}</span><span>Win ${slip.payout || '—'}</span>`;
      card.appendChild(details);

      if (slip.legs?.length) {
        const legWrap = document.createElement('ul');
        legWrap.className = 'custom-slip-legs';
        slip.legs.forEach((leg, idx) => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${idx + 1}. ${leg.selection}</span><strong>${leg.odds || '—'}</strong>`;
          legWrap.appendChild(li);
        });
        card.appendChild(legWrap);
      }

      if (slip.notes) {
        const notes = document.createElement('p');
        notes.className = 'custom-slip-notes';
        notes.textContent = slip.notes;
        card.appendChild(notes);
      }

      preview.appendChild(card);
    });
  };

  const readPhoto = (file) => {
    if (!file) {
      currentPhoto = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      currentPhoto = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  photoInput?.addEventListener('change', (event) => {
    const target = event.target;
    readPhoto(target.files?.[0]);
  });

  addLegBtn?.addEventListener('click', () => {
    const selection = legSelectionInput?.value?.trim();
    const detail = legDetailInput?.value?.trim() || '';
    const odds = legOddsInput?.value?.trim() || '';
    if (!selection) {
      legSelectionInput?.focus();
      return;
    }
    pendingLegs.push({ selection, detail, odds });
    legSelectionInput.value = '';
    legDetailInput.value = '';
    legOddsInput.value = '';
    renderLegList();
    saveStored(PENDING_LEGS_KEY, pendingLegs);
  });

  legList?.addEventListener('click', (event) => {
    const button = event.target.closest('.leg-remove');
    if (!button) return;
    const index = Number(button.dataset.index);
    if (Number.isFinite(index)) {
      pendingLegs.splice(index, 1);
      renderLegList();
      saveStored(PENDING_LEGS_KEY, pendingLegs);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = titleInput?.value?.trim() || 'Custom Slip';
    const odds = oddsInput?.value?.trim() || '';
    const risk = riskInput?.value?.trim() || '';
    const payout = payoutInput?.value?.trim() || '';
    const notes = notesInput?.value?.trim() || '';
    const legs = pendingLegs.map((leg) => ({ ...leg }));

    customSlips.unshift({ title, odds, risk, payout, notes, legs, image: currentPhoto });
    saveStored(CUSTOM_SLIPS_KEY, customSlips);
    renderSlips();
    form.reset();
    currentPhoto = null;
    pendingLegs.length = 0;
    renderLegList();
    saveStored(PENDING_LEGS_KEY, pendingLegs);
  });

  renderSlips();
  renderLegList();
};

const setFooterYear = () => {
  const year = document.getElementById('year');
  year.textContent = new Date().getFullYear();
};

init();
