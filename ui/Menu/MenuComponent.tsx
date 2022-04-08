import { useState } from "react"
import { useMutation } from "react-query"
import { useDeletePage, useGetPages, useUpdatePage } from "../../adapters/page_adapter"
import { Option, Page } from "../../entities/page"
import { PageComponent } from "../Page/PageComponent"
import styles from './Menu.module.css'
import { QueryClient } from 'react-query';

const Menu = (
    {
        queryClient,
        app_id
    }:
        {
            queryClient: QueryClient,
            app_id: string
        }
) => {

    const [pages, setPages] = useState<Page[]>([{ ussd_app_id: app_id }])
    const { isLoading, error, data } = useGetPages(app_id, setPages)

    const updatePageMutation = useMutation(useUpdatePage, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries()
        }
    })

    const deletePageMutation = useMutation(useDeletePage, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries()
        }
    })

    const handleNewPage = (
        {
            name,
            context,
            next_page_name,
            ussd_app_id
        }: {
            name: string,
            context: string,
            next_page_name: string,
            ussd_app_id: string,
        }) => {
        updatePageMutation.mutate({
            ussd_app_id: ussd_app_id,
            page_name: name,
            next_page_name: next_page_name,
            context: context,
            options: []
        })
    }
    const deletePage = (name: string) => {
        deletePageMutation.mutate({
            app_id: app_id,
            page_name: name
        })
    }

    const new_page_button = (pages.length > 0) ?
        <button key={`${app_id}_new_page_button`} onClick={() => handleNewPage({
            name: pages[pages.length - 1].name || '',
            context: pages[pages.length - 1].context || '',
            next_page_name: make_random_name(),
            ussd_app_id: app_id
        })}>+</button> :
        <></>
    // only show delete button on last page and never on the first single page
    const delete_button = (pages.length > 1) ?
        <button key={`${app_id}_delete_button`} onClick={() => deletePage(pages[pages.length - 1].name || '')}>x</button> :
        <></>

    return (
        <div className={styles.page_container_overflow}>
            <div className={styles.page_container_horizontal}>
                {pages.map((page: any, idx: number) => {
                    return <div>
                        <PageComponent
                            key={`${app_id}_${page.id}`}
                            id={page.id}
                            context={page.context}
                            options={page.options}
                            level={page.level}
                            name={page.name}
                            next_page_name={page.next_page_name}
                            new_blank={false}
                            ussd_app_id={app_id}
                        />
                    </div>
                })}

                {delete_button}
                {new_page_button}
            </div>
        </div>
    )
}


function make_random_name() {
    const length = 5;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


export { Menu }

