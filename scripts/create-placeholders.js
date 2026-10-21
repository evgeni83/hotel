const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'assets', 'images');

const colors = ['#0e2a33', '#e0a03c', '#14232b', '#f8e6e4', '#12707e', '#b3232a', '#8b1a20', '#c48a2e', '#fbf7f1', '#0e2a33'];

// Gallery images 3-10
for (let i = 3; i <= 10; i++) {
  const color = colors[(i - 3) % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="${color}"/><text x="400" y="310" font-family="sans-serif" font-size="32" fill="rgba(255,255,255,0.3)" text-anchor="middle">Галерея ${i}</text></svg>\n`;
  fs.writeFileSync(path.join(imagesDir, `gallery-${i}.svg`), svg);
}

// About photo
const aboutSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#12707e"/><text x="400" y="310" font-family="sans-serif" font-size="32" fill="rgba(255,255,255,0.3)" text-anchor="middle">Фото гостевого дома</text></svg>\n`;
fs.writeFileSync(path.join(imagesDir, 'about-photo.svg'), aboutSvg);

// Logo (text-based)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><text x="100" y="40" font-family="sans-serif" font-size="24" font-weight="bold" fill="#b3232a" text-anchor="middle">Ейск Отели</text></svg>\n`;
fs.writeFileSync(path.join(imagesDir, 'logo.svg'), logoSvg);

// OG cover
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="og" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#12707e;stop-opacity:1" /><stop offset="100%" style="stop-color:#0e2a33;stop-opacity:1" /></linearGradient></defs><rect width="1200" height="630" fill="url(#og)"/><text x="600" y="315" font-family="sans-serif" font-size="48" fill="rgba(255,255,255,0.5)" text-anchor="middle">Гостевые дома Ейска</text></svg>\n`;
fs.writeFileSync(path.join(imagesDir, 'og-cover.svg'), ogSvg);

console.log('All placeholder images created!');
