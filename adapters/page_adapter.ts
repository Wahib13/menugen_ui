import axios from "axios"
import { useQuery } from "react-query"
import { Option } from "../entities/page"

const PAGES_ENDPOINT = process.env.NEXT_PUBLIC_PAGES_ENDPOINT || ''


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
        onSuccess: (data) => {
            const grouped_pages = groupPages(data)
            setPages(grouped_pages)
        }
    })
}

const groupPages = (raw_page_data: any[]) => {
    let grouped_pages: any[][] = [[]]
    raw_page_data.map((raw_page) => {
        while (grouped_pages.length < raw_page.level) {
            grouped_pages.push([])
        }
        grouped_pages[raw_page.level - 1].push(raw_page)
    })
    return grouped_pages
}

export const useUpdatePage = (
    {
        ussd_app_id,
        page_name,
        next_page_name,
        context,
        options,
    }: {
        ussd_app_id: string,
        page_name: string,
        next_page_name: string,
        context: string,
        options: Option[]
    }
) => {
    return axios.put(PAGES_ENDPOINT + `/${ussd_app_id}/${page_name}/`,
        {
            context: context,
            options: options,
            next_page_name: next_page_name
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        }).then(res => {
            console.log(res.data)
            return res.data
        })
}

export const useDeletePage = (
    {
        app_id,
        page_name
    }:
        {
            app_id: string,
            page_name: string
        }) => {
    return axios.delete(PAGES_ENDPOINT + `/${app_id}/${page_name}/`, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
    }).then(res => res.status)
}


