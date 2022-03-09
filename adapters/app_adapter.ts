import axios from "axios"
import { useQuery } from "react-query"

const APPS_ENDPOINT = process.env.NEXT_PUBLIC_APPS_ENDPOINT || ''
console.log(APPS_ENDPOINT)

export const useGetApps = (setApps: (data: any) => void) => {
    return useQuery(['apps'], () => {
        return axios.get(APPS_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
            }
        })
            .then(res => {
                console.log(res.data)
                return res.data
            })
    }, {
        onSuccess: setApps
    })
}

