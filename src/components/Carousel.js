import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from "react";
import { Skeleton } from "../components";
import { motion, AnimatePresence } from "framer-motion";
import { PrevButton, NextButton, DotButton } from "./CarouselButtons";

const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const SWIPE_THRESHOLD = 50;
const ACCENT_COLOR = "#6037B3";

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: { x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }
  })
};

const MovieCarousel = ({ movies }) => {
  const [[page, direction], setPage] = useState([0, 0]);

  if (!movies || movies.length === 0) {
    return <Skeleton type="carousel" />;
  }

  const activeIndex = (page % movies.length + movies.length) % movies.length;
  const currentMovie = movies[activeIndex];

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDragEnd = (event, info) => {
    const swipeDistance = info.offset.x;
    if (swipeDistance < -SWIPE_THRESHOLD) {
      paginate(1);
    } else if (swipeDistance > SWIPE_THRESHOLD) {
      paginate(-1);
    }
  };

  const movieYear = currentMovie.media_type === "movie"
    ? currentMovie.release_date?.split('-')[0]
    : currentMovie.first_air_date?.split('-')[0];

  const detailUrl = currentMovie.media_type === "tv"
    ? `/tv/${currentMovie.id}`
    : `/movies/${currentMovie.id}`;

  return (
    <div className="fullscreen-carousel-wrapper">
      <div className="fullscreen-carousel-container">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="fullscreen-carousel-slide"
            style={{ cursor: "grab" }}
            whileTap={{ cursor: "grabbing" }}
          >
            <div className="fullscreen-carousel-image">
              <Image
                src={`${BACKDROP_BASE_URL}${currentMovie.backdrop_path}`}
                alt={currentMovie.title || currentMovie.name}
                layout="fill"
                objectFit="cover"
                priority
                quality={90}
                draggable={false}
              />
              <div className="fullscreen-carousel-overlay" />
            </div>

            <div className="fullscreen-carousel-content">
              <h1>
                {currentMovie.title || currentMovie.name}{" "}
                {movieYear && <span className="movieYear">({movieYear})</span>}
              </h1>
              <p className="movieDesc">{currentMovie.overview}</p>
              <Link href={detailUrl} passHref>
                <a className="carousel-view-btn">View Details</a>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <PrevButton onClick={() => paginate(-1)} enabled={true} style={{ color: ACCENT_COLOR }} />
        <NextButton onClick={() => paginate(1)} enabled={true} style={{ color: ACCENT_COLOR }} />

        {/* Placed inside the container box for absolute tracking visibility */}
        <div className="visible-carousel-dots">
          {movies.map((_, index) => (
            <DotButton
              key={index}
              selected={index === activeIndex}
              onClick={() => {
                const dir = index > activeIndex ? 1 : -1;
                setPage([index, dir]);
              }}
              style={{
                backgroundColor: index === activeIndex ? ACCENT_COLOR : "rgba(255, 255, 255, 0.35)",
                boxShadow: "0 0 4px rgba(0,0,0,0.6)"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;