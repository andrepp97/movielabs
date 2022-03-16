import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { BsPlayFill, BsImages } from 'react-icons/bs'
import { AnimatePresence } from 'framer-motion'
import { MovieSlider, Skeleton, Modal } from '../../components'
import styles from '../../styles/MovieDetails.module.css'

const imgURL = 'https://image.tmdb.org/t/p/w500'
const castURL = 'https://image.tmdb.org/t/p/w138_and_h175_face'
const backdropURL = 'https://image.tmdb.org/t/p/original'

const MovieDetails = () => {
    // State & Params
    const router = useRouter()
    const { id } = router.query
    const [details, setDetails] = useState(null)
    const [video, setVideo] = useState(null)
    const [casts, setCasts] = useState([])
    const [similar, setSimilar] = useState([])
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

        let delayDebounceFn = setTimeout(() => {
            setDetails(data)
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [id])

    const getMovieVideo = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const data = await result.json()
        const trailer = data.results.filter(obj => obj.type === "Trailer")
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

    // Lifecycle
    useEffect(() => {
        if (id) {
            getMovieDetails()
            getMovieVideo()
            getMovieCast()
            getSimilarMovies()
        }
    }, [id, getMovieDetails, getMovieVideo, getMovieCast, getSimilarMovies])

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
                        <div className={styles.movieDetail}>
                            <h1>
                                {details.title}
                                <span>
                                    ({details.release_date && details.release_date.split('-')[0]})
                                </span>
                            </h1>
                            <div className={styles.movieGenre}>
                                {details.genres.map((genre, index) => (
                                    <div key={index}>
                                        <span>
                                            {genre.name}
                                        </span>
                                        {index === details.genres.length - 1 ? '' : <>&nbsp;&#9679;&nbsp;</>}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.cast}>
                                <h3>Main Cast</h3>
                                <div className={styles.castWrapper}>
                                    {casts.map((cast, index) => {
                                        if (index < 6) return (
                                            <Link
                                                passHref={true}
                                                key={cast.cast_id}
                                                href={`/cast/` + cast.id}
                                            >
                                                <div className={styles.castBox}>
                                                    <Image
                                                        width={90}
                                                        height={90}
                                                        alt={cast.name}
                                                        priority={true}
                                                        className={styles.castImg}
                                                        src={castURL + cast.profile_path}
                                                    />
                                                    <p>
                                                        {cast.name}
                                                    </p>
                                                    <small>
                                                        {cast.character}
                                                    </small>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className={styles.synopsis}>
                                <h3>Overview</h3>
                                <p>
                                    {details.overview}
                                </p>
                            </div>
                            {video && (
                                <div className={styles.media}>
                                    <h3>Media</h3>
                                    <div className="d-flex">
                                        <button
                                            className="btn-main"
                                            onClick={() => open("trailer")}
                                        >
                                            <BsPlayFill size={20} /> &nbsp; Play Trailer
                                        </button>
                                        <button
                                            className="btn-main"
                                            onClick={() => open("gallery")}
                                        >
                                            <BsImages size={20} /> &nbsp; Gallery
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <MovieSlider
                        title="Similar Movies"
                        movies={similar}
                        uppercase={true}
                    />
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