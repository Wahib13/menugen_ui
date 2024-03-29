import { Dispatch, SetStateAction, useState } from 'react'
import { QueryClient } from 'react-query'
import { useGetApps } from '../../adapters/app_adapter'
import { USSDApp } from '../../entities/page'
import DataResetTimer from '../DataResetTimer/DataResetTimer'
import styles from './Sidebar.module.css'
import { SidebarButton } from './SidebarButton/SidebarButtonComponent'

export const Sidebar = (
    {
        apps,
        setActiveApp,
        createNewApp,
    }:
        {
            apps: USSDApp[],
            setActiveApp: (ussd_app_id: string, ussd_app_shortcode: string) => void
            createNewApp: (new_app_shortcode: string) => void
        }
) => {

    const [new_app_shortcode, setNewAppShortcode] = useState<string>('')


    return (
        <div className={styles.sidebar}>
            <h2>Shortcodes</h2>
            <ul>
                {apps.map((ussd_app, idx) => {
                    return <SidebarButton
                        key={`side_bar_button_${idx}`}
                        selected={ussd_app.selected}
                        setActiveAppAction={setActiveApp}
                        ussd_app={ussd_app}
                    />
                })}
                <li>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        createNewApp(new_app_shortcode)
                        setNewAppShortcode('')
                    }}>
                        <input value={new_app_shortcode} onChange={(e) => setNewAppShortcode(e.target.value)} />
                    </form>
                </li>
            </ul>
            {/* <DataResetTimer
                key={"data_reset_timer"}
            /> */}
        </div>
    )
}