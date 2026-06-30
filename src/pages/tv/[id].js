import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { MovieDetail, MovieReview, MovieSlider, SimilarMovie, Skeleton, Modal } from "../../components";
import styles from "../../styles/MovieDetails.module.css";

import { fetchTMDB } from "../../utils/tmdb";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

const TvDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  // State Management Groupings
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

  const loadPageData = useCallback(async (tvId, signal) => {
    try {
      setPageLoading(true);
      const fetchOpts = { signal };

      // Fires all core TV endpoints concurrently
      const [detailsData, videoData, creditsData, recommendationsData, reviewsData] = await Promise.all([
        fetchTMDB(`/tv/${tvId}`, 1, fetchOpts),
        fetchTMDB(`/tv/${tvId}/videos`, 1, fetchOpts),
        fetchTMDB(`/tv/${tvId}/credits`, 1, fetchOpts),
        fetchTMDB(`/tv/${tvId}/recommendations`, 1, fetchOpts),
        fetchTMDB(`/tv/${tvId}/reviews`, 1, fetchOpts)
      ]);

      setDetails(detailsData);

      const trailer = videoData.results?.filter((obj) => obj.type === "Trailer") || [];
      setVideo(trailer);

      setCasts(creditsData.cast || []);

      const recsSorted = (recommendationsData.results || [])
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 10);
      setSimilar(recsSorted);

      setReviews(reviewsData.results || []);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Failed loading tv profile dashboard container:", error);
      }
    } finally {
      setPageLoading(false);
    }
  }, []);

  // Isolated Modal Gallery Asset Fetch
  const loadGalleryAssets = useCallback(async (tvId, signal) => {
    try {
      const data = await fetchTMDB(`/tv/${tvId}/images?include_image_language=en,null`, 1, { signal });
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
        <title>{details.title || details.name} - Movielabs</title>
        <meta name="keyword" content={details.title || details.name} />
      </Head>

      <div className="pageContainer">
        <div className={styles.root}>
          <div className={styles.imgContainer}>
            <Image
              width={480}
              height={720}
              priority
              alt={details.title || details.name}
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

        {details.seasons && (
          <MovieSlider
            type="season"
            title="Seasons"
            uppercase
            movies={details.seasons.filter((season) => season.air_date)}
          />
        )}

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
            <h3>Similar TV Shows</h3>
            {similar.length ? (
              similar.map((item) => (
                <SimilarMovie item={item} key={item.id} styles={styles} />
              ))
            ) : (
              <p>Currently there is no similar TV Show</p>
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

export default TvDetails;