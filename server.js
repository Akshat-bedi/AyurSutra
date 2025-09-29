const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// ✅ Using environment variable
require('dotenv').config(); // make sure this is at the top of server.js

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Database connection failed:', err));


// Import routes
// const authRoutes = require('./routes/auth');
// const therapyRoutes = require('./routes/therapy');
// const patientRoutes = require('./routes/patients');
// const notificationRoutes = require('./routes/notifications');
// const scheduleRoutes = require('./routes/schedule');

// Initialize Express app
const app = express();

// ===== MIDDLEWARE SETUP =====

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://ayursutra.com', 'https://www.ayursutra.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 15 * 60 * 1000
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Request logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== DATABASE CONNECTION =====
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayursutra', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// ===== API ROUTES =====
// app.use('/api/auth', authRoutes);
// app.use('/api/therapies', therapyRoutes);
// app.use('/api/patients', patientRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/schedule', scheduleRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'AyurSutra API is running',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        title: 'AyurSutra API Documentation',
        version: '1.0.0',
        description: 'Panchakarma Management System API',
        endpoints: {
            auth: {
                'POST /api/auth/register': 'Register new user',
                'POST /api/auth/login': 'User login',
                'POST /api/auth/logout': 'User logout',
                'GET /api/auth/profile': 'Get user profile',
                'PUT /api/auth/profile': 'Update user profile'
            },
            therapies: {
                'GET /api/therapies': 'Get all therapies',
                'GET /api/therapies/:id': 'Get therapy by ID',
                'POST /api/therapies': 'Create new therapy (admin)',
                'PUT /api/therapies/:id': 'Update therapy (admin)',
                'DELETE /api/therapies/:id': 'Delete therapy (admin)'
            },
            patients: {
                'GET /api/patients': 'Get all patients (practitioner)',
                'GET /api/patients/:id': 'Get patient by ID',
                'POST /api/patients': 'Create patient record',
                'PUT /api/patients/:id': 'Update patient record',
                'GET /api/patients/:id/history': 'Get patient therapy history'
            },
            schedule: {
                'GET /api/schedule': 'Get schedule',
                'POST /api/schedule': 'Create appointment',
                'PUT /api/schedule/:id': 'Update appointment',
                'DELETE /api/schedule/:id': 'Cancel appointment'
            },
            notifications: {
                'GET /api/notifications': 'Get user notifications',
                'POST /api/notifications': 'Send notification',
                'PUT /api/notifications/:id/read': 'Mark as read'
            }
        }
    });
});

// ===== STATIC FILE SERVING =====
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));
    
    // Serve React app for any non-API routes
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api/')) {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        }
    });
}

// ===== ERROR HANDLING =====

// 404 handler for API routes
// app.use('/api/*', (req, res) => {
//     res.status(404).json({
//         error: 'API endpoint not found',
//         path: req.originalUrl,
//         method: req.method,
//         timestamp: new Date().toISOString()
//     });
// });

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global Error Handler:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            error: 'Validation Error',
            details: errors,
            timestamp: new Date().toISOString()
        });
    }

    // Mongoose cast error (invalid ObjectId)
    if (error.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID format',
            timestamp: new Date().toISOString()
        });
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            error: `${field} already exists`,
            timestamp: new Date().toISOString()
        });
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            timestamp: new Date().toISOString()
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            timestamp: new Date().toISOString()
        });
    }

    // Default server error
    res.status(error.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// ===== SERVER STARTUP =====
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 AyurSutra server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

// Socket.io setup for real-time features
const socketIo = require('socket.io');
const io = socketIo(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? ['https://ayursutra.com']
            : ['http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});

// Socket connection handling
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join room based on user role
    socket.on('join-room', (data) => {
        const { userId, role } = data;
        socket.join(`${role}-${userId}`);
        console.log(`📡 User ${userId} joined ${role} room`);
    });

    // Handle therapy progress updates
    socket.on('progress-update', (data) => {
        const { patientId, progress } = data;
        socket.to(`patient-${patientId}`).emit('progress-updated', progress);
        console.log(`📊 Progress update sent to patient ${patientId}`);
    });

    // Handle appointment notifications
    socket.on('appointment-notification', (data) => {
        const { userId, notification } = data;
        socket.to(`patient-${userId}`).emit('new-notification', notification);
        console.log(`🔔 Notification sent to user ${userId}`);
    });

    // Handle real-time chat messages for AyurBot
    socket.on('send-message', (data) => {
        const { recipientId, message, senderId } = data;
        socket.to(`user-${recipientId}`).emit('receive-message', {
            message,
            senderId,
            timestamp: new Date().toISOString()
        });
    });

    // Handle AyurBot queries
    socket.on('ayurbot-query', (data) => {
        const { query, userId } = data;
        // Process query and send response
        const response = processAyurBotQuery(query);
        socket.emit('ayurbot-response', {
            response,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
    });
});

// AyurBot query processing function
function processAyurBotQuery(query) {
    // Basic keyword matching for demo
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('dosha')) {
        return {
            text: "Your Dosha determines your unique constitution. There are three types: Vata (Air & Space), Pitta (Fire & Water), and Kapha (Earth & Water). Would you like to take our Dosha assessment?",
            followUp: ['Take Dosha Quiz', 'Learn about Doshas', 'Book consultation']
        };
    } else if (lowerQuery.includes('panchakarma')) {
        return {
            text: "Panchakarma is Ayurveda's ultimate detox program with 5 main therapies: Vamana, Virechana, Basti, Nasya, and Raktamokshana. Ready to start your transformation journey with AyurSutra?",
            followUp: ['Book consultation', 'Learn more', 'See packages']
        };
    }
    
    return {
        text: "I'm here to help with your Ayurvedic wellness journey at AyurSutra! How can I assist you today?",
        followUp: ['Find my Dosha', 'Natural remedies', 'Book therapy', 'Diet advice']
    };
}

// Store io instance globally for use in other modules
global.io = io;

module.exports = app;