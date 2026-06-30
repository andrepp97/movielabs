import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import moment from "moment";

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w64_and_h64_face";

const MovieReview = ({ styles, data }) => {
  const reviewRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);
  const [readMore, setReadMore] = useState(false);

  // Checks if the text actually overflows past our default 4-line collapsed view
  useEffect(() => {
    if (reviewRef.current) {
      if (reviewRef.current.scrollHeight > reviewRef.current.clientHeight) {
        setIsClamped(true);
      }
    }
  }, [data?.content]);

  if (!data) return null;

  const avatarPath = data.author_details?.avatar_path;
  const srcURL = avatarPath
    ? avatarPath.includes("gravatar")
      ? avatarPath.startsWith("/") ? avatarPath.substring(1) : avatarPath
      : `${IMG_BASE_URL}${avatarPath}`
    : "/avatar.png";

  return (
    <div className={styles.reviewBox} style={{ marginBottom: "2rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1.5rem" }}>
      {/* Author Header */}
      <div className={styles.authorBox} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
        <div style={{ borderRadius: "50%", overflow: "hidden", width: 44, height: 44, position: "relative", backgroundColor: "#f3f4f6" }}>
          <Image
            width={44}
            height={44}
            alt={data.author || "Reviewer"}
            loading="lazy"
            objectFit="cover"
            src={srcURL}
          />
        </div>
        <div className={styles.autorName}>
          <h4 style={{ margin: 0, fontWeight: 600, fontSize: "1rem", color: "#1f2937" }}>{data.author}</h4>
          <small style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            {moment(data.created_at).format("MMMM Do, YYYY")}
          </small>
        </div>
      </div>

      {/* Review Content Area */}
      <div className={styles.reviewContent}>
        <div
          style={{
            display: "block",
            maxHeight: readMore ? "2000px" : "100px",
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <p
            ref={reviewRef}
            className={styles.reviewText}
            style={{
              margin: 0,
              fontSize: "0.95rem",
              lineHeight: "1.6",
              // Fixed contrast issue: High visibility dark slate text for white backgrounds
              color: "#374151",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              // Caps at exactly 4 lines when collapsed, shows everything when expanded
              WebkitLineClamp: readMore ? "unset" : 4,
              overflow: "hidden",
            }}
          >
            {data.content}
          </p>
        </div>

        {/* Action Button Trigger */}
        {isClamped && (
          <div style={{ marginTop: "0.5rem" }}>
            <button
              onClick={() => setReadMore(!readMore)}
              style={{
                background: "none",
                border: "none",
                color: "#6037B3",
                fontWeight: "600",
                fontSize: "0.9rem",
                padding: "4px 0",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              {readMore ? "Read less ↑" : "Read more ↓"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieReview;