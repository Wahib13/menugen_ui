import { useState } from "react"
import { Page } from "../../entities/page"
import styles from './Page.module.css'

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
                event: any,
                context: string,
                setIsEditing: (editing: boolean) => void
            ) => void
            addOption: (
                page: Page,
                event: any
            ) => void,
        }
) => {
    const [is_editing, setIsEditing] = useState(start_editable)

    const body = (is_editing) ?
        <div>
            <form onSubmit={(event) => {
                event.preventDefault()
                setIsEditing(false)
                return handleSubmitPageUpdate(page, event, context, setIsEditing)
            }}>
                <input type="text" value={context}
                    onChange={(e) => setPageContext(id, level, e.target.value)} />
            </form>
        </div> :
        <p onClick={() => setIsEditing(true)}><span>&nbsp;&nbsp;</span>{context}</p>



    return (
        <div className={styles.page}>
            {deleteComponent}
            <div className={styles.page_content}>
                {body}
                <ul>
                    {optionComponents}
                </ul>
                <button onClick={(event) => {
                    return addOption(page, event)
                }}>+</button>
            </div>
        </div>
    )
}

export { PageComponent }