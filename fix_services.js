const fs = require('fs');

const indexFile = 'index.html';
const html = fs.readFileSync(indexFile, 'utf8');

const svgs = [
  '01_scissors, barbershop, haircut, trimming, styling.svg',
  '02_hair cut.svg',
  '03_hair dye.svg',
  '04_hair dryer.svg',
  '05_beard, barbershop, grooming, facial hair, style.svg',
  '06_nail polish.svg',
  '07_make up.svg',
  '08_eye cream.svg'
].map(name => {
  let content = fs.readFileSync(`svg/${name}`, 'utf8');
  // remove completely <?xml ?> and <!-- -->
  content = content.replace(/<\?xml.*?\?>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  
  // extract viewBox
  const vbMatch = content.match(/viewBox="([^"]+)"/);
  const vb = vbMatch ? vbMatch[1] : '0 0 511 511';

  // extract everything inside <svg ...> ... </svg>
  const innerMatch = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  let inner = innerMatch ? innerMatch[1].trim() : '';

  // Return a clean inline SVG ensuring it scales and responds to currentColor
  return `<svg viewBox="${vb}" fill="currentColor">${inner}</svg>`;
});

const cardsData = [
  { title: "Мужские стрижки", desc: "Классические и модельные стрижки, фейд, андеркат — подберём идеальный образ" },
  { title: "Женские стрижки", desc: "Креативные и классические стрижки любой сложности для любой длины волос" },
  { title: "Окрашивание", desc: "Балаяж, шатуш, мелирование, тонирование — работаем с премиальными красителями" },
  { title: "Укладки", desc: "Вечерние, свадебные и повседневные укладки для любого события" },
  { title: "Уход за бородой", desc: "Моделирование, стрижка и горячее бритьё — классический барбер-сервис" },
  { title: "Маникюр и педикюр", desc: "Классический, аппаратный и комбинированный маникюр с покрытием" },
  { title: "Уход за лицом", desc: "Чистки, пилинги, увлажняющие процедуры — профессиональная косметология" },
  { title: "Оформление бровей", desc: "Коррекция, окрашивание хной и краской, долговременная укладка и ламинирование бровей" }
];

let servicesHtml = `      <div class="services-grid">\n`;
cardsData.forEach((c, i) => {
  const delay = i % 4 + 1; // 1, 2, 3, 4
  servicesHtml += `        <div class="service-card reveal reveal-delay-${delay}">
          <div class="service-icon">${svgs[i]}</div>
          <h3>${c.title}</h3>
          <p>${c.desc}</p>
        </div>\n`;
});
servicesHtml += `      </div>`;

// Replace from <div class="services-grid"> to the end of the section
const newHtml = html.replace(/<div class="services-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, servicesHtml + '\n    </div>\n  </section>');

fs.writeFileSync(indexFile, newHtml);
console.log('Successfully updated services!');
