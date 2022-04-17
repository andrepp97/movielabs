import moment from "moment"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useEffect, useCallback } from "react"
import { Skeleton, MovieSlider } from "../../components"
import styles from "../../styles/MovieDetails.module.css"

const imgURL = "https://image.tmdb.org/t/p/h632"

const CastDetails = () => {
    // State & Params
    const router = useRouter()
    const { id } = router.query
    const [details, setDetails] = useState(null)
    const [castMovies, setCastMovies] = useState([])

    // Function
    const getCastDetails = useCallback(async (signal) => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/person/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`, { signal })
        const data = await result.json()
        setDetails(data)
    }, [id])

    const getCastMovies = useCallback(async (signal) => {
        const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/person/${id}/combined_credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`, { signal })
        const data = await result.json()
        let temp = data && [...data.cast]
        temp = temp.filter((item, index) => index < 30 && item.poster_path && (item.release_date || item.first_air_date))
        temp = temp.filter((item, index, self) =>
            index === self.findIndex(t => (
                t.id === item.id
            ))
        )
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
        const controller = new AbortController()
        const signal = controller.signal

        if (id) {
            getCastDetails(signal)
            getCastMovies(signal)
        }

        return () => controller.abort()
    }, [id, getCastDetails, getCastMovies])

    // Render
    return details
        ? (
            <>

                <Head>
                    <title>{details.name} - Movieset</title>
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
                            <div className={styles.personal}>
                                <h3>Personal Information</h3>
                                <div className={styles.personalWrapper}>
                                    <div className={styles.personalItem}>
                                        <h4>Born</h4>
                                        <p>
                                            {moment(details.birthday).format("MMMM Do, YYYY")}&nbsp;
                                            {!details.deathday && (
                                                <>
                                                    (<strong style={{ color: "#969696" }}>
                                                        {calculateAge(details.birthday, new Date())}
                                                    </strong> years old)
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
                                                </strong> years old)
                                            </p>
                                        </div>
                                    )}
                                    <div className={styles.personalItem}>
                                        <h4>Place of Birth</h4>
                                        <p>{details.place_of_birth}</p>
                                    </div>
                                    <div className={styles.personalItem}>
                                        <h4>Gender</h4>
                                        <p>
                                            {
                                                details.gender === 1
                                                    ? "Female"
                                                    : details.gender === 2
                                                        ? "Male"
                                                        : "Others"
                                            }
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