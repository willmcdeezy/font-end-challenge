const BASE = 'http://localhost:8000'
export const WS_BASE = BASE.replace(/^http/, 'ws')

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(parseErrorResponse(await res.text()))
  return res.json()
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(parseErrorResponse(await res.text()))
  return res.json()
}

/** Extract a short message from Pydantic-style { detail: [{ msg }, ...] }; otherwise return raw text. */
function parseErrorResponse(text: string): string {
  try {
    const data = JSON.parse(text) as { detail?: Array<{ msg?: string }> }
    if (Array.isArray(data?.detail)) {
      const messages = data.detail.map((d) => d?.msg).filter(Boolean) as string[]
      if (messages.length) return messages.join('. ')
    }
  } catch {
    // not JSON or unexpected shape
  }
  return text
}
