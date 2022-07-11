import fs from 'node:fs'
import crypto from 'node:crypto'
import path from 'node:path'
import type { Readable } from 'node:stream'
import type { Request, Response, NextFunction } from 'express'

interface WrappedContext {
  req: Request
  res: Response
  next: NextFunction
}

type WrappedFunction = (ctx: WrappedContext) => Promise<void>

/**
 * Hashes input string
 */
export const createHash = (s: string) =>
  crypto.createHash('sha256').update(s).digest('hex')

/**
 * Creates a cache filename
 */
export function createCacheFilename(filename: string) {
  const newFilename = createHash(filename)
  return path.join(process.cwd(), 'cache', newFilename)
}

/**
 * Basic file cache writer/reader
 */
export async function cacheFile(
  filename: string,
  content: () => Promise<Buffer>
): Promise<Readable> {
  const dest = createCacheFilename(filename)

  const exists = await fs.promises
    .access(dest, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)

  if (!exists) {
    const data = await content()
    await fs.promises.writeFile(dest, data)
  }

  return fs.createReadStream(dest)
}

/**
 * Async Express route error handler
 */
export const wrapped =
  (fn: WrappedFunction) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn({ req, res, next })
    } catch (e) {
      console.error('Route exception', e)
      next(e)
    }
  }
