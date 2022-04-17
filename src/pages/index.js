import { MovieSlider, Carousel } from "../components"

// DATA FETCHING
export async function getStaticProps() {
    const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/trending/all/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}`)
    const trendingTemp = await result.json()
    const trending = trendingTemp.results.filter((item, index) => index < 8 && (item.media_type == "movie" || item.media_type == "tv"))

    const result2 = await fetch(process.env.NEXT_PUBLIC_URL + `/upcoming?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const upcomingTemp = await result2.json()
    const upcoming = upcomingTemp.results

    const result3 = await fetch(process.env.NEXT_PUBLIC_URL + `/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const topRatedTemp = await result3.json()
    const topRated = topRatedTemp.results

    const result4 = await fetch(process.env.NEXT_PUBLIC_URL + `/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const popularMoviesTemp = await result4.json()
    const popularMovies = popularMoviesTemp.results.filter(item => (item.release_date && item.poster_path))

    const result5 = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const popularTvTemp = await result5.json()
    const popularTv = popularTvTemp.results

    const result6 = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const topRatedTvTemp = await result6.json()
    const topRatedTv = topRatedTvTemp.results

    return {
        props: {
            trending,
            upcoming,
            topRated,
            popularMovies,
            topRatedTv,
            popularTv,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 30 minutes
        revalidate: 1800, // in seconds
    }
}

// COMPONENT
const Home = ({ trending, upcoming, topRated, popularMovies, topRatedTv, popularTv }) => {
    return (
        <div style={{ marginTop: "3rem", position: "relative" }}>

            <Carousel movies={trending} />

            <MovieSlider
                type="movies"
                movies={upcoming}
                title="Upcoming Movies"
            />

            <MovieSlider
                type="movies"
                movies={topRated}
                showRating={true}
                title="Top Rated Movies"
            />

            <MovieSlider
                type="movies"
                movies={popularMovies}
                title="Popular Movies"
            />

            <MovieSlider
                type="tv"
                showRating={true}
                movies={topRatedTv}
                title="Top Rated TV Shows"
            />

            <MovieSlider
                type="tv"
                movies={popularTv}
                title="Popular TV Shows"
            />

        </div>
    )
}

export default Home;