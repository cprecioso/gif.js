import GIFEncoder from "./GIFEncoder"

const WIDTH = 500
const HEIGHT = 375
const DELAY = 100
const QUALITY = 10
const DITHER = true

const fetchUrl = async (url: string, abortSignal?: AbortSignal) => {
  const res = await fetch(url, { mode: "cors", signal: abortSignal })
  const buf = await res.arrayBuffer()
  return new Uint8ClampedArray(buf)
}

const makeGif = async (urls: string[], abortSignal?: AbortSignal) => {
  const framePromises = urls.map((url) => fetchUrl(url, abortSignal))
  const encoder = new GIFEncoder(WIDTH, HEIGHT)
  encoder.setRepeat(0)
  encoder.setDelay(DELAY)
  encoder.setQuality(QUALITY)
  encoder.setDither(DITHER)
  encoder.setGlobalPalette(true)
  encoder.writeHeader()
  for (const framePromise of framePromises) {
    const frame = await framePromise
    encoder.addFrame(frame)
    if (abortSignal?.aborted) throw "Aborted by user"
  }
  encoder.finish()
  const stream = encoder.stream()
  const blob = new Blob(stream.pages, { type: "image/gif" })
  return URL.createObjectURL(blob)
}

export default makeGif
