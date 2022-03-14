import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { RiCake2Line } from 'react-icons/ri'
import { ImLocation } from 'react-icons/im'
import { Skeleton, MovieSlider } from '../../components'
import styles from '../../styles/MovieDetails.module.css'

const imgURL = "https://image.tmdb.org/t/p/w600_and_h900_bestv2"

const CastDetails = () => {
    // State & Params
    const router = useRouter()
    const { id } = router.query
    const [details, setDetails] = useState(null)
    const [castMovies, setCastMovies] = useState([])

    // Function
    const getCastDetails = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/person/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`)
        const data = await result.json()
        setDetails(data)
    }, [id])

    const getCastMovies = useCallback(async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/person/${id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`)
        const data = await result.json()
        const temp = data.cast.filter((item, index) => (index < 28) && (item.poster_path && item.release_date))
        setCastMovies(temp)
    }, [id])

    const calculateAge = (birthDate, otherDate) => {
        birthDate = new Date(birthDate)
        otherDate = new Date(otherDate)

        let years = (otherDate.getFullYear() - birthDate.getFullYear())

        if (otherDate.getMonth() < birthDate.getMonth() ||
            otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
            years--
        }

        return years
    }

    // Lifecycle
    useEffect(() => {
        if (id) {
            getCastDetails()
            getCastMovies()
        }
    }, [id, getCastDetails])

    // Render
    return details
        ? (
            <>

                <Head>
                    <title>{details.name} - Movieku</title>
                    <meta name="keyword" content={details.name} />
                </Head>

                <div className="pageContainer">
                    <div className={styles.root}>
                        <div className={styles.castImg}>
                            <Image
                                width={480}
                                height={720}
                                priority={true}
                                alt={details.name}
                                className={styles.movieImg}
                                src={imgURL + details.profile_path}
                            />
                        </div>
                        <div id="movie-detail" className={styles.movieDetail}>
                            <h1>
                                {details.name}
                            </h1>
                            <div className={styles.birthday}>
                                <div className="my-1">
                                    <RiCake2Line color="#A3A3A3" />
                                    &nbsp;{details.birthday}&nbsp;
                                    <strong style={{ color: "#8e8e8e" }}>
                                        ({calculateAge(details.birthday, new Date())} years old)
                                    </strong>
                                </div>
                                <div className="my-1">
                                    <ImLocation color="#A3A3A3" />
                                    &nbsp;{details.place_of_birth}
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
                        uppercase={true}
                        title="Known For"
                        movies={castMovies}
                    />
                </div>

            </>
        )
        : <Skeleton type="movie" />
}

export default CastDetails;