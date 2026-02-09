import { MAX_IMAGE_SIZE, MAX_IMAGE_COUNT, SUPPORTED_IMAGE_FORMATS } from '@/shared/constants/config'

export function validateImageFile(file: File): string | null {
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type as (typeof SUPPORTED_IMAGE_FORMATS)[number])) {
    return `対応していない画像形式です: ${file.type}`
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `ファイルサイズが大きすぎます（最大${MAX_IMAGE_SIZE / 1024 / 1024}MB）`
  }
  return null
}

export function validateImageCount(currentCount: number, newCount: number): string | null {
  if (currentCount + newCount > MAX_IMAGE_COUNT) {
    return `画像は最大${MAX_IMAGE_COUNT}枚まで添付できます`
  }
  return null
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) {
    return `${fieldName}は必須です`
  }
  return null
}
