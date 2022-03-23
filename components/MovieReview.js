import { useState } from "react"
import Image from "next/image"
import moment from "moment"

const imgURL = "https://image.tmdb.org/t/p/w64_and_h64_face"

const MovieReview = ({ styles, data }) => {
    // State
    const [readMore, setReadMore] = useState(false)

    // Render
    return data && (
        <div className={styles.reviewBox}>

            <div className={styles.authorBox}>
                <Image
                    width={64}
                    height={64}
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
                {
                    data.content.length < 785
                        ? data.content
                        : (
                            <>
                                {data.content.substring(0, 785)}
                                {readMore ? "" : ". . ."}
                                <span style={readMore ? { transition: ".2s ease", opacity: 1 } : { opacity: 0, position: "fixed", transition: ".2s ease" }}>
                                    {data.content.substring(785, data.content.length)}
                                </span>
                                <div className="text-center">
                                    <button onClick={() => setReadMore(!readMore)}>
                                        {readMore ? "Read less" : "Read more"}
                                    </button>
                                </div>
                            </>
                        )
                }
            </div>

        </div>
    );
}

export default MovieReview;