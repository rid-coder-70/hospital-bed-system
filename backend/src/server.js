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
const { registerSocketEvents } = require('./socket/events');

const app    = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin : true,
    methods: ['GET', 'POST'],
    credentials: true
  },
});


app.use(cors({
  origin     : true, 
  credentials: true,
}));
app.use(express.json());


app.use((req, _res, next) => { req.io = io; next(); });

app.use('/api/auth',       authRoutes);
app.use('/api/hospitals',  hospitalRoutes);
app.use('/api/beds',       bedRoutes);
app.use('/api/ambulance',  ambulanceRoutes);

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
