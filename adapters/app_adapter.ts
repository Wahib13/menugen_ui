import axios from "axios"
import { useQuery } from "react-query"
import { USSDApp } from "../entities/page"

const APPS_ENDPOINT = process.env.NEXT_PUBLIC_APPS_ENDPOINT || ''
console.log(APPS_ENDPOINT)

export const useGetApps = (
    setApps: (data: any[]) => void,
    updateActiveApp: (ussd_app_id: string) => void,
    current_active_app_id: string
) => {
    return useQuery(['apps'], () => {
        return axios.get(APPS_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        })
            .then(res => {
                return res.data
            })
    }, {
        onSuccess: (data: any[]) => {
            if (data.length > 0) {

                const defaultActiveApp = data[0].id || ''
                const new_active_app = current_active_app_id != '' ? current_active_app_id : defaultActiveApp
                updateActiveApp(new_active_app)

                setApps(data.map(
                    (app: any) => {
                        let new_selected = false
                        if (app.id == new_active_app) {
                            new_selected = true
                        }
                        return { ...app, selected: new_selected }
                    }
                ))
            }
        }
    })
}

export const useCreateApp = (app: USSDApp) => {
    return axios.post(APPS_ENDPOINT, {
        name: app.name,
        shortcode: app.shortcode,
    },
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        }).then(res => res.data)
}

