import axios from "axios"
import { useQuery } from "react-query"
import { Page } from "../entities/page"

const app_id = "1"
const PAGES_ENDPOINT = process.env.NEXT_PUBLIC_PAGES_ENDPOINT || ''


export const useCreatePage = (page: Page) => {
    return axios.post(PAGES_ENDPOINT, {
        prev_page_name: page.prev_page_name,
        context: page.context,
        type: page.type,
        name: page.name,
        ussd_app_id: app_id
    },
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        }).then(res => res.data)
}

export const useGetPages = (app_id: string, setPages: (data: any) => void) => {
    return useQuery(['pages', app_id], () => {
        return axios.get(PAGES_ENDPOINT + '?' + new URLSearchParams({ app_id: app_id }), {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        })
            .then(res => {
                console.log(res.data)
                return res.data
            })
    }, {
        onSuccess: setPages
    })
}

export const useUpdatePage = ({ page_id, context }: { page_id: string, context: string }) => {
    return axios.put(PAGES_ENDPOINT + `/${page_id}/`, {
        context: context
    }, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
    }).then(res => res.data)
}

export const useDeletePage = (page_name: string) => {
    return axios.delete(PAGES_ENDPOINT + `/${page_name}/`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
    }).then(res => res.status)
}


