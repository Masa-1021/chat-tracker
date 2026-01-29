export interface DataFilters {
  themeId?: string
  createdBy?: string
  keyword?: string
  dateFrom?: string
  dateTo?: string
  sortBy: 'createdAt' | 'updatedAt' | 'title'
  sortOrder: 'ASC' | 'DESC'
  limit: number
  nextToken?: string
}

export interface DataFormInput {
  title: string
  content: Record<string, string | number>
  images: File[]
}
