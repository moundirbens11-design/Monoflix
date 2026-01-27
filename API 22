export default async function handler(req, res) {
    const { query, genre, page } = req.query;
    const API_KEY = process.env.TMDB_API_KEY; 
    
    let url = "";
    if (query) {
        url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=ar-SA&query=${encodeURIComponent(query)}`;
    } else if (genre && genre !== 'trending') {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=ar-SA&page=${page || 1}`;
    } else {
        url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=ar-SA&page=${page || 1}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
