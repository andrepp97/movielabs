import Link from "next/link";
import {motion} from "framer-motion";
import styles from "../styles/MovieCard.module.css";

const imgURL = "https://image.tmdb.org/t/p/w342";

const MovieCard = ({data, type}) => {
  return (
    <Link
      passHref={true}
      href={type == "tv" ? "/tv/" + data.id : "/movies/" + data.id}
    >
      <motion.div
        layout
        animate={{opacity: 1}}
        initial={{opacity: 0}}
        exit={{opacity: 0}}
        whileTap={{scale: 1}}
        whileHover={{
          scale: 1.05,
          transition: {duration: 0.2},
        }}
        className={styles.movieCard}
      >
        <div className={styles.movieImage}>
          <motion.img
            loading="lazy"
            alt={data.title || data.name}
            src={imgURL + data.poster_path}
            whileHover={{
              transition: {duration: 0.2},
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 8px",
            }}
          />
        </div>
        <div className={styles.movieText}>
          <p className={styles.movieYear}>
            (
            {data.media_type == "movie" || type == "movie"
              ? data.release_date.split("-")[0]
              : data.first_air_date.split("-")[0]}
            )
          </p>
          <p className={styles.movieTitle}>{data.title || data.name}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
