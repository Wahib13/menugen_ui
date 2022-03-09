import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { QueryClient, QueryClientProvider } from 'react-query'
import styles from '../styles/Home.module.css'
import { Menu } from '../ui/Menu/MenuComponent'
import { MenuEditor } from '../ui/MenuEditor/MenuEditorComponent'
import { Sidebar } from '../ui/Sidebar/SidebarComponent'

const queryClient = new QueryClient()

const Home: NextPage = () => {
  return (
    <div className={styles.wrapper}>
      <QueryClientProvider client={queryClient}>
        <MenuEditor queryClient={queryClient} />
      </QueryClientProvider>
    </div>
  )
}

export default Home
