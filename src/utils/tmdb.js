export const fetchTMDB = async (endpoint, page = 1, extraOptions = {}) => {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || "https://api.themoviedb.org/3"}${endpoint}${separator}language=en-US&page=${page}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`
    },
    ...extraOptions
  };

  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`TMDB Fetch Failed: ${endpoint}. Status: ${response.status}`);
  return response.json();
};