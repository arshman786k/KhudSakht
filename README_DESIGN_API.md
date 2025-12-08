# Design Library API Setup

This project includes a design library API that allows users to browse and apply pre-made designs to different parts of the kurta (gala, front, back, bazo, shalwar).

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install Express, CORS, and other required packages.

### 2. Add Design Images

Place your design images in the `designs/` directory:

```
designs/
  ├── gala/
  │   ├── vneck.png
  │   ├── round.png
  │   └── collar.png
  ├── front/
  │   ├── floral.png
  │   ├── geometric.png
  │   └── traditional.png
  ├── back/
  │   ├── simple.png
  │   └── embroidered.png
  ├── bazo/
  │   ├── plain.png
  │   ├── cuff.png
  │   └── full.png
  └── shalwar/
      ├── plain.png
      └── ankle.png
```

### 3. Start the Backend Server

```bash
npm run server
```

The API server will start on `http://localhost:5000`

### 4. Start the Frontend (in a separate terminal)

```bash
npm run dev
```

Or run both together:

```bash
npm run dev:all
```

## API Endpoints

- `GET /api/designs/:part` - Get designs for a specific part (gala, front, back, bazo, shalwar)
- `GET /api/designs` - Get all designs
- `GET /api/health` - Health check
- `GET /designs/:part/:filename` - Serve design images

## Usage

1. Select a garment part (Front, Back, Gala, Bazo, or Shalwar)
2. Scroll down to the "Custom Design" section
3. Browse the design library thumbnails
4. Click on any design to apply it to the selected part
5. Use the controls to position, scale, and rotate the design
6. Or upload your own design using the "Upload Design" button

## Adding New Designs

1. Add your image file to the appropriate folder in `designs/`
2. Update `server.js` to include the new design in the `designs` object:

```javascript
const designs = {
  gala: [
    { id: '1', name: 'V-Neck Classic', url: '/designs/gala/vneck.png' },
    { id: '2', name: 'Round Neck', url: '/designs/gala/round.png' },
    // Add your new design here
    { id: '4', name: 'New Design', url: '/designs/gala/newdesign.png' },
  ],
  // ... other parts
};
```

3. Restart the server

## Supported Image Formats

- PNG (recommended for transparency)
- JPG
- SVG

## Troubleshooting

- **Designs not loading**: Make sure the server is running on port 5000
- **CORS errors**: The server includes CORS middleware, but check if ports match
- **Images not displaying**: Verify file paths in `server.js` match actual file names
- **Proxy errors**: Check `vite.config.ts` proxy configuration

