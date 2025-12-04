/**
 * Convert SVG icons to PNG using sharp library
 * Run: npm install sharp (in root directory)
 * Then: node client/public/icons/convert-svg-to-png.cjs
 */

const fs = require('fs');
const path = require('path');

async function convertIcons() {
  try {
    // Try to load sharp
    const sharp = require('sharp');
    
    const icons = [
      { input: 'icon-192x192.svg', output: 'icon-192x192.png', size: 192 },
      { input: 'icon-512x512.svg', output: 'icon-512x512.png', size: 512 }
    ];
    
    console.log('🎨 Converting SVG icons to PNG...\n');
    
    for (const icon of icons) {
      const inputPath = path.join(__dirname, icon.input);
      const outputPath = path.join(__dirname, icon.output);
      
      await sharp(inputPath)
        .resize(icon.size, icon.size)
        .png()
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      console.log(`✅ Created ${icon.output} (${stats.size} bytes)`);
    }
    
    console.log('\n✨ Icon conversion complete!');
    console.log('🏐 Your volleyball PWA icons are ready!\n');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\n❌ Error: sharp module not found.\n');
      console.error('Please install it by running:');
      console.error('  npm install sharp\n');
      console.error('Or use the browser-based generator:');
      console.error('  Open client/public/icons/generate-icons.html in your browser\n');
    } else {
      console.error('❌ Error converting icons:', error.message);
    }
    process.exit(1);
  }
}

convertIcons();
