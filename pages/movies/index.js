import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { ImSearch } from 'react-icons/im'
import { motion, AnimatePresence } from 'framer-motion'
import { MovieCard, Skeleton } from '../../components'
import styles from '../../styles/Home.module.css'

const Movies = () => {
    // State
    const [text, setText] = useState("")
    const [display, setDisplay] = useState("")
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    // Function
    const searchMovies = useCallback(async () => {
        // Get the movies
        setLoading(true)
        const query = `&query=${text}`
        const result = await fetch(process.env.NEXT_PUBLIC_SEARCH_URL + `?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1&include_adult=false${query}`)
        const result2 = await fetch(process.env.NEXT_PUBLIC_SEARCH_URL + `?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=2&include_adult=false${query}`)
        const data = await result.json()
        const data2 = await result2.json()

        // Filtering the result
        let temp = data.results.filter(movie => movie.poster_path && movie.release_date)
        if (data2.results.length) {
            let temp2 = data2.results.filter(movie => movie.poster_path && movie.release_date)
            temp = temp.concat(temp2)
        }

        // Assign the filtered result to state
        setResult(temp)
        setDisplay(text)
        setLoading(false)
    }, [text])

    const preventDefault = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
        }
    }

    // Lifecycle
    useEffect(() => {
        if (text) {
            let debounceFunction = setTimeout(async () => {
                searchMovies()
            }, 1000)

            return () => clearTimeout(debounceFunction)
        }
    }, [text, searchMovies])

    // Render
    return (
        <div className="pageContainer">

            <Head>
                <title>{display && display + ' - '}Movieku</title>
            </Head>

            <form className={styles.search}>
                <ImSearch />
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search for a movie . . ."
                    onKeyDown={e => preventDefault(e)}
                    onChange={e => setText(e.target.value)}
                    value={text}
                />
            </form>

            {(!result && loading === false) && (
                <div className={styles.searchSvg}>
                    <p>
                        Type a word to start searching
                    </p>
                    <Image
                        width={480}
                        height={480}
                        src="/search.svg"
                        alt='Try "The Batman"'
                    />
                </div>
            )}

            {
                result && loading === false
                    ? (
                        <p className={styles.resultText}>
                            Showing <strong>{result.length}</strong> {result.length > 1 ? "results" : "result"} for &quot;<strong>{display}</strong>&quot;
                        </p>
                    )
                    : null
            }

            <motion.div className={loading ? styles.loadingWrapper : styles.popular}>
                <AnimatePresence>
                    {
                        loading
                            ? <Skeleton type="slider" />
                            : (
                                result
                                    ? result.length
                                        ? result.map((movie, index) => (
                                            <MovieCard
                                                data={movie}
                                                key={`${movie.id} - ${index}`}
                                            />
                                        ))
                                        : (
                                            <h3 className="movieYear">
                                                There are no movies that matched your keyword
                                            </h3>
                                        )
                                    : null
                            )
                    }
                </AnimatePresence>
            </motion.div>

        </div>
    );
}

export default Movies;