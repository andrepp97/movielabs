import Link from 'next/link'
import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { DotButton, PrevButton, NextButton } from "./CarouselButtons"
import { Skeleton } from '../components'

const backdropURL = 'https://image.tmdb.org/t/p/original'

const MovieCarousel = ({ movies }) => {
    const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false })
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState([])

    const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
    const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])
    const scrollTo = useCallback((index) => embla && embla.scrollTo(index), [embla])

    const onSelect = useCallback(() => {
        if (!embla) return
        setSelectedIndex(embla.selectedScrollSnap())
        setPrevBtnEnabled(embla.canScrollPrev())
        setNextBtnEnabled(embla.canScrollNext())
    }, [embla, setSelectedIndex])

    useEffect(() => {
        if (!embla) return
        onSelect()
        setScrollSnaps(embla.scrollSnapList())
        embla.on("select", onSelect)
    }, [embla, setScrollSnaps, onSelect])

    return movies.length
        ? (
            <>
                <p className="sectionTitle">
                    What&apos;s Popular
                </p>
                <div className="embla">
                    <div className="embla__viewport" ref={viewportRef}>
                        <div className="embla__container">
                            {movies.map((movie, index) => (
                                <Link
                                    href={'/movies/' + movie.id}
                                    passHref={true}
                                    key={index}
                                >
                                    <div className="embla__slide" key={index}>
                                        <div className="embla__slide__inner">
                                            <h1>
                                                {movie.title}
                                                <p className="movieYear">({movie.release_date.split('-')[0]})</p>
                                            </h1>
                                            <img
                                                src={backdropURL + movie.backdrop_path}
                                                className="embla__slide__img"
                                                alt={movie.title}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
                    <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
                </div>
                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            selected={index === selectedIndex}
                            onClick={() => scrollTo(index)}
                        />
                    ))}
                </div>
            </>
        )
        : <Skeleton type="carousel" />
}

export default MovieCarousel
