/**
 * Builds a PNG data URL for map overlay. Backend mask URLs may point to text
 * placeholders; we still fetch them to seed the pattern so overlays stay stable
 * per region/model.
 */
export type MaskKind = 'prediction' | 'ground_truth'

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SIZE = 256

export async function buildRasterMaskDataUrl(
  maskUrl: string,
  kind: MaskKind,
  extraSeed: string,
): Promise<string> {
  let textSeed = ''
  try {
    const res = await fetch(maskUrl)
    if (res.ok) {
      textSeed = await res.text()
    }
  } catch {
    /* ignore — still render a deterministic overlay */
  }

  const seedStr = `${textSeed}|${extraSeed}|${kind}`
  const rng = mulberry32(hashSeed(seedStr))

  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  }

  const base =
    kind === 'prediction'
      ? { r: 234, g: 88, b: 12 }
      : { r: 59, g: 130, b: 246 }

  ctx.fillStyle = `rgba(${base.r}, ${base.g}, ${base.b}, 0.28)`
  ctx.fillRect(0, 0, SIZE, SIZE)

  const stripes = kind === 'prediction' ? 14 : 18
  ctx.globalAlpha = 0.22
  for (let i = 0; i < stripes; i++) {
    const offset = (i / stripes) * (SIZE + 40) - 20 + rng() * 8
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.25)'
    ctx.beginPath()
    if (kind === 'prediction') {
      ctx.rect(offset, 0, 6 + rng() * 6, SIZE)
    } else {
      ctx.rect(0, offset, SIZE, 6 + rng() * 6)
    }
    ctx.fill()
  }

  ctx.globalAlpha = 0.35
  for (let n = 0; n < 55; n++) {
    const x = rng() * SIZE
    const y = rng() * SIZE
    const w = 4 + rng() * 28
    const h = 4 + rng() * 28
    ctx.fillStyle =
      rng() > 0.5
        ? `rgba(${Math.min(255, base.r + 40)}, ${Math.min(255, base.g + 40)}, ${Math.min(255, base.b + 40)}, 0.5)`
        : 'rgba(0,0,0,0.2)'
    ctx.fillRect(x, y, w, h)
  }

  ctx.globalAlpha = 1
  return canvas.toDataURL('image/png')
}
