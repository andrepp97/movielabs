import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion'
import { Skeleton } from '../components'

const imgURL = 'https://image.tmdb.org/t/p/w500'

const MovieSlider = ({ title, movies }) => {
    // Ref & State
    const carouselRef = useRef()
    const [width, setWidth] = useState(0)

    // Lifecycle
    useEffect(() => {
        if (movies.length > 0) {
            setTimeout(() => {
                setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
            }, 1000)
        }
    }, [movies.length])

    // Render
    return movies.length < 1
        ? <Skeleton />
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
                        className="inner-carousel"
                    >
                        {movies.map(movie => (
                            <motion.div
                                key={movie.id}
                                className="item"
                                whileTap={{ scale: 1 }}
                                whileHover={{ y: -2, scale: 1.01, transition: { duration: .2 } }}
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
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );
};

export default MovieSlider;