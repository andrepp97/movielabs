import { MovieSlider, Carousel } from "../components";
import { fetchTMDB } from "../utils/tmdb";

export async function getStaticProps() {
  try {
    // Fired cleanly in parallel using the centralized token helper
    const [
      trendingData,
      upcomingData,
      topRatedData,
      popularMoviesData,
      popularTvData,
      topRatedTvData,
    ] = await Promise.all([
      fetchTMDB("/trending/all/week"),
      fetchTMDB("/movie/upcoming"),
      fetchTMDB("/movie/top_rated"),
      fetchTMDB("/movie/popular"),
      fetchTMDB("/tv/popular"),
      fetchTMDB("/tv/top_rated"),
    ]);

    const trending = (trendingData.results || [])
      .filter((item, index) => index < 8 && (item.media_type === "movie" || item.media_type === "tv"));

    const popularMovies = (popularMoviesData.results || [])
      .filter((item) => item.release_date && item.poster_path);

    return {
      props: {
        trending,
        upcoming: upcomingData.results || [],
        topRated: topRatedData.results || [],
        popularMovies,
        popularTv: popularTvData.results || [],
        topRatedTv: topRatedTvData.results || [],
      },
      revalidate: 1800,
    };
  } catch (error) {
    console.error("Data Fetching Error on Home Page:", error);

    return {
      props: {
        trending: [],
        upcoming: [],
        topRated: [],
        popularMovies: [],
        popularTv: [],
        topRatedTv: [],
      },
      revalidate: 60,
    };
  }
}

const Home = ({ trending, upcoming, topRated, popularMovies, topRatedTv, popularTv }) => {
  return (
    <main>
      <Carousel movies={trending} />
      <MovieSlider type="movies" movies={upcoming} title="Upcoming Movies" />
      <MovieSlider type="movies" movies={topRated} showRating title="Top Rated Movies" />
      <MovieSlider type="movies" movies={popularMovies} title="Popular Movies" />
      <MovieSlider type="tv" showRating movies={topRatedTv} title="Top Rated TV Shows" />
      <MovieSlider type="tv" movies={popularTv} title="Popular TV Shows" />
    </main>
  );
};

export default Home;