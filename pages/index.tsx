import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { QueryClient, QueryClientProvider } from 'react-query'
import styles from '../styles/Home.module.css'
import { Menu } from '../ui/Menu/MenuComponent'

const queryClient = new QueryClient()

const Home: NextPage = () => {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Menu queryClient={queryClient}/>
      </QueryClientProvider>
    </div>
  )
}

export default Home
