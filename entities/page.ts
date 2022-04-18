export type USSDApp = {
    id?: string
    name?: string
    shortcode: string
    selected: boolean
}

export type Page = {
    id?: string
    name: string
    context?: string
    options: Option[]
    prev_page_name?: string
    next_page_name?: string
    level?: number
    type?: 'END' | 'CONTINUE'
    editing?: boolean
    ussd_app_id?: string,
}

export type Option = {
    content: string
    next_page_name: string
}