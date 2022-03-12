import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { BsPlayFill, BsImages } from 'react-icons/bs'
import { AnimatePresence } from 'framer-motion'
import { Skeleton, Modal } from '../../components'
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
        const trailer = data.results.filter(obj => {
            return obj.type === "Trailer"
        })

        let delayDebounceFn = setTimeout(() => {
            setVideo(trailer)
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [id])

    const getMovieCast = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const data = await result.json()

        let delayDebounceFn = setTimeout(() => {
            setCasts(data.cast)
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [id])

    // Lifecycle
    useEffect(() => {
        if (id) {
            getMovieDetails()
            getMovieVideo()
            getMovieCast()
        }
    }, [id, getMovieDetails, getMovieVideo, getMovieCast])

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
                                            <div
                                                key={cast.cast_id}
                                                className={styles.castBox}
                                            >
                                                <Image
                                                    width={80}
                                                    height={80}
                                                    alt={cast.name}
                                                    className={styles.castImg}
                                                    src={castURL + cast.profile_path}
                                                />
                                                <p>
                                                    {cast.name}
                                                </p>
                                            </div>
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
                </div>

                <AnimatePresence
                    // Disable any initial animations on children.
                    initial={false}
                    // Only render one component at a time.
                    exitBeforeEnter={true}
                    // Fires when all exiting nodes have completed animating out.
                    onExitComplete={() => null}
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