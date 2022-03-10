import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Skeleton } from '../../components'
import styles from '../../styles/MovieDetails.module.css'

const imgURL = 'https://image.tmdb.org/t/p/w500'

const MovieDetails = () => {
    // State & Params
    const router = useRouter()
    const { id } = router.query
    const [details, setDetails] = useState(null)
    const [video, setVideo] = useState(null)

    // Function
    const getMovieDetails = async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const data = await result.json()

        let delayDebounceFn = setTimeout(() => {
            setDetails(data)
        }, 750)

        return () => clearTimeout(delayDebounceFn)
    }

    const getMovieVideo = async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const data = await result.json()
        const trailer = data.results.filter(obj => {
            return obj.type === "Trailer"
        })
        console.log(trailer)

        let delayDebounceFn = setTimeout(() => {
            setVideo(trailer)
        }, 750)

        return () => clearTimeout(delayDebounceFn)
    }

    // Lifecycle
    useEffect(() => {
        if (id) {
            getMovieDetails()
            getMovieVideo()
        }
    }, [id])

    // Render
    return details
        ? (
            <>
                <Head>
                    <title>MovieDB - {details.title}</title>
                    <meta name="keyword" content={details.title} />
                </Head>
                <div className="pageContainer">
                    <div className={styles.root}>
                        <div className={styles.imgContainer}>
                            <Image
                                width={480}
                                height={720}
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
                                    <>
                                        <span>
                                            {genre.name}
                                        </span>
                                        {index === details.genres.length - 1 ? '' : <>&nbsp;&#9679;&nbsp;</>}
                                    </>
                                ))}
                            </div>
                            <div className={styles.synopsis}>
                                <h3>Synopsis</h3>
                                <p>
                                    {details.overview}
                                </p>
                            </div>
                            {video && (
                                <div className={styles.video}>
                                    <h3>Trailer</h3>
                                    <iframe
                                        allowfullscreen
                                        frameborder="0"
                                        className={styles.trailer}
                                        title="YouTube video player"
                                        src={`https://www.youtube.com/embed/${video[0].key}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
        : <Skeleton type="movie" />
};

export default MovieDetails;