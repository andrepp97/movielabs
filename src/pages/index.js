import { MovieSlider, Carousel } from "../components";

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://api.themoviedb.org/3";

const fetchTMDB = async (endpoint) => {
  const url = `${TMDB_BASE_URL}${endpoint}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`;

  const response = await fetch(url);

  if (!response.ok) {
    // This will print the exact HTTP status (like 401 for bad API key, or 404 for bad URL)
    throw new Error(`Failed to fetch ${endpoint}. Status: ${response.status}`);
  }

  return response.json();
};

export async function getStaticProps() {
  try {
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
    console.error("Data Fetching Error:", error);

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