import { Page } from "../../entities/page";
import make_random_name from "../../utils";

const NewPageButton = (
    {
        page,
        handleNewPage
    }:
        {
            page: Page
            handleNewPage: (
                {
                    page,
                    next_page_name,
                }: {
                    page: Page,
                    next_page_name: string,
                }) => void
        }
) => {
    return <button
        key={`${page.ussd_app_id}_new_page_button`}
        onClick={() => {
            return handleNewPage({
                page,
                next_page_name: make_random_name(),
            })
        }}>+</button>
}

export default NewPageButton;