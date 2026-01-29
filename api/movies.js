export default async function handler(req, res) {
    // --- نظام الحماية المصحح ---
    const allowedOrigin = "https://monoflix.vercel.app"; 
    const requestOrigin = req.headers.origin;

    // السماح بالطلبات التي تأتي من موقعك فقط
    if (requestOrigin && requestOrigin !== allowedOrigin) {
        return res.status(403).json({ error: "Access Denied: Unrecognized Source" });
    }

    // إضافة ترويسات الحماية
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin || "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    // -------------------

    const { query, genre, page, type, id, season, lang, similar } = req.query;
    const API_KEY = process.env.TMDB_API_KEY; 
    const language = lang || 'ar-SA';

    // بقية الكود كما هي...
    let url = "";

    try {
        if (query) {
            url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`;
        } 
        else if (id && similar) {
            url = `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}&language=${language}`;
        }
        else if (id && type === 'tv' && season) {
            url = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`;
        }
        else if (id && type === 'tv') {
            url = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=${language}`;
        }
        else if (genre && genre !== 'trending' && genre !== 'top_rated') {
            url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=${language}&page=${page || 1}`;
        } 
        else if (genre === 'top_rated') {
            url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=${language}&page=${page || 1}`;
        }
        else {
            url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=${language}&page=${page || 1}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
