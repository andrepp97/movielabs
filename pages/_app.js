import Head from 'next/head'
import Layout from '../layout/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Head>
                <title>Movieku</title>
                <link rel="icon" href="/favicon.png" />
                <meta name="keyword" content="Movie DB" />
            </Head>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp
