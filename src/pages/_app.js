import Head from "next/head"
import Layout from "../layout/Layout"
import NextNProgress from "nextjs-progressbar"
import { AnimatePresence, motion } from "framer-motion"
import "../styles/globals.css"
import "../styles/Carousel.css"
import "../styles/Loader.css"

const meta = {
    keywords: "movies, movie database, movie db, database, film",
    description: "A simple movie database website for your needs",
}

function MyApp({ Component, pageProps, router }) {
    return (
        <Layout>
            <NextNProgress color="#f2f2f2" stopDelayMs={250} />
            <Head>
                <title>Movieku</title>
                <link rel="icon" href="/favicon.png" />
                <meta name="keywords" content={meta.keywords} />
                <meta name="description" content={meta.description}></meta>
            </Head>
            <AnimatePresence>
                <motion.div
                    key={router.route}
                    initial="pageInitial"
                    animate="pageAnimate"
                    exit="pageExit"
                    variants={{
                        pageInitial: {
                            opacity: 0
                        },
                        pageAnimate: {
                            opacity: 1
                        },
                        pageExit: {
                            opacity: 0
                        },
                    }}
                >
                    <Component {...pageProps} />
                </motion.div>
            </AnimatePresence>
        </Layout>
    )
}

export default MyApp
