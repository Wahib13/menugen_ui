import axios from "axios"
import { useQuery } from "react-query"
import { Option, Page } from "../entities/page"

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
        onSuccess: setPages
    })
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
    return axios.put(PAGES_ENDPOINT + `/${ussd_app_id}/${page_name}/`, {
        next_page_name: next_page_name,
        context: context,
        options: options
    }, {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
    }).then(res => res.data)
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


