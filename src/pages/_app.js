import Head from "next/head";
import Layout from "../layout/Layout";
import NextNProgress from "nextjs-progressbar";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/globals.css";
import "../styles/Carousel.css";
import "../styles/Loader.css";

const meta = {
  title: "Movielabs — Discover Movies & TV Shows",
  description: "Browse millions of movies and TV shows, track your watchlists, and explore trending cinema trailers with ease.",
  keywords: "movies, movie database, movie db, tv shows, tracking, film database, streaming recommendations",
  siteUrl: "https://movielabs.vercel.app",
  ogImage: "/og-image.jpg"
};

function MyApp({ Component, pageProps, router }) {
  return (
    <Layout>
      <NextNProgress color="#6037B3" stopDelayMs={250} />

      <Head>
        {/* Core Settings */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6037B3" />
        <link rel="icon" href="/favicon.png" />

        {/* SEO HTML Tags */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph / Facebook Protocol */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Movielabs" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.siteUrl} />
        <meta property="og:image" content={`${meta.siteUrl}${meta.ogImage}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${meta.siteUrl}${meta.ogImage}`} />
      </Head>

      <AnimatePresence mode="wait">
        <motion.div
          key={router.route}
          initial="pageInitial"
          animate="pageAnimate"
          exit="pageExit"
          variants={{
            pageInitial: { opacity: 0 },
            pageAnimate: { opacity: 1 },
            pageExit: { opacity: 0 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default MyApp;