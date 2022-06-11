import Tree from "rc-tree"
import { useState } from "react"
import { useMutation } from "react-query"
import { useDeletePage, useGetPages, useUpdatePage } from "../../adapters/page_adapter"
import { Option, Page } from "../../entities/page"
import { PageComponent } from "../Page/PageComponent"
import styles from './Menu.module.css'
import { QueryClient } from 'react-query';
import make_random_name from "../../utils"
import { PageOptionComponent } from "../Page/PageOptionComponent"
import PageLoader from "next/dist/client/page-loader"

const Menu = (
    {
        queryClient,
        app_id,
        shortcode
    }:
        {
            queryClient: QueryClient,
            app_id: string,
            shortcode: string
        }
) => {

    const [pages, setPages] = useState<Page[]>([])
    const { isLoading, error, data } = useGetPages(app_id, setPages)

    const updatePageMutation = useMutation(useUpdatePage, {
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries()
        }
    })

    const setPageContext = (
        page_id: string,
        level: number,
        page_context: string) => {
        const pages_new = pages.map(
            (page) => {
                if (page.id == page_id) {
                    return {
                        ...page,
                        context: page_context
                    }
                }
                return page
            }
        )
        setPages(pages_new)
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
        const page_id = page.id || ''
        const new_page = {
            ...page,
            options: page.options.map((option, index) => {
                if (index == option_index) {
                    return {
                        ...option,
                        content: content
                    }
                }
                return option
            })
        }

        const new_pages = pages.map((page) => {
            if (page.id == page_id) {
                return new_page
            }
            return page
        })
        setPages(new_pages)
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
            page,
            next_page_name,
        }: {
            page: Page,
            next_page_name: string,
        }) => {
        updatePageMutation.mutate({
            ussd_app_id: page.ussd_app_id || '',
            page_name: page.name,
            next_page_name: next_page_name,
            context: page.context || '',
            options: page.options
        })
    }

    const handleDeletePage = (name: string) => {
        deletePageMutation.mutate({
            app_id: app_id,
            page_name: name
        })
    }

    const convertOptionsToComponents = (
        options: Option[],
        page: Page
    ) => {
        if (options) {
            return options.map((option, idx) => {
                return <PageOptionComponent
                    key={`${page.id || ''} + ${idx}`}
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

    const createdPageIds: any = []

    const createPageComponent = (pages: Page[], page: Page) => {
        if (createdPageIds.includes(page.id)) {
            return null
        }
        let page_leaf: any = {
            key: `node_${app_id}_${page.id}`,
            title: <PageComponent
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
                handleNewPage={handleNewPage}
                handleDeletePage={handleDeletePage}
            />,
            children: []
        }

        createdPageIds.push(page.id)

        if (page.options.length > 0) {
            for (let k = 0; k < page.options.length; k++) {
                const child_page: Page | null = pages.filter((page_) => page_.name == page.options[k].next_page_name)[0]
                if (!child_page) {
                    continue;
                }
                // console.log(`content: ${child_page_via_options.context}, final_vertical_position: ${k + vertical_position}, k = ${k}, v = ${vertical_position}`)
                const childNode = createPageComponent(pages, child_page)
                if (childNode) {
                    page_leaf.children.push(childNode)
                }
            }
        }
        if (page.next_page_name) {
            const child_page = pages.filter((page_) => page_.name === page.next_page_name)[0]
            if (!child_page) {
                return page_leaf
            }
            const childNode = createPageComponent(pages, child_page)
            if (childNode) {
                page_leaf.children.push(childNode)
            }
        }
        return page_leaf
    }

    if (pages.length > 0) {
        return (
            <div className={styles.page_container_overflow}>
                <Tree
                    className="myCls"
                    showLine={true}
                    checkable={false}
                    selectable={false}
                    showIcon={false}
                    defaultExpandAll={true}
                    // autoExpandParent={true}
                    // defaultExpandParent={true}
                    treeData={[createPageComponent(pages, pages[0])]}
                />

            </div>
        )
    }

    return (
        <></>
    )

}


export { Menu }

