import Head from "next/head";
import Image from "next/image";
import {useState, useEffect, useCallback} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {MovieCard, Skeleton} from "../../components";
import styles from "../../styles/Home.module.css";

const Search = () => {
  // State
  const [text, setText] = useState("");
  const [display, setDisplay] = useState("Search");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function
  const searchMovies = useCallback(async () => {
    // Get the movies
    setLoading(true);
    const query = `&query=${text}`;
    const result = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        `/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1&include_adult=false${query}`
    );
    const result2 = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL +
        `/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=2&include_adult=false${query}`
    );
    const data = await result.json();
    const data2 = await result2.json();

    // Filtering the result
    let temp = data.results.filter(
      (movie) =>
        movie.poster_path && (movie.release_date || movie.first_air_date)
    );
    if (data2.results.length) {
      let temp2 = data2.results.filter(
        (movie) =>
          movie.poster_path && (movie.release_date || movie.first_air_date)
      );
      temp = temp.concat(temp2);
    }

    // Assign the filtered result to state
    setResult(temp);
    setDisplay(text);
    setLoading(false);
  }, [text]);

  const preventDefault = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Lifecycle
  useEffect(() => {
    if (text.trim().split("").length) {
      let debounceFunction = setTimeout(async () => {
        searchMovies();
      }, 1000);

      return () => clearTimeout(debounceFunction);
    }
  }, [text, searchMovies]);

  // Render
  return (
    <div className="pageContainer">
      <Head>
        <title>{display && display + " - "}Movielabs</title>
      </Head>

      <div className={styles.searchWrapper}>
        <motion.input
          type="text"
          value={text}
          className={styles.searchInput}
          placeholder="Search for a movie. . ."
          onKeyDown={(e) => preventDefault(e)}
          onChange={(e) => setText(e.target.value)}
          initial={{width: "20%"}}
          animate={{width: "100%"}}
        />

        {!result && loading === false && (
          <div className={styles.searchSvg}>
            <p>Type a word to start a search</p>
            <Image
              width={480}
              height={480}
              src="/search.svg"
              alt='Try "The Batman"'
            />
          </div>
        )}

        {result && loading === false ? (
          <p className={styles.resultText}>
            Showing <strong>{result.length}</strong>{" "}
            {result.length > 1 ? "results" : "result"} for &quot;
            <strong>{display}</strong>&quot;
          </p>
        ) : null}

        <motion.div
          className={
            loading || (result && result.length === 0)
              ? styles.loadingWrapper
              : styles.popular
          }
        >
          <AnimatePresence>
            {loading ? (
              <Skeleton type="slider" />
            ) : result ? (
              result.length ? (
                result.map((movie, index) => (
                  <MovieCard
                    data={movie}
                    key={`${movie.id} - ${index}`}
                    type={movie.name ? "tv" : "movie"}
                  />
                ))
              ) : (
                <h3 className={styles.noResult}>
                  There are no movies that matched your keyword
                </h3>
              )
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
