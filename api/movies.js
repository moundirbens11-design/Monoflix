export default async function handler(req, res) {
    // --- نظام الحماية المحدث والمرن ---
    const requestOrigin = req.headers.origin;

    // التحقق من أن الطلب يأتي من موقعك على Vercel أو الرابط الأساسي
    if (requestOrigin && (requestOrigin.endsWith(".vercel.app") || requestOrigin === "https://monoflix.vercel.app")) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    } else {
        // حماية احتياطية في حال عدم وجود Origin واضح
        res.setHeader('Access-Control-Allow-Origin', "*"); 
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // ----------------------------------

    const { query, genre, page, type, id, season, lang, similar } = req.query;
    const API_KEY = process.env.TMDB_API_KEY; 
    const language = lang || 'ar-SA';

    let url = "";

    try {
        // 1. البحث عن فيلم أو مسلسل
        if (query) {
            url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`;
        } 
        // 2. جلب محتوى مشابه
        else if (id && similar) {
            url = `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}&language=${language}`;
        }
        // 3. جلب حلقات موسم معين لمسلسل
        else if (id && type === 'tv' && season) {
            url = `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`;
        }
        // 4. جلب تفاصيل مسلسل (لجلب قائمة المواسم)
        else if (id && type === 'tv') {
            url = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=${language}`;
        }
        // 5. جلب الأفلام بناءً على التصنيف (Genre)
        else if (genre && genre !== 'trending' && genre !== 'top_rated') {
            url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=${language}&page=${page || 1}`;
        } 
        // 6. جلب الأعلى تقييماً
        else if (genre === 'top_rated') {
            url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=${language}&page=${page || 1}`;
        }
        // 7. الافتراضي: الأفلام والمسلسلات الرائجة (Trending)
        else {
            url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=${language}&page=${page || 1}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`TMDB API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}
