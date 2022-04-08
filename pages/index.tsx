import type { NextPage } from 'next'
import { QueryClient, QueryClientProvider } from 'react-query'
import styles from '../styles/Home.module.css'
import { MenuEditor } from '../ui/MenuEditor/MenuEditorComponent'

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
