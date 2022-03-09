import React, { useEffect } from 'react';
import styles from '../styles/MovieGenre.module.css'

const genre = [
    {
        id: 0,
        name: 'All'
    },
    {
        id: 28,
        name: 'Action'
    },
    {
        id: 12,
        name: 'Adventure'
    },
    {
        id: 16,
        name: 'Animation'
    },
    {
        id: 35,
        name: 'Comedy'
    },
    {
        id: 80,
        name: 'Crime'
    },
    {
        id: 14,
        name: 'Fantasy'
    },
    {
        id: 9648,
        name: 'Mystery'
    },
    {
        id: 878,
        name: 'Sci-Fi'
    },
    {
        id: 53,
        name: 'Thriller'
    },
]

const MovieGenre = ({ title, popular, setFiltered, activeGenre, setActiveGenre }) => {
    // Lifecycle
    useEffect(() => {
        if (activeGenre == 0) {
            setFiltered(popular)
            return
        }

        const filtered = popular.filter(movie => movie.genre_ids.includes(activeGenre))
        setFiltered(filtered)
    }, [popular, activeGenre, setFiltered])

    // Render
    return (
        <>
            <p className="sectionTitle">
                {title}
            </p>
            <div className={styles.genreContainer}>
                {genre.map((value, idx) => (
                    <div
                        key={idx}
                        onClick={() => setActiveGenre(value.id)}
                        className={activeGenre === value.id ? styles.genreActive : styles.genreItem}
                        style={idx !== genre.length - 1 ? { marginRight: '12px' } : { marginright: 0 }}
                    >
                        {value.name}
                    </div>
                ))}
            </div>
        </>
    );
};

export default MovieGenre;