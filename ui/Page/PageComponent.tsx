import { useState } from "react"
import { Page } from "../../entities/page"
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
        deleteComponent,
        setPageContext,
        handleSubmitPageUpdate,
        addOption,
    }:
        {
            id: string,
            level: number,
            context: string,
            page: Page,
            start_editable: boolean,
            deleteComponent?: any,
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

    const getPageBackgroundColor = () => {
        // return context == "" ? "green" : "white"
        return "white"
    }


    return (
        <div className={styles.page}>
            {deleteComponent}
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
            </div>
        </div>
    )
}


export { PageComponent }