import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import styles from "../styles/MovieGenre.module.css"

const MovieGenre = ({ title, popular, moreData, setFiltered, genreList, activeGenre, setActiveGenre }) => {
    // State & Ref
    const genreRef = useRef()
    const [width, setWidth] = useState(0)
    const [genre, setGenre] = useState(null)

    // Lifecycle
    useEffect(() => {
        if (genreList) {
            let temp = [...genreList]
            temp.unshift({ id: 0, name: "All" })
            temp = temp.filter(item => item.id !== 10770)
            temp.forEach((item, idx) => { if (item.name === "Science Fiction") temp[idx].name = "Sci-Fi" })
            setGenre(temp)
        }
    }, [genreList])

    useEffect(() => {
        let debounce = setTimeout(() => {
            setWidth(genreRef.current.scrollWidth - genreRef.current.offsetWidth + 40)
        }, 750)

        return () => clearTimeout(debounce)
    }, [genre])

    useEffect(() => {
        if (popular) {
            let arr = [...popular, ...moreData]

            if (activeGenre == 0) {
                setFiltered(arr)
                return
            }

            const filtered = arr.filter(movie => movie.genre_ids.includes(activeGenre))
            setFiltered(filtered)
        }
    }, [popular, moreData, activeGenre, setFiltered])

    // Render
    return (
        <>
            <div className="sectionTitle">
                {title}
            </div>
            <div ref={genreRef} className={styles.genreContainer}>
                <motion.div
                    drag="x"
                    whileDrag={{ pointerEvents: "none" }}
                    dragConstraints={{ right: 0, left: -width }}
                    className={styles.genreSlider}
                >
                    {genre && genre.map((value, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActiveGenre(value.id)}
                            className={activeGenre === value.id ? styles.genreActive : styles.genreItem}
                            style={idx !== genre.length - 1 ? { marginRight: "12px" } : { marginright: 0 }}
                        >
                            <p>{value.name}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </>
    );
};

export default MovieGenre;