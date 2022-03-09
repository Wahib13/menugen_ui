import { useState } from 'react'
import { QueryClient } from 'react-query'
import { useGetApps } from '../../adapters/app_adapter'
import { USSDApp } from '../../entities/page'
import { Menu } from '../Menu/MenuComponent'
import { Sidebar } from '../Sidebar/SidebarComponent'

export const MenuEditor = (
    { queryClient }: { queryClient: QueryClient }
) => {

    const [apps, setApps] = useState<USSDApp[]>([])
    const [active_app, setActiveApp] = useState<string>('')
    
    const setAppsAndActiveApp = (data: any): void => {
        setApps(data)
        setActiveApp(data[0].id || '')
    }

    const { isLoading, error, data } = useGetApps(setAppsAndActiveApp)

    const menu_component = (apps.length > 0 && active_app != '') ?
        <Menu app_id={active_app} queryClient={queryClient} /> :
        <></>

    return (
        <>
            <Sidebar queryClient={queryClient} setActiveApp={setActiveApp} />
            {menu_component}
        </>
    )
}