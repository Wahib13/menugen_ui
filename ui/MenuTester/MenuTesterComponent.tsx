import axios from "axios"
import xml2js from "xml2js"
import { useEffect, useState } from "react"
import parse from 'html-react-parser'
import styles from './MenuTester.module.css'

const ENDPOINT_PULL_USSD = "http://localhost:8000/menu_gen/pull/"

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

    useEffect(() => {
        setDiallerContent(shortcode)
    }, [shortcode])

    const appendDiallerContent = (additional_content: string) => {
        setDiallerContent(diallerContent + additional_content)
        setErrorMode(false)
    }

    const promptDisplay = promptDisplaying ?
        <USSD_PageDisplayPrompt
            inputMessage={inputMessage}
            outputMessage={outputMessage}
            setInputMessage={setInputMessage}
            setOutputMessage={setOutputMessage}
            setPromptDisplaying={setPromptDisplaying}
        /> : <></>

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
                                    pullUSSD(diallerContent, "233202009098", "1", (output: USSD_Output) => {
                                        setOutputMessage({
                                            message: convertUSSDReplyToHTML(output.message),
                                            type: output.type
                                        })
                                        setPromptDisplaying(true)
                                        setInputMessage("")
                                    })
                                }
                                else {
                                    setErrorMode(true)
                                }
                            }}>
                            <input className={errorMode ? styles.dialler_error : styles.dialler_plain}
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
                            <br />
                            <button className={styles["call-button"]} disabled={promptDisplaying} type="submit">
                                <i className={`material-icons ${styles["call-icon"]}`}>call</i>
                            </button>
                        </form>
                        {promptDisplay}
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
    next: (output: USSD_Output) => void
) => {

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
            })
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
    }:
        {
            inputMessage: string,
            outputMessage: USSD_Output,
            setInputMessage: (input: string) => void
            setOutputMessage: (output: USSD_Output) => void
            setPromptDisplaying: (displaying: boolean) => void
        }
) => {

    const is_continue_message = outputMessage.type == "2"

    return (
        <div className={styles.page_display_plus_bg_container}>
            <div className={styles.page_display_bg}></div>
            <div className={styles.page_display_container}>
                <div className={styles.page_display}>
                    <div key="menu_form">
                        <p><span>&nbsp;&nbsp;</span>{parse(outputMessage.message)}</p>
                        {is_continue_message ? <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} /> : <></>}
                        <br />
                        <button onClick={(e) => setPromptDisplaying(false)}>{is_continue_message ? "cancel" : "ok"}</button>

                        {is_continue_message ?
                            <button onClick={(e) => {
                                e.preventDefault()
                                pullUSSD(inputMessage, "233202009098", "2", (output: USSD_Output) => {
                                    setOutputMessage(output)
                                    setInputMessage("")
                                })
                            }}>Send</button> : <></>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MenuTesterComponent
