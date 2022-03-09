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
        prev_page_name,
        new_blank,
        level = -1,
        ussd_app_id,
        deletePage,
        handleNewPage
    }:
        Page
) => {
    const [is_editing, setIsEditing] = useState(new_blank)
    const [current_content, setCurrentContent] = useState(context)

    const updateMutation = useMutation(useUpdatePage)

    const handleSubmitContent = (event: any) => {
        if (is_editing) {
            if (new_blank && handleNewPage) {
                handleNewPage({
                    prev_page_name: prev_page_name,
                    name: make_random_name(),
                    context: current_content,
                    ussd_app_id,
                })
                setCurrentContent('')
            }
            else {
                updateMutation.mutate({ page_id: id, context: current_content })
                setIsEditing(false)
            }
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

export { PageComponent }