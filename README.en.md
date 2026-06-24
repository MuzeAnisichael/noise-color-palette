# Noise Colour Palette

[简体中文](README.md) | [English](README.en.md)

A dependency-free browser app for noise synthesis and mixing. It turns noise colour into a draggable palette and adds an independent mixer for EQ, reverb, pan, spatial width, and audio export.

## Features

- Drag the palette to shape the current noise colour.
- The center stays close to white/grey noise; stronger spectral colouring appears toward the edge.
- Built-in brown/red, pink, yellow low-mid, green mid, cyan presence, blue bright, and violet air anchors.
- Chinese/English UI switching, persisted with `localStorage`.
- Real-time spectrum curve and spectrum-shaping metrics.
- Independent mixer: 5-band EQ curve, reverb, pan, spatial width, and spatial delay.
- Configurable export duration, sample rate, and audio format.
- Exports `WAV 16-bit PCM`, `WAV 32-bit Float`, `AIFF 16-bit PCM`, and `AU 16-bit PCM`.
- Mixer-enabled exports are stereo.

## Run Locally

This is a static project with no package install step:

```powershell
python -m http.server 5173
```

Then open:

```text
http://localhost:5173/
```

## Project Structure

```text
.
├── .github/                 # GitHub Actions and issue/PR templates
├── app.js                   # Noise synthesis, mixer DSP, export encoding, i18n
├── index.html               # App UI
├── styles.css               # Responsive styles
├── README.md                # Chinese README
├── README.en.md             # English README
├── CONTRIBUTING.md          # Contribution guide
├── SECURITY.md              # Security policy
└── CHANGELOG.md             # Release notes
```

## Spectrum Mapping

This project uses a designed, explainable mapping. It does not claim a physical one-to-one relationship between visible colour and audio spectrum.

- Hue controls both the overall spectral tilt and the main-band center frequency.
- Saturation controls the strength of the transition from white noise to the target spectrum.
- The center keeps more white/grey noise weight.
- Yellow and green regions generate explicit low-mid and midrange emphasis, avoiding the persistent midrange dip caused by mixing low-frequency and high-frequency anchors.
- The spectrum preview reflects the theoretical result of the current target spectrum and EQ curve.

## Export Notes

Export does not record the real-time playback stream. It offline-renders the current palette and mixer settings for the requested duration, then writes the selected audio format. Peak normalization defaults to about `-1 dB` to reduce loudness differences between noise colours and mixer settings.

## Development Check

```powershell
node --check app.js
```

GitHub Actions runs the same static check on push and pull request.
