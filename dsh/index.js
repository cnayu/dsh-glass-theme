// dsh-glass-theme server entry.
// Serves the chat-area wallpaper file from the local dsh data dir
// (~/.dsh/dsh-glass-theme/) so it survives browser restarts and
// browser-side storage eviction. Binary + meta live on disk; the
// web client mounts it via /dsh-glass-theme/wallpaper.

import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { pipeline } from 'node:stream/promises'

export const name = 'dsh-glass-theme'

const DATA_DIR = join(homedir(), '.dsh', 'dsh-glass-theme')
const WALLPAPER_PATH = join(DATA_DIR, 'wallpaper.bin')
const META_PATH = join(DATA_DIR, 'meta.json')
const MAX_BYTES = 1024 * 1024 * 1024 // 1GB hard cap on stored wallpaper

function readMeta() {
  try {
    return JSON.parse(readFileSync(META_PATH, 'utf-8'))
  } catch {
    return null
  }
}

function writeMeta(meta) {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(META_PATH, JSON.stringify(meta, null, 2), 'utf-8')
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

function isMediaType(type) {
  return /^image\//.test(type || '') || /^video\//.test(type || '')
}

export function apply(ctx) {
  if (typeof ctx.inject !== 'function') return
  ctx.inject(['webServer'], (scope) => {
    scope.webServer.register({
      kind: 'exact',
      path: '/dsh-glass-theme/wallpaper',
      handler: async (req, res) => {
        try {
          // CSRF guard: browsers attach an Origin header on every cross-origin
          // request, so a drive-by web page cannot touch this endpoint. Local
          // tools and the app's own same-origin pages send no Origin (or the
          // matching one) and pass through.
          const origin = String(req.headers.origin || '')
          if (origin) {
            const originHost = origin.replace(/^https?:\/\//, '')
            const host = String(req.headers.host || '')
            if (originHost !== host) {
              sendJson(res, 403, { ok: false, error: 'cross-origin request rejected' })
              return
            }
          }
          // GET ?meta=1 → JSON descriptor for the boot restore path.
          if (req.method === 'GET' && String(req.url).includes('meta=1')) {
            const meta = readMeta()
            if (!meta || !existsSync(WALLPAPER_PATH)) {
              sendJson(res, 200, { exists: false })
              return
            }
            const stat = statSync(WALLPAPER_PATH)
            sendJson(res, 200, {
              exists: true,
              name: meta.name,
              type: meta.type,
              size: stat.size,
              mtime: stat.mtimeMs,
            })
            return
          }

          // GET → stream the file; Range support so video seeking works.
          if (req.method === 'GET') {
            const meta = readMeta()
            if (!meta || !existsSync(WALLPAPER_PATH)) {
              res.writeHead(404)
              res.end()
              return
            }
            const stat = statSync(WALLPAPER_PATH)
            const type = isMediaType(meta.type) ? meta.type : 'application/octet-stream'
            const base = {
              'Content-Type': type,
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'no-store',
            }
            const range = req.headers.range
            if (range) {
              const m = /^bytes=(\d*)-(\d*)$/.exec(String(range))
              let start = m && m[1] ? parseInt(m[1], 10) : 0
              let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1
              if (!Number.isFinite(start) || start < 0) start = 0
              if (!Number.isFinite(end) || end >= stat.size) end = stat.size - 1
              if (start > end) {
                res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size })
                res.end()
                return
              }
              res.writeHead(206, {
                ...base,
                'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
                'Content-Length': end - start + 1,
              })
              createReadStream(WALLPAPER_PATH, { start, end }).pipe(res)
              return
            }
            res.writeHead(200, { ...base, 'Content-Length': stat.size })
            createReadStream(WALLPAPER_PATH).pipe(res)
            return
          }

          // POST → store the uploaded binary (streamed to disk).
          if (req.method === 'POST') {
            const rawName = decodeURIComponent(String(req.headers['x-glass-name'] || 'wallpaper'))
            const name = rawName.replace(/[\\/:*?"<>|]/g, '_').slice(0, 120) || 'wallpaper'
            const type = String(req.headers['content-type'] || '').split(';')[0].trim()
            if (!isMediaType(type)) {
              sendJson(res, 400, { ok: false, error: 'only image/* or video/* accepted' })
              return
            }
            const len = parseInt(req.headers['content-length'] || '0', 10)
            if (len > MAX_BYTES) {
              sendJson(res, 413, { ok: false, error: 'file too large (1GB max)' })
              return
            }
            mkdirSync(DATA_DIR, { recursive: true })
            const tmp = WALLPAPER_PATH + '.tmp'
            await pipeline(req, createWriteStream(tmp))
            if (statSync(tmp).size > MAX_BYTES) {
              unlinkSync(tmp)
              sendJson(res, 413, { ok: false, error: 'file too large (1GB max)' })
              return
            }
            try { unlinkSync(WALLPAPER_PATH) } catch {}
            renameSync(tmp, WALLPAPER_PATH)
            writeMeta({ name, type })
            sendJson(res, 200, { ok: true, name, type })
            return
          }

          // DELETE → remove the stored wallpaper.
          if (req.method === 'DELETE') {
            try { unlinkSync(WALLPAPER_PATH) } catch {}
            try { unlinkSync(META_PATH) } catch {}
            sendJson(res, 200, { ok: true })
            return
          }

          res.writeHead(405, { allow: 'GET, POST, DELETE' })
          res.end()
        } catch (error) {
          sendJson(res, 500, { ok: false, error: String(error?.message || error) })
        }
      },
    })
  })
}
