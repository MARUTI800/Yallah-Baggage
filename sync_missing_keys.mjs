import fs from 'fs';
import path from 'path';

const messagesDir = 'messages';
const enPath = path.join(messagesDir, 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const newKeys = ['Security', 'Legal', 'Promo'];

const locales = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json') && f !== 'en.json');

for (const locale of locales) {
  const localePath = path.join(messagesDir, locale);
  const data = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  
  let updated = false;
  for (const key of newKeys) {
    if (!data[key]) {
      data[key] = en[key];
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(localePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`Updated ${locale} with missing keys.`);
  }
}
