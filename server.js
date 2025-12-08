const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Design library data
const designs = {
  gala: [
    { id: '1', name: 'Gala Design 1', url: '/designs/gala/80.jpg' },
    { id: '2', name: 'Gala Design 2', url: '/designs/gala/7979865.jpg' },
  ],
  front: [
    { id: '1', name: 'Front Design 1', url: '/designs/front/79373-OFLZJN-587.jpg' },
    { id: '2', name: 'Front Design 2', url: '/designs/front/9561463.jpg' },
  ],
  back: [
    { id: '1', name: 'Back Design 1', url: '/designs/back/OBN1DS0.jpg' },
    { id: '2', name: 'Back Design 2', url: '/designs/back/OBSKH20.jpg' },
  ],
  bazo: [
    { id: '1', name: 'Bazo Design 1', url: '/designs/bazo/115824-OOR8IH-617.jpg' },
    { id: '2', name: 'Bazo Design 2', url: '/designs/bazo/69604-OCSWXF-956.jpg' },
  ],
  shalwar: [
    { id: '1', name: 'Shalwar Design 1', url: '/designs/shalwar/73083-OE7WL4-457.jpg' },
  ],
};

// API endpoint to get designs by part
app.get('/api/designs/:part', (req, res) => {
  try {
    const part = req.params.part.toLowerCase();
    const partDesigns = designs[part] || [];
    console.log(`Fetching designs for part: ${part}, found ${partDesigns.length} designs`);
    
    if (partDesigns.length === 0) {
      console.warn(`No designs found for part: ${part}`);
    }
    
    res.json(partDesigns);
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch designs', 
      message: error.message || 'An unexpected error occurred while fetching designs'
    });
  }
});

// API endpoint to get all designs
app.get('/api/designs', (req, res) => {
  res.json(designs);
});

// Serve static design images
const designsPath = path.join(__dirname, 'designs');
if (!fs.existsSync(designsPath)) {
  console.warn(`⚠️  Designs directory not found at: ${designsPath}`);
} else {
  console.log(`✅ Serving designs from: ${designsPath}`);
}

app.use('/designs', express.static(designsPath, {
  maxAge: '1d', // Cache for 1 day
  setHeaders: (res, filePath) => {
    // Set proper content type for images
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    }
  }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Design API is running' });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Design API server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET /api/designs/:part - Get designs for a specific part (gala, front, back, bazo, shalwar)`);
  console.log(`  GET /api/designs - Get all designs`);
  console.log(`  GET /api/health - Health check`);
  console.log(`\nDesign counts:`);
  Object.keys(designs).forEach(part => {
    console.log(`  ${part}: ${designs[part].length} designs`);
  });
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other server or use a different port.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

