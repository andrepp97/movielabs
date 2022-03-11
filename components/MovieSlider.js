import { useState, useRef, useEffect } from 'react'
import { Skeleton } from '../components'
import { motion } from 'framer-motion'
import Link from 'next/link'

const imgURL = 'https://image.tmdb.org/t/p/w300'

const MovieSlider = ({ title, movies }) => {
    // Ref & State
    const carouselRef = useRef()
    const [width, setWidth] = useState(0)

    // Lifecycle
    useEffect(() => {
        let delayDebounceFn = setTimeout(() => {
            if (movies.length > 0) setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth + 40)
        }, 1500)

        return () => clearTimeout(delayDebounceFn)
    }, [movies.length])

    // Render
    return movies.length < 1
        ? <Skeleton type="slider" />
        : (
            <div className="slider">
                <p className="sectionTitle">
                    {title}
                </p>
                <motion.div
                    ref={carouselRef}
                    className="carousel"
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        whileDrag={{ pointerEvents: 'none' }}
                        className="inner-carousel"
                    >
                        {movies.map(movie => (
                            <Link href={'/movies/' + movie.id} key={movie.id} passHref={true}>
                                <motion.div
                                    className="item"
                                    whileTap={{ scale: 1, cursor: 'grabbing' }}
                                    whileHover={{
                                        cursor: 'pointer',
                                        y: -2, scale: 1.01,
                                        transition: { duration: .2 },
                                    }}
                                >
                                    <img
                                        alt={movie.title}
                                        draggable={false}
                                        src={imgURL + movie.poster_path}
                                    />
                                    <p className="movieYear">
                                        ({movie.release_date.split('-')[0]})
                                    </p>
                                    <p className="movieTitle">
                                        {movie.title}
                                    </p>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );
};

export default MovieSlider;