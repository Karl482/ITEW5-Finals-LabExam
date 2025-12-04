/**
 * Generate proper PNG icons for PWA
 * This creates valid PNG files with the correct dimensions
 */

const fs = require('fs');
const path = require('path');

// Create a simple colored PNG using Canvas-like approach
// Since we don't have canvas in Node without dependencies, we'll create a proper PNG manually

function createPNG(width, height, color) {
  // PNG file structure
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // Parse hex color
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  // Create IHDR chunk (image header)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // color type (RGB)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  
  // Create IDAT chunk (image data) - simple solid color
  const scanlineSize = width * 3 + 1; // RGB + filter byte
  const imageData = Buffer.alloc(height * scanlineSize);
  
  for (let y = 0; y < height; y++) {
    const offset = y * scanlineSize;
    imageData[offset] = 0; // filter type: none
    
    for (let x = 0; x < width; x++) {
      const pixelOffset = offset + 1 + x * 3;
      imageData[pixelOffset] = r;
      imageData[pixelOffset + 1] = g;
      imageData[pixelOffset + 2] = b;
    }
  }
  
  // Compress the image data (simplified - just use uncompressed)
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(imageData);
  const idatChunk = createChunk('IDAT', compressed);
  
  // Create IEND chunk (end of file)
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  // Combine all chunks
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(buffer) {
  let crc = 0xFFFFFFFF;
  
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons
console.log('🎨 Generating PWA icons...\n');

const icons = [
  { size: 192, filename: 'icon-192x192.png' },
  { size: 512, filename: 'icon-512x512.png' }
];

const color = '#0066CC'; // Sports blue
const outputDir = path.join(__dirname, 'client', 'public', 'icons');

icons.forEach(icon => {
  try {
    const pngData = createPNG(icon.size, icon.size, color);
    const outputPath = path.join(outputDir, icon.filename);
    
    fs.writeFileSync(outputPath, pngData);
    const stats = fs.statSync(outputPath);
    
    console.log(`✅ Created ${icon.filename} (${icon.size}x${icon.size}, ${stats.size} bytes)`);
  } catch (error) {
    console.error(`❌ Error creating ${icon.filename}:`, error.message);
  }
});

console.log('\n✨ Icon generation complete!');
console.log('📝 Note: These are solid color icons. For better icons with logos,');
console.log('   use a tool like Inkscape or an online SVG to PNG converter.\n');
