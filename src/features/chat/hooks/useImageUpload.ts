import { useState, useCallback } from 'react'

const MAX_IMAGES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
]

interface ImageFile {
  id: string
  file: File
  previewUrl: string
  dataUri: string
}

interface UseImageUploadReturn {
  images: ImageFile[]
  error: string | null
  addImages: (files: FileList | File[]) => Promise<void>
  removeImage: (id: string) => void
  clearImages: () => void
  getDataUris: () => string[]
}

function generateId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function useImageUpload(): UseImageUploadReturn {
  const [images, setImages] = useState<ImageFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const addImages = useCallback(
    async (files: FileList | File[]) => {
      setError(null)
      const fileArray = Array.from(files)

      // Validate count
      if (images.length + fileArray.length > MAX_IMAGES) {
        setError(`画像は最大${MAX_IMAGES}枚までです`)
        return
      }

      const newImages: ImageFile[] = []
      for (const file of fileArray) {
        // Validate type
        if (!ALLOWED_TYPES.includes(file.type)) {
          setError(
            `${file.name}: 対応していない形式です。JPEG, PNG, WebP, GIF, BMPが使用可能です。`,
          )
          return
        }
        // Validate size
        if (file.size > MAX_FILE_SIZE) {
          setError(`${file.name}: ファイルサイズが10MBを超えています`)
          return
        }

        const dataUri = await fileToDataUri(file)
        newImages.push({
          id: generateId(),
          file,
          previewUrl: URL.createObjectURL(file),
          dataUri,
        })
      }

      setImages((prev) => [...prev, ...newImages])
    },
    [images.length],
  )

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((img) => img.id !== id)
    })
    setError(null)
  }, [])

  const clearImages = useCallback(() => {
    setImages((prev) => {
      for (const img of prev) {
        URL.revokeObjectURL(img.previewUrl)
      }
      return []
    })
    setError(null)
  }, [])

  const getDataUris = useCallback(() => {
    return images.map((img) => img.dataUri)
  }, [images])

  return { images, error, addImages, removeImage, clearImages, getDataUris }
}
