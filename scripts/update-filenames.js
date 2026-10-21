const fs = require('fs');
const path = require('path');

const hotelsPath = path.join(__dirname, '..', 'data', 'hotels.json');
const hotels = JSON.parse(fs.readFileSync(hotelsPath, 'utf8'));

for (const hotel of hotels) {
  hotel.photos.hero = [];
  for (let i = 1; i <= 3; i++) {
    hotel.photos.hero.push('hero-' + hotel.id + '-' + i + '.svg');
  }
  hotel.photos.gallery = [];
  for (let i = 1; i <= 10; i++) {
    hotel.photos.gallery.push('gallery-' + hotel.id + '-' + i + '.svg');
  }
}

fs.writeFileSync(hotelsPath, JSON.stringify(hotels, null, 2), 'utf8');
console.log('Updated photo filenames for ' + hotels.length + ' hotels');
