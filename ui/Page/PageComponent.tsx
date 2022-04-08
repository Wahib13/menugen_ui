import { useState } from "react"
import { useMutation } from "react-query"
import { useDeletePage, useUpdatePage } from "../../adapters/page_adapter"
import { Option, Page } from "../../entities/page"
import styles from './Page.module.css'

const PageComponent = (
    {
        id = "",
        context = "",
        options = [],
        new_blank,
        name,
        next_page_name,
        level = -1,
        ussd_app_id,
    }:
        Page
) => {
    const [is_editing, setIsEditing] = useState(new_blank)
    const [current_content, setCurrentContent] = useState(context)

    const updateMutation = useMutation(useUpdatePage)

    const handleSubmitContent = (event: any) => {
        if (is_editing) {
            updateMutation.mutate({
                ussd_app_id: ussd_app_id,
                next_page_name: next_page_name || '',
                page_name: name || '',
                context: current_content,
                options: options
            })
            setIsEditing(false)
            event.preventDefault()
        }
    }

    const body = (is_editing) ?
        <div>
            <form onSubmit={handleSubmitContent}>
                <input type="text" value={current_content}
                    onChange={(e) => setCurrentContent(e.target.value)} />
            </form>
        </div> :
        <p onClick={() => setIsEditing(true)}><span>&nbsp;&nbsp;</span>{current_content}</p>



    return (
        <div className={styles.page}>
            <div className={styles.page_content}>
                {body}
                <ul>
                    {options.map((option, idx) => {
                        return <li key={id + idx}>{option.content}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export { PageComponent }