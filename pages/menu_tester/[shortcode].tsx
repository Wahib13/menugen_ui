import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import MenuTesterComponent from "../../ui/MenuTester/MenuTesterComponent"

const MenuTest: NextPage = () => {
    const router = useRouter()
    const { shortcode } = router.query

    return (
        <div>
            <Head>
                <title>Test</title>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </Head>
            <MenuTesterComponent shortcode={shortcode || ''} />
        </div>
    )
}

export default MenuTest