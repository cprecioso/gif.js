import makeGif from "./makeGif"

let currentlyProcessingId: number | null = null
let currentAbortController = new AbortController()

self.addEventListener("message", async (msg: MessageEvent) => {
  const request: Request = msg.data

  try {
    if (currentlyProcessingId != null && currentlyProcessingId !== request.id) {
      throw "Already processing a gif"
    } else if (request.command === "make-gif") {
      const { signal } = currentAbortController
      currentlyProcessingId = request.id

      const gifUrl = await makeGif(request.frameUrls, signal)

      if (signal.aborted) throw "Aborted by user"

      const response: Response.Success = {
        id: request.id,
        type: "success",
        gifUrl,
      }
      self.postMessage(response)

      currentlyProcessingId = null
    } else if (request.command === "cancel-make-gif") {
      currentAbortController.abort()
      currentAbortController = new AbortController()
      currentlyProcessingId = null
    } else {
      throw "Unknown command"
    }
  } catch (error) {
    const response: Response.Error = { id: request.id, type: "error", error }
    self.postMessage(response)
  } finally {
  }
})

export type Request = Request.MakeGif | Request.CancelMakeGif
export declare namespace Request {
  export type MakeGif = { id: number; command: "make-gif"; frameUrls: string[] }
  export type CancelMakeGif = { id: number; command: "cancel-make-gif" }
}

export type Response = Response.Success | Response.Error
export declare namespace Response {
  export type Success = { id: number; type: "success"; gifUrl: string }
  export type Error = { id: number; type: "error"; error: string }
}
