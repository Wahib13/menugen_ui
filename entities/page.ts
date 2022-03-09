export type USSDApp = {
    id?: string
    name?: string
    shortcode: string
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
    ussd_app_id: string
    deletePage?: ((id: string) => void)
    handleNewPage?: (page: Page) => void
}

export type Option = {
    content: string
    next_page_id: string
}