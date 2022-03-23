import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MovieDetail, MovieReview, Skeleton, Modal } from '../../components'
import styles from '../../styles/MovieDetails.module.css'

const imgURL = 'https://image.tmdb.org/t/p/w500'
const backdropURL = 'https://image.tmdb.org/t/p/original'

const MovieDetails = () => {
    // State & Params
    const router = useRouter()
    const { id } = router.query
    const [details, setDetails] = useState(null)
    const [video, setVideo] = useState(null)
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

    const getMovieDetails = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const data = await result.json()
        setDetails(data)
    }, [id])

    const getMovieVideo = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const data = await result.json()
        const trailer = data && data.results.filter(obj => obj.type === "Trailer")
        setVideo(trailer)
    }, [id])

    const getMovieCast = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const data = await result.json()
        setCasts(data.cast)
    }, [id])

    const getSimilarMovies = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}/similar?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=3`)
        const data = await result.json()
        setSimilar(data.results)
    }, [id])

    const getMovieReviews = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}/reviews?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const data = await result.json()
        setReviews(data.results)
    }, [id])

    // Lifecycle
    useEffect(() => {
        if (id) {
            getMovieDetails()
            getMovieVideo()
            getMovieCast()
            getSimilarMovies()
            getMovieReviews()
        }
    }, [id, getMovieDetails, getMovieVideo, getMovieCast, getSimilarMovies, getMovieReviews])

    // Render
    return details
        ? (
            <>

                <Head>
                    <title>{details.title} - Movieku</title>
                    <meta name="keyword" content={details.title} />
                </Head>

                <div className="pageContainer">

                    <div className={styles.root}>

                        <div className={styles.imgContainer}>
                            <Image
                                width={480}
                                height={720}
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
                                Similar Movies
                            </h3>
                            {similar && similar.map(item => (
                                <Link
                                    key={item.id}
                                    passHref={true}
                                    href={"/movies/" + item.id}
                                >
                                    <div className={styles.similarMovie}>
                                        <div className={styles.similarImg}>
                                            <Image
                                                width={128}
                                                height={190}
                                                loading="lazy"
                                                alt={item.title}
                                                src={imgURL + item.poster_path}
                                            />
                                        </div>
                                        <div className={styles.similarDetails}>
                                            <div>
                                                <p className={styles.similarTitle}>
                                                    {item.title}
                                                </p>
                                                <p className={styles.similarYear}>
                                                    {item.release_date.split('-')[0]}
                                                </p>
                                            </div>
                                            <p className={styles.similarOverview}>
                                                {item.overview}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
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
                            gallery={{
                                posterURL: imgURL,
                                poster: details.poster_path,
                                backdropURL: backdropURL,
                                backdrop: details.backdrop_path,
                            }}
                        />
                    )}
                </AnimatePresence>
            </>
        )
        : <Skeleton type="movie" />
};

export default MovieDetails;