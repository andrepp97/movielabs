import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MovieCard, MovieGenre, Loader } from "../../components";
import styles from "../../styles/Home.module.css";

import { fetchTMDB } from "../../utils/tmdb";

// DATA FETCHING (Runs on Server at Build Time / Revalidation)
export async function getStaticProps() {
  try {
    const [popularData, genresData] = await Promise.all([
      fetchTMDB("/tv/popular"),
      fetchTMDB("/genre/tv/list")
    ]);

    const popular = (popularData.results || []).filter(
      (show) => show.poster_path
    );

    return {
      props: {
        popular,
        genres: genresData.genres || [],
      },
      revalidate: 3600, // Revalidate once every 60 minutes
    };
  } catch (error) {
    console.error("Static build error on TV Shows Page:", error);
    return {
      props: { popular: [], genres: [] },
      revalidate: 60,
    };
  }
}

// COMPONENT (Runs on Client)
const TvShows = ({ popular, genres }) => {
  // State
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [moreData, setMoreData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeGenre, setActiveGenre] = useState({ id: 0, name: "All" });

  // Optimized pagination loader
  const loadMoreData = useCallback(async (targetPage) => {
    if (targetPage < 2) return;

    try {
      setLoading(true);
      const data = await fetchTMDB("/tv/popular", targetPage);
      const newShows = (data.results || []).filter((show) => show.poster_path);

      setMoreData((prevData) => [...prevData, ...newShows]);
    } catch (error) {
      console.error("Failed loading client TV pagination page:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Safe tracking watch on page number mutation shifts
  useEffect(() => {
    if (page > 1) {
      loadMoreData(page);
    }
  }, [page, loadMoreData]);

  return (
    <div className="pageContainer">
      <Head>
        <title>{activeGenre.name} TV Shows - Movielabs</title>
        <meta name="keyword" content={activeGenre.name} />
      </Head>

      <MovieGenre
        title="TV Shows"
        popular={popular}
        moreData={moreData}
        genreList={genres}
        setFiltered={setFiltered}
        activeGenre={activeGenre}
        setActiveGenre={setActiveGenre}
      />

      <motion.div className={styles.popular} layout>
        <AnimatePresence mode="popLayout">
          {filtered?.map((show, index) => (
            <MovieCard
              type="tv"
              data={show}
              key={`${show.id}-${index}`}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <div className={styles.loadMore}>
        {loading ? (
          <Loader />
        ) : page <= 5 ? (
          <button
            className="btn-main"
            style={{ backgroundColor: "#6037B3", color: "#fff" }}
            onClick={() => setPage((prevPage) => prevPage + 1)}
          >
            Load More
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TvShows;