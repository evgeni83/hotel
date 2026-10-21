const fs = require('fs');
const path = require('path');

const hotels = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'hotels.json'), 'utf8'));
const template = fs.readFileSync(path.join(__dirname, '..', 'template.html'), 'utf8');

let generated = 0;

for (const hotel of hotels) {
  const outDir = path.join(__dirname, '..', 'hotels', hotel.id);
  fs.mkdirSync(outDir, { recursive: true });

  let html = template;

  // Replace placeholders
  html = html.replace(/\{\{NAME\}\}/g, hotel.name);
  html = html.replace(/\{\{ADDRESS\}\}/g, hotel.address);
  html = html.replace(/\{\{DESCRIPTION\}\}/g, hotel.description);
  html = html.replace(/\{\{PRICE_RANGE\}\}/g, hotel.price_range);
  html = html.replace(/\{\{YANDEX_MAPS_LINK\}\}/g, hotel.yandex_maps_link);
  html = html.replace(/\{\{YANDEX_MAPS_OID\}\}/g, hotel.yandex_maps_oid);

  // Phone handling — if no phone, show placeholder
  if (hotel.phone) {
    const phoneClean = hotel.phone.replace(/[^+\d]/g, '');
    html = html.replace(/\{\{PHONE\}\}/g, hotel.phone);
    html = html.replace(/\{\{PHONE_CLEAN\}\}/g, phoneClean);
    html = html.replace(/\{\{PHONE_DISPLAY\}\}/g, hotel.phone);
    // Replace phone placeholder blocks with actual phone blocks
    html = html.replace(
      /<!-- PHONE_START -->.*?<!-- PHONE_END -->/gs,
      `<!-- PHONE_START -->
            <li>
              <a href="tel:${phoneClean}">
                <span class="contact-list__icon"><svg class="ic"><use href="#i-phone"/></svg></span>
                <span><strong>${hotel.phone}</strong><em>звоните круглосуточно</em></span>
              </a>
            </li>
            <li>
              <a href="https://wa.me/${phoneClean.replace('+', '')}" target="_blank" rel="noopener">
                <span class="contact-list__icon"><svg class="ic"><use href="#i-whatsapp"/></svg></span>
                <span><strong>WhatsApp</strong><em>напишите нам</em></span>
              </a>
            </li>
<!-- PHONE_END -->`
    );
    // Replace mobile action bar phone links
    html = html.replace(
      /href="tel:\{\{PHONE_CLEAN\}\}"/g,
      `href="tel:${phoneClean}"`
    );
    html = html.replace(
      /href="https:\/\/wa\.me\/\{\{PHONE_CLEAN\}\}"/g,
      `href="https://wa.me/${phoneClean.replace('+', '')}"`
    );
    html = html.replace(
      /href="tel:\{\{PHONE\}\}"/g,
      `href="tel:${phoneClean}"`
    );
    html = html.replace(
      /\{\{PHONE_DISPLAY\}\}/g,
      hotel.phone
    );
  } else {
    // No phone — replace with placeholder message
    html = html.replace(
      /<!-- PHONE_START -->.*?<!-- PHONE_END -->/gs,
      `<!-- PHONE_START -->
            <li>
              <a href="${hotel.yandex_maps_link}" target="_blank" rel="noopener">
                <span class="contact-list__icon"><svg class="ic"><use href="#i-phone"/></svg></span>
                <span><strong>Телефон уточняйте</strong><em>на Яндекс Картах</em></span>
              </a>
            </li>
            <li>
              <span>
                <span class="contact-list__icon"><svg class="ic"><use href="#i-whatsapp"/></svg></span>
                <span><strong>WhatsApp</strong><em>номер телефона уточняйте по адресу</em></span>
              </span>
            </li>
<!-- PHONE_END -->`
    );
    // Replace mobile action bar — hide phone and WhatsApp, keep booking
    html = html.replace(
      /href="tel:\{\{PHONE_CLEAN\}\}"/g,
      `href="${hotel.yandex_maps_link}"`
    );
    html = html.replace(
      /href="https:\/\/wa\.me\/\{\{PHONE_CLEAN\}\}"/g,
      `href="${hotel.yandex_maps_link}"`
    );
    html = html.replace(
      /href="tel:\{\{PHONE\}\}"/g,
      `href="${hotel.yandex_maps_link}"`
    );
    html = html.replace(
      /\{\{PHONE_DISPLAY\}\}/g,
      'Телефон уточняйте'
    );
  }

  // Rating handling
  if (hotel.rating && hotel.review_count) {
    html = html.replace(/\{\{RATING\}\}/g, hotel.rating);
    html = html.replace(/\{\{REVIEW_COUNT\}\}/g, hotel.review_count);
    html = html.replace(
      /<!-- RATING_START -->.*?<!-- RATING_END -->/gs,
      `<!-- RATING_START -->
          <div class="hero__rating" aria-label="Рейтинг ${hotel.rating} из 5 на Яндекс Картах">
            <span class="stars" aria-hidden="true">
              <svg class="ic"><use href="#i-star"/></svg>
              <svg class="ic"><use href="#i-star"/></svg>
              <svg class="ic"><use href="#i-star"/></svg>
              <svg class="ic"><use href="#i-star"/></svg>
              <svg class="ic"><use href="#i-star"/></svg>
            </span>
            <strong>${hotel.rating}</strong>
            <span class="hero__rating-sub">${hotel.review_count} отзывов на Яндекс Картах</span>
          </div>
<!-- RATING_END -->`
    );
    // Stats section
    html = html.replace(
      /<!-- STATS_START -->.*?<!-- STATS_END -->/gs,
      `<!-- STATS_START -->
        <div class="stat"><span class="stat__num">${hotel.rating}</span><span class="stat__label">рейтинг гостей</span></div>
        <div class="stat"><span class="stat__num">${hotel.review_count}</span><span class="stat__label">отзыва</span></div>
<!-- STATS_END -->`
    );
    // Reviews section
    html = html.replace(
      /<!-- REVIEWS_START -->.*?<!-- REVIEWS_END -->/gs,
      `<!-- REVIEWS_START -->
        <div class="reviews__panel" data-reveal>
          <div class="reviews__score">
            <span class="reviews__num">${hotel.rating}</span>
            <span class="stars stars--lg" aria-hidden="true">
              <svg class="ic"><use href="#i-star"/></svg><svg class="ic"><use href="#i-star"/></svg><svg class="ic"><use href="#i-star"/></svg><svg class="ic"><use href="#i-star"/></svg><svg class="ic"><use href="#i-star"/></svg>
            </span>
            <span class="reviews__meta">${hotel.review_count} отзывов</span>
          </div>
        </div>
<!-- REVIEWS_END -->`
    );
  } else {
    // No rating — hide rating badge
    html = html.replace(
      /<!-- RATING_START -->.*?<!-- RATING_END -->/gs,
      `<!-- RATING_START -->
          <div class="hero__rating" aria-label="Отзывы на Яндекс Картах">
            <span class="hero__rating-sub">Отзывы на Яндекс Картах</span>
          </div>
<!-- RATING_END -->`
    );
    // Stats section — only show address-related stats
    html = html.replace(
      /<!-- STATS_START -->.*?<!-- STATS_END -->/gs,
      `<!-- STATS_START -->
        <div class="stat"><span class="stat__num">Ейск</span><span class="stat__label">Краснодарский край</span></div>
        <div class="stat"><span class="stat__num">Азовское</span><span class="stat__label">море</span></div>
<!-- STATS_END -->`
    );
    // Reviews section — link to Yandex Maps
    html = html.replace(
      /<!-- REVIEWS_START -->.*?<!-- REVIEWS_END -->/gs,
      `<!-- REVIEWS_START -->
        <div class="reviews__panel" data-reveal>
          <div class="reviews__score">
            <span class="reviews__meta">Отзывы на Яндекс Картах</span>
          </div>
        </div>
<!-- REVIEWS_END -->`
    );
  }

  // Amenities
  const amenitiesHtml = hotel.amenities.map(a => `<li><svg class="ic"><use href="#i-check"/></svg> ${a}</li>`).join('\n            ');
  html = html.replace(
    /<!-- AMENITIES_FEATURE_START -->.*?<!-- AMENITIES_FEATURE_END -->/gs,
    `<!-- AMENITIES_FEATURE_START -->
          ${amenitiesHtml}
<!-- AMENITIES_FEATURE_END -->`
  );

  // Hero chips
  const chipsHtml = hotel.amenities.slice(0, 4).map(a => {
    const iconMap = { 'Wi-Fi': 'i-wifi', 'Парковка': 'i-parking', 'Кондиционер': 'i-snow', 'Завтрак': 'i-coffee' };
    const icon = iconMap[a] || 'i-check';
    return `<li><svg class="ic"><use href="#${icon}"/></svg> ${a}</li>`;
  }).join('\n            ');
  html = html.replace(
    /<!-- HERO_CHIPS_START -->.*?<!-- HERO_CHIPS_END -->/gs,
    `<!-- HERO_CHIPS_START -->
            ${chipsHtml}
<!-- HERO_CHIPS_END -->`
  );

  // Hero photos
  const hero1 = hotel.photos.hero[0] || 'hero-1.svg';
  const hero2 = hotel.photos.hero[1] || 'hero-2.svg';
  const hero3 = hotel.photos.hero[2] || 'hero-3.svg';
  html = html.replace(/\{\{HERO_1\}\}/g, hero1);
  html = html.replace(/\{\{HERO_2\}\}/g, hero2);
  html = html.replace(/\{\{HERO_3\}\}/g, hero3);

  // Gallery photos
  const galleryItems = hotel.photos.gallery.map((img, i) => {
    return `          <button class="gallery__item" type="button" data-img="../../assets/images/${img}" data-caption="Фото ${i + 1}">
            <img src="../../assets/images/${img}" alt="Фото ${i + 1} ${hotel.name}" width="800" height="600" loading="lazy" />
          </button>`;
  }).join('\n');
  html = html.replace(
    /<!-- GALLERY_START -->.*?<!-- GALLERY_END -->/gs,
    `<!-- GALLERY_START -->
${galleryItems}
<!-- GALLERY_END -->`
  );

  // About photos
  html = html.replace(/\{\{ABOUT_PHOTO_1\}\}/g, hotel.photos.gallery[0] || 'about-photo.jpg');
  html = html.replace(/\{\{ABOUT_PHOTO_2\}\}/g, hotel.photos.gallery[1] || 'about-photo.jpg');

  // OG image
  html = html.replace(/\{\{OG_IMAGE\}\}/g, 'og-cover.jpg');

  // Schema.org structured data
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": `Гостевой дом «${hotel.name}»`,
    "description": hotel.description,
    "image": `assets/images/${hero1}`,
    "priceRange": hotel.price_range,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": hotel.address,
      "addressLocality": "Ейск",
      "addressRegion": "Краснодарский край",
      "addressCountry": "RU"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "amenityFeature": hotel.amenities.map(a => ({
      "@type": "LocationFeatureSpecification",
      "name": a,
      "value": true
    }))
  };
  if (hotel.rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": String(hotel.rating),
      "reviewCount": String(hotel.review_count || 0),
      "bestRating": "5"
    };
  }
  html = html.replace(
    /<!-- SCHEMA_START -->.*?<!-- SCHEMA_END -->/gs,
    `<!-- SCHEMA_START -->
  <script type="application/ld+json">
  ${JSON.stringify(schema, null, 2)}
  </script>
<!-- SCHEMA_END -->`
  );

  // Write the file
  const outFile = path.join(outDir, 'index.html');
  fs.writeFileSync(outFile, html, 'utf8');
  generated++;
  console.log(`✓ Generated: ${hotel.id} — ${hotel.name}`);
}

console.log(`\nDone! Generated ${generated} hotel pages.`);
