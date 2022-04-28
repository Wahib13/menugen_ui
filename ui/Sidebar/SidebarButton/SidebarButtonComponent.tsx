import { USSDApp } from "../../../entities/page"
import styles from '../Sidebar.module.css'

export const SidebarButton = (
    {
        ussd_app,
        setActiveAppAction,
        selected
    }:
        {
            ussd_app: USSDApp
            setActiveAppAction: ((ussd_app_id: string, ussd_app_shortcode: string) => void)
            selected: boolean
        }
) => {

    return (
        <li className={selected ? styles.active : styles.inactive}
            onClick={
                (event) =>
                    setActiveAppAction(
                        ussd_app.id || '',
                        ussd_app.shortcode || ''
                    )
            } key={ussd_app.id}>
            <a>
                {ussd_app.shortcode}
            </a>
        </li>
    )
}