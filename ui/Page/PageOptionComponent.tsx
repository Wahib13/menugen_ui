import { useState } from "react"
import { Page, Option } from "../../entities/page"
import styles from "./Page.module.css"

const PageOptionComponent = (
    {
        index,
        page,
        content,
        updateOptionContent,
        handleSubmitPageUpdate
    }: {
        index: number,
        page: Page
        content: string
        updateOptionContent: (
            index: number,
            content: string,
            page: Page
        ) => void
        handleSubmitPageUpdate: (
            page: Page,
            context: string,
        ) => void
    }
) => {

    const [editing, setEditing] = useState<boolean>(false || content == "")

    const list_item = (editing) ? <input type="text"
        value={content}
        onChange={
            (e) => updateOptionContent(
                index,
                e.target.value,
                page
            )} /> : <span onClick={() => setEditing(true)}>{content}</span>

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                setEditing(false)
                return handleSubmitPageUpdate(page, page.context || '')
            }}>
                <li className={styles.page_option}>
                    {index + 1}. {list_item}
                </li>
            </form>
        </div>
    )
}

export { PageOptionComponent }