import axios from "axios"
import xml2js from "xml2js"
import { useEffect, useState } from "react"
import parse from 'html-react-parser'
import styles from './MenuTester.module.css'
import { Oval } from "react-loader-spinner"

const ENDPOINT_PULL_USSD = process.env.NEXT_PUBLIC_USSD_PULL_ENDPOINT || ''

type USSD_Output = {
    message: string
    type: "2" | "3"
}

const MenuTesterComponent = (
    {
        shortcode
    }:
        {
            shortcode: string | string[]
        }
) => {

    const [outputMessage, setOutputMessage] = useState<USSD_Output>({ message: "", type: "2" })
    const [inputMessage, setInputMessage] = useState<string>("")
    const [promptDisplaying, setPromptDisplaying] = useState<boolean>(false)
    const [errorMode, setErrorMode] = useState<boolean>(false)
    const [diallerContent, setDiallerContent] = useState<string | string[]>(shortcode)
    const [hidden, setHidden] = useState<boolean>(true)
    const [is_dialling, setIsDialling] = useState<boolean>(false)

    useEffect(() => {
        setDiallerContent(shortcode)
    }, [shortcode])

    const appendDiallerContent = (additional_content: string) => {
        setDiallerContent(diallerContent + additional_content)
    }

    const promptDisplay = promptDisplaying ?
        <USSD_PageDisplayPrompt
            inputMessage={inputMessage}
            outputMessage={outputMessage}
            setInputMessage={setInputMessage}
            setOutputMessage={setOutputMessage}
            setPromptDisplaying={setPromptDisplaying}
            setIsDialling={setIsDialling}
        /> : <></>

    const loadingSpinner = is_dialling ? <USSD_Dial_Spinner/> : <></>


    const shakeAndRevert = () => {
        setErrorMode(true)
        setTimeout(
            () => {
                setErrorMode(false)
            },
            500
        )
    }

    return (
        <>
            <div className={styles.menu_tester_container_outer}>
                <div className={`
                    ${styles.menu_tester_container} 
                    ${hidden ? styles.menu_tester_container_hidden : styles.menu_tester_container_revealed}
                    `
                }>
                    <button className={`
                        ${styles.menu_tester_toggle_btn}
                        material-icons
                        `}
                        onClick={(e) => {
                            setHidden(!hidden)
                        }}>dialpad</button>
                    <div className={styles.dial_form_container}>
                        <form className={styles.dial_form}
                            key="dial_form"
                            onSubmit={(e) => {
                                e.preventDefault()
                                if (diallerContent == shortcode) {
                                    pullUSSD(diallerContent, "233202009098", "1", setIsDialling, (output: USSD_Output) => {
                                        setOutputMessage({
                                            message: convertUSSDReplyToHTML(output.message),
                                            type: output.type
                                        })
                                        setPromptDisplaying(true)
                                        setInputMessage("")
                                    })
                                }
                                else {
                                    shakeAndRevert()
                                }
                            }}>
                            <input className={`${styles.phone_input} ${errorMode ? styles.dialler_error : styles.dialler_plain}`}
                                value={diallerContent}
                                readOnly />
                            <button className={styles.backspace_button} onClick={(e) => {
                                e.preventDefault()
                                setDiallerContent(diallerContent.slice(0, -1))
                            }}>
                                <i className={`material-icons ${styles["call-icon"]}`}>backspace</i>
                            </button>
                            <br />
                            <div className={styles.button_container}>
                                <DialButton content={'1'} appendDiallerContent={appendDiallerContent} />
                                <DialButton content={'2'} appendDiallerContent={appendDiallerContent} />
                                <DialButton content={'3'} appendDiallerContent={appendDiallerContent} />
                                <br />
                                <DialButton content={'4'} appendDiallerContent={appendDiallerContent} />
                                <DialButton content={'5'} appendDiallerContent={appendDiallerContent} />
                                <DialButton content={'6'} appendDiallerContent={appendDiallerContent} />
                                <br />
                                <DialButton content={'7'} appendDiallerContent={appendDiallerContent} />
                                <DialButton content={'8'} appendDiallerContent={appendDiallerContent} />
                                <DialButton content={'9'} appendDiallerContent={appendDiallerContent} />
                                <br />
                                <DialButton content={'*'} appendDiallerContent={appendDiallerContent} />
                                <DialButton content={'0'} appendDiallerContent={appendDiallerContent} />
                                <DialButton content={'#'} appendDiallerContent={appendDiallerContent} />
                            </div>
                            <button className={styles["call-button"]} disabled={promptDisplaying} type="submit">
                                <i className={`material-icons ${styles["call-icon"]}`}>call</i>
                            </button>
                        </form>
                        {promptDisplay}
                        {loadingSpinner}
                    </div>
                </div>
            </div>
        </>
    )

}


const DialButton = ({
    content,
    appendDiallerContent
}: {
    content: string,
    appendDiallerContent: (content: string) => void
}) => {

    return (
        <>
            <button onClick={(e) => {
                e.preventDefault()
                appendDiallerContent(content)
            }} className={styles["dial-button"]}>
                {content}
            </button>
        </>
    )
}

const pullUSSD = (
    input: string | string[],
    msisdn: string,
    input_type: string,
    setIsDialling: (dialling: boolean) => void,
    next: (output: USSD_Output) => void
) => {

    setIsDialling(true)
    const xml: string = `<ussd>
        <msisdn>${msisdn}</msisdn>
        <sessionid>${"0001"}</sessionid>
        <type>${input_type}</type>
        <msg>${input}</msg>
    </ussd>`

    axios.post(
        ENDPOINT_PULL_USSD,
        xml,
        {
            headers: {
                "Content-Type": "application/xml"
            }
        }).then((response) => {
            xml2js.parseString(response.data, (error, result) => {
                next(
                    {
                        message: String(result.ussd.msg[0]),
                        type: result.ussd.type[0]
                    }
                )
            }),
            setIsDialling(false)
        })
}

const convertUSSDReplyToHTML = (msg: string) => {
    return msg.replaceAll('\n', '<br/>')
}

const USSD_PageDisplayPrompt = (
    {
        inputMessage,
        outputMessage,
        setInputMessage,
        setOutputMessage,
        setPromptDisplaying,
        setIsDialling,
    }:
        {
            inputMessage: string,
            outputMessage: USSD_Output,
            setInputMessage: (input: string) => void
            setOutputMessage: (output: USSD_Output) => void
            setPromptDisplaying: (displaying: boolean) => void,
            setIsDialling: (dialling: boolean) => void
        }
) => {

    const is_continue_message = outputMessage.type == "2"

    return (
        <div className={styles.page_display_plus_bg_container}>
            <div className={styles.page_display_bg}></div>
            <div className={styles.page_display_container}>
                <div className={styles.page_display}>
                    <div key="menu_form">
                        <p>{parse(outputMessage.message)}</p>
                        <div className={styles.ussd_prompt_button_container}>
                            {is_continue_message ? 
                                <input className={styles.ussd_prompt_input}
                                value={inputMessage}
                                onChange={
                                    (e) => setInputMessage(e.target.value)
                                } /> : <></>}
                            <button className={styles.ussd_prompt_button} 
                                onClick={(e) => setPromptDisplaying(false)}>
                                    {is_continue_message ? "Cancel" : "OK"}
                            </button>
                        </div>

                        {is_continue_message ?
                            <button className={styles.ussd_prompt_button} onClick={(e) => {
                                e.preventDefault()
                                pullUSSD(inputMessage, "233202009098", "2", setIsDialling, (output: USSD_Output) => {
                                    setOutputMessage({
                                            message: convertUSSDReplyToHTML(output.message),
                                            type: output.type
                                        })
                                    setInputMessage("")
                                })
                            }}>Send</button> : <></>}
                    </div>
                </div>
            </div>
        </div>
    )
}

const USSD_Dial_Spinner = () => {
    return (
        <>
        <div className={styles.page_display_bg}></div> 
        <Oval
            visible={true}
            height="80"
            width="80"
            color="#ffffff"
            wrapperStyle={{margin: "auto", position: "absolute", left: "50%",
            top: "30%", transform: "translate(-50%,-50%)", }}
            />
        </>
    )
}

export default MenuTesterComponent
