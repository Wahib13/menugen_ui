import { useState } from "react"
import { Page } from "../../entities/page"
import DeletePageButton from "../DeletePageButton/DeletePageButtonComponent"
import NewPageButton from "../NewPageButton/NewPageButtonComponent"
import styles from './Page.module.css'


const LIST_COLORS = ["red", "blue", "green", "yellow"]

const PageComponent = (
    {
        id,
        level,
        context = "",
        page,
        start_editable,
        optionComponents,
        setPageContext,
        handleSubmitPageUpdate,
        addOption,
        handleNewPage = (

        ) => { },
        handleDeletePage = (

        ) => { }
    }:
        {
            id: string,
            level: number,
            context?: string,
            page: Page,
            start_editable: boolean,
            optionComponents: React.ReactNode[],
            setPageContext: (page_id: string, level: number, context: string) => void,
            handleSubmitPageUpdate: (
                page: Page,
                context: string,
            ) => void
            addOption: (
                page: Page,
                event: any
            ) => void,
            handleNewPage?: (
                {
                    page,
                    next_page_name,
                }: {
                    page: Page,
                    next_page_name: string,
                }) => void,
            handleDeletePage?: (
                page_name: string
            ) => void
        }
) => {
    const [is_editing, setIsEditing] = useState(start_editable)

    const body = (is_editing) ?
        <form onSubmit={(event) => {
            event.preventDefault()
            setIsEditing(false)
            return handleSubmitPageUpdate(page, context)
        }}>
            <input type="text" value={context}
                onChange={(e) => setPageContext(id, level, e.target.value)} />
        </form>
        :
        <p className={styles.page_context} onClick={() => setIsEditing(true)}><span>&nbsp;&nbsp;</span>{context}</p>

    return (
        <div className={styles.page}>
            <div className={styles.page_content}>
                <div className={styles.page_context}>
                    {body}
                </div>
                <ul>
                    {optionComponents}
                </ul>
                <button className={styles.add_option_button} onClick={(event) => {
                    return addOption(page, event)
                }}>+</button>
                {page.type === "END" && page.name != "intro" ?
                    <DeletePageButton
                        key={`delete_${page.id}`}
                        page_name={page.name}
                        handleDeletePage={handleDeletePage}
                    />
                    :
                    <></>}
            </div>
            {page.type === "END" ?
                <NewPageButton
                    key={`new_page_${page.id}`}
                    page={page}
                    handleNewPage={handleNewPage}
                />
                :
                <></>}

        </div>
    )
}


export { PageComponent }