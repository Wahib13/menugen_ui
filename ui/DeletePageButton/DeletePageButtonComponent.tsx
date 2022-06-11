import styles from './DeletePageButton.module.css'

const DeletePageButton = (
    {
        page_name,
        handleDeletePage
    }: {
        page_name: string,
        handleDeletePage: (page_name: string) => void
    }
) => {

    return <button
        className={styles.delete_button}
        onClick={() => handleDeletePage(page_name)}>
        x
    </button>
}

export default DeletePageButton;