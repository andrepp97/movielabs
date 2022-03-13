import Head from 'next/head'
import Layout from '../layout/Layout'
import NextNProgress from 'nextjs-progressbar'
import '../styles/globals.css'
import '../styles/Carousel.css'

function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <NextNProgress color="#f2f2f2" />
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
