import Link from "next/link"
import Image from "next/image"
import { BsFillStarFill, BsPlayFill, BsImages } from "react-icons/bs"

const castURL = "https://image.tmdb.org/t/p/w138_and_h175_face"

const round = (val = 1) => Math.round(val * 10) / 10

const MovieDetail = ({ styles, casts, video, details, openModal }) => {
    return details && (
        <div className={styles.movieDetail}>

            <h1>
                {details.title || details.name}
                {details.first_air_date && (
                    <span>
                        ({details.first_air_date.split("-")[0]})
                    </span>
                )}
            </h1>

            <div className={styles.movieGenre}>
                {details.genres && details.genres.map((genre, index) => (
                    <div key={genre.id}>
                        <span>
                            {genre.name}
                        </span>
                        {index === details.genres.length - 1 ? "" : <strong>&nbsp;&#183;&nbsp;</strong>}
                    </div>
                ))}
            </div>

            <div className={styles.movieRating}>
                <BsFillStarFill size={20} color="#F7C03E" />
                <p>{round(details.vote_average)}</p>
                <small>/ 10</small>
            </div>

            <div className={styles.cast}>
                <h3>Main Cast</h3>
                <div className={styles.castWrapper}>
                    {casts && casts.map((cast, index) => {
                        if (index < 6) return (
                            <Link
                                passHref={true}
                                key={cast.id}
                                href={`/cast/` + cast.id}
                            >
                                <div className={styles.castBox}>
                                    <Image
                                        width={90}
                                        height={90}
                                        alt={cast.name}
                                        priority={true}
                                        className={styles.castImg}
                                        src={cast.profile_path ? castURL + cast.profile_path : "/avatar.png"}
                                    />
                                    <p>
                                        {cast.name}
                                    </p>
                                    <small>
                                        {cast.character}
                                    </small>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className={styles.synopsis}>
                <h3>Overview</h3>
                <p>
                    {details.overview}
                </p>
            </div>

            {video && (
                <div className={styles.media}>
                    <h3>Media</h3>
                    <div className="d-flex">
                        <button
                            className="btn-main"
                            onClick={() => openModal("trailer")}
                        >
                            <BsPlayFill size={20} /> &nbsp; Play Trailer
                        </button>
                        <button
                            className="btn-main"
                            onClick={() => openModal("gallery")}
                        >
                            <BsImages size={20} /> &nbsp; Gallery
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MovieDetail;