import { useRef, useState, type DragEvent } from 'react'
import { SerendieSymbolClose, SerendieSymbolImage } from '@serendie/symbols'
import { useImageUpload } from '../hooks/useImageUpload'

interface ImageAttachmentProps {
  onImagesChange: (dataUris: string[]) => void
  disabled?: boolean
}

export function ImageAttachment({
  onImagesChange,
  disabled = false,
}: ImageAttachmentProps) {
  const { images, error, addImages, removeImage, getDataUris } =
    useImageUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    await addImages(files)
    // Notify parent of updated images (after state update)
    setTimeout(() => onImagesChange(getDataUris()), 0)
  }

  const handleRemove = (id: string) => {
    removeImage(id)
    setTimeout(() => onImagesChange(getDataUris()), 0)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="image-attachment">
      {/* Image Button */}
      <button
        type="button"
        className="image-attachment-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || images.length >= 5}
        aria-label="画像を添付"
        title="画像を添付"
      >
        <SerendieSymbolImage width={20} height={20} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
        multiple
        className="image-attachment-input"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={disabled}
      />

      {/* Drop zone & preview */}
      {images.length > 0 && (
        <div
          className={`image-attachment-previews ${isDragging ? 'is-dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {images.map((img) => (
            <div key={img.id} className="image-attachment-thumb">
              <img
                src={img.previewUrl}
                alt={img.file.name}
                onClick={() => setPreviewSrc(img.previewUrl)}
              />
              <button
                type="button"
                className="image-attachment-remove"
                onClick={() => handleRemove(img.id)}
                aria-label={`${img.file.name}を削除`}
              >
                <SerendieSymbolClose width={14} height={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="image-attachment-error">{error}</div>}

      {/* Full preview overlay */}
      {previewSrc && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewSrc(null)}
          role="dialog"
          aria-label="画像プレビュー"
        >
          <img src={previewSrc} alt="プレビュー" />
        </div>
      )}
    </div>
  )
}
