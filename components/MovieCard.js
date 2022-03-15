import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from '../styles/MovieCard.module.css'

const imgURL = 'https://image.tmdb.org/t/p/w500'

const MovieCard = ({ data }) => {
    return (
        <Link href={'/movies/' + data.id} passHref={true}>
            <motion.div
                layout
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 1 }}
                whileHover={{
                    scale: 1.02,
                    transition: { duration: .15 },
                }}
                className={styles.movieCard}
            >
                <div className={styles.movieImage}>
                    <motion.img
                        loading="lazy"
                        alt={data.title}
                        src={imgURL + data.poster_path}
                        whileHover={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 10px" }}
                    />
                </div>
                <div className={styles.movieText}>
                    {data.release_date && (
                        <p className={styles.movieYear}>
                            ({data.release_date.split('-')[0]})
                        </p>
                    )}
                    <p className={styles.movieTitle}>
                        {data.title}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

export default MovieCard;