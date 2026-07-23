import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { PortfolioPDF } from '../src/components/portfolio/PortfolioPDF';
import path from 'path';
import fs from 'fs';

const destPath = path.resolve(__dirname, '../public/Timiclassic_Luxury_Portfolio.pdf');
const publicDir = path.resolve(__dirname, '../public');

console.log('Rendering portfolio PDF...');
console.log('Destination:', destPath);

// Pre-load all required images as Buffers
const imageKeys = [
  'logo.jpg',
  'dresses/couture-6.jpg',
  'dresses/couture-3.jpg',
  'dresses/couture-4.jpg',
  'dresses/couture-1.jpg',
  'dresses/couture-2 (5).JPEG',
  'dresses/couture-7.jpg',
  'dresses/couture-2 (13).JPEG',
  'dresses/couture-5.jpg',
  'dresses/couture-2 (6).jpeg'
];

const loadedImages: Record<string, Buffer> = {};
for (const key of imageKeys) {
  const filePath = path.join(publicDir, key);
  if (fs.existsSync(filePath)) {
    console.log(`Loading image: ${key} (${fs.statSync(filePath).size} bytes)`);
    loadedImages[key] = fs.readFileSync(filePath);
  } else {
    console.warn(`Warning: Image not found at ${filePath}`);
  }
}

ReactPDF.renderToFile(
  React.createElement(PortfolioPDF, { images: loadedImages }) as any,
  destPath
)
  .then(() => {
    console.log('Successfully generated Timiclassic Luxury Portfolio PDF!');
    const finalSize = fs.statSync(destPath).size;
    console.log(`Final PDF File Size: ${(finalSize / (1024 * 1024)).toFixed(2)} MB`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to generate PDF:', err);
    process.exit(1);
  });
