import styles from './Delete.module.css'

const DeleteButton = (
    {
        page_name,
        deletePage
    }: {
        page_name: string,
        deletePage: (page_name: string) => void
    }) => {

    return <button
        className={styles.delete_button}
        onClick={() => {
            return deletePage(page_name)
        }}>x</button>

}

export { DeleteButton }