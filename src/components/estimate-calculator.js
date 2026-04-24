const PROJECT_LABELS = {
  'roof-repair': 'Roof repair',
  'roof-replacement': 'Roof replacement',
  'siding-replacement': 'Siding replacement',
  maintenance: 'Seasonal maintenance',
};

const SIZE_UNIT_LABELS = {
  sqft: 'Square feet',
  sqm: 'Square metres',
};

const AGE_LABELS = {
  unknown: "Don't know",
  '0-5': '0-5 years',
  '6-10': '6-10 years',
  '11-15': '11-15 years',
  '16-20': '16-20 years',
  '21-plus': '21+ years',
};

const SQUARE_FEET_PER_SQUARE_METRE = 10.7639104167;
const DRAFT_DB_NAME = 'iras-request-a-quote-drafts';
const DRAFT_STORE_NAME = 'drafts';
const DRAFT_KEY = 'request-a-quote';

const PROFILE_MULTIPLIERS = {
  standard: 1,
  steep: 1.12,
  tight: 1.16,
  coastal: 1.1,
};

const TIMELINE_MULTIPLIERS = {
  planned: 1,
  soon: 1.08,
  urgent: 1.16,
};

const ESTIMATE_BANDS = {
  'roof-repair': { min: 1600, max: 5200, sizeRate: 0.55 },
  'roof-replacement': { min: 14500, max: 29500, sizeRate: 4.75 },
  'siding-replacement': { min: 15500, max: 32500, sizeRate: 4.25 },
  maintenance: { min: 550, max: 2200, sizeRate: 0.18 },
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-CA', {
    maximumFractionDigits,
  }).format(value);
}

function toSquareFeet(value, unit) {
  if (!Number.isFinite(value)) return 1800;
  return unit === 'sqm' ? value * SQUARE_FEET_PER_SQUARE_METRE : value;
}

function toSquareMetres(valueInSquareFeet) {
  if (!Number.isFinite(valueInSquareFeet)) return 0;
  return valueInSquareFeet / SQUARE_FEET_PER_SQUARE_METRE;
}

function convertMeasurement(value, fromUnit, toUnit) {
  if (!Number.isFinite(value) || fromUnit === toUnit) return value;
  if (fromUnit === 'sqm' && toUnit === 'sqft') {
    return value * SQUARE_FEET_PER_SQUARE_METRE;
  }
  if (fromUnit === 'sqft' && toUnit === 'sqm') {
    return value / SQUARE_FEET_PER_SQUARE_METRE;
  }
  return value;
}

function formatSizeValue(value, unit) {
  const normalizedValue = Number.isFinite(value) ? value : 1800;
  if (unit === 'sqm') {
    return `${formatNumber(normalizedValue, 1)} sq m · ${formatNumber(convertMeasurement(normalizedValue, 'sqm', 'sqft'), 0)} sq ft`;
  }
  return `${formatNumber(normalizedValue, 0)} sq ft · ${formatNumber(toSquareMetres(normalizedValue), 1)} sq m`;
}

function getAgeLabel(value) {
  return AGE_LABELS[value] ?? AGE_LABELS.unknown;
}

function normalizeImages(entries) {
  if (!Array.isArray(entries)) return [];

  return entries
    .filter(Boolean)
    .map(entry => ({
      name: entry.name ?? 'Image',
      type: entry.type ?? '',
      lastModified: entry.lastModified ?? Date.now(),
      blob: entry.blob ?? entry,
    }));
}

function isValidProject(value) {
  return Object.prototype.hasOwnProperty.call(PROJECT_LABELS, value);
}

function isValidProfile(value) {
  return Object.prototype.hasOwnProperty.call(PROFILE_MULTIPLIERS, value);
}

function isValidTimeline(value) {
  return Object.prototype.hasOwnProperty.call(TIMELINE_MULTIPLIERS, value);
}

function isValidAge(value) {
  return Object.prototype.hasOwnProperty.call(AGE_LABELS, value);
}

function openDraftDatabase() {
  if (!('indexedDB' in window)) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DRAFT_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DRAFT_STORE_NAME)) {
        db.createObjectStore(DRAFT_STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open draft storage.'));
  });
}

function readDraft() {
  return openDraftDatabase()
    .then(db => {
      if (!db) return null;

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(DRAFT_STORE_NAME, 'readonly');
        const store = transaction.objectStore(DRAFT_STORE_NAME);
        const request = store.get(DRAFT_KEY);

        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => reject(request.error ?? new Error('Unable to read draft.'));

        transaction.oncomplete = () => db.close();
        transaction.onerror = () => {
          db.close();
          reject(transaction.error ?? request.error ?? new Error('Unable to read draft.'));
        };
        transaction.onabort = () => {
          db.close();
          reject(transaction.error ?? request.error ?? new Error('Unable to read draft.'));
        };
      });
    })
    .catch(() => null);
}

function saveDraft(draft) {
  return openDraftDatabase()
    .then(db => {
      if (!db) return null;

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(DRAFT_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(DRAFT_STORE_NAME);
        store.put(draft, DRAFT_KEY);

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error ?? new Error('Unable to save draft.'));
        };
        transaction.onabort = () => {
          db.close();
          reject(transaction.error ?? new Error('Unable to save draft.'));
        };
      });
    })
    .catch(() => null);
}

function normalizeDraft(draft) {
  const project = isValidProject(draft?.project) ? draft.project : 'roof-repair';
  const profile = isValidProfile(draft?.profile) ? draft.profile : 'standard';
  const timeline = isValidTimeline(draft?.timeline) ? draft.timeline : 'planned';
  const age = isValidAge(draft?.age) ? draft.age : 'unknown';
  const unit = draft?.unit === 'sqm' ? 'sqm' : 'sqft';
  const parsedSize = Number.parseFloat(draft?.size);

  return {
    project,
    size: Number.isFinite(parsedSize) ? parsedSize : 2200,
    unit,
    profile,
    timeline,
    email: typeof draft?.email === 'string' ? draft.email : '',
    age,
    notes: typeof draft?.notes === 'string' ? draft.notes : '',
    images: normalizeImages(draft?.images),
  };
}

function getEstimate(project, size, profile, timeline) {
  const band = ESTIMATE_BANDS[project] ?? ESTIMATE_BANDS['roof-repair'];
  const profileMultiplier = PROFILE_MULTIPLIERS[profile] ?? 1;
  const timelineMultiplier = TIMELINE_MULTIPLIERS[timeline] ?? 1;
  const normalizedSize = Number.isFinite(size) ? size : 1800;
  const sizeDelta = Math.max(normalizedSize - 1600, 0);

  let min = band.min + sizeDelta * band.sizeRate * 0.7;
  let max = band.max + sizeDelta * band.sizeRate;

  min *= profileMultiplier * timelineMultiplier;
  max *= profileMultiplier * timelineMultiplier;

  const roundedMin = Math.round(min / 50) * 50;
  const roundedMax = Math.round(max / 100) * 100;

  return {
    min: roundedMin,
    max: Math.max(roundedMax, roundedMin + 500),
  };
}

function applyEstimateCalculator(calculator) {
  if (calculator.dataset.uiEstimateCalculatorReady === 'true') return;

  const projectSelect = calculator.querySelector('[data-ui-estimate-project]');
  const sizeInput = calculator.querySelector('[data-ui-estimate-size]');
  const unitSelect = calculator.querySelector('[data-ui-estimate-size-unit]');
  const profileSelect = calculator.querySelector('[data-ui-estimate-profile]');
  const timelineSelect = calculator.querySelector('[data-ui-estimate-timeline]');
  const ageSelect = calculator.querySelector('[data-ui-estimate-age]');
  const emailInput = calculator.querySelector('[data-ui-estimate-email]');
  const notesInput = calculator.querySelector('[data-ui-estimate-notes]');
  const imagesInput = calculator.querySelector('[data-ui-estimate-images]');
  const imagesSummary = calculator.querySelector('[data-ui-estimate-images-summary]');
  const revealButton = calculator.querySelector('[data-ui-estimate-submit]');
  const rangeOutput = calculator.querySelector('[data-ui-estimate-range]');
  const summaryOutput = calculator.querySelector('[data-ui-estimate-summary]');
  const statusOutput = calculator.querySelector('[data-ui-estimate-status]');
  const projectLabel = calculator.querySelector('[data-ui-estimate-project-label]');
  const profileLabel = calculator.querySelector('[data-ui-estimate-profile-label]');
  const timelineLabel = calculator.querySelector('[data-ui-estimate-timeline-label]');
  const sizeLabel = calculator.querySelector('[data-ui-estimate-size-label]');

  if (!projectSelect || !sizeInput || !unitSelect || !profileSelect || !timelineSelect || !ageSelect || !emailInput || !notesInput || !imagesInput || !imagesSummary || !revealButton || !rangeOutput || !summaryOutput || !statusOutput) {
    return;
  }

  let currentUnit = unitSelect.value === 'sqm' ? 'sqm' : 'sqft';
  let currentImages = [];
  let isRevealed = false;
  let isHydrating = true;
  let hasUserInteracted = false;
  let needsPersistAfterHydration = false;
  let writeQueue = Promise.resolve();

  const queueDraftSave = () => {
    if (isHydrating) return;

    const draft = {
      project: projectSelect.value,
      size: Number.parseFloat(sizeInput.value),
      unit: currentUnit,
      profile: profileSelect.value,
      timeline: timelineSelect.value,
      email: emailInput.value,
      age: ageSelect.value,
      notes: notesInput.value,
      images: currentImages.map(image => ({
        name: image.name,
        type: image.type,
        lastModified: image.lastModified,
        blob: image.blob,
      })),
    };

    writeQueue = writeQueue.then(() => saveDraft(draft)).catch(() => null);
  };

  const updateImageSummary = () => {
    if (!currentImages.length) {
      imagesSummary.textContent = 'No images uploaded yet.';
      return;
    }

    const names = currentImages.map(image => image.name).join(', ');
    imagesSummary.textContent = `${currentImages.length} image${currentImages.length === 1 ? '' : 's'} stored locally: ${names}`;
  };

  const applyDraft = draft => {
    const normalizedDraft = normalizeDraft(draft);

    projectSelect.value = normalizedDraft.project;
    currentUnit = normalizedDraft.unit;
    unitSelect.value = currentUnit;
    sizeInput.step = currentUnit === 'sqm' ? '0.1' : '50';
    sizeInput.value = currentUnit === 'sqm'
      ? formatNumber(normalizedDraft.size, 1)
      : formatNumber(normalizedDraft.size, 0);
    profileSelect.value = normalizedDraft.profile;
    timelineSelect.value = normalizedDraft.timeline;
    ageSelect.value = normalizedDraft.age;
    emailInput.value = normalizedDraft.email;
    notesInput.value = normalizedDraft.notes;
    currentImages = normalizedDraft.images;
    updateImageSummary();
  };

  const render = () => {
    const project = projectSelect.value;
    const rawSize = Number.parseFloat(sizeInput.value);
    const profile = profileSelect.value;
    const timeline = timelineSelect.value;
    const age = ageSelect.value;
    const email = emailInput.value.trim();
    const notes = notesInput.value.trim();
    const size = toSquareFeet(rawSize, currentUnit);
    const estimate = getEstimate(project, size, profile, timeline);
    const profileText = profileSelect.selectedOptions[0]?.textContent?.toLowerCase() ?? 'standard access';
    const timelineText = timelineSelect.selectedOptions[0]?.textContent?.toLowerCase() ?? 'planned';
    const ageLabel = getAgeLabel(age);

    if (projectLabel) projectLabel.textContent = PROJECT_LABELS[project] ?? 'Roof repair';
    if (profileLabel) profileLabel.textContent = profileSelect.selectedOptions[0]?.textContent ?? 'Standard access';
    if (timelineLabel) timelineLabel.textContent = timelineSelect.selectedOptions[0]?.textContent ?? 'Planned project';
    if (sizeLabel) sizeLabel.textContent = formatSizeValue(Number.isFinite(rawSize) ? rawSize : 1800, currentUnit);
    updateImageSummary();

    if (!email) {
      rangeOutput.textContent = 'Enter your email to unlock a planning range.';
      summaryOutput.textContent = 'We use the email to follow up with the next questions before booking a site visit. Your images and notes stay stored locally.';
      statusOutput.textContent = 'Add an email to reveal the range.';
      revealButton.textContent = 'Reveal my range';
      isRevealed = false;
      return;
    }

    if (!isRevealed) {
      rangeOutput.textContent = 'Ready to reveal the range.';
      summaryOutput.textContent = 'Press the button to generate a planning range for the project details above. Any images, age notes, and scope notes are saved locally.';
      statusOutput.textContent = `Email entered for ${email}.`;
      return;
    }

    rangeOutput.textContent = `${formatCurrency(estimate.min)} - ${formatCurrency(estimate.max)}`;
    summaryOutput.textContent = [
      `Planning range for ${PROJECT_LABELS[project] ?? 'the project'}`,
      `with ${profileText}`,
      `${timelineText} timeline`,
      age === 'unknown' ? 'age not provided' : `age ${ageLabel.toLowerCase()}`,
      `${formatSizeValue(Number.isFinite(rawSize) ? rawSize : 1800, currentUnit)}`,
      currentImages.length ? `${currentImages.length} image${currentImages.length === 1 ? '' : 's'} stored locally` : null,
      notes ? 'extra notes saved locally' : null,
    ].filter(Boolean).join(', ') + '.';
    statusOutput.textContent = `Range ready for ${email}.`;
    revealButton.textContent = 'Refresh my range';
  };

  const handleChange = () => {
    hasUserInteracted = true;
    if (isHydrating) needsPersistAfterHydration = true;
    render();
    queueDraftSave();
  };

  const handleUnitChange = () => {
    hasUserInteracted = true;
    if (isHydrating) needsPersistAfterHydration = true;

    const nextUnit = unitSelect.value === 'sqm' ? 'sqm' : 'sqft';
    if (nextUnit !== currentUnit) {
      const currentValue = Number.parseFloat(sizeInput.value);
      if (Number.isFinite(currentValue)) {
        const convertedValue = convertMeasurement(currentValue, currentUnit, nextUnit);
        sizeInput.value = nextUnit === 'sqm' ? formatNumber(convertedValue, 1) : formatNumber(convertedValue, 0);
      }
      currentUnit = nextUnit;
      sizeInput.step = nextUnit === 'sqm' ? '0.1' : '50';
    }

    handleChange();
  };

  const handleImageChange = () => {
    hasUserInteracted = true;
    if (isHydrating) needsPersistAfterHydration = true;

    currentImages = Array.from(imagesInput.files ?? []).map(file => ({
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      blob: file,
    }));

    updateImageSummary();
    render();
    queueDraftSave();
  };

  const reveal = () => {
    hasUserInteracted = true;
    if (isHydrating) needsPersistAfterHydration = true;

    if (!emailInput.value.trim()) {
      statusOutput.textContent = 'Add an email to reveal the range.';
      emailInput.focus();
      return;
    }

    isRevealed = true;
    render();
    queueDraftSave();
  };

  [projectSelect, sizeInput, profileSelect, timelineSelect, ageSelect, emailInput, notesInput].forEach(control => {
    control.addEventListener('input', handleChange);
    control.addEventListener('change', handleChange);
  });

  unitSelect.addEventListener('change', handleUnitChange);
  imagesInput.addEventListener('change', handleImageChange);

  revealButton.addEventListener('click', reveal);

  readDraft().then(draft => {
    if (draft && !hasUserInteracted) {
      applyDraft(draft);
    }
  }).finally(() => {
    isHydrating = false;
    render();
    if (needsPersistAfterHydration) {
      needsPersistAfterHydration = false;
      queueDraftSave();
    }
  });

  render();
  calculator.dataset.uiEstimateCalculatorReady = 'true';
}

export function mountEstimateCalculators() {
  document.querySelectorAll('[data-ui-estimate-calculator]').forEach(applyEstimateCalculator);
}
