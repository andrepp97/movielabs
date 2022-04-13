import Link from "next/link"
import Image from "next/image"

const imgURL = "https://image.tmdb.org/t/p/w185"

const SimilarMovie = ({ item, styles }) => {
    return (
        <Link
            passHref={true}
            href={item.name ? "/tv/" + item.id : "/movies/" + item.id}
        >
            <div className={styles.similarMovie}>
                <div className={styles.similarImg}>
                    <Image
                        width={128}
                        height={190}
                        loading="lazy"
                        alt={item.title}
                        src={imgURL + item.poster_path}
                    />
                </div>
                <div className={styles.similarDetails}>
                    <div>
                        <p className={styles.similarTitle}>
                            {item.title || item.name}
                        </p>
                        <p className={styles.similarYear}>
                            {item.release_date && item.release_date.split("-")[0] || item.first_air_date.split("-")[0]}
                        </p>
                    </div>
                    <p className={styles.similarOverview}>
                        {item.overview}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default SimilarMovie;