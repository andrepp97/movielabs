import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MovieCard, Skeleton } from "../../components";
import styles from "../../styles/Home.module.css";

import { fetchTMDB } from "../../utils/tmdb";

const SUGGESTIONS = ["The Batman", "Succession", "Dune", "Toy Story", "Frieren"];

const Search = () => {
  const [text, setText] = useState("");
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchMovies = useCallback(async (searchQuery, signal) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    try {
      setLoading(true);
      const fetchOpts = { signal };
      const encodedQuery = encodeURIComponent(trimmedQuery);
      const endpoint = `/search/multi?include_adult=false&query=${encodedQuery}`;

      const [page1Data, page2Data] = await Promise.all([
        fetchTMDB(endpoint, 1, fetchOpts),
        fetchTMDB(endpoint, 2, fetchOpts),
      ]);

      const combinedResults = [
        ...(page1Data.results || []),
        ...(page2Data.results || []),
      ];

      const filtered = combinedResults.filter(
        (item) => item.poster_path && (item.release_date || item.first_air_date)
      );

      setResult(filtered);
      setDisplay(trimmedQuery);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Search fetch failed:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cleanText = text.trim();
    if (!cleanText.length) {
      setResult(null);
      setDisplay("");
      return;
    }

    const controller = new AbortController();
    const debounceHandler = setTimeout(() => {
      searchMovies(cleanText, controller.signal);
    }, 750);

    return () => {
      clearTimeout(debounceHandler);
      controller.abort();
    };
  }, [text, searchMovies]);

  return (
    <>
      {/* Small, dynamic localized stylesheet targeting mobile screens */}
      <style jsx>{`
        .searchContainer {
          max-width: 1200px;
          min-height: 69vh;
          margin: 0 auto;
          padding: 4rem 2rem;
          transition: padding 0.2s ease;
        }
        @media (max-width: 640px) {
          .searchContainer {
            padding: 2rem 1rem;
          }
          input.responsiveInput {
            font-size: 1.5rem !important;
          }
        }
      `}</style>

      <div className="searchContainer">
        <Head>
          <title>{display ? `Search: ${display}` : "Search"} - Movielabs</title>
        </Head>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Search Bar Input Area */}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              value={text}
              className="responsiveInput"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              placeholder="Type to search..."
              style={{
                width: "100%",
                padding: "0.75rem 0",
                fontSize: "2rem",
                fontWeight: "300",
                background: "transparent",
                border: "none",
                borderBottom: "2px solid #e5e7eb",
                outline: "none",
                color: "#1f2937",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = "#6037B3")}
              onBlur={(e) => (e.target.style.borderBottomColor = "#e5e7eb")}
            />
            {text && (
              <button
                onClick={() => setText("")}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Results Counter Metadata Header */}
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: "0.9rem", color: "#6b7280" }}
            >
              Found {result.length} {result.length === 1 ? "match" : "matches"} for &quot;
              <span style={{ color: "#1f2937", fontWeight: "500" }}>{display}</span>&quot;
            </motion.div>
          )}

          {/* Render Logic Presentation Area */}
          <div style={{ marginTop: "0.5rem" }}>
            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.div key="loading" className={styles.loadingWrapper}>
                  <Skeleton type="slider" />
                </motion.div>
              ) : result ? (
                result.length ? (
                  <motion.div key="results" layout className={styles.popular}>
                    {result.map((item, index) => (
                      <MovieCard
                        data={item}
                        key={`${item.id}-${index}`}
                        type={item.media_type || (item.name ? "tv" : "movie")}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", padding: "4rem 0" }}
                  >
                    <h3 style={{ fontWeight: "400", color: "#9ca3af", fontSize: "1rem" }}>
                      No exact matches found.
                    </h3>
                  </motion.div>
                )
              ) : (
                /* Grid-isolated block layout for fluid chip flows */
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ width: "100%" }}
                >
                  <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", marginBottom: "0.75rem", fontWeight: "600" }}>
                    Popular Searches
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setText(suggestion)}
                        style={{
                          padding: "0.4rem 1rem",
                          backgroundColor: "#f3f4f6",
                          border: "1px solid transparent",
                          borderRadius: "100px",
                          fontSize: "0.9rem",
                          color: "#4b5563",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#eec9ff";
                          e.currentTarget.style.color = "#6037B3";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f3f4f6";
                          e.currentTarget.style.color = "#4b5563";
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;