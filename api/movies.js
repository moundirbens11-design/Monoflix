export default async function handler(req, res) {
    const { query, genre, page, type, id, season, lang } = req.query;
    const API_KEY = process.env.TMDB_API_KEY; 
    const language = lang || 'ar-SA';
    
    let url = "";

    // 1. البحث
    if (query) {
        url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`;
    } 
    // 2. جلب الحلقات لموسم معين
    else if (id && type === 'tv' && season) {
        url = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`;
    }
    // 3. جلب تفاصيل المسلسل (المواسم)
    else if (id && type === 'tv') {
        url = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=${language}`;
    }
    // 4. جلب محتوى مشابه
    else if (id && type === 'movie') {
        url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=${language}`;
    }
    // 5. جلب حسب التصنيف (Action, Drama, etc)
    else if (genre && genre !== 'trending') {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=${language}&page=${page || 1}`;
    } 
    // 6. الصفحة الرئيسية (Trending)
    else {
        url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=${language}&page=${page || 1}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال بخوادم TMDB" });
    }
}
