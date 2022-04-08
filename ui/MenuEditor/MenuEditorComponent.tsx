import { useState } from 'react'
import { QueryClient, useMutation } from 'react-query'
import { useCreateApp, useGetApps } from '../../adapters/app_adapter'
import { USSDApp } from '../../entities/page'
import { Menu } from '../Menu/MenuComponent'
import { Sidebar } from '../Sidebar/SidebarComponent'

export const MenuEditor = (
    { queryClient }: { queryClient: QueryClient }
) => {

    const [apps, setApps] = useState<USSDApp[]>([])
    const [active_app, setActiveApp] = useState<string>('')

    const createAppMutation = useMutation(useCreateApp, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries()
            updateActiveApp(data.id)
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

    const updateActiveApp = (ussd_app_id: string) => {
        setActiveApp(ussd_app_id)
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

    const { isLoading, error, data } = useGetApps(setApps, setActiveApp, active_app)

    const menu_component = (apps.length > 0 && active_app != '') ?
        <Menu app_id={active_app} queryClient={queryClient} /> :
        <></>

    return (
        <>
            {menu_component}
            <Sidebar createNewApp={createNewApp} apps={apps} setActiveApp={updateActiveApp} />
        </>
    )
}