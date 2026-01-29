import {
  SUPPORTED_IMAGE_FORMATS,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_COUNT,
} from '../constants/config'

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type as (typeof SUPPORTED_IMAGE_FORMATS)[number])) {
    return {
      valid: false,
      error: `サポートされていないファイル形式です。${SUPPORTED_IMAGE_FORMATS.join(', ')}のみ対応しています。`,
    }
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `ファイルサイズが大きすぎます。最大${MAX_IMAGE_SIZE / 1024 / 1024}MBまでです。`,
    }
  }

  return { valid: true }
}

export function validateImageFiles(files: File[]): { valid: boolean; error?: string } {
  if (files.length > MAX_IMAGE_COUNT) {
    return {
      valid: false,
      error: `画像は最大${MAX_IMAGE_COUNT}枚までアップロードできます。`,
    }
  }

  for (const file of files) {
    const result = validateImageFile(file)
    if (!result.valid) {
      return result
    }
  }

  return { valid: true }
}

export function getImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
