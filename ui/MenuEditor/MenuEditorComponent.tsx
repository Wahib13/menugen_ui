import Link from 'next/link'
import { useState } from 'react'
import { QueryClient, useMutation } from 'react-query'
import { useCreateApp, useGetApps } from '../../adapters/app_adapter'
import { USSDApp } from '../../entities/page'
import { Menu } from '../Menu/MenuComponent'
import MenuTesterComponent from '../MenuTester/MenuTesterComponent'
import { Sidebar } from '../Sidebar/SidebarComponent'

export const MenuEditor = (
    { queryClient }: { queryClient: QueryClient }
) => {

    const [apps, setApps] = useState<USSDApp[]>([])
    const [active_app, setActiveApp] = useState<string>('')
    const [active_app_shortcode, setActiveAppShortcode] = useState<string>('')

    const createAppMutation = useMutation(useCreateApp, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries()
            updateActiveApp(data.id, data.shortcode)
        }
    })

    const createNewApp = (new_app_shortcode: string) => {
        createAppMutation.mutate({
            name: 'test',
            shortcode: new_app_shortcode,
            selected: false
        })
        queryClient.invalidateQueries()
    }

    const updateActiveApp = (ussd_app_id: string, ussd_app_shortcode: string) => {
        setActiveApp(ussd_app_id)
        setActiveAppShortcode(ussd_app_shortcode)
        setApps(apps.map(
            (app) => {
                let new_selected = false
                if (app.id == ussd_app_id) {
                    new_selected = true
                }

                return { ...app, selected: new_selected }
            }
        ))
    }

    const { isLoading, error, data } = useGetApps(setApps, setActiveApp, setActiveAppShortcode, active_app, active_app_shortcode)

    const menu_component = (apps.length > 0 && active_app != '') ?
        <Menu
            shortcode={active_app_shortcode}
            app_id={active_app}
            queryClient={queryClient}
        /> :
        <></>

    return (
        <>
            {menu_component}
            <Sidebar createNewApp={createNewApp} apps={apps} setActiveApp={updateActiveApp} />
            <MenuTesterComponent shortcode={active_app_shortcode} />
        </>
    )
}