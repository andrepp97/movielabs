import { useState, useEffect, useCallback } from "react"
import { MovieCard, MovieGenre, MovieSlider, Carousel, Loader } from "../components"
import { motion, AnimatePresence } from "framer-motion"
import styles from "../styles/Home.module.css"

// DATA FETCHING
export async function getStaticProps() {
    const result = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const trendingTemp = await result.json()
    let trending = trendingTemp.results.filter((item, index) => index < 6)

    const result2 = await fetch(process.env.NEXT_PUBLIC_URL + `/upcoming?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const upcomingTemp = await result2.json()
    const upcoming = upcomingTemp.results

    const result3 = await fetch(process.env.NEXT_PUBLIC_URL + `/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const topRatedTemp = await result3.json()
    const topRated = topRatedTemp.results

    const result4 = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=2`)
    const result5 = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=3`)
    const popularTemp1 = await result4.json()
    const popularTemp2 = await result5.json()

    let popular = popularTemp1.results.filter(movie => movie.poster_path && movie.release_date)
    let popular2 = popularTemp2.results.filter(movie => movie.poster_path && movie.release_date)
    popular = popular.concat(popular2)

    const getGenres = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`)
    const genres = await getGenres.json()

    return {
        props: {
            trending,
            upcoming,
            topRated,
            popular,
            genres,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 30 minutes
        revalidate: 1800, // in seconds
    }
}

// COMPONENT
const Home = ({ trending, upcoming, topRated, popular, genres }) => {
    // State
    const [page, setPage] = useState(3)
    const [loading, setLoading] = useState(false)
    const [moreData, setMoreData] = useState([])
    const [filtered, setFiltered] = useState([])
    const [activeGenre, setActiveGenre] = useState(0)

    // Load More
    const loadMoreData = useCallback(async () => {
        try {
            setLoading(true)
            setActiveGenre(0)
            const result = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${page}`)
            const movies = await result.json()
            let arr = [...moreData, ...movies.results]
            setMoreData(arr)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [page])

    // Lifecycle
    useEffect(() => {
        if (page > 3) loadMoreData()
    }, [page, loadMoreData])

    // Render
    return (
        <div style={{ marginTop: "3rem" }}>

            <Carousel movies={trending} />

            <MovieSlider
                movies={upcoming}
                title="Upcoming Movies"
            />

            <MovieSlider
                movies={topRated}
                showRating={true}
                title="Top Rated Movies"
            />

            <MovieGenre
                title="Genres"
                popular={popular}
                moreData={moreData}
                genreList={genres.genres}
                setFiltered={setFiltered}
                activeGenre={activeGenre}
                setActiveGenre={setActiveGenre}
            />

            <motion.div className={styles.popular}>
                <AnimatePresence>
                    {filtered && filtered.map((movie, index) => (
                        <MovieCard
                            data={movie}
                            key={movie.id + "-" + index}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            <div className={styles.loadMore}>
                {
                    loading
                        ? <Loader />
                        : page < 8
                            ? (
                                <button
                                    className="btn-main"
                                    onClick={() => setPage(page + 1)}
                                >
                                    Load More
                                </button>
                            )
                            : null
                }
            </div>

        </div>
    )
}

export default Home;