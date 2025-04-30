const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const recordRoutes = require('./routes/records');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'https://patientone.health'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/patientOne', {
  useNewUrlParser: true,
  useUnifiedTopology: true                                            
  // useCreateIndex: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Add this middleware before your static files middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' https://cdn.jsdelivr.net 'sha256-...'; " + // Add script hashes if needed
    "style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; " +
    "font-src 'self' https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self'; " +
    "frame-src 'none'; " +
    "object-src 'none'"
  );
  next();
});

// Routes
app.use('/api/records', recordRoutes);
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts')));
app.use('/css', express.static(path.join(__dirname, 'node_modules', '@fortawesome', 'fontawesome-free', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// HTML routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/records', (req, res) => res.sendFile(path.join(__dirname, 'public', 'records.html')));
app.get('/access', (req, res) => res.sendFile(path.join(__dirname, 'public', 'access.html')));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});