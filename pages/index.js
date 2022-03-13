import { useState } from 'react'
import { MovieCard, MovieGenre, MovieSlider, Carousel } from '../components'
import { motion, AnimatePresence } from 'framer-motion'
import styles from '../styles/Home.module.css'

// DATA FETCHING
export async function getStaticProps() {
    const result = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const trendingTemp = await result.json()
    let trending = trendingTemp.results.filter((item, index) => index < 5)

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

    return {
        props: {
            trending,
            upcoming,
            topRated,
            popular,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 60, // in seconds
    }
}

// COMPONENT
const Home = ({ trending, upcoming, topRated, popular }) => {
    // State
    const [filtered, setFiltered] = useState([])
    const [activeGenre, setActiveGenre] = useState(0)

    // Render
    return (
        <div style={{ marginTop: '60px' }}>

            <AnimatePresence>
                <Carousel movies={trending} />
            </AnimatePresence>

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
                    {filtered && filtered.map(movie => (
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