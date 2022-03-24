import { useState, useRef, useEffect } from 'react'
import { Skeleton } from '../components'
import { motion } from 'framer-motion'
import Link from 'next/link'

const imgURL = 'https://image.tmdb.org/t/p/w300'

const MovieSlider = ({ title, movies, uppercase, showRating }) => {
    // Ref & State
    const carouselRef = useRef()
    const [width, setWidth] = useState(0)
    const [itemIdx, setItemIdx] = useState(0)

    // Lifecycle
    useEffect(() => {
        if (movies) setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth + 50)
    }, [movies, itemIdx])

    // Render
    return !movies
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
                        {movies && movies.map((movie, index) => (
                            <Link href={'/movies/' + movie.id} key={movie.id} passHref={true}>
                                <motion.div
                                    className="item"
                                    whileTap={{
                                        y: 0,
                                        cursor: "grabbing",
                                    }}
                                    whileHover={{
                                        y: "-4px",
                                        transition: { duration: .2 },
                                    }}
                                >
                                    <img
                                        alt={movie.title}
                                        className="itemImg"
                                        onLoad={() => setItemIdx(index)}
                                        src={imgURL + movie.poster_path}
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