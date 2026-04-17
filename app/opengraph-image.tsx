import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const alt = 'Z & Y — Ibrahim Zimam and Yanal Ahmed invitation monogram'
export const size = { width: 1024, height: 1024 }
export const contentType = 'image/png'

/** Serves the monogram from `public/` so WhatsApp / Meta crawlers get a stable OG image URL. */
export default async function Image() {
  const filePath = path.join(process.cwd(), 'public', 'assets', 'Z-y-logo.png')
  const buffer = await readFile(filePath)
  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
