import '../styles/globals.css'
import "rc-tree/assets/index.css"
import "./index.css"
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
