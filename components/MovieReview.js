import { useState } from "react"
import moment from "moment";

const MovieReview = ({ styles, data }) => {
    // State
    const [readMore, setReadMore] = useState(false)

    // Render
    return (
        <div className={styles.reviewBox}>
            <h4>
                {data.author}
            </h4>
            <small>
                {moment(data.created_at).format("MMMM Do, YYYY")}
            </small>
            <p>
                {
                    data.content.length < 780
                        ? data.content
                        : (
                            <>
                                {data.content.substring(0, 780)}
                                {readMore ? "" : ". . ."}
                                <span style={readMore ? { transition: ".2s ease", opacity: 1 } : { opacity: 0, position: "fixed", transition: ".2s ease" }}>
                                    {data.content.substring(780, data.content.length)}
                                </span>
                                <div className="text-center">
                                    <button onClick={() => setReadMore(!readMore)}>
                                        {readMore ? "Read less" : "Read more"}
                                    </button>
                                </div>
                            </>
                        )
                }
            </p>
        </div>
    );
}

export default MovieReview;