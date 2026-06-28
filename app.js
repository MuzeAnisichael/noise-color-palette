"use strict";

const ANCHORS = [
  { id: "brown", labelZh: "棕/红", labelEn: "Brown/Red", hue: 18, beta: -1.85, centerFrequency: 95, bandGainDb: 7.5, bandWidth: 0.9, notchFrequency: 1150, notchCutDb: 0, notchWidth: 0.9, edgeGainDb: 0, color: "#99542d" },
  { id: "yellow", labelZh: "黄色中低", labelEn: "Yellow Low-Mid", hue: 62, beta: -0.38, centerFrequency: 420, bandGainDb: 7.2, bandWidth: 0.86, notchFrequency: 1150, notchCutDb: 0, notchWidth: 0.9, edgeGainDb: 0, color: "#c39a28" },
  { id: "green", labelZh: "绿色强中频", labelEn: "Green Focus", hue: 122, beta: 0, centerFrequency: 1180, bandGainDb: 16.2, bandWidth: 0.5, notchFrequency: 1150, notchCutDb: 0, notchWidth: 0.9, edgeGainDb: 0, color: "#37a46d" },
  { id: "cyan", labelZh: "青色存在感", labelEn: "Cyan Presence", hue: 178, beta: 0.28, centerFrequency: 2600, bandGainDb: 8.2, bandWidth: 0.78, notchFrequency: 1150, notchCutDb: 0, notchWidth: 0.9, edgeGainDb: 0, color: "#2a9a9a" },
  { id: "blue", labelZh: "蓝色明亮", labelEn: "Blue Bright", hue: 222, beta: 0.9, centerFrequency: 5200, bandGainDb: 7.4, bandWidth: 0.82, notchFrequency: 1150, notchCutDb: 0, notchWidth: 0.9, edgeGainDb: 0, color: "#2f82c6" },
  { id: "violet", labelZh: "紫色空气感", labelEn: "Violet Air", hue: 282, beta: 1.7, centerFrequency: 11200, bandGainDb: 6.8, bandWidth: 0.92, notchFrequency: 1150, notchCutDb: 0, notchWidth: 0.9, edgeGainDb: 0, color: "#7d57bd" },
  { id: "red-violet", labelZh: "红紫凹陷", labelEn: "Red-Violet Scoop", hue: 335, beta: -0.05, centerFrequency: 1150, bandGainDb: 0.6, bandWidth: 0.95, notchFrequency: 1150, notchCutDb: 15.5, notchWidth: 0.82, edgeGainDb: 7.8, color: "#d85aa5" },
];

const MAX_FOCUS_GAIN_DB = 16.5;
const MAX_SCOOP_CUT_DB = 16;

const EQ_BANDS = [
  { id: "sub", label: "80 Hz", frequency: 80, type: "lowshelf", q: 0.7 },
  { id: "lowMid", label: "250 Hz", frequency: 250, type: "peaking", q: 1.05 },
  { id: "mid", label: "1 kHz", frequency: 1000, type: "peaking", q: 1.05 },
  { id: "presence", label: "4 kHz", frequency: 4000, type: "peaking", q: 1.05 },
  { id: "air", label: "12 kHz", frequency: 12000, type: "highshelf", q: 0.7 },
];

const MIX_KEYS = ["strength", "beta", "centerFrequency", "bandGainDb", "bandWidth", "notchFrequency", "notchCutDb", "notchWidth", "edgeGainDb"];
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
    mixLegendAria: "频谱塑形指标",
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
    audioNoiseAria: "音频噪化",
    feature3: "Feature 3",
    audioNoiseTitle: "音频噪化",
    sourceAudio: "源音频",
    sourceFile: "文件",
    sourceDuration: "时长",
    sourceLevel: "原音量",
    noiseLevel: "噪声量",
    outputGain: "输出增益",
    renderNoised: "生成噪化音频",
    noAudioFile: "未选择音频",
    decodingAudio: "解码中",
    audioLoaded: "已载入",
    processingAudio: "处理中",
    processedAudio: "已生成",
    audioDecodeFailed: "解码失败",
    audioNoiseFailed: "处理失败",
    downloadNoisedRecent: "下载最近噪化音频",
    noisedPreview: "噪化音频预览",
    audioLossTitle: "音频全损",
    feature4: "Feature 4",
    lossPreset: "全损预设",
    lossPresetMeme: "经典全损",
    lossPresetPhone: "电话转载",
    lossPresetDeepfried: "压爆过载",
    lossPresetBitcrush: "低位塌缩",
    lossIntensity: "损坏强度",
    lossBits: "位深",
    lossCrushRate: "塌缩采样",
    lossBandwidth: "带宽保留",
    lossDrive: "压爆",
    renderLoss: "生成全损音频",
    audioLossFailed: "全损失败",
    downloadLossRecent: "下载最近全损音频",
    lossPreview: "全损音频预览",
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
    mixLegendAria: "Spectrum shaping metrics",
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
    audioNoiseAria: "Audio noising",
    feature3: "Feature 3",
    audioNoiseTitle: "Audio Noising",
    sourceAudio: "Source audio",
    sourceFile: "File",
    sourceDuration: "Duration",
    sourceLevel: "Source level",
    noiseLevel: "Noise level",
    outputGain: "Output gain",
    renderNoised: "Generate noised audio",
    noAudioFile: "No audio selected",
    decodingAudio: "Decoding",
    audioLoaded: "Loaded",
    processingAudio: "Processing",
    processedAudio: "Generated",
    audioDecodeFailed: "Decode failed",
    audioNoiseFailed: "Processing failed",
    downloadNoisedRecent: "Download latest noised audio",
    noisedPreview: "Noised audio preview",
    audioLossTitle: "Audio Lossifier",
    feature4: "Feature 4",
    lossPreset: "Loss preset",
    lossPresetMeme: "Classic loss",
    lossPresetPhone: "Phone repost",
    lossPresetDeepfried: "Deep fried",
    lossPresetBitcrush: "Bit collapse",
    lossIntensity: "Damage",
    lossBits: "Bit depth",
    lossCrushRate: "Crush rate",
    lossBandwidth: "Bandwidth kept",
    lossDrive: "Drive",
    renderLoss: "Generate lossified audio",
    audioLossFailed: "Loss failed",
    downloadLossRecent: "Download latest lossified audio",
    lossPreview: "Lossified audio preview",
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
  audioFileInput: document.querySelector("#audioFileInput"),
  audioNoiseState: document.querySelector("#audioNoiseState"),
  sourceFileName: document.querySelector("#sourceFileName"),
  sourceDurationValue: document.querySelector("#sourceDurationValue"),
  sourceLevelControl: document.querySelector("#sourceLevelControl"),
  sourceLevelValue: document.querySelector("#sourceLevelValue"),
  noiseLevelControl: document.querySelector("#noiseLevelControl"),
  noiseLevelValue: document.querySelector("#noiseLevelValue"),
  noiseOutputGainControl: document.querySelector("#noiseOutputGainControl"),
  noiseOutputGainValue: document.querySelector("#noiseOutputGainValue"),
  renderNoisedButton: document.querySelector("#renderNoisedButton"),
  audioNoiseProgress: document.querySelector("#audioNoiseProgress"),
  noisedPreview: document.querySelector("#noisedPreview"),
  noisedDownloadLink: document.querySelector("#noisedDownloadLink"),
  audioLossState: document.querySelector("#audioLossState"),
  lossPresetSelect: document.querySelector("#lossPresetSelect"),
  lossIntensityControl: document.querySelector("#lossIntensityControl"),
  lossIntensityValue: document.querySelector("#lossIntensityValue"),
  lossBitsControl: document.querySelector("#lossBitsControl"),
  lossBitsValue: document.querySelector("#lossBitsValue"),
  lossCrushRateControl: document.querySelector("#lossCrushRateControl"),
  lossCrushRateValue: document.querySelector("#lossCrushRateValue"),
  lossBandwidthControl: document.querySelector("#lossBandwidthControl"),
  lossBandwidthValue: document.querySelector("#lossBandwidthValue"),
  lossDriveControl: document.querySelector("#lossDriveControl"),
  lossDriveValue: document.querySelector("#lossDriveValue"),
  renderLossButton: document.querySelector("#renderLossButton"),
  audioLossProgress: document.querySelector("#audioLossProgress"),
  lossPreview: document.querySelector("#lossPreview"),
  lossDownloadLink: document.querySelector("#lossDownloadLink"),
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
  sourceAudio: {
    buffer: null,
    fileName: "",
    statusKey: "noAudioFile",
    lastObjectUrl: null,
    lastDownloadFilename: null,
    processing: false,
  },
  lossAudio: {
    statusKey: "noAudioFile",
    lastObjectUrl: null,
    lastDownloadFilename: null,
    processing: false,
  },
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
  decodeContext: null,
  meter: 0,
};

function createEmptyMix() {
  return {
    model: "spectral",
    strength: 0,
    beta: 0,
    effectiveBeta: 0,
    centerFrequency: 1000,
    bandGainDb: 0,
    bandWidth: 0.85,
    notchFrequency: 1150,
    notchCutDb: 0,
    notchWidth: 0.9,
    edgeGainDb: 0,
    foundation: 1,
    tiltAmount: 0,
    bandAmount: 0,
    scoopAmount: 0,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function dbToGain(db) {
  return Math.pow(10, db / 20);
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
  if (state.sourceAudio.lastDownloadFilename) {
    dom.noisedDownloadLink.textContent = `${t("downloadPrefix")} ${state.sourceAudio.lastDownloadFilename}`;
  }
  if (state.lossAudio.lastDownloadFilename) {
    dom.lossDownloadLink.textContent = `${t("downloadPrefix")} ${state.lossAudio.lastDownloadFilename}`;
  }
  updateAudioNoiseReadouts();
  updateAudioLossReadouts();
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
  const strength = Math.pow(saturation, 0.9);
  const pair = anchorPairForHue(hue);
  const t = pair.t * pair.t * (3 - 2 * pair.t);
  const beta = lerp(pair.from.beta, pair.to.beta, t);
  const logCenter = lerp(Math.log2(pair.from.centerFrequency), Math.log2(pair.to.centerFrequency), t);
  const bandGainDb = lerp(pair.from.bandGainDb, pair.to.bandGainDb, t);
  const bandWidth = lerp(pair.from.bandWidth, pair.to.bandWidth, t);
  const logNotch = lerp(Math.log2(pair.from.notchFrequency), Math.log2(pair.to.notchFrequency), t);
  const notchCutDb = lerp(pair.from.notchCutDb, pair.to.notchCutDb, t);
  const notchWidth = lerp(pair.from.notchWidth, pair.to.notchWidth, t);
  const edgeGainDb = lerp(pair.from.edgeGainDb, pair.to.edgeGainDb, t);
  const dominant = strength < 0.28
    ? { id: "white", labelZh: "白/灰", labelEn: "White/Grey", color: "#f7f7f2" }
    : pair.t <= 0.5 ? pair.from : pair.to;
  const mix = {
    model: "spectral",
    strength,
    beta,
    effectiveBeta: beta * strength,
    centerFrequency: Math.pow(2, logCenter),
    bandGainDb,
    bandWidth,
    notchFrequency: Math.pow(2, logNotch),
    notchCutDb,
    notchWidth,
    edgeGainDb,
    foundation: 1 - strength,
    tiltAmount: clamp(Math.abs(beta) * strength / 1.9, 0, 1),
    bandAmount: clamp((bandGainDb * strength) / MAX_FOCUS_GAIN_DB, 0, 1),
    scoopAmount: clamp((notchCutDb * strength) / MAX_SCOOP_CUT_DB, 0, 1),
  };

  return { mix, beta: mix.effectiveBeta, dominant };
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function anchorPairForHue(hue) {
  const sorted = [...ANCHORS].sort((a, b) => a.hue - b.hue);
  for (let i = 0; i < sorted.length; i += 1) {
    const from = sorted[i];
    const to = sorted[(i + 1) % sorted.length];
    const span = (to.hue - from.hue + 360) % 360 || 360;
    const offset = (hue - from.hue + 360) % 360;
    if (offset <= span) {
      return { from, to, t: offset / span };
    }
  }
  return { from: sorted[0], to: sorted[1], t: 0 };
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
  const strength = clamp(mix.strength || 0, 0, 1);
  const tiltPower = Math.pow(ratio, mix.beta || 0);
  const bandDistance = Math.log2(frequency / clamp(mix.centerFrequency || 1000, 35, 16000));
  const bandWidth = clamp(mix.bandWidth || 0.85, 0.45, 1.5);
  const bandShape = Math.exp(-(bandDistance * bandDistance) / (2 * bandWidth * bandWidth));
  const bandPower = Math.pow(10, ((mix.bandGainDb || 0) * bandShape) / 10);
  const notchDistance = Math.log2(frequency / clamp(mix.notchFrequency || 1150, 80, 8000));
  const notchWidth = clamp(mix.notchWidth || 0.9, 0.45, 1.6);
  const notchShape = Math.exp(-(notchDistance * notchDistance) / (2 * notchWidth * notchWidth));
  const notchPower = Math.pow(10, (-(mix.notchCutDb || 0) * notchShape) / 10);
  const edgeShape = 1 - Math.exp(-(notchDistance * notchDistance) / (2 * 1.55 * 1.55));
  const edgePower = Math.pow(10, ((mix.edgeGainDb || 0) * edgeShape) / 10);
  const colouredPower = tiltPower * bandPower * notchPower * edgePower;
  const basePower = (1 - strength) + strength * colouredPower;

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
    { id: "foundation", labelZh: "白噪基础", labelEn: "White Base", color: "#c7ccc3" },
    { id: "tilt", labelZh: "频谱斜率", labelEn: "Spectral Tilt", color: "#99542d" },
    { id: "band", labelZh: "主频带", labelEn: "Focus Band", color: state.dominant?.color || "#37a46d" },
    { id: "scoop", labelZh: "中频凹陷", labelEn: "Mid Scoop", color: "#d85aa5" },
    { id: "strength", labelZh: "染色强度", labelEn: "Colour Depth", color: "#2f8c67" },
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
    const item = items.find((entry) => entry.id === key);
    const metrics = legendMetricFor(key);
    row.querySelector("[data-legend-label]").textContent = labelFor(item);
    row.querySelector(".legend-bar span").style.background = item.color;
    row.querySelector(".legend-bar span").style.width = `${metrics.width}%`;
    row.querySelector("strong").textContent = metrics.text;
  });
}

function formatFrequency(frequency) {
  if (frequency >= 1000) {
    const value = frequency / 1000;
    return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} kHz`;
  }
  return `${Math.round(frequency)} Hz`;
}

function legendMetricFor(key) {
  if (key === "foundation") {
    const value = Math.round((1 - (state.mix.strength || 0)) * 100);
    return { width: value, text: `${value}%` };
  }
  if (key === "tilt") {
    const value = clamp(Math.round(Math.abs(state.mix.effectiveBeta || 0) / 1.9 * 100), 0, 100);
    const beta = state.mix.effectiveBeta || 0;
    return { width: value, text: `${beta > 0 ? "+" : ""}${beta.toFixed(2)}β` };
  }
  if (key === "band") {
    const value = clamp(Math.round((state.mix.bandGainDb || 0) * (state.mix.strength || 0) / MAX_FOCUS_GAIN_DB * 100), 0, 100);
    return { width: value, text: formatFrequency(state.mix.centerFrequency || 1000) };
  }
  if (key === "scoop") {
    const cut = (state.mix.notchCutDb || 0) * (state.mix.strength || 0);
    const edge = (state.mix.edgeGainDb || 0) * (state.mix.strength || 0);
    const value = clamp(Math.round(cut / MAX_SCOOP_CUT_DB * 100), 0, 100);
    const text = cut > 0.05 ? `-${Math.round(cut)}/+${Math.round(edge)} dB` : "0 dB";
    return { width: value, text };
  }
  const value = Math.round((state.mix.strength || 0) * 100);
  return { width: value, text: `${value}%` };
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

class DynamicBandPass {
  constructor(sampleRate) {
    this.sampleRate = sampleRate;
    this.lastFrequency = 0;
    this.lastWidth = 0;
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.updateCoefficients(1000, 0.85);
  }

  updateCoefficients(frequency, width) {
    const safeFrequency = clamp(frequency, 35, this.sampleRate * 0.42);
    const safeWidth = clamp(width, 0.45, 1.5);
    if (Math.abs(safeFrequency - this.lastFrequency) < 1 && Math.abs(safeWidth - this.lastWidth) < 0.01) {
      return;
    }

    this.lastFrequency = safeFrequency;
    this.lastWidth = safeWidth;
    const q = clamp(1.25 / safeWidth, 0.55, 3.2);
    const w0 = (2 * Math.PI * safeFrequency) / this.sampleRate;
    const alpha = Math.sin(w0) / (2 * q);
    const a0 = 1 + alpha;

    this.b0 = alpha / a0;
    this.b1 = 0;
    this.b2 = -alpha / a0;
    this.a1 = (-2 * Math.cos(w0)) / a0;
    this.a2 = (1 - alpha) / a0;
  }

  process(sample, frequency, width) {
    this.updateCoefficients(frequency, width);
    const output = this.b0 * sample + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = sample;
    this.y2 = this.y1;
    this.y1 = output;
    return output;
  }
}

class NoiseGenerator {
  constructor(sampleRate, seed = Date.now()) {
    this.sampleRate = sampleRate;
    this.random = createPrng(seed);
    this.colourBand = new DynamicBandPass(sampleRate);
    this.scoopBand = new DynamicBandPass(sampleRate);
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
      rawWhite: white,
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
    const strength = clamp(mix.strength || 0, 0, 1);
    const effectiveBeta = clamp((mix.beta || 0) * strength, -2, 2);
    let tiltSample = bases.white;

    if (effectiveBeta < 0) {
      const amount = -effectiveBeta;
      tiltSample = amount <= 1
        ? bases.white * (1 - amount) + bases.pink * amount
        : bases.pink * (2 - amount) + bases.brown * (amount - 1);
    } else if (effectiveBeta > 0) {
      const amount = effectiveBeta;
      tiltSample = amount <= 1
        ? bases.white * (1 - amount) + bases.blue * amount
        : bases.blue * (2 - amount) + bases.violet * (amount - 1);
    }

    const bandSample = this.colourBand.process(
      bases.rawWhite,
      mix.centerFrequency || 1000,
      mix.bandWidth || 0.85,
    );
    const scoopSample = this.scoopBand.process(
      bases.rawWhite,
      mix.notchFrequency || 1150,
      mix.notchWidth || 0.9,
    );
    const focusAmount = clamp((mix.bandGainDb || 0) * strength / MAX_FOCUS_GAIN_DB, 0, 1);
    const scoopAmount = clamp((mix.notchCutDb || 0) * strength / MAX_SCOOP_CUT_DB, 0, 1);
    const bandBoost = Math.max(0, dbToGain((mix.bandGainDb || 0) * strength) - 1) * 0.42;
    const edgeBoost = Math.max(0, dbToGain((mix.edgeGainDb || 0) * strength) - 1) * 0.26;
    const edgeSample = bases.brown * 0.46 + bases.violet * 0.36 + bases.blue * 0.18;
    const dryTrim = clamp(1 - strength * 0.12 - focusAmount * 0.22 - scoopAmount * 0.14, 0.48, 1);
    const sample = tiltSample * dryTrim + bandSample * bandBoost - scoopSample * scoopAmount * 1.05 + edgeSample * edgeBoost;

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

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const whole = safeSeconds > 0 && safeSeconds < 1 ? 1 : Math.round(safeSeconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const remaining = whole % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  }
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function formatSampleRate(sampleRate) {
  return `${(sampleRate / 1000).toFixed(sampleRate % 1000 === 0 ? 0 : 1)} kHz`;
}

function updateAudioNoiseReadouts() {
  const source = state.sourceAudio;
  dom.audioNoiseState.textContent = t(source.statusKey);
  dom.sourceFileName.textContent = source.fileName || t("noAudioFile");
  dom.sourceDurationValue.textContent = source.buffer
    ? `${formatDuration(source.buffer.duration)} / ${source.buffer.numberOfChannels} ch / ${formatSampleRate(source.buffer.sampleRate)}`
    : "0:00";

  dom.sourceLevelValue.textContent = `${dom.sourceLevelControl.value}%`;
  dom.noiseLevelValue.textContent = `${dom.noiseLevelControl.value}%`;
  dom.noiseOutputGainValue.textContent = `${dom.noiseOutputGainControl.value}%`;
  dom.renderNoisedButton.disabled = !source.buffer || source.processing || state.lossAudio.processing;
}

const LOSS_PRESETS = {
  meme: { intensity: 72, bits: 6, crushRate: 8, bandwidth: 36, drive: 18 },
  phone: { intensity: 58, bits: 8, crushRate: 11, bandwidth: 24, drive: 9 },
  deepfried: { intensity: 92, bits: 5, crushRate: 6, bandwidth: 42, drive: 30 },
  bitcrush: { intensity: 80, bits: 4, crushRate: 5, bandwidth: 70, drive: 12 },
};

function updateAudioLossReadouts() {
  const loss = state.lossAudio;
  dom.audioLossState.textContent = t(loss.statusKey);
  dom.lossIntensityValue.textContent = `${dom.lossIntensityControl.value}%`;
  dom.lossBitsValue.textContent = `${dom.lossBitsControl.value}-bit`;
  dom.lossCrushRateValue.textContent = `${dom.lossCrushRateControl.value} kHz`;
  dom.lossBandwidthValue.textContent = `${dom.lossBandwidthControl.value}%`;
  dom.lossDriveValue.textContent = `${dom.lossDriveControl.value} dB`;
  dom.renderLossButton.disabled = !state.sourceAudio.buffer || state.sourceAudio.processing || loss.processing;
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

async function ensureDecodeContext() {
  if (!audio.decodeContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error("AudioContext is not supported in this browser");
    }
    audio.decodeContext = new AudioContextClass({ latencyHint: "playback" });
  }
  return audio.decodeContext;
}

function clearNoisedOutput() {
  if (state.sourceAudio.lastObjectUrl) {
    URL.revokeObjectURL(state.sourceAudio.lastObjectUrl);
  }
  state.sourceAudio.lastObjectUrl = null;
  state.sourceAudio.lastDownloadFilename = null;
  dom.noisedDownloadLink.hidden = true;
  dom.noisedPreview.hidden = true;
  dom.noisedPreview.removeAttribute("src");
  dom.noisedPreview.load();
  dom.audioNoiseProgress.style.width = "0%";
}

function clearLossOutput() {
  if (state.lossAudio.lastObjectUrl) {
    URL.revokeObjectURL(state.lossAudio.lastObjectUrl);
  }
  state.lossAudio.lastObjectUrl = null;
  state.lossAudio.lastDownloadFilename = null;
  dom.lossDownloadLink.hidden = true;
  dom.lossPreview.hidden = true;
  dom.lossPreview.removeAttribute("src");
  dom.lossPreview.load();
  dom.audioLossProgress.style.width = "0%";
}

function setLossPreset(presetId) {
  const preset = LOSS_PRESETS[presetId] || LOSS_PRESETS.meme;
  dom.lossIntensityControl.value = preset.intensity;
  dom.lossBitsControl.value = preset.bits;
  dom.lossCrushRateControl.value = preset.crushRate;
  dom.lossBandwidthControl.value = preset.bandwidth;
  dom.lossDriveControl.value = preset.drive;
  updateAudioLossReadouts();
}

async function loadSourceAudio(file) {
  clearNoisedOutput();
  clearLossOutput();

  if (!file) {
    state.sourceAudio.buffer = null;
    state.sourceAudio.fileName = "";
    state.sourceAudio.statusKey = "noAudioFile";
    state.lossAudio.statusKey = "noAudioFile";
    updateAudioNoiseReadouts();
    updateAudioLossReadouts();
    return;
  }

  state.sourceAudio.statusKey = "decodingAudio";
  state.sourceAudio.processing = true;
  updateAudioNoiseReadouts();

  try {
    const context = await ensureDecodeContext();
    const arrayBuffer = await file.arrayBuffer();
    const decoded = await context.decodeAudioData(arrayBuffer.slice(0));
    state.sourceAudio.buffer = decoded;
    state.sourceAudio.fileName = file.name;
    state.sourceAudio.statusKey = "audioLoaded";
    state.lossAudio.statusKey = "audioLoaded";
  } catch (error) {
    state.sourceAudio.buffer = null;
    state.sourceAudio.fileName = file.name || "";
    state.sourceAudio.statusKey = "audioDecodeFailed";
    state.lossAudio.statusKey = "audioDecodeFailed";
    throw error;
  } finally {
    state.sourceAudio.processing = false;
    updateAudioNoiseReadouts();
    updateAudioLossReadouts();
  }
}

function decodedSampleAt(buffer, outputIndex, outputSampleRate, channel) {
  const channelIndex = Math.min(channel, buffer.numberOfChannels - 1);
  const data = buffer.getChannelData(channelIndex);
  const sourcePosition = (outputIndex * buffer.sampleRate) / outputSampleRate;
  const index = Math.floor(sourcePosition);

  if (index < 0 || index >= data.length) {
    return 0;
  }
  if (index >= data.length - 1) {
    return data[index] || 0;
  }

  const fraction = sourcePosition - index;
  return data[index] * (1 - fraction) + data[index + 1] * fraction;
}

function sourceBaseName(fileName) {
  return sanitizeFilename((fileName || "source-audio").replace(/\.[^.]+$/, ""));
}

async function renderNoisedAudio() {
  const buffer = state.sourceAudio.buffer;
  if (!buffer) {
    state.sourceAudio.statusKey = "noAudioFile";
    updateAudioNoiseReadouts();
    return;
  }

  const sampleRate = Number(dom.sampleRateSelect.value);
  const totalSamples = Math.max(1, Math.round(buffer.duration * sampleRate));
  const samples = {
    left: new Float32Array(totalSamples),
    right: new Float32Array(totalSamples),
  };
  const generator = new NoiseGenerator(sampleRate, Date.now() ^ Math.round(state.hue * 1000) ^ totalSamples);
  const noiseMixer = new MixerProcessor(sampleRate, state.mixer);
  const mix = { ...state.mix };
  const renderChunk = 16384;
  const sourceLevel = Number(dom.sourceLevelControl.value) / 100;
  const noiseLevel = Number(dom.noiseLevelControl.value) / 100;
  const outputGain = Number(dom.noiseOutputGainControl.value) / 100;

  state.sourceAudio.processing = true;
  state.sourceAudio.statusKey = "processingAudio";
  dom.audioNoiseProgress.style.width = "0%";
  dom.noisedDownloadLink.hidden = true;
  dom.noisedPreview.hidden = true;
  updateAudioNoiseReadouts();
  updateAudioLossReadouts();

  try {
    for (let offset = 0; offset < totalSamples; offset += renderChunk) {
      const end = Math.min(totalSamples, offset + renderChunk);
      for (let i = offset; i < end; i += 1) {
        const sourceLeft = decodedSampleAt(buffer, i, sampleRate, 0) * sourceLevel;
        const sourceRight = decodedSampleAt(buffer, i, sampleRate, 1) * sourceLevel;
        const noiseMono = generator.nextSample(mix);
        const [noiseLeft, noiseRight] = noiseMixer.process(noiseMono);
        samples.left[i] = softLimit((sourceLeft + noiseLeft * noiseLevel) * outputGain);
        samples.right[i] = softLimit((sourceRight + noiseRight * noiseLevel) * outputGain);
      }
      const progress = Math.round((end / totalSamples) * 82);
      dom.audioNoiseProgress.style.width = `${progress}%`;
      dom.audioNoiseState.textContent = `${Math.round((end / totalSamples) * 100)}%`;
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }

    if (dom.normalizeExport.checked) {
      normalizeSamples(samples);
    }

    dom.audioNoiseProgress.style.width = "92%";
    dom.audioNoiseState.textContent = t("encoding");
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    const encoder = encoderForFormat(dom.formatSelect.value);
    const encoded = encoder(samples, sampleRate);
    const blob = new Blob([encoded.buffer], { type: encoded.mime });
    const filename = `${sourceBaseName(state.sourceAudio.fileName)}-${state.dominant.id}-noised.${encoded.extension}`;

    if (state.sourceAudio.lastObjectUrl) {
      URL.revokeObjectURL(state.sourceAudio.lastObjectUrl);
    }

    state.sourceAudio.lastObjectUrl = URL.createObjectURL(blob);
    state.sourceAudio.lastDownloadFilename = filename;
    dom.noisedDownloadLink.href = state.sourceAudio.lastObjectUrl;
    dom.noisedDownloadLink.download = filename;
    dom.noisedDownloadLink.textContent = `${t("downloadPrefix")} ${filename}`;
    dom.noisedDownloadLink.hidden = false;
    dom.noisedPreview.src = state.sourceAudio.lastObjectUrl;
    dom.noisedPreview.hidden = false;
    dom.audioNoiseProgress.style.width = "100%";
    state.sourceAudio.statusKey = "processedAudio";
    dom.audioNoiseState.textContent = t(state.sourceAudio.statusKey);
  } finally {
    state.sourceAudio.processing = false;
    updateAudioNoiseReadouts();
    updateAudioLossReadouts();
  }
}

function onePoleAlphaFor(frequency, sampleRate) {
  return 1 - Math.exp((-2 * Math.PI * frequency) / sampleRate);
}

function lossSettingsFromControls(sampleRate) {
  const intensity = Number(dom.lossIntensityControl.value) / 100;
  const bits = Number(dom.lossBitsControl.value);
  const crushRate = Number(dom.lossCrushRateControl.value) * 1000;
  const bandwidth = Number(dom.lossBandwidthControl.value) / 100;
  const driveDb = Number(dom.lossDriveControl.value);
  const lowCut = clamp(40 + intensity * 520 * (1 - bandwidth * 0.42), 20, 1200);
  const highCut = clamp((1800 + bandwidth * 14200) * (1 - intensity * 0.32), lowCut * 1.6, sampleRate * 0.44);
  const holdSamples = clamp(Math.round(sampleRate / clamp(crushRate, 1000, sampleRate)), 1, Math.round(sampleRate / 1000));

  return {
    intensity,
    bits,
    quantMax: Math.max(1, Math.pow(2, bits - 1) - 1),
    holdSamples,
    jitter: intensity * 0.7,
    dropoutChance: intensity * intensity * 0.018,
    dropoutMax: Math.max(1, Math.round(holdSamples * (1 + intensity * 5))),
    driveGain: dbToGain(driveDb * (0.55 + intensity * 0.7)),
    lowpassAlpha: onePoleAlphaFor(highCut, sampleRate),
    highpassAlpha: onePoleAlphaFor(lowCut, sampleRate),
    smear: intensity * 0.42,
    makeup: 0.82 + intensity * 0.24,
  };
}

function createLossChannelState(seed) {
  return {
    random: createPrng(seed),
    held: 0,
    holdRemaining: 0,
    dropoutRemaining: 0,
    highpassMemory: 0,
    lowpassMemory: 0,
    previous: 0,
  };
}

function processLossSample(input, channelState, settings) {
  if (channelState.holdRemaining <= 0) {
    const jitter = Math.round((channelState.random() * 2 - 1) * settings.holdSamples * settings.jitter);
    channelState.held = input;
    channelState.holdRemaining = Math.max(1, settings.holdSamples + jitter);
    if (channelState.random() < settings.dropoutChance) {
      channelState.dropoutRemaining = Math.ceil(channelState.random() * settings.dropoutMax);
    }
  }
  channelState.holdRemaining -= 1;

  const held = channelState.dropoutRemaining > 0 ? channelState.previous * 0.74 : channelState.held;
  if (channelState.dropoutRemaining > 0) {
    channelState.dropoutRemaining -= 1;
  }

  const denominator = Math.tanh(settings.driveGain) || 1;
  const driven = Math.tanh(held * settings.driveGain) / denominator;
  channelState.highpassMemory += settings.highpassAlpha * (driven - channelState.highpassMemory);
  const highpassed = driven - channelState.highpassMemory;
  channelState.lowpassMemory += settings.lowpassAlpha * (highpassed - channelState.lowpassMemory);
  const quantized = Math.round(clamp(channelState.lowpassMemory, -1, 1) * settings.quantMax) / settings.quantMax;
  const smeared = quantized * (1 - settings.smear) + channelState.previous * settings.smear;
  channelState.previous = smeared;
  return softLimit(smeared * settings.makeup);
}

async function renderLossAudio() {
  const buffer = state.sourceAudio.buffer;
  if (!buffer) {
    state.lossAudio.statusKey = "noAudioFile";
    updateAudioLossReadouts();
    return;
  }

  const sampleRate = Number(dom.sampleRateSelect.value);
  const totalSamples = Math.max(1, Math.round(buffer.duration * sampleRate));
  const samples = {
    left: new Float32Array(totalSamples),
    right: new Float32Array(totalSamples),
  };
  const settings = lossSettingsFromControls(sampleRate);
  const leftState = createLossChannelState(Date.now() ^ totalSamples);
  const rightState = createLossChannelState(Date.now() ^ Math.round(buffer.duration * 1000) ^ 0x9e3779b9);
  const renderChunk = 16384;

  state.lossAudio.processing = true;
  state.lossAudio.statusKey = "processingAudio";
  dom.audioLossProgress.style.width = "0%";
  dom.lossDownloadLink.hidden = true;
  dom.lossPreview.hidden = true;
  updateAudioLossReadouts();
  updateAudioNoiseReadouts();

  try {
    for (let offset = 0; offset < totalSamples; offset += renderChunk) {
      const end = Math.min(totalSamples, offset + renderChunk);
      for (let i = offset; i < end; i += 1) {
        const sourceLeft = decodedSampleAt(buffer, i, sampleRate, 0);
        const sourceRight = decodedSampleAt(buffer, i, sampleRate, 1);
        samples.left[i] = processLossSample(sourceLeft, leftState, settings);
        samples.right[i] = processLossSample(sourceRight, rightState, settings);
      }
      const progress = Math.round((end / totalSamples) * 82);
      dom.audioLossProgress.style.width = `${progress}%`;
      dom.audioLossState.textContent = `${Math.round((end / totalSamples) * 100)}%`;
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }

    if (dom.normalizeExport.checked) {
      normalizeSamples(samples);
    }

    dom.audioLossProgress.style.width = "92%";
    dom.audioLossState.textContent = t("encoding");
    await new Promise((resolve) => window.setTimeout(resolve, 0));

    const encoder = encoderForFormat(dom.formatSelect.value);
    const encoded = encoder(samples, sampleRate);
    const blob = new Blob([encoded.buffer], { type: encoded.mime });
    const filename = `${sourceBaseName(state.sourceAudio.fileName)}-${dom.lossPresetSelect.value}-loss.${encoded.extension}`;

    if (state.lossAudio.lastObjectUrl) {
      URL.revokeObjectURL(state.lossAudio.lastObjectUrl);
    }

    state.lossAudio.lastObjectUrl = URL.createObjectURL(blob);
    state.lossAudio.lastDownloadFilename = filename;
    dom.lossDownloadLink.href = state.lossAudio.lastObjectUrl;
    dom.lossDownloadLink.download = filename;
    dom.lossDownloadLink.textContent = `${t("downloadPrefix")} ${filename}`;
    dom.lossDownloadLink.hidden = false;
    dom.lossPreview.src = state.lossAudio.lastObjectUrl;
    dom.lossPreview.hidden = false;
    dom.audioLossProgress.style.width = "100%";
    state.lossAudio.statusKey = "processedAudio";
    dom.audioLossState.textContent = t(state.lossAudio.statusKey);
  } finally {
    state.lossAudio.processing = false;
    updateAudioLossReadouts();
    updateAudioNoiseReadouts();
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

  dom.audioFileInput.addEventListener("change", () => {
    loadSourceAudio(dom.audioFileInput.files[0]).catch((error) => {
      state.sourceAudio.statusKey = "audioDecodeFailed";
      state.sourceAudio.processing = false;
      updateAudioNoiseReadouts();
      console.error(error);
    });
  });

  [dom.sourceLevelControl, dom.noiseLevelControl, dom.noiseOutputGainControl].forEach((control) => {
    control.addEventListener("input", updateAudioNoiseReadouts);
  });

  dom.renderNoisedButton.addEventListener("click", () => {
    renderNoisedAudio().catch((error) => {
      state.sourceAudio.statusKey = "audioNoiseFailed";
      state.sourceAudio.processing = false;
      updateAudioNoiseReadouts();
      updateAudioLossReadouts();
      console.error(error);
    });
  });

  dom.lossPresetSelect.addEventListener("change", () => {
    setLossPreset(dom.lossPresetSelect.value);
  });

  [
    dom.lossIntensityControl,
    dom.lossBitsControl,
    dom.lossCrushRateControl,
    dom.lossBandwidthControl,
    dom.lossDriveControl,
  ].forEach((control) => {
    control.addEventListener("input", updateAudioLossReadouts);
  });

  dom.renderLossButton.addEventListener("click", () => {
    renderLossAudio().catch((error) => {
      state.lossAudio.statusKey = "audioLossFailed";
      state.lossAudio.processing = false;
      updateAudioLossReadouts();
      updateAudioNoiseReadouts();
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
