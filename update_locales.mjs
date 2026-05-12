import fs from 'fs';

const bookNow = {
  fr: { secureCheckout: "Paiement sécurisé", heroTitle1: "Vos bagages.", heroTitle2: "Notre mission.", heroDesc: "Voyagez les mains libres à Dubaï et aux Émirats. Vos affaires arrivent avant vous.", fullyInsured: "Entièrement assuré", allBagsCovered: "Tous les bagages couverts", onTimeGuarantee: "Garantie ponctualité", moneyBack: "Ou remboursement", ratingLabel: "Note 4.9", ratingDesc: "De plus de 1 800 clients", trustedBy: "Approuvé par", travellersCount: "2 500+", travellers: "voyageurs", dubaiUAE: "Dubaï, ÉAU" },
  zh: { secureCheckout: "安全结算", heroTitle1: "您的行李。", heroTitle2: "我们的使命。", heroDesc: "在迪拜和阿联酋自由旅行。您的物品先您一步到达。", fullyInsured: "全额保险", allBagsCovered: "所有行李均有保障", onTimeGuarantee: "准时保证", moneyBack: "否则退款", ratingLabel: "4.9 评分", ratingDesc: "来自1,800+位客人", trustedBy: "受到信赖", travellersCount: "2,500+", travellers: "位旅客", dubaiUAE: "迪拜，阿联酋" },
  es: { secureCheckout: "Pago seguro", heroTitle1: "Sus maletas.", heroTitle2: "Nuestra misión.", heroDesc: "Viaje sin equipaje por Dubái y los Emiratos. Sus pertenencias llegan antes que usted.", fullyInsured: "Totalmente asegurado", allBagsCovered: "Todas las maletas cubiertas", onTimeGuarantee: "Garantía de puntualidad", moneyBack: "O le devolvemos su dinero", ratingLabel: "Calificación 4.9", ratingDesc: "De más de 1.800 huéspedes", trustedBy: "Confiado por", travellersCount: "2.500+", travellers: "viajeros", dubaiUAE: "Dubái, EAU" },
  nl: { secureCheckout: "Veilig afrekenen", heroTitle1: "Uw bagage.", heroTitle2: "Onze missie.", heroDesc: "Handsfree reizen door Dubai en de VAE. Uw spullen arriveren voor u.", fullyInsured: "Volledig verzekerd", allBagsCovered: "Alle koffers gedekt", onTimeGuarantee: "Op-tijd garantie", moneyBack: "Of geld terug", ratingLabel: "4.9 Beoordeling", ratingDesc: "Van 1.800+ gasten", trustedBy: "Vertrouwd door", travellersCount: "2.500+", travellers: "reizigers", dubaiUAE: "Dubai, VAE" }
};

const trackExtra = {
  fr: { formError: "E-mail, téléphone et code de suivi sont tous requis.", footerCopyright: "© 2026 Yallah Baggage. Le premier concierge de bagages à Dubaï." },
  zh: { formError: "电子邮件、电话和追踪代码均为必填项。", footerCopyright: "© 2026 Yallah Baggage。迪拜首屈一指的行李礼宾服务。" },
  es: { formError: "Email, teléfono y código de seguimiento son obligatorios.", footerCopyright: "© 2026 Yallah Baggage. El primer concierge de equipaje en Dubái." },
  nl: { formError: "E-mail, telefoon en trackingcode zijn allemaal verplicht.", footerCopyright: "© 2026 Yallah Baggage. Dubai's eerste bagage-concierge." }
};

// Fix proper i18n values for BW keys 
const bwFix = {
  zh: { days: "天", paymentMethod: "支付方式", cardPayment: "银行卡支付", cardPaymentDesc: "安全在线支付", cashOnDelivery: "货到付款", cashOnDeliveryDesc: "送达时付款", codPayMessage: "送达时支付 AED {amount}", confirming: "确认中...", confirmOrder: "确认订单", ages: { under1: "不到1岁", "1year": "1岁", "2years": "2岁", "3years": "3岁", "4years": "4岁", "5years": "5岁", "6to11": "6-11岁" } },
  es: { days: "días", paymentMethod: "Método de pago", cardPayment: "Pago con tarjeta", cardPaymentDesc: "Pague de forma segura en línea", cashOnDelivery: "Pago contra entrega", cashOnDeliveryDesc: "Pague al momento de la entrega", codPayMessage: "Pague AED {amount} al recibir sus maletas", confirming: "Confirmando...", confirmOrder: "Confirmar pedido", ages: { under1: "Menor de 1", "1year": "1 año", "2years": "2 años", "3years": "3 años", "4years": "4 años", "5years": "5 años", "6to11": "6-11 años" } },
  fr: { days: "jours", paymentMethod: "Mode de paiement", cardPayment: "Paiement par carte", cardPaymentDesc: "Payez en ligne en toute sécurité", cashOnDelivery: "Paiement à la livraison", cashOnDeliveryDesc: "Payez à la livraison", codPayMessage: "Payez AED {amount} à la livraison de vos bagages", confirming: "Confirmation...", confirmOrder: "Confirmer la commande", ages: { under1: "Moins de 1 an", "1year": "1 an", "2years": "2 ans", "3years": "3 ans", "4years": "4 ans", "5years": "5 ans", "6to11": "6-11 ans" } },
};

for (const lang of ['fr', 'zh', 'es', 'nl']) {
  const path = `messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  
  // Fix BW keys with proper unicode
  if (bwFix[lang]) {
    Object.assign(data.BookingWizard, bwFix[lang]);
  }
  
  // Add BookNow section
  data.BookNow = bookNow[lang];
  
  // Add Track extras
  Object.assign(data.Track, trackExtra[lang]);
  
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  console.log(`Updated ${lang}.json`);
}

// Fix ar.json - rebuild it cleanly
const ar = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));
// Remove duplicate sections that got appended
const cleanAr = {};
const validKeys = ['Navigation', 'Hero', 'Logos', 'RideBookingForm', 'Track', 'Partnerships', 'Footer', 'HotelLogos', 'Status', 'Features', 'Process', 'FAQ', 'CTA', 'BookingWizard', 'BookNow'];
for (const key of validKeys) {
  if (ar[key]) cleanAr[key] = ar[key];
}
fs.writeFileSync('messages/ar.json', JSON.stringify(cleanAr, null, 2) + '\n');
console.log('Fixed ar.json');
