import { useState, useRef, useEffect } from 'react'
import { Skeleton } from '../components'
import { motion } from 'framer-motion'
import Link from 'next/link'

const imgURL = 'https://image.tmdb.org/t/p/w300'

const MovieSlider = ({ title, movies, uppercase, showRating }) => {
    // Ref & State
    const carouselRef = useRef()
    const [width, setWidth] = useState(0)

    // Lifecycle
    useEffect(() => {
        if (movies && movies.length && carouselRef.current) {
            let debounceFn = setTimeout(() => {
                setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth + 50)
            }, 500)

            return () => clearTimeout(debounceFn)
        }
    }, [movies, carouselRef.current])

    // Render
    return movies.length < 1
        ? <Skeleton type="slider" />
        : (
            <div className="slider">
                <p className={uppercase ? "sliderTitle" : "sectionTitle"}>
                    {title}
                </p>
                <div ref={carouselRef} className="carousel">
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        whileDrag={{ pointerEvents: 'none' }}
                        className="inner-carousel"
                        id="inner-carousel"
                    >
                        {movies && movies.map(movie => (
                            <Link href={'/movies/' + movie.id} key={movie.id} passHref={true}>
                                <motion.div
                                    className="item"
                                    whileTap={{
                                        y: 0,
                                        cursor: "grabbing",
                                    }}
                                    whileHover={{
                                        y: "-4px",
                                        transition: { duration: .15 },
                                    }}
                                >
                                    <motion.img
                                        alt={movie.title}
                                        className="itemImg"
                                        src={imgURL + movie.poster_path}
                                        whileHover={{
                                            transition: { duration: .2 },
                                            boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 8px",
                                        }}
                                    />
                                    <p className="movieYear">
                                        ({movie.release_date.split('-')[0]})
                                    </p>
                                    <p className="movieTitle">
                                        {movie.title}
                                    </p>
                                    {showRating && (
                                        <div className="ratingWrapper" style={{ width: "100%" }}>
                                            <span className="movieRating">
                                                {movie.vote_average}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        );
};

export default MovieSlider;