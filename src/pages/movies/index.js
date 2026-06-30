import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MovieCard, MovieGenre, Loader } from "../../components";
import styles from "../../styles/Home.module.css";

// Import your new global utility function
import { fetchTMDB } from "../../utils/tmdb";

// DATA FETCHING (Runs on Server)
export async function getStaticProps() {
  try {
    // Fired simultaneously with the global helper
    const [popularData, genresData] = await Promise.all([
      fetchTMDB("/movie/popular"),
      fetchTMDB("/genre/movie/list")
    ]);

    const popular = (popularData.results || []).filter(
      (movie) => movie.poster_path && movie.release_date
    );

    return {
      props: {
        popular,
        genres: genresData.genres || [],
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Static build error on Movies Page:", error);
    return {
      props: { popular: [], genres: [] },
      revalidate: 60,
    };
  }
}

// COMPONENT (Runs on Client)
const Movies = ({ popular, genres }) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [moreData, setMoreData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeGenre, setActiveGenre] = useState({ id: 0, name: "All" });

  const loadMoreData = useCallback(async (targetPage) => {
    if (targetPage < 2) return;

    try {
      setLoading(true);
      // Re-using the exact same helper cleanly on the client-side network call
      const data = await fetchTMDB("/movie/popular", targetPage);
      setMoreData((prevData) => [...prevData, ...(data.results || [])]);
    } catch (error) {
      console.error("Failed loading client data pagination page:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (page > 1) {
      loadMoreData(page);
    }
  }, [page, loadMoreData]);

  return (
    <div className="pageContainer">
      <Head>
        <title>{activeGenre.name} Movies - Movielabs</title>
        <meta name="keyword" content={activeGenre.name} />
      </Head>

      <MovieGenre
        title="Movies"
        popular={popular}
        moreData={moreData}
        genreList={genres}
        setFiltered={setFiltered}
        activeGenre={activeGenre}
        setActiveGenre={setActiveGenre}
      />

      <motion.div className={styles.popular} layout>
        <AnimatePresence mode="popLayout">
          {filtered?.map((movie, index) => (
            <MovieCard
              data={movie}
              type="movie"
              key={`${movie.id}-${index}`}
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

export default Movies;