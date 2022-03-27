import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import moment from "moment"

const imgURL = "https://image.tmdb.org/t/p/w64_and_h64_face"

const MovieReview = ({ styles, data }) => {
    // State & Ref
    const reviewRef = useRef()
    const [height, setHeigt] = useState(0)
    const [readMore, setReadMore] = useState(false)

    // Lifecycle
    useEffect(() => {
        setHeigt(reviewRef?.current?.scrollHeight)
    }, [reviewRef])

    // Render
    return data && (
        <div className={styles.reviewBox}>

            <div className={styles.authorBox}>
                <Image
                    width={64}
                    height={64}
                    alt="Reviewer"
                    loading="lazy"
                    src={
                        data.author_details.avatar_path
                            ? data.author_details.avatar_path.includes("gravatar")
                                ? data.author_details.avatar_path.substring(1, data.author_details.avatar_path.length)
                                : imgURL + data.author_details.avatar_path
                            : "/avatar.png"
                    }
                />
                <div className={styles.autorName}>
                    <h4>
                        {data.author}
                    </h4>
                    <small>
                        {moment(data.created_at).format("MMMM Do, YYYY")}
                    </small>
                </div>
            </div>

            <div className={styles.reviewContent}>
                <p
                    ref={reviewRef}
                    className={styles.reviewText}
                    style={readMore ? { WebkitLineClamp: "unset" } : {}}
                >
                    {data.content}
                </p>
                {height > 154 && (
                    <div className="text-center">
                        <button onClick={() => setReadMore(!readMore)}>
                            {readMore ? "Read less" : "Read more"}
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}

export default MovieReview;