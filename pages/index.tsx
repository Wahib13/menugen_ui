import type { NextPage } from 'next'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from 'react-query'
import styles from '../styles/Home.module.css'
import { MenuEditor } from '../ui/MenuEditor/MenuEditorComponent'

const queryClient = new QueryClient()

const Home: NextPage = () => {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Menu Generator</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <MenuEditor queryClient={queryClient} />
      </QueryClientProvider>
    </div>
  )
}

export default Home
