"use client";

import React from "react";
import { LegalLayout } from "@/components/ui/legal-layout";
import { ShieldCheck, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout 
      title="Privacy Policy" 
      lastUpdated="May 9, 2026" 
      icon={ShieldCheck}
    >
      {/* PDF Download Link */}
      <div className="flex justify-end mb-8">
        <a 
          href="/privacy-policy.pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-xs font-black text-[#8B7280] hover:text-[#0A2E6D] transition-colors uppercase tracking-[0.2em]"
        >
          <FileText className="w-4 h-4 text-[#1E5BD7]" />
          Download PDF Version
        </a>
      </div>

      <p className="lead text-[#4A4A4A] mb-8">
        Yallah Baggage respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, share and protect your information when you use our website, app, WhatsApp booking service, customer support channels, payment links, luggage collection and delivery services, or any other service provided by Yallah Baggage.
      </p>

      <p className="text-[#4A4A4A] mb-10">
        By using Yallah Baggage, you agree to the collection and use of your information in accordance with this Privacy Policy.
      </p>

      <section className="mb-10">
        <h2>1. Introduction</h2>
        <p>Yallah Baggage respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, share and protect your information when you use our website, app, WhatsApp booking service, customer support channels, payment links, luggage collection and delivery services, or any other service provided by Yallah Baggage.</p>
        <p>By using Yallah Baggage, you agree to the collection and use of your information in accordance with this Privacy Policy.</p>
      </section>

      <section className="mb-10">
        <h2>2. Who We Are</h2>
        <p>Yallah Baggage provides luggage collection, storage, handling, tracking and delivery services for travellers, residents, hotels, holiday-home operators, Airbnb hosts, corporate partners and other customers.</p>
        <p>For the purpose of applicable data protection laws, Yallah Baggage is the data controller for the personal data we collect directly from you.</p>
        <address className="not-italic bg-[#FDFCF9] border border-[#E5E5E5] rounded-2xl p-6 mt-4 inline-block">
          <strong className="text-[#0A2E6D]">Yallah Baggage</strong><br />
          Website: <a href="https://yallahbaggage.com" target="_blank" rel="noopener noreferrer" className="text-[#1E5BD7] hover:underline">https://yallahbaggage.com</a><br />
          Email: <a href="mailto:support@yallahbaggage.com" className="text-[#1E5BD7] hover:underline">support@yallahbaggage.com</a><br />
          Location: Dubai, United Arab Emirates
        </address>
      </section>

      <section className="mb-10">
        <h2>3. Information We Collect</h2>
        <p>We may collect, use, store, and transfer different kinds of personal data about you, which we have grouped together as follows:</p>
        
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">3.1 Personal Identification Information</h3>
            <p className="mb-2">This may include:</p>
            <ul>
              <li>Full name.</li>
              <li>Email address.</li>
              <li>Phone number and WhatsApp number.</li>
              <li>Billing details.</li>
              <li>Customer ID or booking reference.</li>
              <li>Passport, Emirates ID or other ID information where required for security, verification, payment, fraud prevention, insurance, legal or operational reasons.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">3.2 Booking and Travel Information</h3>
            <p className="mb-2">This may include:</p>
            <ul>
              <li>Collection and delivery addresses (including Hotel, Airbnb, apartment or office details).</li>
              <li>Flight number, airline, and arrival or departure terminal.</li>
              <li>Collection and delivery time.</li>
              <li>Number of bags, bag size, weight, description, and photos of luggage where required for verification.</li>
              <li>QR code or booking confirmation details.</li>
              <li>Special handling instructions.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">3.3 Payment Information</h3>
            <p className="mb-2">We may collect payment-related information such as:</p>
            <ul>
              <li>Payment status.</li>
              <li>Transaction reference.</li>
              <li>Invoice details and billing address.</li>
              <li>Refund information.</li>
            </ul>
            <p className="mt-2 text-sm italic text-[#8B7280]">
              We do not store full card details. Card payments are processed by third-party payment providers such as Stripe, payment link providers, banking partners, card processors, Apple Pay, Google Pay or other payment providers we may use.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">3.4 Location and Tracking Information</h3>
            <p className="mb-2">To provide luggage collection, delivery and tracking services, we may collect or process:</p>
            <ul>
              <li>Collection and delivery locations.</li>
              <li>Driver location and route information.</li>
              <li>Estimated time of arrival.</li>
              <li>GPS or map-based tracking information.</li>
              <li>Location updates shared through the app, website, WhatsApp, SMS or partner systems.</li>
            </ul>
            <p className="mt-2 text-sm">We use this information to complete your booking, improve service reliability, provide updates and support secure luggage handling.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">3.5 Communication Information</h3>
            <p className="mb-2">We may collect information from communications with you through WhatsApp, SMS, email, phone calls, website forms, social media messages, customer support chats, or booking forms. This may include:</p>
            <ul>
              <li>Messages, call notes, and support history.</li>
              <li>Complaints, feedback, and customer requests.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">3.6 Technical and Usage Data</h3>
            <p className="mb-2">When you use our website or app, we may collect:</p>
            <ul>
              <li>IP address, browser type, device type, and operating system.</li>
              <li>App version, website pages visited, and the time and date of visits.</li>
              <li>Cookie data, session data, and diagnostic and performance data.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2>4. How We Use Your Personal Data</h2>
        <p>We use your personal data to:</p>
        <ul>
          <li>Create and manage bookings.</li>
          <li>Collect, store, handle and deliver luggage.</li>
          <li>Verify customer identity and booking details.</li>
          <li>Generate booking confirmations and QR codes.</li>
          <li>Contact you about your booking and send delivery updates or tracking information.</li>
          <li>Process payments and refunds.</li>
          <li>Provide customer support.</li>
          <li>Handle complaints, disputes or lost-item investigations.</li>
          <li>Improve our website, app and services.</li>
          <li>Prevent fraud, misuse, theft or security incidents.</li>
          <li>Manage partner, driver and hotel coordination.</li>
          <li>Send service updates, promotions or marketing where permitted.</li>
          <li>Comply with legal, regulatory, tax, insurance and operational requirements.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>5. Legal Basis for Processing</h2>
        <p>Depending on your location and applicable law, we process your personal data based on one or more of the following:</p>
        <ul>
          <li>Your consent.</li>
          <li>Performance of a contract with you.</li>
          <li>Legal obligations.</li>
          <li>Legitimate business interests.</li>
          <li>Protection of your vital interests or the interests of another person.</li>
          <li>Fraud prevention, safety and service security.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>6. Sharing Your Personal Data</h2>
        <p>We may share your information with selected third parties where necessary to provide our services, including:</p>
        <ul>
          <li>Drivers and delivery partners.</li>
          <li>Storage partners.</li>
          <li>Hotels, holiday-home operators or Airbnb partners.</li>
          <li>Airport, transport or concierge partners where applicable.</li>
          <li>Payment processors.</li>
          <li>IT, hosting and cloud service providers.</li>
          <li>Customer support platforms.</li>
          <li>Analytics providers.</li>
          <li>Marketing service providers.</li>
          <li>Insurance providers.</li>
          <li>Professional advisers, including lawyers, accountants and auditors.</li>
          <li>Government authorities, regulators, courts or law enforcement where legally required.</li>
        </ul>
        <p className="mt-2 text-sm italic text-[#8B7280]">We only share the information needed for the relevant purpose.</p>
      </section>

      <section className="mb-10">
        <h2>7. Drivers, Partners and Service Providers</h2>
        <p>Yallah Baggage may work with verified drivers, logistics providers, storage locations, hotels, property managers, concierge teams and other operational partners. Where we share customer information with these partners, it is for the purpose of completing the booking, verifying luggage, coordinating collection or delivery, providing customer support, or meeting legal and safety obligations. Partners are expected to handle personal data securely and only use it for the agreed service purpose.</p>
      </section>

      <section className="mb-10">
        <h2>8. WhatsApp, SMS and Communication Channels</h2>
        <p>If you contact or book with Yallah Baggage through WhatsApp, SMS, email, phone or social media, we may use those channels to confirm your booking, request missing booking details, send payment links, share driver or delivery updates, send luggage verification photos, and handle support requests. You may opt out of marketing messages at any time, but we may still send essential service messages about active bookings.</p>
      </section>

      <section className="mb-10">
        <h2>9. Cookies and Tracking Technologies</h2>
        <p>Our website and app may use cookies and similar technologies to keep the website functioning, remember preferences, improve user experience, measure website performance, understand visitor behaviour, support marketing and advertising campaigns, and detect fraud or misuse. You can usually manage or disable cookies through your browser settings. Some features may not work properly if cookies are disabled.</p>
      </section>

      <section className="mb-10">
        <h2>10. Analytics and Marketing Tools</h2>
        <p>Yallah Baggage may use analytics, advertising, tracking and performance tools (including Google Analytics, Meta Pixel, WhatsApp Business tools, CRM platforms, and retargeting systems) to improve our services, website, app functionality, booking experience and marketing performance. These tools collect website usage, device info, approximate location, referral source, ad interactions, and booking journey. This helps us optimize performance, understand user behavior, deliver relevant campaigns, and improve operational efficiency. You can control certain tracking permissions through your browser settings or device options.</p>
      </section>

      <section className="mb-10">
        <h2>11. Payments</h2>
        <p>Yallah Baggage may offer payments through third-party payment processors and financial service providers (such as Stripe, PayPal, Apple Pay, Google Pay, bank transfers, and credit card processors). Your payment information is processed securely by those providers in accordance with their own privacy policies and security standards. Yallah Baggage does not store complete payment card information on its own servers. We may retain limited transaction-related information (payment status, transaction IDs, invoice details, refund records, and billing references) for customer support, fraud prevention, accounting, legal, operational, and tax purposes.</p>
      </section>

      <section className="mb-10">
        <h2>12. Data Retention</h2>
        <p>We keep personal data only for as long as reasonably necessary for the purposes described in this Privacy Policy. This may include retaining data for active bookings, customer support, legal and regulatory compliance, tax and accounting records, insurance and dispute handling, fraud prevention, and analytics. When data is no longer required, we will delete, anonymise or securely archive it where appropriate.</p>
      </section>

      <section className="mb-10">
        <h2>13. International Data Transfers</h2>
        <p>As Yallah Baggage may serve travellers from different countries and use technology providers located outside the UAE, your personal data may be transferred to and processed in countries outside your country of residence. Where required, we will take reasonable steps to ensure that your personal data remains protected in accordance with applicable data protection laws.</p>
      </section>

      <section className="mb-10">
        <h2>14. Data Security</h2>
        <p>We take reasonable technical and organisational steps to protect your personal data against unauthorised access, loss, misuse, alteration or disclosure. These steps include access controls, secure systems, password protection, limited access to booking data, secure payment processing, staff/partner confidentiality expectations, operational verification procedures, and QR code or booking confirmation checks. However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
      </section>

      <section className="mb-10">
        <h2>15. Your Privacy Rights</h2>
        <p>Depending on your location and applicable law, you may have rights to request access to your personal data, request correction of inaccurate data, request deletion of your data, object to or restrict certain processing, withdraw consent, request transfer of your data, opt out of marketing communications, or complain to a relevant data protection authority. To exercise these rights, please contact us using the details at the end of this policy.</p>
      </section>

      <section className="mb-10">
        <h2>16. UK and EU Travellers</h2>
        <p>If you are located in the UK, European Union or European Economic Area, you may have additional rights under applicable data protection laws, including the UK GDPR or EU GDPR. Where applicable, we will process your personal data based on recognised legal grounds such as consent, contract performance, legal obligation or legitimate interests.</p>
      </section>

      <section className="mb-10">
        <h2>17. Children&apos;s Privacy</h2>
        <p>Our services are not intended for children under the age of 13. We do not knowingly collect personal data from children under 13. If we become aware that we have collected such data without appropriate parental or guardian consent, we will take steps to delete it. Where bookings involve family travel or children&apos;s luggage, the booking must be made by a parent, guardian or responsible adult.</p>
      </section>

      <section className="mb-10">
        <h2>18. Luggage Photos and Verification Data</h2>
        <p>To protect customers, drivers and partners, we may collect photos or records of luggage at collection, storage or delivery. These may be used to verify luggage condition, confirm handover, prevent disputes, investigate lost or damaged baggage claims, support insurance or operational checks, and confirm booking completion. These images will only be used for legitimate operational, legal, safety or customer support purposes.</p>
      </section>

      <section className="mb-10">
        <h2>19. QR Codes and Booking Verification</h2>
        <p>Yallah Baggage may use QR codes, booking references or digital confirmations to verify bookings and ensure luggage is collected and delivered to the correct customer. QR codes or booking details may contain limited personal or booking-related information necessary to complete the service. Customers should not share booking QR codes or confirmation details with unauthorised persons.</p>
      </section>

      <section className="mb-10">
        <h2>20. Third-Party Links</h2>
        <p>Our website, app or messages may contain links to third-party websites, platforms or payment pages. We are not responsible for the privacy practices, content or security of third-party websites. You should review their privacy policies before providing personal data.</p>
      </section>

      <section className="mb-10">
        <h2>21. Business Transfers</h2>
        <p>If Yallah Baggage is involved in a merger, acquisition, investment, restructuring, sale of assets or business transfer, your personal data may be transferred as part of that transaction. If this happens, we will take reasonable steps to ensure your personal data continues to be protected.</p>
      </section>

      <section className="mb-10">
        <h2>22. Legal Disclosure</h2>
        <p>We may disclose your personal data where necessary to comply with legal obligations, respond to lawful requests from authorities, protect the rights, safety or property of Yallah Baggage, prevent fraud, theft or misuse, investigate security incidents, enforce our Terms and Conditions, or protect customers, drivers, partners or the public.</p>
      </section>

      <section className="mb-10">
        <h2>23. Marketing Communications</h2>
        <p>With your consent where required, we may send you updates, offers, promotions, referral campaigns or service news. You can opt out of marketing at any time by clicking unsubscribe in emails, replying STOP where applicable, or contacting us directly. Opting out of marketing does not stop essential service communications relating to bookings.</p>
      </section>

      <section className="mb-10">
        <h2>24. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. When we make changes, we will update the &quot;Last Updated&quot; date above. Where changes are significant, we may notify you by email, website notice, app notice or other appropriate method. You should review this Privacy Policy periodically.</p>
      </section>

      <section className="mb-10">
        <h2>25. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or how Yallah Baggage handles your personal data, you can contact us at:</p>
        <address className="not-italic bg-[#FDFCF9] border border-[#E5E5E5] rounded-2xl p-6 mt-4 inline-block">
          <strong className="text-[#0A2E6D]">Yallah Baggage</strong><br />
          Website: <a href="https://yallahbaggage.com" target="_blank" rel="noopener noreferrer" className="text-[#1E5BD7] hover:underline">https://yallahbaggage.com</a><br />
          Email: <a href="mailto:support@yallahbaggage.com" className="text-[#1E5BD7] hover:underline">support@yallahbaggage.com</a><br />
          Location: Dubai, United Arab Emirates
        </address>
      </section>
    </LegalLayout>
  );
}
