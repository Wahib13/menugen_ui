import { useState } from "react"
import { useMutation } from "react-query"
import { useDeletePage, useGetPages, useUpdatePage } from "../../adapters/page_adapter"
import { Option, Page } from "../../entities/page"
import { PageComponent } from "../Page/PageComponent"
import styles from './Menu.module.css'
import { QueryClient } from 'react-query';
import make_random_name from "../../utils"
import { PageOptionComponent } from "../Page/PageOptionComponent"
import { DeleteButton } from "../Page/DeleteButtonComponent"

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

    const [grouped_pages, setGroupedPages] = useState<Page[][]>([[]])
    const { isLoading, error, data } = useGetPages(app_id, setGroupedPages)

    const updatePageMutation = useMutation(useUpdatePage, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries()
        }
    })

    const setPageContext = (
        page_id: string,
        level: number,
        page_context: string) => {
        const page_groups = grouped_pages.slice()
        page_groups[level - 1] = page_groups[level - 1].map(
            (page) => {
                if (page.id == page_id) {
                    return { ...page, context: page_context }
                }
                return page
            }
        )
        setGroupedPages(page_groups)
    }

    const addOption = (page: Page, event: any) => {
        updatePageMutation.mutate({
            ussd_app_id: app_id,
            page_name: page.name || '',
            context: page.context || '',
            next_page_name: page.next_page_name || '',
            options: [
                ...page.options,
                {
                    next_page_name: make_random_name(),
                    content: ""
                }
            ]
        },
        )
        event.preventDefault()
    }

    const updateOptionContent = (
        option_index: number,
        content: string,
        page: Page
    ) => {
        const page_level = page.level || 1
        const page_id = page.id || ''

        const page_groups = grouped_pages.slice()
        page_groups[page_level - 1] = page_groups[page_level - 1].map(
            (page) => {
                if (page.id == page_id) {
                    return {
                        ...page,
                        options: page.options.map((option, index) => {
                            if (index == option_index) {
                                return { ...option, content: content }
                            }
                            return option
                        })
                    }
                }
                return page
            }
        )
        setGroupedPages(page_groups)
    }



    const handleSubmitPageUpdate = (
        page: Page,
        context: string
    ) => {
        updatePageMutation.mutate({
            ussd_app_id: app_id,
            page_name: page.name || '',
            next_page_name: page.next_page_name || '',
            context: context,
            options: page.options
        })
    }


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

    const new_page_button = (grouped_pages.length > 0) ?
        <button key={`${app_id}_new_page_button`} onClick={() => {
            const last_page_group = grouped_pages[grouped_pages.length - 1]
            const last_page = last_page_group[last_page_group.length - 1]
            return handleNewPage({
                name: last_page.name || '',
                context: last_page.context || '',
                next_page_name: make_random_name(),
                ussd_app_id: app_id
            })
        }}>+</button> :
        <></>

    const convertOptionsToComponents = (
        options: Option[],
        page: Page
    ) => {
        if (options) {
            return options.map((option, idx) => {
                return <PageOptionComponent
                    key={page.id || '' + idx}
                    index={idx}
                    page={page}
                    content={option.content}
                    updateOptionContent={updateOptionContent}
                    handleSubmitPageUpdate={handleSubmitPageUpdate}
                />
            })
        } else {
            return []
        }
    }

    return (
        <div className={styles.page_container_overflow}>
            <div className={styles.page_container_horizontal}>
                {grouped_pages.map((page_vertical_group: any[], idx1: number) => {

                    return (
                        <div className={styles.page_container_vertical}>
                            {page_vertical_group.map(
                                (page: Page, idx: number) => {
                                    let delete_button = <></>
                                    if (
                                        grouped_pages.length > 1 &&
                                        idx1 == grouped_pages.length - 1 &&
                                        idx == page_vertical_group.length - 1
                                    ) {
                                        delete_button = <DeleteButton
                                            page_name={page.name}
                                            deletePage={deletePage}
                                        />
                                    }
                                    return <PageComponent
                                        key={`${app_id}_${page.id}`}
                                        id={page.id || ''}
                                        level={page.level || 1}
                                        context={page.context || ''}
                                        page={page}
                                        start_editable={false}
                                        setPageContext={setPageContext}
                                        optionComponents={convertOptionsToComponents(page.options, page)}
                                        handleSubmitPageUpdate={handleSubmitPageUpdate}
                                        addOption={addOption}
                                        deleteComponent={delete_button}
                                    />
                                }
                            )}
                        </div>
                    )
                })}
                {new_page_button}
            </div>
        </div>
    )
}


export { Menu }

