export type Customer = {
    msisdn: string
}

export type CustomerSession = {
    customer: Customer
    shortcode: string
    session_id: string
    current_page_name: string
    user_inputs?: {}
}

export type CustomerInput = {
    message: string
    type: 'INITIATED' | 'CONTINUE'
}