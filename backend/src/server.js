require('dotenv').config();
const express     = require('express');
const http        = require('http');
const cors        = require('cors');
const { Server }  = require('socket.io');

const db             = require('./config/db');
const hospitalRoutes = require('./routes/hospitals');
const bedRoutes      = require('./routes/beds');
const ambulanceRoutes= require('./routes/ambulance');
const authRoutes     = require('./routes/auth');
const adminRoutes    = require('./routes/admin');
const dispatchRoutes = require('./routes/dispatches');
const { registerSocketEvents } = require('./socket/events');

const app    = express();
const server = http.createServer(app);


// Determine allowed origins from environment variable
// In Railway: set FRONTEND_URL=https://your-app.vercel.app
// Multiple origins can be comma-separated: https://a.vercel.app,https://b.vercel.app
const rawOrigins = process.env.FRONTEND_URL || '';
const allowedOrigins = rawOrigins
  ? rawOrigins.split(',').map(o => o.replace(/\/$/, '').trim()).filter(Boolean)
  : [];

// Automatically trust the known vercel deployment, stripping any accidents
allowedOrigins.push('https://healthbed-ai.vercel.app');

// CORS origin resolver — allows all in dev, specific origins in prod
const corsOrigin = (origin, callback) => {
  if (process.env.NODE_ENV !== 'production') return callback(null, true);
  if (!origin) return callback(null, true); // allow non-browser requests (mobile, Postman)
  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  callback(new Error(`CORS: Origin ${origin} not allowed`));
};

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  },
  // Allow both websocket and polling transports (required for Railway proxy)
  transports: ['polling', 'websocket'],
});


app.use(cors({
  origin     : corsOrigin,
  credentials: true,
}));
app.use(express.json());


app.use((req, _res, next) => { req.io = io; next(); });

app.use('/api/auth',       authRoutes);
app.use('/api/hospitals',  hospitalRoutes);
app.use('/api/beds',       bedRoutes);
app.use('/api/ambulance',  ambulanceRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/dispatches', dispatchRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);


app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

registerSocketEvents(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ PostgreSQL connected');
  } catch (e) {
    console.error('❌ PostgreSQL connection failed:', e.message);
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
