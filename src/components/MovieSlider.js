import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Skeleton from "./Skeleton"
import Link from "next/link"

const imgURL = "https://image.tmdb.org/t/p/w342"

const MovieSlider = ({ title, movies, uppercase, showRating }) => {
    // Ref & State
    const carouselRef = useRef()
    const [width, setWidth] = useState(0)
    const [index, setIndex] = useState(0)

    // Lifecycle
    useEffect(() => {
        if (movies && carouselRef) {
            let debounce = setTimeout(() => {
                const x = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth + 40
                if (x > width) setWidth(x)
            }, 750)

            return () => clearTimeout(debounce)
        }
    }, [movies, width, index, carouselRef])

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
                        whileDrag={{ pointerEvents: "none" }}
                        dragConstraints={{ right: 0, left: -width }}
                        className="inner-carousel"
                    >
                        {movies && movies.map((movie, index) => (
                            <Link
                                key={movie.id}
                                passHref={true}
                                href={"/movies/" + movie.id}
                            >
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
                                        loading="eager"
                                        alt={movie.title}
                                        className="itemImg"
                                        src={imgURL + movie.poster_path}
                                        onLoad={() => index > 0 && setIndex(index)}
                                    />
                                    <p className="movieYear">
                                        ({movie.release_date.split("-")[0]})
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