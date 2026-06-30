const TMDB_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://api.themoviedb.org/3";

/**
 * Fetch wrapper for TMDB v4 API.
 * @param {string} endpoint - The API path (e.g., '/movie/popular')
 * @param {number} page - Optional page number for pagination (defaults to 1)
 */
export const fetchTMDB = async (endpoint, page = 1) => {
  // Automatically handles appending page query parameter cleanly
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${separator}language=en-US&page=${page}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`
    }
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`TMDB Fetch Failed: ${endpoint}. Status: ${response.status}`);
  }

  return response.json();
};