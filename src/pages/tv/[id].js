import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useEffect, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { MovieDetail, MovieReview, MovieSlider, SimilarMovie, Skeleton, Modal } from "../../components"
import styles from "../../styles/MovieDetails.module.css"

const imgURL = "https://image.tmdb.org/t/p/w500"

const TvDetails = () => {
    // State & Params
    const router = useRouter()
    const { id } = router.query
    const [details, setDetails] = useState(null)
    const [video, setVideo] = useState(null)
    const [gallery, setGallery] = useState([])
    const [casts, setCasts] = useState([])
    const [similar, setSimilar] = useState([])
    const [reviews, setReviews] = useState([])
    const [type, setType] = useState("trailer")
    const [modalOpen, setModalOpen] = useState(false)

    // Function
    const close = () => setModalOpen(false)
    const open = (type) => {
        setType(type)
        setModalOpen(true)
    }

    const getMovieDetails = useCallback(async (signal) => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`, { signal })
        const data = await result.json()
        setDetails(data)
    }, [id])

    const getMovieVideo = useCallback(async (signal) => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`, { signal })
        const data = await result.json()
        const trailer = data.results && data.results.filter(obj => obj.type === "Trailer")
        setVideo(trailer)
    }, [id])

    const getMovieImages = useCallback(async (signal) => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/${id}/images?api_key=${process.env.NEXT_PUBLIC_API_KEY}&include_image_language=en,null`, { signal })
        const data = await result.json()
        setGallery(data.backdrops)
    }, [id])

    const getMovieCast = useCallback(async (signal) => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/${id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`, { signal })
        const data = await result.json()
        setCasts(data.cast)
    }, [id])

    const getSimilarMovies = useCallback(async (signal) => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`, { signal })
        const data = await result.json()
        setSimilar(data.results)
    }, [id])

    const getMovieReviews = useCallback(async (signal) => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/${id}/reviews?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`, { signal })
        const data = await result.json()
        setReviews(data.results)
    }, [id])

    // Lifecycle
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        if (id) {
            getMovieDetails(signal)
            getMovieVideo(signal)
            getMovieImages(signal)
            getMovieCast(signal)
            getSimilarMovies(signal)
            getMovieReviews(signal)
        }

        return () => controller.abort()
    }, [id, getMovieDetails, getMovieVideo, getMovieImages, getMovieCast, getSimilarMovies, getMovieReviews])

    // Render
    return details
        ? (
            <>

                <Head>
                    <title>{details.title || details.name} - Movieset</title>
                    <meta name="keyword" content={details.title} />
                </Head>

                <div className="pageContainer">

                    <div className={styles.root}>
                        <div className={styles.imgContainer}>
                            <Image
                                width={480}
                                height={720}
                                priority={true}
                                alt={details.title}
                                className={styles.movieImg}
                                src={imgURL + details.poster_path}
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

                    {details && (
                        <MovieSlider
                            type="season"
                            title="Seasons"
                            uppercase={true}
                            movies={details.seasons.filter(season => season.air_date)}
                        />
                    )}

                    <div className={styles.bottomSection}>
                        <div className={styles.left}>
                            <h3>
                                Reviews
                            </h3>
                            {
                                reviews
                                    ? reviews.length
                                        ? reviews.map(review => (
                                            <MovieReview
                                                key={review.id}
                                                styles={styles}
                                                data={review}
                                            />
                                        ))
                                        : <p>Currently there is no review</p>
                                    : null
                            }
                        </div>

                        <div className={styles.right}>
                            <h3>
                                Similar TV Shows
                            </h3>
                            {
                                similar
                                    ? similar.length
                                        ? similar.map(item => (
                                            <SimilarMovie
                                                item={item}
                                                key={item.id}
                                                styles={styles}
                                            />
                                        ))
                                        : <p>Currently there is no similar TV Show</p>
                                    : null
                            }
                        </div>
                    </div>

                </div>

                <AnimatePresence
                    // Disable any initial animations on children.
                    initial={false}
                    // Only render one component at a time.
                    exitBeforeEnter={true}
                >
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
        )
        : <Skeleton type="movie" />
};

export default TvDetails;