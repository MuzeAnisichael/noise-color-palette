"use strict";

const ANCHORS = [
  { id: "brown", labelZh: "棕/红", labelEn: "Brown/Red", hue: 20, beta: -2, color: "#99542d" },
  { id: "pink", labelZh: "粉红", labelEn: "Pink", hue: 335, beta: -1, color: "#e66e9b" },
  { id: "green", labelZh: "绿色", labelEn: "Green", hue: 120, beta: 0, color: "#37a46d" },
  { id: "blue", labelZh: "蓝色", labelEn: "Blue", hue: 218, beta: 1, color: "#2f82c6" },
  { id: "violet", labelZh: "紫色", labelEn: "Violet", hue: 280, beta: 2, color: "#7d57bd" },
];

const EQ_BANDS = [
  { id: "sub", label: "80 Hz", frequency: 80, type: "lowshelf", q: 0.7 },
  { id: "lowMid", label: "250 Hz", frequency: 250, type: "peaking", q: 1.05 },
  { id: "mid", label: "1 kHz", frequency: 1000, type: "peaking", q: 1.05 },
  { id: "presence", label: "4 kHz", frequency: 4000, type: "peaking", q: 1.05 },
  { id: "air", label: "12 kHz", frequency: 12000, type: "highshelf", q: 0.7 },
];

const MIX_KEYS = ["white", ...ANCHORS.map((anchor) => anchor.id)];
const root = document.documentElement;

const I18N = {
  zh: {
    appTitle: "噪声调色盘",
    currentStatus: "当前状态",
    workspaceAria: "噪声调色盘工作区",
    paused: "已暂停",
    listeningState: "监听中",
    palette: "色盘",
    colorWheelAria: "拖动选择噪声颜色",
    currentColor: "当前颜色",
    spectralTilt: "频谱倾向",
    colorStrength: "染色强度",
    listen: "监听",
    startListening: "开始监听",
    pauseListening: "暂停监听",
    outputVolume: "输出音量",
    resetWhite: "重置为白噪声",
    randomColor: "随机颜色",
    spectrum: "频谱",
    spectrumCanvasAria: "当前噪声频谱预览",
    mixLegendAria: "噪声混合比例",
    saveAudio: "保存音频",
    ready: "待生成",
    duration: "时长",
    unit: "单位",
    seconds: "秒",
    minutes: "分钟",
    audioFormat: "音频格式",
    sampleRate: "采样率",
    filename: "文件名",
    normalizeExport: "峰值归一化到 -1 dB",
    generateDownload: "生成并下载",
    downloadRecent: "下载最近生成的音频",
    mixerAria: "噪声混音器",
    feature2: "Feature 2",
    mixerTitle: "噪声混音器",
    bypassMixer: "旁路混音处理",
    eqCurve: "EQ 曲线",
    eqCanvasAria: "拖动 EQ 曲线控制点",
    eqBandAria: "EQ 频段增益",
    eqReset: "重置 EQ",
    eqSmile: "微笑曲线",
    eqWarm: "暖色低频",
    effectsTitle: "混响与空间",
    reverbMix: "混响量",
    roomSize: "房间大小",
    damping: "高频阻尼",
    pan: "声像位置",
    spatialWidth: "空间宽度",
    spatialDelay: "空间延迟",
    spaceReset: "重置空间",
    spaceWide: "宽阔空间",
    spaceNear: "近场干声",
    whiteGrey: "白/灰",
    tiltSuffix: "倾向",
    center: "居中",
    left: "左",
    right: "右",
    bypassed: "已旁路",
    widthLabel: "宽度",
    generating: "生成中",
    encoding: "编码中",
    generated: "已生成",
    exportFailed: "生成失败",
    startFailed: "启动失败",
    downloadPrefix: "下载",
    languageToggle: "EN",
    languageAria: "Switch language to English",
  },
  en: {
    appTitle: "Noise Colour Palette",
    currentStatus: "Current status",
    workspaceAria: "Noise colour palette workspace",
    paused: "Paused",
    listeningState: "Listening",
    palette: "Palette",
    colorWheelAria: "Drag to choose a noise colour",
    currentColor: "Current colour",
    spectralTilt: "Spectral tilt",
    colorStrength: "Colour strength",
    listen: "Monitor",
    startListening: "Start monitor",
    pauseListening: "Pause monitor",
    outputVolume: "Output level",
    resetWhite: "Reset to white noise",
    randomColor: "Random colour",
    spectrum: "Spectrum",
    spectrumCanvasAria: "Current noise spectrum preview",
    mixLegendAria: "Noise blend ratio",
    saveAudio: "Save audio",
    ready: "Ready",
    duration: "Duration",
    unit: "Unit",
    seconds: "Seconds",
    minutes: "Minutes",
    audioFormat: "Audio format",
    sampleRate: "Sample rate",
    filename: "Filename",
    normalizeExport: "Normalize peak to -1 dB",
    generateDownload: "Generate and download",
    downloadRecent: "Download the latest generated audio",
    mixerAria: "Noise mixer",
    feature2: "Feature 2",
    mixerTitle: "Noise Mixer",
    bypassMixer: "Bypass mixer processing",
    eqCurve: "EQ Curve",
    eqCanvasAria: "Drag EQ curve control points",
    eqBandAria: "EQ band gain",
    eqReset: "Reset EQ",
    eqSmile: "Smile curve",
    eqWarm: "Warm lows",
    effectsTitle: "Reverb and Space",
    reverbMix: "Reverb mix",
    roomSize: "Room size",
    damping: "HF damping",
    pan: "Pan position",
    spatialWidth: "Spatial width",
    spatialDelay: "Spatial delay",
    spaceReset: "Reset space",
    spaceWide: "Wide space",
    spaceNear: "Near dry",
    whiteGrey: "White/Grey",
    tiltSuffix: "tilt",
    center: "Center",
    left: "Left",
    right: "Right",
    bypassed: "Bypassed",
    widthLabel: "Width",
    generating: "Generating",
    encoding: "Encoding",
    generated: "Generated",
    exportFailed: "Export failed",
    startFailed: "Start failed",
    downloadPrefix: "Download",
    languageToggle: "中文",
    languageAria: "切换到中文",
  },
};

const dom = {
  languageToggle: document.querySelector("#languageToggle"),
  colorWheel: document.querySelector("#colorWheel"),
  spectrumCanvas: document.querySelector("#spectrumCanvas"),
  playToggle: document.querySelector("#playToggle"),
  audioState: document.querySelector("#audioState"),
  noiseName: document.querySelector("#noiseName"),
  colourValue: document.querySelector("#colourValue"),
  selectedSwatch: document.querySelector("#selectedSwatch"),
  selectedHex: document.querySelector("#selectedHex"),
  tiltValue: document.querySelector("#tiltValue"),
  saturationValue: document.querySelector("#saturationValue"),
  volumeControl: document.querySelector("#volumeControl"),
  volumeValue: document.querySelector("#volumeValue"),
  levelMeter: document.querySelector("#levelMeter"),
  meterValue: document.querySelector("#meterValue"),
  resetButton: document.querySelector("#resetButton"),
  randomButton: document.querySelector("#randomButton"),
  mixLegend: document.querySelector("#mixLegend"),
  durationInput: document.querySelector("#durationInput"),
  durationUnit: document.querySelector("#durationUnit"),
  formatSelect: document.querySelector("#formatSelect"),
  sampleRateSelect: document.querySelector("#sampleRateSelect"),
  filenameInput: document.querySelector("#filenameInput"),
  normalizeExport: document.querySelector("#normalizeExport"),
  exportButton: document.querySelector("#exportButton"),
  exportState: document.querySelector("#exportState"),
  exportProgress: document.querySelector("#exportProgress"),
  downloadLink: document.querySelector("#downloadLink"),
  mixerBypass: document.querySelector("#mixerBypass"),
  eqCanvas: document.querySelector("#eqCanvas"),
  eqReadout: document.querySelector("#eqReadout"),
  eqBandControls: document.querySelector("#eqBandControls"),
  eqResetButton: document.querySelector("#eqResetButton"),
  eqSmileButton: document.querySelector("#eqSmileButton"),
  eqWarmButton: document.querySelector("#eqWarmButton"),
  reverbMixControl: document.querySelector("#reverbMixControl"),
  reverbMixValue: document.querySelector("#reverbMixValue"),
  reverbSizeControl: document.querySelector("#reverbSizeControl"),
  reverbSizeValue: document.querySelector("#reverbSizeValue"),
  reverbDampingControl: document.querySelector("#reverbDampingControl"),
  reverbDampingValue: document.querySelector("#reverbDampingValue"),
  panControl: document.querySelector("#panControl"),
  panValue: document.querySelector("#panValue"),
  widthControl: document.querySelector("#widthControl"),
  widthValue: document.querySelector("#widthValue"),
  spaceDelayControl: document.querySelector("#spaceDelayControl"),
  spaceDelayValue: document.querySelector("#spaceDelayValue"),
  spaceReadout: document.querySelector("#spaceReadout"),
  spaceResetButton: document.querySelector("#spaceResetButton"),
  spaceWideButton: document.querySelector("#spaceWideButton"),
  spaceNearButton: document.querySelector("#spaceNearButton"),
};

const state = {
  language: localStorage.getItem("noisePaletteLanguage") === "en" ? "en" : "zh",
  hue: 335,
  saturation: 0.75,
  mix: null,
  color: null,
  beta: 0,
  dominant: null,
  dragging: false,
  eqDraggingIndex: null,
  eqSelectedIndex: 2,
  lastObjectUrl: null,
  lastDownloadFilename: null,
  exportStatusKey: "ready",
  mixer: {
    bypass: false,
    eq: EQ_BANDS.map(() => 0),
    reverbMix: 0.18,
    reverbSize: 0.46,
    reverbDamping: 0.42,
    pan: 0,
    width: 1,
    spaceDelayMs: 14,
  },
};

const audio = {
  context: null,
  processor: null,
  generator: null,
  isPlaying: false,
  currentMix: createEmptyMix(),
  targetMix: createEmptyMix(),
  currentVolume: 0,
  targetVolume: 0.36,
  mixerProcessor: null,
  meter: 0,
};

function createEmptyMix() {
  return MIX_KEYS.reduce((mix, key) => {
    mix[key] = key === "white" ? 1 : 0;
    return mix;
  }, {});
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function dbToGain(db) {
  return Math.pow(10, db / 20);
}

function gainToDb(gain) {
  return 20 * Math.log10(Math.max(0.000001, gain));
}

function softLimit(sample) {
  return Math.tanh(sample * 1.08) / Math.tanh(1.08);
}

function t(key) {
  return I18N[state.language]?.[key] || I18N.zh[key] || key;
}

function labelFor(item) {
  if (!item) {
    return "";
  }
  return state.language === "en" ? item.labelEn || item.labelZh || item.label : item.labelZh || item.label || item.labelEn;
}

function applyLanguage() {
  document.documentElement.lang = state.language === "en" ? "en" : "zh-CN";
  document.title = t("appTitle");
  dom.languageToggle.textContent = t("languageToggle");
  dom.languageToggle.setAttribute("aria-label", t("languageAria"));

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  dom.exportState.textContent = t(state.exportStatusKey);
  if (state.lastDownloadFilename) {
    dom.downloadLink.textContent = `${t("downloadPrefix")} ${state.lastDownloadFilename}`;
  }
  updateAudioLabels();
  renderAll();
}

function circularDistance(a, b) {
  const distance = Math.abs(a - b) % 360;
  return Math.min(distance, 360 - distance);
}

function hsvToRgb(hue, saturation, value) {
  const c = value * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = value - c;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function rgbToHex([r, g, b]) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function mixFromColour(hue, saturation) {
  const colorWeight = Math.pow(saturation, 0.92);
  const whiteWeight = 1 - colorWeight;
  const spread = 48;
  const raw = ANCHORS.map((anchor) => {
    const distance = circularDistance(hue, anchor.hue);
    return Math.exp(-(distance * distance) / (2 * spread * spread));
  });
  const rawSum = raw.reduce((sum, value) => sum + value, 0) || 1;
  const mix = createEmptyMix();

  mix.white = whiteWeight;
  ANCHORS.forEach((anchor, index) => {
    mix[anchor.id] = (raw[index] / rawSum) * colorWeight;
  });

  const beta = ANCHORS.reduce((sum, anchor) => sum + mix[anchor.id] * anchor.beta, 0);
  const dominant = dominantFromMix(mix);

  return { mix, beta, dominant };
}

function dominantFromMix(mix) {
  if (mix.white >= 0.5) {
    return { id: "white", labelZh: "白/灰", labelEn: "White/Grey", color: "#f7f7f2" };
  }

  let best = ANCHORS[0];
  for (const anchor of ANCHORS) {
    if (mix[anchor.id] > mix[best.id]) {
      best = anchor;
    }
  }
  return best;
}

function updateStateFromColour(hue, saturation) {
  state.hue = (hue + 360) % 360;
  state.saturation = clamp(saturation, 0, 1);
  const [r, g, b] = hsvToRgb(state.hue, state.saturation, 0.94);
  state.color = { rgb: [r, g, b], hex: rgbToHex([r, g, b]) };
  const mapping = mixFromColour(state.hue, state.saturation);
  state.mix = mapping.mix;
  state.beta = mapping.beta;
  state.dominant = mapping.dominant;

  for (const key of MIX_KEYS) {
    audio.targetMix[key] = state.mix[key];
  }

  renderAll();
}

function renderAll() {
  drawColorWheel();
  drawSpectrum();
  drawEqCurve();
  updateReadouts();
  updateLegend();
  updateMixerReadouts();
}

function updateReadouts() {
  const hue = Math.round(state.hue);
  const saturation = Math.round(state.saturation * 100);
  dom.colourValue.textContent = `H ${hue} / S ${saturation}%`;
  dom.selectedSwatch.style.background = state.color.hex;
  dom.selectedHex.textContent = state.color.hex;
  dom.tiltValue.textContent = state.beta.toFixed(2);
  dom.saturationValue.textContent = `${saturation}%`;
  dom.noiseName.textContent = state.language === "en"
    ? `${labelFor(state.dominant)} ${t("tiltSuffix")}`
    : `${labelFor(state.dominant)}${t("tiltSuffix")}`;
}

function drawColorWheel() {
  const canvas = dom.colorWheel;
  const rect = canvas.getBoundingClientRect();
  const cssSize = Math.max(240, Math.round(Math.min(rect.width || 360, rect.height || 360)));
  const dpr = window.devicePixelRatio || 1;
  const pixelSize = Math.round(cssSize * dpr);

  if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
    canvas.width = pixelSize;
    canvas.height = pixelSize;
  }

  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  const image = ctx.createImageData(pixelSize, pixelSize);
  const center = pixelSize / 2;
  const radius = pixelSize * 0.47;
  const feather = dpr * 1.5;

  for (let y = 0; y < pixelSize; y += 1) {
    for (let x = 0; x < pixelSize; x += 1) {
      const dx = x + 0.5 - center;
      const dy = y + 0.5 - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const index = (y * pixelSize + x) * 4;

      if (distance <= radius + feather) {
        const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        const saturation = clamp(distance / radius, 0, 1);
        const value = 0.98 - saturation * 0.04;
        const [r, g, b] = hsvToRgb(hue, saturation, value);
        const alpha = distance <= radius ? 255 : Math.round(255 * (1 - (distance - radius) / feather));

        image.data[index] = r;
        image.data[index + 1] = g;
        image.data[index + 2] = b;
        image.data[index + 3] = alpha;
      }
    }
  }

  ctx.putImageData(image, 0, 0);
  ctx.save();
  ctx.scale(dpr, dpr);
  const logicalCenter = cssSize / 2;
  const logicalRadius = cssSize * 0.47;
  const handleRadius = 9;
  const handleDistance = state.saturation * logicalRadius;
  const angle = (state.hue * Math.PI) / 180;
  const handleX = logicalCenter + Math.cos(angle) * handleDistance;
  const handleY = logicalCenter + Math.sin(angle) * handleDistance;

  ctx.beginPath();
  ctx.arc(logicalCenter, logicalCenter, logicalRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(23, 26, 22, 0.22)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(handleX, handleY, handleRadius, 0, Math.PI * 2);
  ctx.fillStyle = state.color.hex;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(23, 26, 22, 0.56)";
  ctx.stroke();
  ctx.restore();
}

function spectrumPowerAt(frequency, mix) {
  const ratio = frequency / 1000;
  const logBand = Math.log2(frequency / 720);
  const greenBump = 0.12 + 1.8 * Math.exp(-(logBand * logBand) / (2 * 0.9 * 0.9));

  const basePower =
    mix.white * 1 +
    mix.pink * Math.pow(ratio, -1) +
    mix.brown * Math.pow(ratio, -2) +
    mix.green * greenBump +
    mix.blue * Math.pow(ratio, 1) +
    mix.violet * Math.pow(ratio, 2);

  if (state.mixer?.bypass) {
    return basePower;
  }

  const eqGain = dbToGain(eqGainAtFrequency(frequency, state.mixer?.eq || []));
  return basePower * eqGain * eqGain;
}

function drawSpectrum() {
  const canvas = dom.spectrumCanvas;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(420, Math.round(rect.width || 720));
  const height = Math.max(230, Math.round(rect.height || 300));
  const dpr = window.devicePixelRatio || 1;

  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfcf9";
  ctx.fillRect(0, 0, width, height);

  const padLeft = 46;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 34;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const minHz = 20;
  const maxHz = 20000;
  const minDb = -30;
  const maxDb = 30;
  const reference = spectrumPowerAt(1000, state.mix) || 1;

  function xForFrequency(frequency) {
    const ratio = (Math.log10(frequency) - Math.log10(minHz)) / (Math.log10(maxHz) - Math.log10(minHz));
    return padLeft + ratio * plotWidth;
  }

  function yForDb(db) {
    const ratio = (clamp(db, minDb, maxDb) - minDb) / (maxDb - minDb);
    return padTop + (1 - ratio) * plotHeight;
  }

  ctx.strokeStyle = "#e2e6dd";
  ctx.lineWidth = 1;
  ctx.font = "12px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#687064";

  for (const db of [-24, -12, 0, 12, 24]) {
    const y = yForDb(db);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();
    ctx.fillText(`${db} dB`, 6, y + 4);
  }

  for (const tick of [20, 100, 1000, 10000, 20000]) {
    const x = xForFrequency(tick);
    ctx.beginPath();
    ctx.moveTo(x, padTop);
    ctx.lineTo(x, height - padBottom);
    ctx.stroke();
    const label = tick >= 1000 ? `${tick / 1000}k` : `${tick}`;
    ctx.fillText(label, x - 10, height - 12);
  }

  const points = [];
  for (let i = 0; i <= 180; i += 1) {
    const t = i / 180;
    const frequency = minHz * Math.pow(maxHz / minHz, t);
    const power = spectrumPowerAt(frequency, state.mix);
    const db = 10 * Math.log10(Math.max(0.000001, power / reference));
    points.push([xForFrequency(frequency), yForDb(db)]);
  }

  ctx.beginPath();
  ctx.moveTo(points[0][0], height - padBottom);
  for (const [x, y] of points) {
    ctx.lineTo(x, y);
  }
  ctx.lineTo(points[points.length - 1][0], height - padBottom);
  ctx.closePath();
  ctx.fillStyle = "rgba(47, 140, 103, 0.14)";
  ctx.fill();

  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = state.dominant.color || "#2f8c67";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function updateLegend() {
  const items = [
    { id: "white", labelZh: "白/灰", labelEn: "White/Grey", color: "#c7ccc3" },
    ...ANCHORS,
  ];

  if (!dom.mixLegend.dataset.ready) {
    dom.mixLegend.innerHTML = items
      .map(
        (item) => `
          <div class="legend-row" data-key="${item.id}">
            <span data-legend-label="${item.id}">${labelFor(item)}</span>
            <span class="legend-bar"><span style="background:${item.color}"></span></span>
            <strong>0%</strong>
          </div>
        `,
      )
      .join("");
    dom.mixLegend.dataset.ready = "true";
  }

  dom.mixLegend.querySelectorAll(".legend-row").forEach((row) => {
    const key = row.dataset.key;
    const percent = Math.round((state.mix[key] || 0) * 100);
    const item = items.find((entry) => entry.id === key);
    row.querySelector("[data-legend-label]").textContent = labelFor(item);
    row.querySelector(".legend-bar span").style.width = `${percent}%`;
    row.querySelector("strong").textContent = `${percent}%`;
  });
}

function eqGainAtFrequency(frequency, gains = state.mixer.eq) {
  const target = Math.log2(frequency);
  return EQ_BANDS.reduce((sum, band, index) => {
    const distance = target - Math.log2(band.frequency);
    const width = band.type === "peaking" ? 0.82 : 1.28;
    const weight = Math.exp(-(distance * distance) / (2 * width * width));
    return sum + (gains[index] || 0) * weight;
  }, 0);
}

function xForEqFrequency(frequency, left, width) {
  const minHz = 20;
  const maxHz = 20000;
  const ratio = (Math.log10(frequency) - Math.log10(minHz)) / (Math.log10(maxHz) - Math.log10(minHz));
  return left + ratio * width;
}

function yForEqGain(gainDb, top, height) {
  const minDb = -18;
  const maxDb = 18;
  const ratio = (clamp(gainDb, minDb, maxDb) - minDb) / (maxDb - minDb);
  return top + (1 - ratio) * height;
}

function gainFromEqY(y, top, height) {
  const minDb = -18;
  const maxDb = 18;
  const ratio = 1 - clamp((y - top) / height, 0, 1);
  return clamp(Math.round((minDb + ratio * (maxDb - minDb)) * 2) / 2, -12, 12);
}

function drawEqCurve() {
  if (!dom.eqCanvas) {
    return;
  }

  const canvas = dom.eqCanvas;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(420, Math.round(rect.width || 820));
  const height = Math.max(280, Math.round(rect.height || 320));
  const dpr = window.devicePixelRatio || 1;

  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfcf9";
  ctx.fillRect(0, 0, width, height);

  const padLeft = 48;
  const padRight = 20;
  const padTop = 22;
  const padBottom = 36;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  ctx.strokeStyle = "#e2e6dd";
  ctx.lineWidth = 1;
  ctx.font = "12px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#687064";

  for (const db of [-12, -6, 0, 6, 12]) {
    const y = yForEqGain(db, padTop, plotHeight);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - padRight, y);
    ctx.stroke();
    ctx.fillText(`${db > 0 ? "+" : ""}${db}`, 10, y + 4);
  }

  for (const tick of [20, 80, 250, 1000, 4000, 12000, 20000]) {
    const x = xForEqFrequency(tick, padLeft, plotWidth);
    ctx.beginPath();
    ctx.moveTo(x, padTop);
    ctx.lineTo(x, height - padBottom);
    ctx.stroke();
    const label = tick >= 1000 ? `${tick / 1000}k` : `${tick}`;
    ctx.fillText(label, x - 11, height - 12);
  }

  const points = [];
  for (let i = 0; i <= 220; i += 1) {
    const t = i / 220;
    const frequency = 20 * Math.pow(20000 / 20, t);
    const gain = state.mixer.bypass ? 0 : eqGainAtFrequency(frequency);
    points.push([xForEqFrequency(frequency, padLeft, plotWidth), yForEqGain(gain, padTop, plotHeight)]);
  }

  ctx.beginPath();
  ctx.moveTo(points[0][0], yForEqGain(0, padTop, plotHeight));
  for (const [x, y] of points) {
    ctx.lineTo(x, y);
  }
  ctx.lineTo(points[points.length - 1][0], yForEqGain(0, padTop, plotHeight));
  ctx.closePath();
  ctx.fillStyle = "rgba(45, 118, 173, 0.12)";
  ctx.fill();

  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = state.mixer.bypass ? "#9aa398" : "#2d76ad";
  ctx.lineWidth = 3;
  ctx.stroke();

  EQ_BANDS.forEach((band, index) => {
    const x = xForEqFrequency(band.frequency, padLeft, plotWidth);
    const y = yForEqGain(state.mixer.bypass ? 0 : state.mixer.eq[index], padTop, plotHeight);
    const selected = index === state.eqSelectedIndex;

    ctx.beginPath();
    ctx.arc(x, y, selected ? 8 : 7, 0, Math.PI * 2);
    ctx.fillStyle = selected ? "#b85f38" : "#2f8c67";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(23, 26, 22, 0.35)";
    ctx.stroke();
  });
}

function renderEqBandControls() {
  if (dom.eqBandControls.dataset.ready) {
    return;
  }

  dom.eqBandControls.innerHTML = EQ_BANDS.map(
    (band, index) => `
      <label class="eq-band">
        <span>${band.label}</span>
        <input data-eq-index="${index}" type="range" min="-12" max="12" step="0.5" value="0" />
        <strong data-eq-value="${index}">0 dB</strong>
      </label>
    `,
  ).join("");
  dom.eqBandControls.dataset.ready = "true";

  dom.eqBandControls.querySelectorAll("input[data-eq-index]").forEach((input) => {
    input.addEventListener("input", () => {
      setEqBand(Number(input.dataset.eqIndex), Number(input.value));
    });
  });
}

function formatPan(value) {
  if (Math.abs(value) < 0.01) {
    return t("center");
  }
  return value < 0 ? `${t("left")} ${Math.round(Math.abs(value) * 100)}` : `${t("right")} ${Math.round(value * 100)}`;
}

function updateAudioLabels() {
  dom.playToggle.textContent = audio.isPlaying ? t("pauseListening") : t("startListening");
  dom.audioState.textContent = audio.isPlaying ? t("listeningState") : t("paused");
}

function updateMixerReadouts() {
  if (!dom.eqReadout) {
    return;
  }

  EQ_BANDS.forEach((band, index) => {
    const input = dom.eqBandControls.querySelector(`input[data-eq-index="${index}"]`);
    const output = dom.eqBandControls.querySelector(`[data-eq-value="${index}"]`);
    const value = state.mixer.eq[index];
    if (input && Number(input.value) !== value) {
      input.value = value;
    }
    if (output) {
      output.textContent = `${value > 0 ? "+" : ""}${value} dB`;
    }
  });

  const selectedBand = EQ_BANDS[state.eqSelectedIndex] || EQ_BANDS[2];
  const selectedGain = state.mixer.eq[state.eqSelectedIndex] || 0;
  dom.eqReadout.textContent = `${selectedBand.label} / ${selectedGain > 0 ? "+" : ""}${selectedGain} dB`;
  dom.mixerBypass.checked = state.mixer.bypass;

  dom.reverbMixControl.value = Math.round(state.mixer.reverbMix * 100);
  dom.reverbMixValue.textContent = `${Math.round(state.mixer.reverbMix * 100)}%`;
  dom.reverbSizeControl.value = Math.round(state.mixer.reverbSize * 100);
  dom.reverbSizeValue.textContent = `${Math.round(state.mixer.reverbSize * 100)}%`;
  dom.reverbDampingControl.value = Math.round(state.mixer.reverbDamping * 100);
  dom.reverbDampingValue.textContent = `${Math.round(state.mixer.reverbDamping * 100)}%`;
  dom.panControl.value = Math.round(state.mixer.pan * 100);
  dom.panValue.textContent = formatPan(state.mixer.pan);
  dom.widthControl.value = Math.round(state.mixer.width * 100);
  dom.widthValue.textContent = `${Math.round(state.mixer.width * 100)}%`;
  dom.spaceDelayControl.value = Math.round(state.mixer.spaceDelayMs);
  dom.spaceDelayValue.textContent = `${Math.round(state.mixer.spaceDelayMs)} ms`;
  dom.spaceReadout.textContent = state.mixer.bypass ? t("bypassed") : `${t("widthLabel")} ${Math.round(state.mixer.width * 100)}%`;
}

function applyMixerSettings() {
  if (audio.mixerProcessor) {
    audio.mixerProcessor.setSettings(state.mixer);
  }
  drawEqCurve();
  drawSpectrum();
  updateMixerReadouts();
}

function setEqBand(index, gain) {
  state.eqSelectedIndex = clamp(index, 0, EQ_BANDS.length - 1);
  state.mixer.eq[state.eqSelectedIndex] = clamp(gain, -12, 12);
  applyMixerSettings();
}

function setEqPreset(values) {
  state.mixer.eq = EQ_BANDS.map((_, index) => clamp(values[index] || 0, -12, 12));
  applyMixerSettings();
}

function setSpacePreset(values) {
  Object.assign(state.mixer, values);
  state.mixer.reverbMix = clamp(state.mixer.reverbMix, 0, 1);
  state.mixer.reverbSize = clamp(state.mixer.reverbSize, 0, 1);
  state.mixer.reverbDamping = clamp(state.mixer.reverbDamping, 0, 1);
  state.mixer.pan = clamp(state.mixer.pan, -1, 1);
  state.mixer.width = clamp(state.mixer.width, 0, 2);
  state.mixer.spaceDelayMs = clamp(state.mixer.spaceDelayMs, 0, 35);
  applyMixerSettings();
}

function eqIndexFromPointer(event) {
  const rect = dom.eqCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const padLeft = 48;
  const padRight = 20;
  const padTop = 22;
  const padBottom = 36;
  const plotWidth = rect.width - padLeft - padRight;
  const plotHeight = rect.height - padTop - padBottom;
  let bestIndex = 0;
  let bestDistance = Infinity;

  EQ_BANDS.forEach((band, index) => {
    const pointX = xForEqFrequency(band.frequency, padLeft, plotWidth);
    const pointY = yForEqGain(state.mixer.eq[index], padTop, plotHeight);
    const distance = Math.hypot(x - pointX, y - pointY);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function updateEqFromPointer(event) {
  const rect = dom.eqCanvas.getBoundingClientRect();
  const padTop = 22;
  const padBottom = 36;
  const plotHeight = rect.height - padTop - padBottom;
  const gain = gainFromEqY(event.clientY - rect.top, padTop, plotHeight);
  setEqBand(state.eqDraggingIndex ?? state.eqSelectedIndex, gain);
}

function colourFromPointer(event) {
  const rect = dom.colorWheel.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  const radius = size * 0.47;
  const distance = Math.sqrt(x * x + y * y);
  const saturation = clamp(distance / radius, 0, 1);
  const hue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  updateStateFromColour(hue, saturation);
}

function createPrng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

class NoiseGenerator {
  constructor(sampleRate, seed = Date.now()) {
    this.sampleRate = sampleRate;
    this.random = createPrng(seed);
    this.pinkB0 = 0;
    this.pinkB1 = 0;
    this.pinkB2 = 0;
    this.pinkB3 = 0;
    this.pinkB4 = 0;
    this.pinkB5 = 0;
    this.pinkB6 = 0;
    this.brown = 0;
    this.greenLow = 0;
    this.greenBand = 0;
    this.lastWhite = 0;
    this.lastWhite2 = 0;
    this.greenLowAlpha = this.onePoleAlpha(220);
    this.greenBandAlpha = this.onePoleAlpha(1800);
  }

  onePoleAlpha(frequency) {
    return 1 - Math.exp((-2 * Math.PI * frequency) / this.sampleRate);
  }

  nextBases() {
    const white = this.random() * 2 - 1;

    this.pinkB0 = 0.99886 * this.pinkB0 + white * 0.0555179;
    this.pinkB1 = 0.99332 * this.pinkB1 + white * 0.0750759;
    this.pinkB2 = 0.969 * this.pinkB2 + white * 0.153852;
    this.pinkB3 = 0.8665 * this.pinkB3 + white * 0.3104856;
    this.pinkB4 = 0.55 * this.pinkB4 + white * 0.5329522;
    this.pinkB5 = -0.7616 * this.pinkB5 - white * 0.016898;
    const pink =
      (this.pinkB0 +
        this.pinkB1 +
        this.pinkB2 +
        this.pinkB3 +
        this.pinkB4 +
        this.pinkB5 +
        this.pinkB6 +
        white * 0.5362) *
      0.11;
    this.pinkB6 = white * 0.115926;

    this.brown = (this.brown + 0.026 * white) / 1.026;
    const brown = this.brown * 3.2;
    const blue = (white - this.lastWhite) * 0.72;
    const violet = (white - 2 * this.lastWhite + this.lastWhite2) * 0.33;

    this.greenLow += this.greenLowAlpha * (white - this.greenLow);
    const highPassed = white - this.greenLow;
    this.greenBand += this.greenBandAlpha * (highPassed - this.greenBand);
    const green = this.greenBand * 2.15;

    this.lastWhite2 = this.lastWhite;
    this.lastWhite = white;

    return {
      white: white * 0.72,
      pink,
      brown,
      green,
      blue,
      violet,
    };
  }

  nextSample(mix) {
    const bases = this.nextBases();
    let sample = 0;
    for (const key of MIX_KEYS) {
      sample += (mix[key] || 0) * bases[key];
    }
    return Math.tanh(sample * 0.9) * 0.76;
  }
}

class BiquadFilter {
  constructor(sampleRate, band, gainDb = 0) {
    this.sampleRate = sampleRate;
    this.band = band;
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.setGain(gainDb);
  }

  setGain(gainDb) {
    this.gainDb = gainDb;
    this.updateCoefficients();
  }

  updateCoefficients() {
    if (Math.abs(this.gainDb) < 0.001) {
      this.b0 = 1;
      this.b1 = 0;
      this.b2 = 0;
      this.a1 = 0;
      this.a2 = 0;
      return;
    }

    const frequency = clamp(this.band.frequency, 20, this.sampleRate * 0.45);
    const w0 = (2 * Math.PI * frequency) / this.sampleRate;
    const cosW0 = Math.cos(w0);
    const sinW0 = Math.sin(w0);
    const a = Math.pow(10, this.gainDb / 40);
    const sqrtA = Math.sqrt(a);
    const q = this.band.q || 1;
    let b0;
    let b1;
    let b2;
    let a0;
    let a1;
    let a2;

    if (this.band.type === "lowshelf" || this.band.type === "highshelf") {
      const alpha = sinW0 / 2 * Math.sqrt(2);

      if (this.band.type === "lowshelf") {
        b0 = a * ((a + 1) - (a - 1) * cosW0 + 2 * sqrtA * alpha);
        b1 = 2 * a * ((a - 1) - (a + 1) * cosW0);
        b2 = a * ((a + 1) - (a - 1) * cosW0 - 2 * sqrtA * alpha);
        a0 = (a + 1) + (a - 1) * cosW0 + 2 * sqrtA * alpha;
        a1 = -2 * ((a - 1) + (a + 1) * cosW0);
        a2 = (a + 1) + (a - 1) * cosW0 - 2 * sqrtA * alpha;
      } else {
        b0 = a * ((a + 1) + (a - 1) * cosW0 + 2 * sqrtA * alpha);
        b1 = -2 * a * ((a - 1) + (a + 1) * cosW0);
        b2 = a * ((a + 1) + (a - 1) * cosW0 - 2 * sqrtA * alpha);
        a0 = (a + 1) - (a - 1) * cosW0 + 2 * sqrtA * alpha;
        a1 = 2 * ((a - 1) - (a + 1) * cosW0);
        a2 = (a + 1) - (a - 1) * cosW0 - 2 * sqrtA * alpha;
      }
    } else {
      const alpha = sinW0 / (2 * q);
      b0 = 1 + alpha * a;
      b1 = -2 * cosW0;
      b2 = 1 - alpha * a;
      a0 = 1 + alpha / a;
      a1 = -2 * cosW0;
      a2 = 1 - alpha / a;
    }

    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = a1 / a0;
    this.a2 = a2 / a0;
  }

  process(sample) {
    const output = this.b0 * sample + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = sample;
    this.y2 = this.y1;
    this.y1 = output;
    return output;
  }
}

class VariableDelayLine {
  constructor(maxSamples) {
    this.buffer = new Float32Array(Math.max(2, Math.ceil(maxSamples) + 2));
    this.index = 0;
  }

  process(input, delaySamples) {
    const delay = clamp(Math.round(delaySamples), 1, this.buffer.length - 1);
    let readIndex = this.index - delay;
    if (readIndex < 0) {
      readIndex += this.buffer.length;
    }
    const delayed = this.buffer[readIndex];
    this.buffer[this.index] = input;
    this.index = (this.index + 1) % this.buffer.length;
    return delayed;
  }
}

class StereoReverb {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this.leftBases = [29.7, 37.1, 41.1, 53.3];
    this.rightBases = [31.1, 34.9, 43.7, 59.9];
    const maxSamples = Math.ceil(sampleRate * 0.13);
    this.leftLines = this.leftBases.map(() => new VariableDelayLine(maxSamples));
    this.rightLines = this.rightBases.map(() => new VariableDelayLine(maxSamples));
    this.leftDamp = this.leftBases.map(() => 0);
    this.rightDamp = this.rightBases.map(() => 0);
  }

  process(left, right, settings) {
    const wet = clamp(settings.reverbMix, 0, 1);
    if (wet <= 0.001 || settings.bypass) {
      return [left, right];
    }

    const size = clamp(settings.reverbSize, 0, 1);
    const damping = clamp(settings.reverbDamping, 0, 1);
    const feedback = 0.48 + size * 0.38;
    const roomScale = 0.55 + size * 1.05;
    const dampMove = 1 - damping * 0.78;
    let wetLeft = 0;
    let wetRight = 0;

    for (let i = 0; i < this.leftLines.length; i += 1) {
      const leftDelay = (this.leftBases[i] * roomScale * this.sampleRate) / 1000;
      const rightDelay = (this.rightBases[i] * roomScale * this.sampleRate) / 1000;
      const delayedLeft = this.leftLines[i].process(left + this.leftDamp[i] * feedback, leftDelay);
      const delayedRight = this.rightLines[i].process(right + this.rightDamp[i] * feedback, rightDelay);

      this.leftDamp[i] += (delayedLeft - this.leftDamp[i]) * dampMove;
      this.rightDamp[i] += (delayedRight - this.rightDamp[i]) * dampMove;
      wetLeft += this.leftDamp[i];
      wetRight += this.rightDamp[i];
    }

    wetLeft /= this.leftLines.length;
    wetRight /= this.rightLines.length;
    const cross = 0.18 + size * 0.12;
    const reverbLeft = wetLeft * (1 - cross) + wetRight * cross;
    const reverbRight = wetRight * (1 - cross) + wetLeft * cross;
    const dry = 1 - wet * 0.72;

    return [
      left * dry + reverbLeft * wet * 0.9,
      right * dry + reverbRight * wet * 0.9,
    ];
  }
}

class MixerProcessor {
  constructor(sampleRate, settings) {
    this.sampleRate = sampleRate;
    this.filters = EQ_BANDS.map((band, index) => new BiquadFilter(sampleRate, band, settings.eq[index] || 0));
    this.widthDelay = new VariableDelayLine(Math.ceil(sampleRate * 0.05));
    this.reverb = new StereoReverb(sampleRate);
    this.setSettings(settings);
  }

  setSettings(settings) {
    this.settings = {
      bypass: Boolean(settings.bypass),
      eq: [...settings.eq],
      reverbMix: clamp(settings.reverbMix, 0, 1),
      reverbSize: clamp(settings.reverbSize, 0, 1),
      reverbDamping: clamp(settings.reverbDamping, 0, 1),
      pan: clamp(settings.pan, -1, 1),
      width: clamp(settings.width, 0, 2),
      spaceDelayMs: clamp(settings.spaceDelayMs, 0, 35),
    };
    this.filters.forEach((filter, index) => {
      filter.setGain(this.settings.eq[index] || 0);
    });
  }

  applyEq(sample) {
    return this.filters.reduce((current, filter) => filter.process(current), sample);
  }

  applySpatial(sample) {
    const delaySamples = (this.settings.spaceDelayMs * this.sampleRate) / 1000;
    const delayed = this.widthDelay.process(sample, Math.max(1, delaySamples));
    const side = (sample - delayed) * 0.46 * this.settings.width;
    let left = sample + side;
    let right = sample - side;
    const angle = (this.settings.pan + 1) * Math.PI / 4;
    const leftGain = Math.cos(angle) * Math.SQRT2;
    const rightGain = Math.sin(angle) * Math.SQRT2;

    left *= leftGain;
    right *= rightGain;
    return [left, right];
  }

  process(sample) {
    if (this.settings.bypass) {
      return [sample, sample];
    }

    const eqSample = this.applyEq(sample);
    const [spaceLeft, spaceRight] = this.applySpatial(eqSample);
    const [wetLeft, wetRight] = this.reverb.process(spaceLeft, spaceRight, this.settings);
    return [softLimit(wetLeft), softLimit(wetRight)];
  }
}

async function togglePlayback() {
  if (!audio.context) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audio.context = new AudioContextClass({ latencyHint: "interactive" });
    audio.generator = new NoiseGenerator(audio.context.sampleRate);
    audio.mixerProcessor = new MixerProcessor(audio.context.sampleRate, state.mixer);
    audio.processor = audio.context.createScriptProcessor(2048, 0, 2);
    audio.processor.onaudioprocess = renderLiveAudio;
    audio.processor.connect(audio.context.destination);
  }

  if (audio.context.state === "suspended") {
    await audio.context.resume();
  }

  audio.isPlaying = !audio.isPlaying;
  audio.targetVolume = audio.isPlaying ? Number(dom.volumeControl.value) / 100 : 0;
  updateAudioLabels();
}

function renderLiveAudio(event) {
  const outputLeft = event.outputBuffer.getChannelData(0);
  const outputRight = event.outputBuffer.getChannelData(1);
  let rms = 0;

  for (let i = 0; i < outputLeft.length; i += 1) {
    for (const key of MIX_KEYS) {
      audio.currentMix[key] += (audio.targetMix[key] - audio.currentMix[key]) * 0.0018;
    }
    audio.currentVolume += (audio.targetVolume - audio.currentVolume) * 0.002;

    const sample = audio.generator.nextSample(audio.currentMix) * audio.currentVolume;
    const [left, right] = audio.mixerProcessor.process(sample);
    outputLeft[i] = left;
    outputRight[i] = right;
    rms += (left * left + right * right) * 0.5;
  }

  audio.meter = Math.sqrt(rms / outputLeft.length);
}

function updateMeter() {
  const db = audio.meter > 0.00001 ? 20 * Math.log10(audio.meter) : -90;
  const width = clamp((db + 60) / 54, 0, 1) * 100;
  dom.levelMeter.style.width = `${width}%`;
  dom.meterValue.textContent = audio.isPlaying ? `${Math.round(db)} dB` : "0 dB";
  requestAnimationFrame(updateMeter);
}

function setVolumeFromInput() {
  const volume = Number(dom.volumeControl.value);
  dom.volumeValue.textContent = `${volume}%`;
  if (audio.isPlaying) {
    audio.targetVolume = volume / 100;
  }
}

function getAudioDataInfo(input) {
  if (input?.left && input?.right) {
    const length = Math.min(input.left.length, input.right.length);
    return {
      channels: 2,
      length,
      sampleAt(index, channel) {
        return channel === 0 ? input.left[index] : input.right[index];
      },
    };
  }

  return {
    channels: 1,
    length: input.length,
    sampleAt(index) {
      return input[index];
    },
  };
}

function writeString(view, offset, value) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

function encodeWav16(samples, sampleRate) {
  const audioData = getAudioDataInfo(samples);
  const bytesPerSample = 2;
  const dataBytes = audioData.length * audioData.channels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, audioData.channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * audioData.channels * bytesPerSample, true);
  view.setUint16(32, audioData.channels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let i = 0; i < audioData.length; i += 1) {
    for (let channel = 0; channel < audioData.channels; channel += 1) {
      const value = clamp(audioData.sampleAt(i, channel), -1, 1);
      view.setInt16(offset, value < 0 ? value * 32768 : value * 32767, true);
      offset += bytesPerSample;
    }
  }

  return { buffer, mime: "audio/wav", extension: "wav" };
}

function encodeWavFloat32(samples, sampleRate) {
  const audioData = getAudioDataInfo(samples);
  const bytesPerSample = 4;
  const dataBytes = audioData.length * audioData.channels * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true);
  view.setUint16(22, audioData.channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * audioData.channels * bytesPerSample, true);
  view.setUint16(32, audioData.channels * bytesPerSample, true);
  view.setUint16(34, 32, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let i = 0; i < audioData.length; i += 1) {
    for (let channel = 0; channel < audioData.channels; channel += 1) {
      view.setFloat32(offset, clamp(audioData.sampleAt(i, channel), -1, 1), true);
      offset += bytesPerSample;
    }
  }

  return { buffer, mime: "audio/wav", extension: "wav" };
}

function writeExtended80(view, offset, value) {
  if (value === 0) {
    for (let i = 0; i < 10; i += 1) {
      view.setUint8(offset + i, 0);
    }
    return;
  }

  const sign = value < 0 ? 0x8000 : 0;
  const abs = Math.abs(value);
  const exponent = Math.floor(Math.log2(abs));
  const fraction = abs / Math.pow(2, exponent);
  const biasedExponent = exponent + 16383;
  const mantissa = fraction * Math.pow(2, 63);
  const high = Math.floor(mantissa / Math.pow(2, 32));
  const low = Math.floor(mantissa - high * Math.pow(2, 32));

  view.setUint16(offset, sign | biasedExponent, false);
  view.setUint32(offset + 2, high, false);
  view.setUint32(offset + 6, low, false);
}

function encodeAiff16(samples, sampleRate) {
  const audioData = getAudioDataInfo(samples);
  const bytesPerSample = 2;
  const dataBytes = audioData.length * audioData.channels * bytesPerSample;
  const buffer = new ArrayBuffer(54 + dataBytes);
  const view = new DataView(buffer);

  writeString(view, 0, "FORM");
  view.setUint32(4, 46 + dataBytes, false);
  writeString(view, 8, "AIFF");
  writeString(view, 12, "COMM");
  view.setUint32(16, 18, false);
  view.setUint16(20, audioData.channels, false);
  view.setUint32(22, audioData.length, false);
  view.setUint16(26, 16, false);
  writeExtended80(view, 28, sampleRate);
  writeString(view, 38, "SSND");
  view.setUint32(42, dataBytes + 8, false);
  view.setUint32(46, 0, false);
  view.setUint32(50, 0, false);

  let offset = 54;
  for (let i = 0; i < audioData.length; i += 1) {
    for (let channel = 0; channel < audioData.channels; channel += 1) {
      const value = clamp(audioData.sampleAt(i, channel), -1, 1);
      view.setInt16(offset, value < 0 ? value * 32768 : value * 32767, false);
      offset += bytesPerSample;
    }
  }

  return { buffer, mime: "audio/aiff", extension: "aiff" };
}

function encodeAu16(samples, sampleRate) {
  const audioData = getAudioDataInfo(samples);
  const bytesPerSample = 2;
  const dataBytes = audioData.length * audioData.channels * bytesPerSample;
  const buffer = new ArrayBuffer(24 + dataBytes);
  const view = new DataView(buffer);

  view.setUint32(0, 0x2e736e64, false);
  view.setUint32(4, 24, false);
  view.setUint32(8, dataBytes, false);
  view.setUint32(12, 3, false);
  view.setUint32(16, sampleRate, false);
  view.setUint32(20, audioData.channels, false);

  let offset = 24;
  for (let i = 0; i < audioData.length; i += 1) {
    for (let channel = 0; channel < audioData.channels; channel += 1) {
      const value = clamp(audioData.sampleAt(i, channel), -1, 1);
      view.setInt16(offset, value < 0 ? value * 32768 : value * 32767, false);
      offset += bytesPerSample;
    }
  }

  return { buffer, mime: "audio/basic", extension: "au" };
}

function encoderForFormat(format) {
  if (format === "wav32") {
    return encodeWavFloat32;
  }
  if (format === "aiff16") {
    return encodeAiff16;
  }
  if (format === "au16") {
    return encodeAu16;
  }
  return encodeWav16;
}

function sanitizeFilename(value) {
  return (value || "noise-colour")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function getExportSeconds() {
  const raw = Number(dom.durationInput.value);
  const unit = dom.durationUnit.value;
  const seconds = unit === "minutes" ? raw * 60 : raw;
  return clamp(Number.isFinite(seconds) ? seconds : 30, 1, 600);
}

function normalizeSamples(samples) {
  const audioData = getAudioDataInfo(samples);
  let peak = 0;
  for (let i = 0; i < audioData.length; i += 1) {
    for (let channel = 0; channel < audioData.channels; channel += 1) {
      peak = Math.max(peak, Math.abs(audioData.sampleAt(i, channel)));
    }
  }

  if (peak <= 0) {
    return;
  }

  const gain = Math.min(8, 0.89125 / peak);
  if (samples?.left && samples?.right) {
    for (let i = 0; i < audioData.length; i += 1) {
      samples.left[i] *= gain;
      samples.right[i] *= gain;
    }
  } else {
    for (let i = 0; i < samples.length; i += 1) {
      samples[i] *= gain;
    }
  }
}

async function exportAudio() {
  const seconds = getExportSeconds();
  const sampleRate = Number(dom.sampleRateSelect.value);
  const totalSamples = Math.round(seconds * sampleRate);
  const generator = new NoiseGenerator(sampleRate, Date.now() ^ Math.round(state.hue * 1000));
  const samples = {
    left: new Float32Array(totalSamples),
    right: new Float32Array(totalSamples),
  };
  const mixerProcessor = new MixerProcessor(sampleRate, state.mixer);
  const mix = { ...state.mix };
  const renderChunk = 16384;
  const level = Number(dom.volumeControl.value) / 100 || 0.36;

  dom.exportButton.disabled = true;
  state.exportStatusKey = "generating";
  dom.exportState.textContent = t(state.exportStatusKey);
  dom.exportProgress.style.width = "0%";
  dom.downloadLink.hidden = true;

  for (let offset = 0; offset < totalSamples; offset += renderChunk) {
    const end = Math.min(totalSamples, offset + renderChunk);
    for (let i = offset; i < end; i += 1) {
      const mono = generator.nextSample(mix) * level;
      const [left, right] = mixerProcessor.process(mono);
      samples.left[i] = left;
      samples.right[i] = right;
    }
    const progress = Math.round((end / totalSamples) * 74);
    dom.exportProgress.style.width = `${progress}%`;
    dom.exportState.textContent = `${Math.round((end / totalSamples) * 100)}%`;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  if (dom.normalizeExport.checked) {
    normalizeSamples(samples);
  }

  state.exportStatusKey = "encoding";
  dom.exportState.textContent = t(state.exportStatusKey);
  dom.exportProgress.style.width = "86%";
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  const encoder = encoderForFormat(dom.formatSelect.value);
  const encoded = encoder(samples, sampleRate);
  const blob = new Blob([encoded.buffer], { type: encoded.mime });
  const filename = `${sanitizeFilename(dom.filenameInput.value)}-${state.dominant.id}-mix-${Math.round(seconds)}s.${encoded.extension}`;

  if (state.lastObjectUrl) {
    URL.revokeObjectURL(state.lastObjectUrl);
  }

  state.lastObjectUrl = URL.createObjectURL(blob);
  dom.downloadLink.href = state.lastObjectUrl;
  dom.downloadLink.download = filename;
  dom.downloadLink.hidden = false;
  state.lastDownloadFilename = filename;
  dom.downloadLink.textContent = `${t("downloadPrefix")} ${filename}`;
  dom.exportProgress.style.width = "100%";
  state.exportStatusKey = "generated";
  dom.exportState.textContent = t(state.exportStatusKey);
  dom.downloadLink.click();
  dom.exportButton.disabled = false;
}

function bindEvents() {
  dom.languageToggle.addEventListener("click", () => {
    state.language = state.language === "zh" ? "en" : "zh";
    localStorage.setItem("noisePaletteLanguage", state.language);
    applyLanguage();
  });

  dom.colorWheel.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    dom.colorWheel.setPointerCapture(event.pointerId);
    colourFromPointer(event);
  });

  dom.colorWheel.addEventListener("pointermove", (event) => {
    if (state.dragging) {
      colourFromPointer(event);
    }
  });

  dom.colorWheel.addEventListener("pointerup", (event) => {
    state.dragging = false;
    dom.colorWheel.releasePointerCapture(event.pointerId);
  });

  dom.colorWheel.addEventListener("keydown", (event) => {
    const hueStep = event.shiftKey ? 10 : 3;
    const satStep = event.shiftKey ? 0.08 : 0.03;

    if (event.key === "ArrowLeft") {
      updateStateFromColour(state.hue - hueStep, state.saturation);
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      updateStateFromColour(state.hue + hueStep, state.saturation);
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      updateStateFromColour(state.hue, state.saturation + satStep);
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      updateStateFromColour(state.hue, state.saturation - satStep);
      event.preventDefault();
    }
  });

  dom.playToggle.addEventListener("click", () => {
    togglePlayback().catch(() => {
      dom.audioState.textContent = t("startFailed");
    });
  });

  dom.volumeControl.addEventListener("input", setVolumeFromInput);

  dom.resetButton.addEventListener("click", () => {
    updateStateFromColour(0, 0);
  });

  dom.randomButton.addEventListener("click", () => {
    updateStateFromColour(Math.random() * 360, 0.45 + Math.random() * 0.55);
  });

  dom.exportButton.addEventListener("click", () => {
    exportAudio().catch((error) => {
      state.exportStatusKey = "exportFailed";
      dom.exportState.textContent = t(state.exportStatusKey);
      dom.exportButton.disabled = false;
      console.error(error);
    });
  });

  dom.mixerBypass.addEventListener("change", () => {
    state.mixer.bypass = dom.mixerBypass.checked;
    applyMixerSettings();
  });

  dom.eqCanvas.addEventListener("pointerdown", (event) => {
    state.eqDraggingIndex = eqIndexFromPointer(event);
    state.eqSelectedIndex = state.eqDraggingIndex;
    dom.eqCanvas.setPointerCapture(event.pointerId);
    updateEqFromPointer(event);
  });

  dom.eqCanvas.addEventListener("pointermove", (event) => {
    if (state.eqDraggingIndex !== null) {
      updateEqFromPointer(event);
    }
  });

  dom.eqCanvas.addEventListener("pointerup", (event) => {
    state.eqDraggingIndex = null;
    dom.eqCanvas.releasePointerCapture(event.pointerId);
  });

  dom.eqCanvas.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      state.eqSelectedIndex = clamp(state.eqSelectedIndex - 1, 0, EQ_BANDS.length - 1);
      applyMixerSettings();
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      state.eqSelectedIndex = clamp(state.eqSelectedIndex + 1, 0, EQ_BANDS.length - 1);
      applyMixerSettings();
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      setEqBand(state.eqSelectedIndex, state.mixer.eq[state.eqSelectedIndex] + (event.shiftKey ? 2 : 0.5));
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      setEqBand(state.eqSelectedIndex, state.mixer.eq[state.eqSelectedIndex] - (event.shiftKey ? 2 : 0.5));
      event.preventDefault();
    }
  });

  dom.eqResetButton.addEventListener("click", () => setEqPreset([0, 0, 0, 0, 0]));
  dom.eqSmileButton.addEventListener("click", () => setEqPreset([4, 1.5, -2.5, 1.5, 4]));
  dom.eqWarmButton.addEventListener("click", () => setEqPreset([4, 2, -0.5, -2, -3]));

  dom.reverbMixControl.addEventListener("input", () => {
    state.mixer.reverbMix = Number(dom.reverbMixControl.value) / 100;
    applyMixerSettings();
  });

  dom.reverbSizeControl.addEventListener("input", () => {
    state.mixer.reverbSize = Number(dom.reverbSizeControl.value) / 100;
    applyMixerSettings();
  });

  dom.reverbDampingControl.addEventListener("input", () => {
    state.mixer.reverbDamping = Number(dom.reverbDampingControl.value) / 100;
    applyMixerSettings();
  });

  dom.panControl.addEventListener("input", () => {
    state.mixer.pan = Number(dom.panControl.value) / 100;
    applyMixerSettings();
  });

  dom.widthControl.addEventListener("input", () => {
    state.mixer.width = Number(dom.widthControl.value) / 100;
    applyMixerSettings();
  });

  dom.spaceDelayControl.addEventListener("input", () => {
    state.mixer.spaceDelayMs = Number(dom.spaceDelayControl.value);
    applyMixerSettings();
  });

  dom.spaceResetButton.addEventListener("click", () => {
    setSpacePreset({
      reverbMix: 0.18,
      reverbSize: 0.46,
      reverbDamping: 0.42,
      pan: 0,
      width: 1,
      spaceDelayMs: 14,
    });
  });

  dom.spaceWideButton.addEventListener("click", () => {
    setSpacePreset({
      reverbMix: 0.3,
      reverbSize: 0.68,
      reverbDamping: 0.38,
      pan: 0,
      width: 1.65,
      spaceDelayMs: 22,
    });
  });

  dom.spaceNearButton.addEventListener("click", () => {
    setSpacePreset({
      reverbMix: 0.04,
      reverbSize: 0.16,
      reverbDamping: 0.68,
      pan: 0,
      width: 0.62,
      spaceDelayMs: 4,
    });
  });

  window.addEventListener("resize", renderAll);
}

function init() {
  root.style.setProperty("--accent", "#2f8c67");
  renderEqBandControls();
  setVolumeFromInput();
  bindEvents();
  updateStateFromColour(state.hue, state.saturation);
  applyLanguage();
  updateMeter();
}

init();
