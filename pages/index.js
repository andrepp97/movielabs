import { useState, useEffect } from 'react'
import { MovieCard, MovieGenre, MovieSlider, Carousel } from '../components'
import { motion, AnimatePresence } from 'framer-motion'
import styles from '../styles/Home.module.css'

const Home = () => {
    // State
    const [trending, setTrending] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [topRated, setTopRated] = useState([])
    const [popular, setPopular] = useState([])
    const [filtered, setFiltered] = useState([])
    const [activeGenre, setActiveGenre] = useState(0)

    // Function
    const getTrendingMovies = async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const movies = await result.json()

        let temp = []
        movies.results.forEach((movie, index) => {
            if (index < 5) {
                temp.push(movie)
            } else {
                return
            }
        })

        setTrending(temp)
    }

    const getPopularMovies = async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=2`)
        const result2 = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=3`)
        const movies = await result.json()
        const movies2 = await result2.json()

        let temp = [...movies.results]
        temp = temp.concat(movies2.results)

        setPopular(temp)
        setFiltered(temp)
    }

    const getUpcomingMovies = async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/upcoming?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const movies = await result.json()
        setTimeout(() => {
            setUpcoming(movies.results)
        }, 250)
    }

    const getTopMovies = async () => {
        const result = await fetch(process.env.NEXT_PUBLIC_URL + `/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
        const movies = await result.json()
        setTimeout(() => {
            setTopRated(movies.results)
        }, 250)
    }

    // Lifecycle
    useEffect(() => {
        getTrendingMovies()
        getUpcomingMovies()
        getTopMovies()
        getPopularMovies()
    }, [])

    // Render
    return (
        <div style={{ marginTop: '60px' }}>

            <Carousel movies={trending} />

            <MovieSlider
                movies={upcoming}
                title="Upcoming Movies"
            />

            <MovieSlider
                movies={topRated}
                title="Top Rated Movies"
            />

            <MovieGenre
                title="Genres"
                popular={popular}
                setFiltered={setFiltered}
                activeGenre={activeGenre}
                setActiveGenre={setActiveGenre}
            />

            <motion.div className={styles.popular}>
                <AnimatePresence>
                    {filtered.map(movie => (
                        <MovieCard
                            key={movie.id}
                            data={movie}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

        </div>
    )
}

export default Home;