// SERVER CONFIGURATIONS
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.SERVER_PORT;

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:4200', // Replace with your Angular app's URL in production
    methods: ['GET', 'POST'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
}));

// Rate limiting middleware
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many email requests from this IP, please try again later'
});

// Redis client setup
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

// Ensure the Redis client is connected before using it
const ensureRedisConnected = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

// Movie API configuration
const MOVIE_API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.MOVIE_API_KEY;

// Helper function to fetch data with Redis caching
const fetchData = async (url, cacheKey) => {
    try {
        await ensureRedisConnected();

        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        const response = await axios.get(url);
        const data = response.data;

        // Store data in Redis with an expiration time (e.g., 1 hour)
        redisClient.setEx(cacheKey, 3600, JSON.stringify(data));

        return data;
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
        throw error;
    }
};

const genres = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    documentary: 99,
    scifi: 878,
    thriller: 53
};

const getSearchMovie = async (query) => {
    const url = `${MOVIE_API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
    const cacheKey = `search_movie:${query}`;
    return fetchDataWithCache(url, cacheKey);
};

const getMovieDetails = async (movieId) => {
    const url = `${MOVIE_API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const cacheKey = `movie_details:${movieId}`;
    return fetchDataWithCache(url, cacheKey);
};

const getMovieVideo = async (movieId) => {
    const url = `${MOVIE_API_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;
    const cacheKey = `movie_videos:${movieId}`;
    return fetchDataWithCache(url, cacheKey);
};

const getMovieCast = async (movieId) => {
    const url = `${MOVIE_API_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
    const cacheKey = `movie_cast:${movieId}`;
    return fetchDataWithCache(url, cacheKey);
};

// Define routes for each endpoint
app.get('/movies/banner', async (req, res) => {
    try {
        const data = await fetchData(`${MOVIE_API_BASE_URL}/trending/all/week?api_key=${API_KEY}`, 'movies:banner');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banner data' });
    }
});

app.get('/movies/trending', async (req, res) => {
    try {
        const data = await fetchData(`${MOVIE_API_BASE_URL}/trending/movie/day?api_key=${API_KEY}`, 'movies:trending');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
});

app.get('/search/movie', async (req, res) => {
    const query = req.query.query;
    try {
        const data = await getSearchMovie(query);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

app.get('/movie/details/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const data = await getMovieDetails(movieId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

app.get('/movie/video/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const data = await getMovieVideo(movieId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie videos' });
    }
});

app.get('/movie/cast/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const data = await getMovieCast(movieId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie cast' });
    }
});

for (const [genre, id] of Object.entries(genres)) {
    app.get(`/movies/${genre}`, async (req, res) => {
        try {
            const data = await fetchData(`${MOVIE_API_BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${id}`, `movies:${genre}`);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: `Failed to fetch ${genre} movies` });
        }
    });
}

app.post('/send-email', emailLimiter, [
    body('to').isEmail().withMessage('Invalid email address'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('text').notEmpty().withMessage('Text is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { to, subject, text } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'mail.nacossacoetec.com.ng',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('An error occurred while sending the email.');
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});