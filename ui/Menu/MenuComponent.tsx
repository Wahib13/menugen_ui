import { useState } from "react"
import { useMutation } from "react-query"
import { useCreatePage, useDeletePage, useGetPages } from "../../adapters/page_adapter"
import { Page } from "../../entities/page"
import { PageComponent } from "../Page/PageComponent"
import styles from './Menu.module.css'
import { QueryClient } from 'react-query';
import Button from "react-bootstrap/Button"

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

    const [pages, setPages] = useState<Page[]>([])
    const { isLoading, error, data } = useGetPages(app_id, setPages)

    const createPageMutation = useMutation(useCreatePage, {
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
            prev_page_name,
            context,
        }: Page) => {
        console.log(`creating new page ${prev_page_name}`)
        createPageMutation.mutate({
            prev_page_name: prev_page_name,
            name: name,
            context: context,
            type: 'END',
            ussd_app_id: app_id
        })
    }
    const deletePage = (id: string) => {
        deletePageMutation.mutate(id)
    }

    const new_blank_page = (pages.length > 0) ?
        <PageComponent
            key={`${app_id}_blank_page`}
            new_blank={true}
            handleNewPage={handleNewPage}
            prev_page_name={pages[pages.length - 1].name}
            ussd_app_id={app_id}
        /> : <></>

    // only show delete button on last page and never on the first single page
    const delete_button = (pages.length > 0 && pages.length > 1) ?
        <Button key={`${app_id}_delete_button`} variant="danger" onClick={() => deletePage(pages[pages.length - 1].id || '')}>x</Button> :
        <></>

    return (
        <div className={styles.page_container_horizontal}>
            {pages.map((page: any, idx: number) => {
                return <div>
                    <PageComponent
                        key={`${app_id}_${page.id}`}
                        id={page.id}
                        context={page.context}
                        options={page.options}
                        level={page.level}
                        prev_page_name={page.prev_page_name}
                        name={page.name}
                        new_blank={false}
                        deletePage={deletePage}
                        ussd_app_id={app_id}
                    />
                </div>
            })}

            {delete_button}
            {new_blank_page}
        </div>
    )
}



export { Menu }

