import { Dispatch, SetStateAction, useState } from 'react'
import { QueryClient } from 'react-query'
import { useGetApps } from '../../adapters/app_adapter'
import { USSDApp } from '../../entities/page'
import styles from './Sidebar.module.css'
import Button from 'react-bootstrap/Button'

export const Sidebar = (
    {
        queryClient,
        setActiveApp
    }:
        {
            queryClient: QueryClient,
            setActiveApp: Dispatch<SetStateAction<string>>
        }
) => {

    const [apps, setApps] = useState<USSDApp[]>([])
    const { isLoading, error, data } = useGetApps(setApps)

    return (
        <div className={styles.sidebar}>
            <h2>Shortcodes</h2>
            <ul>
                {apps.map((ussd_app) => {
                    return <li onClick={() => setActiveApp(ussd_app.id || '')} key={ussd_app.id}>
                        <button>
                            {ussd_app.shortcode}
                        </button>
                    </li>
                })}
            </ul>
        </div>
    )
}