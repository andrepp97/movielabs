import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { Skeleton, MovieSlider } from "../../components";
import styles from "../../styles/MovieDetails.module.css";

import { fetchTMDB } from "../../utils/tmdb";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/h632";

const CastDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  // States
  const [details, setDetails] = useState(null);
  const [castMovies, setCastMovies] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Age Calculator Helper
  const calculateAge = (birthDate, otherDate) => {
    const birth = new Date(birthDate);
    const other = new Date(otherDate);
    let years = other.getFullYear() - birth.getFullYear();

    if (
      other.getMonth() < birth.getMonth() ||
      (other.getMonth() === birth.getMonth() && other.getDate() < birth.getDate())
    ) {
      years--;
    }
    return years;
  };

  // Parallelized Core Page Data Fetcher
  const loadCastProfile = useCallback(async (castId, signal) => {
    try {
      setPageLoading(true);
      const fetchOpts = { signal };

      // Fires both endpoints concurrently
      const [bioData, creditsData] = await Promise.all([
        fetchTMDB(`/person/${castId}`, 1, fetchOpts),
        fetchTMDB(`/person/${castId}/combined_credits`, 1, fetchOpts),
      ]);

      setDetails(bioData);

      // Filter and isolate Unique Top 10 Credits
      const rawCredits = creditsData.cast || [];
      const uniquelyFiltered = rawCredits
        .filter((item) => item.poster_path && (item.release_date || item.first_air_date))
        .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
        .slice(0, 12);

      setCastMovies(uniquelyFiltered);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed loading cast dynamic details:", error);
      }
    } finally {
      setPageLoading(false);
    }
  }, []);

  // Lifecycle Sync
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    loadCastProfile(id, controller.signal);

    return () => controller.abort();
  }, [id, loadCastProfile]);

  if (pageLoading || !details) {
    return <Skeleton type="movie" />;
  }

  return (
    <>
      <Head>
        <title>{details.name} - Movielabs</title>
        <meta name="keyword" content={details.name} />
      </Head>

      <div className="pageContainer">
        <div className={styles.root}>
          <div className={styles.castImg}>
            <Image
              width={480}
              height={720}
              priority
              alt={details.name}
              className={styles.movieImg}
              src={`${IMG_BASE_URL}${details.profile_path}`}
            />
          </div>
          <div id="movie-detail" className={styles.movieDetail}>
            <h1>{details.name || ""}</h1>
            <div className={styles.personal}>
              <h3>Personal Information</h3>
              <div className={styles.personalWrapper}>
                <div className={styles.personalItem}>
                  <h4>Born</h4>
                  <p>
                    {details.birthday ? moment(details.birthday).format("MMMM Do, YYYY") : "-"}&nbsp;
                    {!details.deathday && details.birthday && (
                      <>
                        (<strong style={{ color: "#969696" }}>
                          {calculateAge(details.birthday, new Date())}
                        </strong>{" "}
                        years old)
                      </>
                    )}
                  </p>
                </div>
                {details.deathday && (
                  <div className={styles.personalItem}>
                    <h4>Died</h4>
                    <p>
                      {moment(details.deathday).format("MMMM Do, YYYY")}&nbsp;
                      (<strong style={{ color: "#969696" }}>
                        {calculateAge(details.birthday, details.deathday)}
                      </strong>{" "}
                      years old)
                    </p>
                  </div>
                )}
                <div className={styles.personalItem}>
                  <h4>Place of Birth</h4>
                  <p>{details.place_of_birth || "-"}</p>
                </div>
                <div className={styles.personalItem}>
                  <h4>Gender</h4>
                  <p>
                    {details.gender === 1
                      ? "Female"
                      : details.gender === 2
                        ? "Male"
                        : "Others"}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.cast}>
              <h3>Biography</h3>
              <p className={styles.biography}>
                {details.biography || "---"}
              </p>
            </div>
          </div>
        </div>
        <MovieSlider
          type="movies"
          uppercase
          title="Known For"
          movies={castMovies}
        />
      </div>
    </>
  );
};

export default CastDetails;