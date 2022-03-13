import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
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

    const checkInput = useCallback(() => {
        let regExp = /[a-zA-Z]/g

        if (regExp.test(text)) {
            return true
        }

        return false
    }, [text])

    // Lifecycle
    useEffect(() => {
        if (checkInput()) {
            let debounceFunction = setTimeout(async () => {
                searchMovies()
            }, 1000)

            return () => clearTimeout(debounceFunction)
        }
    }, [text, checkInput, searchMovies])

    // Render
    return (
        <div className="pageContainer">

            <Head>
                <title>{display && display + ' - '}Movieku</title>
            </Head>

            <AnimatePresence>
                <motion.input
                    type="text"
                    value={text}
                    className={styles.searchInput}
                    placeholder="Search for a movie . . ."
                    onKeyDown={e => preventDefault(e)}
                    onChange={e => setText(e.target.value)}
                    initial={{ width: "5%" }}
                    animate={{ width: "100%" }}
                />
            </AnimatePresence>

            {(!result && loading === false) && (
                <div className={styles.searchSvg}>
                    <p>
                        Type a word to start a search
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

            <motion.div className={(loading || result && result.length === 0) ? styles.loadingWrapper : styles.popular}>
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
                                            <h3 className={styles.noResult}>
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