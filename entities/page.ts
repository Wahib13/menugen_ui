export type USSDApp = {
    name?: string
    shortcode: string
    pages: Page[]
}

export type Page = {
    id?: string
    name?: string
    context?: string
    options?: Option[]
    prev_page_name?: string
    next_page_name?: string
    level?: number
    type?: 'END' | 'CONTINUE'
    new_blank?: boolean
    deletePage?: ((id: string) => void)
    handleNewPage?: (page: Page) => void
}

export type Option = {
    content: string
    next_page_id: string
}