import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>VibeCherry - AI App Maker</title>
        <meta name="description" content="Create beautiful, AI-generated apps in seconds. No coding required, just pure creativity." />
        <link rel="icon" href="/vibecherry-logo.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
