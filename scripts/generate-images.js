const fs = require('fs');
const path = require('path');

const hotels = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'hotels.json'), 'utf8'));
const imgDir = path.join(__dirname, '..', 'assets', 'images');

// Different gradient patterns for variety
const patterns = [
  // Pattern 1: diagonal gradient
  (c1, c2) => `<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${c2};stop-opacity:1" />
    </linearGradient>`,
  // Pattern 2: horizontal gradient
  (c1, c2) => `<linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${c1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${c2};stop-opacity:1" />
    </linearGradient>`,
  // Pattern 3: vertical gradient
  (c1, c2) => `<linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${c1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${c2};stop-opacity:1" />
    </linearGradient>`,
  // Pattern 4: radial gradient
  (c1, c2) => `<radialGradient id="g" cx="50%" cy="50%" r="70%">
      <stop offset="0%" style="stop-color:${c1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${c2};stop-opacity:1" />
    </radialGradient>`,
];

// Decorative shapes for visual interest
const shapes = [
  // Circles
  `<circle cx="200" cy="150" r="120" fill="rgba(255,255,255,0.04)"/>
   <circle cx="900" cy="600" r="180" fill="rgba(255,255,255,0.03)"/>`,
  // Diagonal lines
  `<line x1="0" y1="0" x2="1200" y2="800" stroke="rgba(255,255,255,0.03)" stroke-width="200"/>`,
  // Arcs
  `<path d="M0 400 Q600 200 1200 400" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="300"/>`,
  // Dots
  `<circle cx="100" cy="100" r="3" fill="rgba(255,255,255,0.15)"/>
   <circle cx="300" cy="200" r="3" fill="rgba(255,255,255,0.12)"/>
   <circle cx="500" cy="150" r="3" fill="rgba(255,255,255,0.1)"/>
   <circle cx="700" cy="250" r="3" fill="rgba(255,255,255,0.15)"/>
   <circle cx="900" cy="180" r="3" fill="rgba(255,255,255,0.12)"/>
   <circle cx="1100" cy="300" r="3" fill="rgba(255,255,255,0.1)"/>
   <circle cx="150" cy="600" r="3" fill="rgba(255,255,255,0.12)"/>
   <circle cx="400" cy="700" r="3" fill="rgba(255,255,255,0.15)"/>
   <circle cx="800" cy="650" r="3" fill="rgba(255,255,255,0.1)"/>
   <circle cx="1050" cy="550" r="3" fill="rgba(255,255,255,0.12)"/>`,
  // Waves
  `<path d="M0 600 C200 500, 400 700, 600 600 C800 500, 1000 700, 1200 600 L1200 800 L0 800Z" fill="rgba(255,255,255,0.03)"/>`,
  // Triangles
  `<polygon points="100,700 200,400 300,700" fill="rgba(255,255,255,0.03)"/>
   <polygon points="800,700 950,350 1100,700" fill="rgba(255,255,255,0.025)"/>`,
];

// Labels for different image types
const heroLabels = ['Вид на море', 'Территория', 'Номер'];
const galleryLabels = ['Номер 1', 'Номер 2', 'Ванная', 'Кухня', 'Территория', 'Вид из окна', 'Лобби', 'Балкон', 'Двор', 'Вид на море'];

let count = 0;

for (const hotel of hotels) {
  const c1 = hotel.accentColor;
  const c2 = hotel.accentColor600;

  // Generate hero images
  for (let i = 0; i < 3; i++) {
    const pattern = patterns[i % patterns.length];
    const shape = shapes[i % shapes.length];
    const label = heroLabels[i];
    const filename = `hero-${hotel.id}-${i + 1}.svg`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    ${pattern(c1, c2)}
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  ${shape}
  <text x="600" y="420" font-family="sans-serif" font-size="48" fill="rgba(255,255,255,0.25)" text-anchor="middle">${label}</text>
</svg>`;
    fs.writeFileSync(path.join(imgDir, filename), svg);
    count++;
  }

  // Generate gallery images
  for (let i = 0; i < 10; i++) {
    const pattern = patterns[i % patterns.length];
    const shape = shapes[(i + 2) % shapes.length];
    const label = galleryLabels[i];
    const filename = `gallery-${hotel.id}-${i + 1}.svg`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    ${pattern(c1, c2)}
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  ${shape}
  <text x="400" y="310" font-family="sans-serif" font-size="36" fill="rgba(255,255,255,0.25)" text-anchor="middle">${label}</text>
</svg>`;
    fs.writeFileSync(path.join(imgDir, filename), svg);
    count++;
  }
}

console.log(`Generated ${count} themed placeholder images for ${hotels.length} hotels.`);
