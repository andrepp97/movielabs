import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MovieSlider, Skeleton, Modal } from '../../components'
import MovieDetail from './components/MovieDetail'
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

                        <MovieDetail
                            casts={casts}
                            video={video}
                            styles={styles}
                            details={details}
                            openModal={open}
                        />
                        
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