"use strict";

const ANCHORS = [
  { id: "brown", label: "棕/红", hue: 20, beta: -2, color: "#99542d" },
  { id: "pink", label: "粉红", hue: 335, beta: -1, color: "#e66e9b" },
  { id: "green", label: "绿色", hue: 120, beta: 0, color: "#37a46d" },
  { id: "blue", label: "蓝色", hue: 218, beta: 1, color: "#2f82c6" },
  { id: "violet", label: "紫色", hue: 280, beta: 2, color: "#7d57bd" },
];

const MIX_KEYS = ["white", ...ANCHORS.map((anchor) => anchor.id)];
const root = document.documentElement;

const dom = {
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
};

const state = {
  hue: 335,
  saturation: 0.75,
  mix: null,
  color: null,
  beta: 0,
  dominant: null,
  dragging: false,
  lastObjectUrl: null,
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
    return { id: "white", label: "白/灰", color: "#f7f7f2" };
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
  updateReadouts();
  updateLegend();
}

function updateReadouts() {
  const hue = Math.round(state.hue);
  const saturation = Math.round(state.saturation * 100);
  dom.colourValue.textContent = `H ${hue} / S ${saturation}%`;
  dom.selectedSwatch.style.background = state.color.hex;
  dom.selectedHex.textContent = state.color.hex;
  dom.tiltValue.textContent = state.beta.toFixed(2);
  dom.saturationValue.textContent = `${saturation}%`;
  dom.noiseName.textContent = `${state.dominant.label}倾向`;
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

  return (
    mix.white * 1 +
    mix.pink * Math.pow(ratio, -1) +
    mix.brown * Math.pow(ratio, -2) +
    mix.green * greenBump +
    mix.blue * Math.pow(ratio, 1) +
    mix.violet * Math.pow(ratio, 2)
  );
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
  if (!dom.mixLegend.dataset.ready) {
    const items = [
      { id: "white", label: "白/灰", color: "#c7ccc3" },
      ...ANCHORS,
    ];
    dom.mixLegend.innerHTML = items
      .map(
        (item) => `
          <div class="legend-row" data-key="${item.id}">
            <span>${item.label}</span>
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
    row.querySelector(".legend-bar span").style.width = `${percent}%`;
    row.querySelector("strong").textContent = `${percent}%`;
  });
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

async function togglePlayback() {
  if (!audio.context) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audio.context = new AudioContextClass({ latencyHint: "interactive" });
    audio.generator = new NoiseGenerator(audio.context.sampleRate);
    audio.processor = audio.context.createScriptProcessor(2048, 0, 2);
    audio.processor.onaudioprocess = renderLiveAudio;
    audio.processor.connect(audio.context.destination);
  }

  if (audio.context.state === "suspended") {
    await audio.context.resume();
  }

  audio.isPlaying = !audio.isPlaying;
  audio.targetVolume = audio.isPlaying ? Number(dom.volumeControl.value) / 100 : 0;
  dom.playToggle.textContent = audio.isPlaying ? "暂停监听" : "开始监听";
  dom.audioState.textContent = audio.isPlaying ? "监听中" : "已暂停";
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
    outputLeft[i] = sample;
    outputRight[i] = sample;
    rms += sample * sample;
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

function writeString(view, offset, value) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

function encodeWav16(samples, sampleRate) {
  const bytesPerSample = 2;
  const dataBytes = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataBytes, true);

  for (let i = 0; i < samples.length; i += 1) {
    const value = clamp(samples[i], -1, 1);
    view.setInt16(44 + i * 2, value < 0 ? value * 32768 : value * 32767, true);
  }

  return { buffer, mime: "audio/wav", extension: "wav" };
}

function encodeWavFloat32(samples, sampleRate) {
  const bytesPerSample = 4;
  const dataBytes = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 32, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataBytes, true);

  for (let i = 0; i < samples.length; i += 1) {
    view.setFloat32(44 + i * 4, clamp(samples[i], -1, 1), true);
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
  const bytesPerSample = 2;
  const dataBytes = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(54 + dataBytes);
  const view = new DataView(buffer);

  writeString(view, 0, "FORM");
  view.setUint32(4, 46 + dataBytes, false);
  writeString(view, 8, "AIFF");
  writeString(view, 12, "COMM");
  view.setUint32(16, 18, false);
  view.setUint16(20, 1, false);
  view.setUint32(22, samples.length, false);
  view.setUint16(26, 16, false);
  writeExtended80(view, 28, sampleRate);
  writeString(view, 38, "SSND");
  view.setUint32(42, dataBytes + 8, false);
  view.setUint32(46, 0, false);
  view.setUint32(50, 0, false);

  for (let i = 0; i < samples.length; i += 1) {
    const value = clamp(samples[i], -1, 1);
    view.setInt16(54 + i * 2, value < 0 ? value * 32768 : value * 32767, false);
  }

  return { buffer, mime: "audio/aiff", extension: "aiff" };
}

function encodeAu16(samples, sampleRate) {
  const bytesPerSample = 2;
  const dataBytes = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(24 + dataBytes);
  const view = new DataView(buffer);

  view.setUint32(0, 0x2e736e64, false);
  view.setUint32(4, 24, false);
  view.setUint32(8, dataBytes, false);
  view.setUint32(12, 3, false);
  view.setUint32(16, sampleRate, false);
  view.setUint32(20, 1, false);

  for (let i = 0; i < samples.length; i += 1) {
    const value = clamp(samples[i], -1, 1);
    view.setInt16(24 + i * 2, value < 0 ? value * 32768 : value * 32767, false);
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
  let peak = 0;
  for (let i = 0; i < samples.length; i += 1) {
    peak = Math.max(peak, Math.abs(samples[i]));
  }

  if (peak <= 0) {
    return;
  }

  const gain = Math.min(8, 0.89125 / peak);
  for (let i = 0; i < samples.length; i += 1) {
    samples[i] *= gain;
  }
}

async function exportAudio() {
  const seconds = getExportSeconds();
  const sampleRate = Number(dom.sampleRateSelect.value);
  const totalSamples = Math.round(seconds * sampleRate);
  const generator = new NoiseGenerator(sampleRate, Date.now() ^ Math.round(state.hue * 1000));
  const samples = new Float32Array(totalSamples);
  const mix = { ...state.mix };
  const renderChunk = 16384;
  const level = Number(dom.volumeControl.value) / 100 || 0.36;

  dom.exportButton.disabled = true;
  dom.exportState.textContent = "生成中";
  dom.exportProgress.style.width = "0%";
  dom.downloadLink.hidden = true;

  for (let offset = 0; offset < totalSamples; offset += renderChunk) {
    const end = Math.min(totalSamples, offset + renderChunk);
    for (let i = offset; i < end; i += 1) {
      samples[i] = generator.nextSample(mix) * level;
    }
    const progress = Math.round((end / totalSamples) * 74);
    dom.exportProgress.style.width = `${progress}%`;
    dom.exportState.textContent = `${Math.round((end / totalSamples) * 100)}%`;
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }

  if (dom.normalizeExport.checked) {
    normalizeSamples(samples);
  }

  dom.exportState.textContent = "编码中";
  dom.exportProgress.style.width = "86%";
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  const encoder = encoderForFormat(dom.formatSelect.value);
  const encoded = encoder(samples, sampleRate);
  const blob = new Blob([encoded.buffer], { type: encoded.mime });
  const filename = `${sanitizeFilename(dom.filenameInput.value)}-${state.dominant.id}-${Math.round(seconds)}s.${encoded.extension}`;

  if (state.lastObjectUrl) {
    URL.revokeObjectURL(state.lastObjectUrl);
  }

  state.lastObjectUrl = URL.createObjectURL(blob);
  dom.downloadLink.href = state.lastObjectUrl;
  dom.downloadLink.download = filename;
  dom.downloadLink.hidden = false;
  dom.downloadLink.textContent = `下载 ${filename}`;
  dom.exportProgress.style.width = "100%";
  dom.exportState.textContent = "已生成";
  dom.downloadLink.click();
  dom.exportButton.disabled = false;
}

function bindEvents() {
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
      dom.audioState.textContent = "启动失败";
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
      dom.exportState.textContent = "生成失败";
      dom.exportButton.disabled = false;
      console.error(error);
    });
  });

  window.addEventListener("resize", renderAll);
}

function init() {
  root.style.setProperty("--accent", "#2f8c67");
  setVolumeFromInput();
  bindEvents();
  updateStateFromColour(state.hue, state.saturation);
  updateMeter();
}

init();
