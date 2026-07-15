import type { ApiProfile, TaskParams } from '../types'
import { DEFAULT_NANO_BANANA_BASE_URL, DEFAULT_NANO_BANANA_MODEL } from './apiProfiles'
import { readClientDevProxyConfig, shouldUseApiProxy, type DevProxyConfig } from './devProxy'
import {
  type CallApiOptions,
  type CallApiResult,
  fetchImageUrlAsDataUrl,
  getApiErrorMessage,
  isDataUrl,
  isHttpUrl,
  normalizeBase64Image,
} from './imageApiShared'

const SUPPORTED_ASPECT_RATIOS = [
  ['1:1', 1],
  ['4:3', 4 / 3],
  ['3:4', 3 / 4],
  ['16:9', 16 / 9],
  ['9:16', 9 / 16],
  ['2:3', 2 / 3],
  ['3:2', 3 / 2],
] as const
const NANO_BANANA_SIZE_CONFIG_PATTERN = /^(2K):(.+)$/i

interface NanoBananaImage {
  value: string
  mimeType: string
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function normalizeNanoBananaBaseUrl(baseUrl: string): string {
  const raw = baseUrl.trim() || DEFAULT_NANO_BANANA_BASE_URL
  const input = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(raw) ? raw : `https://${raw}`
  try {
    const url = new URL(input)
    const pathname = url.pathname.replace(/\/+$/, '').replace(/\/(?:v1|v1beta)$/i, '')
    return `${url.origin}${pathname}`
  } catch {
    return raw.replace(/\/+$/, '').replace(/\/(?:v1|v1beta)$/i, '')
  }
}

function createNanoBananaUrl(profile: ApiProfile, proxyConfig: DevProxyConfig | null, useApiProxy: boolean): string {
  const baseUrl = normalizeNanoBananaBaseUrl(profile.baseUrl)
  const model = profile.model.trim() || DEFAULT_NANO_BANANA_MODEL
  const query = new URLSearchParams({ key: profile.apiKey })
  const path = `v1beta/models/${encodeURIComponent(model)}:generateContent?${query.toString()}`
  return useApiProxy ? `${proxyConfig?.prefix ?? '/api-proxy'}/${path}` : `${baseUrl}/${path}`
}

function parseNanoBananaSizeConfig(size: string): { aspectRatio?: TaskParams['banana_aspect_ratio']; imageSize?: TaskParams['banana_image_size'] } {
  if (size === 'auto') return {}

  const configMatch = size.match(NANO_BANANA_SIZE_CONFIG_PATTERN)
  if (configMatch) {
    return {
      imageSize: configMatch[1].toUpperCase() as TaskParams['banana_image_size'],
      aspectRatio: normalizeAspectRatio(configMatch[2]),
    }
  }

  const directRatio = normalizeAspectRatio(size)
  if (directRatio) return { aspectRatio: directRatio }

  const match = size.match(/^(\d+)x(\d+)$/)
  if (!match) return {}
  const width = Number(match[1])
  const height = Number(match[2])
  if (!width || !height) return {}

  const ratio = width / height
  const aspectRatio = SUPPORTED_ASPECT_RATIOS.reduce((best, current) =>
    Math.abs(Math.log(ratio / current[1])) < Math.abs(Math.log(ratio / best[1])) ? current : best,
  )[0]
  const pixels = width * height
  return { aspectRatio, imageSize: '2K' }
}

function normalizeAspectRatio(value: string): TaskParams['banana_aspect_ratio'] | undefined {
  const normalized = value.trim()
  return SUPPORTED_ASPECT_RATIOS.some(([aspectRatio]) => aspectRatio === normalized) ? normalized as TaskParams['banana_aspect_ratio'] : undefined
}

function createNanoBananaImageConfig(params: TaskParams) {
  const fallback = parseNanoBananaSizeConfig(params.size)
  return {
    aspectRatio: params.banana_aspect_ratio || fallback.aspectRatio || '1:1',
    imageSize: params.banana_image_size || fallback.imageSize || '2K',
    quality: params.banana_quality || 'standard',
  }
}

function parseInputImage(dataUrl: string): { mime_type: string; data: string } {
  const match = dataUrl.match(/^data:([^;,]+);base64,([\s\S]+)$/i)
  if (!match) throw new Error('Nano Banana 参考图必须是 Base64 data URL')
  return { mime_type: match[1], data: match[2].replace(/\s/g, '') }
}

function createRequestBody(opts: CallApiOptions): Record<string, unknown> {
  const parts: Array<Record<string, unknown>> = [{ text: opts.prompt }]
  for (const image of opts.inputImageDataUrls) {
    parts.push({ inline_data: parseInputImage(image) })
  }

  const imageConfig = createNanoBananaImageConfig(opts.params)
  return {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig,
    },
  }
}

function readInlineImage(value: unknown): NanoBananaImage | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const data = typeof record.data === 'string' ? record.data : null
  if (!data) return null
  const mimeType = typeof record.mimeType === 'string'
    ? record.mimeType
    : typeof record.mime_type === 'string'
      ? record.mime_type
      : 'image/png'
  return { value: normalizeBase64Image(data, mimeType), mimeType }
}

function collectNanoBananaImages(payload: unknown): NanoBananaImage[] {
  if (!payload || typeof payload !== 'object') return []
  const record = payload as Record<string, unknown>
  const images: NanoBananaImage[] = []

  if (Array.isArray(record.candidates)) {
    for (const candidate of record.candidates) {
      if (!candidate || typeof candidate !== 'object') continue
      const content = (candidate as Record<string, unknown>).content
      if (!content || typeof content !== 'object') continue
      const parts = (content as Record<string, unknown>).parts
      if (!Array.isArray(parts)) continue
      for (const part of parts) {
        if (!part || typeof part !== 'object') continue
        const partRecord = part as Record<string, unknown>
        const inline = readInlineImage(partRecord.inlineData) ?? readInlineImage(partRecord.inline_data)
        if (inline) images.push(inline)
      }
    }
  }

  if (Array.isArray(record.choices)) {
    for (const choice of record.choices) {
      if (!choice || typeof choice !== 'object') continue
      const message = (choice as Record<string, unknown>).message
      if (!message || typeof message !== 'object') continue
      const content = (message as Record<string, unknown>).content
      if (typeof content !== 'string') continue
      for (const match of content.matchAll(/data:(image\/[^;,]+);base64,([A-Za-z0-9+/=]+)/g)) {
        images.push({ value: `data:${match[1]};base64,${match[2]}`, mimeType: match[1] })
      }
    }
  }

  const legacyData = Array.isArray(record.data) ? record.data : record.data ? [record.data] : []
  for (const item of legacyData) {
    if (!item || typeof item !== 'object') continue
    const itemRecord = item as Record<string, unknown>
    if (typeof itemRecord.b64_json === 'string') {
      images.push({ value: normalizeBase64Image(itemRecord.b64_json, 'image/png'), mimeType: 'image/png' })
    } else if (isHttpUrl(itemRecord.url) || isDataUrl(itemRecord.url)) {
      images.push({ value: itemRecord.url, mimeType: 'image/png' })
    }
  }

  return images
}

async function requestNanoBananaImage(
  opts: CallApiOptions,
  profile: ApiProfile,
  proxyConfig: DevProxyConfig | null,
  useApiProxy: boolean,
  signal: AbortSignal,
): Promise<string[]> {
  const response = await fetch(createNanoBananaUrl(profile, proxyConfig, useApiProxy), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createRequestBody(opts)),
    signal,
  })

  if (!response.ok) throw new Error(await getApiErrorMessage(response))
  const payload: unknown = await response.json()
  const images = collectNanoBananaImages(payload)
  if (!images.length) {
    const error = new Error('Nano Banana 未返回可识别的图片数据')
    ;(error as Error & { rawResponsePayload?: string }).rawResponsePayload = JSON.stringify(payload, null, 2)
    throw error
  }

  return Promise.all(images.map(async (image) =>
    isHttpUrl(image.value) ? fetchImageUrlAsDataUrl(image.value, image.mimeType, signal) : image.value,
  ))
}

export async function callNanoBananaImageApi(opts: CallApiOptions, profile: ApiProfile): Promise<CallApiResult> {
  if (opts.maskDataUrl) throw new Error('Nano Banana 当前不支持蒙版编辑，请移除蒙版后重试')

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), profile.timeout * 1000)
  const count = Math.min(10, Math.max(1, opts.params.n || 1))
  const proxyConfig = readClientDevProxyConfig()
  const useApiProxy = shouldUseApiProxy(profile.apiProxy, proxyConfig)

  try {
    const settled = await Promise.allSettled(
      Array.from({ length: count }, () => requestNanoBananaImage(opts, profile, proxyConfig, useApiProxy, controller.signal)),
    )
    const images = settled.flatMap((result) => result.status === 'fulfilled' ? result.value : [])
    const failedRequests = settled.flatMap((result, requestIndex) =>
      result.status === 'rejected' ? [{ requestIndex, error: getErrorMessage(result.reason) }] : [],
    )

    if (!images.length) {
      const firstFailure = settled.find((result): result is PromiseRejectedResult => result.status === 'rejected')
      if (firstFailure) throw firstFailure.reason
      throw new Error('Nano Banana 未返回图片')
    }

    const actualParams: Partial<TaskParams> = {
      banana_image_size: opts.params.banana_image_size || '2K',
      banana_aspect_ratio: opts.params.banana_aspect_ratio || '1:1',
      banana_quality: opts.params.banana_quality || 'standard',
      output_format: 'png',
      n: images.length,
    }
    return {
      images,
      actualParams,
      actualParamsList: images.map(() => ({
        banana_image_size: opts.params.banana_image_size || '2K',
        banana_aspect_ratio: opts.params.banana_aspect_ratio || '1:1',
        banana_quality: opts.params.banana_quality || 'standard',
        output_format: 'png',
      })),
      revisedPrompts: images.map(() => undefined),
      ...(failedRequests.length ? { failedRequests } : {}),
    }
  } catch (error) {
    if (controller.signal.aborted) throw new Error(`Nano Banana 请求超时（${profile.timeout} 秒）`)
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
