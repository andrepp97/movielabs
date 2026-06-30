import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  MovieDetail,
  MovieReview,
  SimilarMovie,
  Skeleton,
  Modal,
} from "../../components";
import styles from "../../styles/MovieDetails.module.css";

import { fetchTMDB } from "../../utils/tmdb";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  // Grouped UI States
  const [details, setDetails] = useState(null);
  const [video, setVideo] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [casts, setCasts] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [type, setType] = useState("trailer");
  const [modalOpen, setModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const close = () => setModalOpen(false);
  const open = (modalType) => {
    setType(modalType);
    setModalOpen(true);
  };

  const loadPageData = useCallback(async (movieId, signal) => {
    try {
      setPageLoading(true);
      const fetchOpts = { signal };

      // Fires all core endpoints simultaneously
      const [detailsData, videoData, creditsData, recommendationsData, reviewsData] = await Promise.all([
        fetchTMDB(`/movie/${movieId}`, 1, fetchOpts),
        fetchTMDB(`/movie/${movieId}/videos`, 1, fetchOpts),
        fetchTMDB(`/movie/${movieId}/credits`, 1, fetchOpts),
        fetchTMDB(`/movie/${movieId}/recommendations`, 1, fetchOpts),
        fetchTMDB(`/movie/${movieId}/reviews`, 1, fetchOpts)
      ]);

      setDetails(detailsData);

      const trailer = videoData.results?.filter((obj) => obj.type === "Trailer") || [];
      setVideo(trailer);

      setCasts(creditsData.cast || []);

      const recsFiltered = (recommendationsData.results || [])
        .filter((item) => item.poster_path && (item.release_date || item.first_air_date))
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 10);
      setSimilar(recsFiltered);

      setReviews(reviewsData.results || []);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Failed loading movie layout profile:", error);
      }
    } finally {
      setPageLoading(false);
    }
  }, []);

  const loadGalleryAssets = useCallback(async (movieId, signal) => {
    try {
      // Append explicit language search constraints directly onto the endpoint path
      const data = await fetchTMDB(`/movie/${movieId}/images?include_image_language=en,null`, 1, { signal });
      setGallery(data.backdrops?.slice(0, 9) || []);
    } catch (error) {
      if (error.name !== 'AbortError') console.error("Gallery asset failure:", error);
    }
  }, []);

  // Core Mount Controller Lifecycle
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    loadPageData(id, controller.signal);

    return () => controller.abort();
  }, [id, loadPageData]);

  // Gallery Modal Controller Lifecycle
  useEffect(() => {
    if (!id || !modalOpen) return;
    const controller = new AbortController();

    loadGalleryAssets(id, controller.signal);

    return () => controller.abort();
  }, [id, modalOpen, loadGalleryAssets]);

  if (pageLoading || !details) {
    return <Skeleton type="movie" />;
  }

  return (
    <>
      <Head>
        <title>{details.title} - Movielabs</title>
        <meta name="keyword" content={details.title} />
      </Head>

      <div className="pageContainer">
        <div className={styles.root}>
          <div className={styles.imgContainer}>
            <Image
              width={480}
              height={720}
              priority
              alt={details.title}
              className={styles.movieImg}
              src={`${IMG_BASE_URL}${details.poster_path}`}
            />
          </div>

          <MovieDetail
            casts={casts}
            video={video}
            styles={styles}
            details={details}
            openModal={open}
          />
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.left}>
            <h3>Reviews</h3>
            {reviews.length ? (
              reviews.map((review) => (
                <MovieReview key={review.id} styles={styles} data={review} />
              ))
            ) : (
              <p>Currently there is no review</p>
            )}
          </div>

          <div className={styles.right}>
            <h3>Similar Movies</h3>
            {similar.length ? (
              similar.map((item) => (
                <SimilarMovie item={item} key={item.id} styles={styles} />
              ))
            ) : (
              <p>Currently there is no similar Movie</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {modalOpen && (
          <Modal
            modalOpen={modalOpen}
            handleClose={close}
            type={type}
            video={video}
            gallery={gallery}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MovieDetails;