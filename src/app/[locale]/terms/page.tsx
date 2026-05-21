"use client";

import React from "react";
import { LegalLayout } from "@/components/ui/legal-layout";
import { ScrollText, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <LegalLayout 
      title="Terms of Service" 
      lastUpdated="May 2026" 
      icon={ScrollText}
    >
      {/* PDF Download Link */}
      <div className="flex justify-end mb-8">
        <a 
          href="/terms-of-service.pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-xs font-black text-[#8B7280] hover:text-[#0A2E6D] transition-colors uppercase tracking-[0.2em]"
        >
          <FileText className="w-4 h-4 text-[#1E5BD7]" />
          Download PDF Version
        </a>
      </div>

      <p className="lead text-[#4A4A4A] mb-8">
        Welcome to Yallah Baggage. Yallah Baggage is a technology-enabled baggage collection, storage, transportation and delivery platform designed to simplify travel and baggage handling for travelers, residents, hotels, holiday homes, Airbnb hosts and business partners.
      </p>

      <p className="text-[#4A4A4A] mb-10">
        These Terms of Service (&quot;Terms&quot;) govern your use of the Yallah Baggage website, booking systems, WhatsApp communications, applications, customer support channels and related services. By accessing, booking or using Yallah Baggage services, you acknowledge that you have read, understood and agreed to be legally bound by these Terms.
      </p>

      <section className="mb-10">
        <h2>1. Definitions & Interpretation</h2>
        <p>Unless otherwise stated in these Terms:</p>
        <ul>
          <li><strong>Account</strong> means a registered Yallah Baggage customer account.</li>
          <li><strong>Booking</strong> means a confirmed reservation for Yallah Baggage services.</li>
          <li><strong>Booking Request</strong> means a request submitted by a customer for services.</li>
          <li><strong>Baggage</strong> means suitcases, luggage, bags, personal items or other approved belongings accepted by Yallah Baggage.</li>
          <li><strong>Collection Point</strong> means the agreed pickup location.</li>
          <li><strong>Delivery Point</strong> means the agreed drop-off location.</li>
          <li><strong>Customer, &quot;you&quot;, or &quot;your&quot;</strong> means the person using the services.</li>
          <li><strong>Handler</strong> means Yallah Baggage employees, contractors, drivers or approved partners.</li>
          <li><strong>Platform</strong> means the Yallah Baggage website, mobile application, booking tools, QR verification systems, WhatsApp booking systems and communication channels.</li>
          <li><strong>Prohibited Items</strong> means any items restricted or prohibited under these Terms or applicable laws.</li>
          <li><strong>Services</strong> means all baggage collection, transportation, delivery, storage, airport assistance and related services provided by Yallah Baggage.</li>
          <li><strong>Storage Services</strong> means temporary or long-term baggage storage services.</li>
          <li><strong>VIP Services</strong> means premium dedicated baggage handling or transportation services.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2>2. Acceptance of Terms</h2>
        <p>By using Yallah Baggage services, you agree to these Terms in full. If you do not agree to these Terms, you must immediately stop using the services. Yallah Baggage reserves the right to amend or update these Terms at any time. Updated Terms become effective immediately upon publication. Continued use of the services following updates constitutes acceptance of the revised Terms.</p>
      </section>

      <section className="mb-10">
        <h2>3. Availability of Services</h2>
        <p>Services are provided on an &quot;as available&quot; basis. Yallah Baggage does not guarantee uninterrupted service availability and reserves the right to modify or suspend services, refuse bookings, change operational coverage areas, change pricing, and introduce new service limitations without prior notice.</p>
        <p className="mt-2">Service availability may vary depending on: operational capacity, traffic conditions, airport restrictions, security requirements, weather conditions, local regulations, and third-party availability.</p>
      </section>

      <section className="mb-10">
        <h2>4. Use of the Platform</h2>
        <p>Customers are responsible for maintaining accurate booking information, maintaining confidentiality of account details, providing valid contact information, and ensuring lawful use of services.</p>
        <p className="mt-2">Yallah Baggage may contact customers through WhatsApp, SMS, phone calls, email, and push notifications for booking coordination, support, operational updates, promotions or security verification. Customers may opt out of marketing communications.</p>
      </section>

      <section className="mb-10">
        <h2>5. Bookings & Confirmations</h2>
        <p>Bookings may be made through the website, WhatsApp, social media, customer service, email, or partner platforms. A booking is only considered confirmed when payment has been accepted where applicable, and a confirmation has been issued by Yallah Baggage.</p>
        <p className="mt-2">Yallah Baggage reserves the right to reject bookings, cancel bookings, request additional information, refuse baggage, or amend operational schedules. Customers are responsible for ensuring all booking details are accurate. Incorrect details may result in delays, failed deliveries, additional charges or cancellation.</p>
      </section>

      <section className="mb-10">
        <h2>6. Service Overview</h2>
        <p>Yallah Baggage may provide: airport/hotel/residential baggage collection and delivery, Airbnb baggage handling, same-day or scheduled baggage delivery, intercity baggage transportation, temporary or long-term storage, concierge assistance, VIP baggage handling, QR verification, and real-time tracking services.</p>
        <p className="mt-2">Service pricing may vary by country, city, distance, demand, bag quantity, weight, vehicle requirements, and the time of booking.</p>
      </section>

      <section className="mb-10">
        <h2>7. Delivery Services</h2>
        
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">7.1 Standard Delivery Services</h3>
            <p>Customers must ensure baggage is ready for collection during the agreed collection window. A waiting period may apply. Additional waiting charges may be incurred where delays are caused by the customer. Door-to-door delivery may be subject to building access restrictions, elevator availability, parking restrictions, and security regulations. Additional charges may apply for oversized items, heavy baggage, additional floors without elevators, long walking distances, airport parking fees, and congestion charges.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">7.2 VIP Services</h3>
            <p>VIP services may include a dedicated vehicle, dedicated handlers, priority scheduling, and premium customer support. VIP pricing and operational limitations will be confirmed separately.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">7.3 International Delivery Assistance</h3>
            <p>Where international delivery or shipping assistance is provided, customers acknowledge that customs delays may occur, third-party courier terms may apply, additional duties or taxes may apply, and Yallah Baggage is not responsible for customs seizures or delays.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2>8. Storage Services</h2>
        
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">8.1 Short-Term Storage</h3>
            <p>Storage durations and fees are confirmed during booking. Customers are responsible for collecting baggage before the agreed storage expiry date. Additional storage fees apply for overdue collections.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">8.2 Long-Term Storage</h3>
            <p>Long-term storage may require advance payment, security deposits, and monthly recurring payments. Yallah Baggage reserves the right to restrict access to unpaid storage items, relocate stored baggage, and suspend services for unpaid balances.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">8.3 Uncollected Baggage</h3>
            <p>Unclaimed baggage may be treated as abandoned where customers fail to respond, storage remains unpaid, or baggage remains uncollected beyond the agreed term. Where legally permitted, abandoned items may be disposed of, donated, or sold to recover unpaid fees. Reasonable efforts will be made to contact customers beforehand.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2>9. Pricing & Payments</h2>
        <p>Pricing is displayed at the time of booking. Yallah Baggage reserves the right to correct pricing errors. Accepted payment methods may include credit/debit cards, Apple Pay, bank transfer, and approved cash payments. Customers remain responsible for bank fees, transaction charges, and currency conversion fees. Late payments may incur additional charges.</p>
      </section>

      <section className="mb-10">
        <h2>10. Cancellation & Refund Policy</h2>
        <p>Cancellation terms may vary depending on the service booked. Unless otherwise agreed: last-minute cancellations may be non-refundable, completed services are non-refundable, and promotional bookings may be non-refundable. Refunds may be issued as account credits at Yallah Baggage&apos;s discretion. Operational or weather-related delays do not automatically qualify for refunds.</p>
      </section>

      <section className="mb-10">
        <h2>11. Baggage Reduction Policy</h2>
        <p>Reducing baggage quantity after booking confirmation does not entitle customers to refunds or credits. Unused baggage allowance cannot be transferred or refunded.</p>
      </section>

      <section className="mb-10">
        <h2>12. Baggage Increase Policy</h2>
        <p>Additional baggage presented during collection may incur additional charges. Yallah Baggage reserves the right to refuse excess baggage, modify service requirements, request additional payment, or upgrade vehicle requirements. Promotional discounts may not apply to additional baggage.</p>
      </section>

      <section className="mb-10">
        <h2>13. Customer Responsibilities & Warranties</h2>
        <p>Customers warrant that all baggage belongs to them or is authorized by the owner, no prohibited items are included, baggage complies with applicable laws, baggage is securely packed, weight limits are respected, and accurate booking details have been provided.</p>
        <p className="mt-2">Customers remain solely responsible for baggage contents, customs compliance, airline baggage regulations, and required travel documentation. Customers are strongly encouraged to maintain their own baggage and travel insurance.</p>
      </section>

      <section className="mb-10">
        <h2>14. Collection, Delivery & Security</h2>
        <p>Yallah Baggage may use QR-code verification, tamper-evident seals, digital scanning systems, security tags, identity verification, and photo verification. Customers agree that baggage may be scanned or inspected if required by authorities, government or airport authorities may request access to baggage, and Yallah Baggage may refuse unsecured baggage.</p>
        <p className="mt-2">Customers may be required to provide passport copies, government-issued ID, booking references, and QR verification codes. Yallah Baggage is not liable for delays caused by security checks, airport operational restrictions, government investigations, or customer absence during delivery.</p>
      </section>

      <section className="mb-10">
        <h2>15. Airport Lost Baggage Assistance</h2>
        <p>Where Yallah Baggage assists customers in retrieving lost baggage from airports or airlines: retrieval success cannot be guaranteed, airline or airport approval is required, and service fees may remain payable regardless of outcome. Yallah Baggage is not responsible for airline baggage handling failures.</p>
      </section>

      <section className="mb-10">
        <h2>16. Free Storage Promotions</h2>
        <p>Promotional free storage offers may be subject to booking limits, time restrictions, location restrictions, and bag quantity limitations. Additional charges apply once promotional periods expire. Yallah Baggage reserves the right to withdraw promotional offers at any time.</p>
      </section>

      <section className="mb-10">
        <h2>17. Packing Assistance Disclaimer</h2>
        <p>Where customers request packing assistance: customers remain fully responsible for all contents, Yallah Baggage accepts no responsibility for packing-related damage, and customers must verify packed contents themselves. Fragile, high-value or sensitive items should not be entrusted without appropriate protection and insurance.</p>
      </section>

      <section className="mb-10">
        <h2>18. Additional Charges</h2>
        <p>Additional charges may apply for waiting time, failed collections/deliveries, congestion zones, airport parking, extra baggage, oversized items, long walking distances, stairs without elevators, re-delivery requests, last-minute modifications, and additional storage days. Operational pricing may vary by city and country.</p>
      </section>

      <section className="mb-10">
        <h2>19. Liability & Indemnity</h2>
        <p>To the maximum extent permitted by law, Yallah Baggage is not liable for indirect or consequential losses, airline delays or failures, fragile or improperly packed items, or normal wear and tear.</p>
        <p className="mt-2">Customers agree to indemnify and hold harmless Yallah Baggage, its staff, drivers, contractors and partners from any claims, losses, damages, penalties or legal actions arising from customer baggage contents, illegal items, breach of these Terms, misuse of services, or customer negligence.</p>
        <p className="mt-4 font-semibold">
          Unless otherwise required by law, Yallah Baggage&apos;s maximum liability shall not exceed the booking value or &pound;250 GBP per booking, whichever is lower.
        </p>
      </section>

      <section className="mb-10">
        <h2>20. Bag Protection & Claims</h2>
        <p>Yallah Baggage may offer limited bag protection at its discretion. Bag protection is not insurance, does not cover indirect losses, and does not cover prohibited or fragile items without proper protection.</p>
        <p className="mt-2">Claims must be reported immediately and submitted within 24 hours with supporting evidence and photographs where possible. Yallah Baggage reserves the right to reject fraudulent or unsupported claims.</p>
      </section>

      <section className="mb-10">
        <h2>21. Illegal Goods Liability</h2>
        <p>Customers are solely responsible for ensuring baggage contents comply with all applicable laws. Yallah Baggage strictly prohibits transportation or storage of illegal goods. Customers agree to indemnify Yallah Baggage against all legal claims, pay all associated legal costs, and cooperate with investigations. Yallah Baggage may cooperate fully with law enforcement authorities.</p>
      </section>

      <section className="mb-10">
        <h2>22. Reviews & Customer Conduct</h2>
        <p>Customers may submit reviews following completed bookings. Reviews must be truthful, not be abusive, not be defamatory, and not contain hate speech or offensive content. Yallah Baggage reserves the right to remove inappropriate reviews. Customers engaging in abusive, threatening or harassing behavior toward staff, drivers or partners may be refused service.</p>
      </section>

      <section className="mb-10">
        <h2>23. Privacy & Data Protection</h2>
        <p>Yallah Baggage may collect and process names, contact info, pickup/delivery addresses, flight details, booking history, payment info, and IDs. Information may be used for booking fulfillment, support, fraud prevention, security verification, legal compliance, service improvements, and marketing. Data may be shared with drivers, partners, payment processors, and authorities. Customers may request deletion of data subject to legal retention obligations.</p>
      </section>

      <section className="mb-10">
        <h2>24. Right to Refuse Service</h2>
        <p>Yallah Baggage reserves the right to refuse or terminate services where prohibited items are identified, fraud is suspected, customer conduct is abusive, safety concerns arise, false information is provided, or security verification cannot be completed. Services may be terminated without refund where serious breaches occur.</p>
      </section>

      <section className="mb-10">
        <h2>25. Prohibited & Restricted Items</h2>
        <p>Customers must not include prohibited items in baggage. Prohibited items include but are not limited to illegal drugs, weapons, firearms, explosives, hazardous materials, flammable substances, cash, precious metals, high-value jewellery, live animals, perishable goods, counterfeit goods, and dangerous chemicals. Customers remain solely liable for all baggage contents. A separate Prohibited Items Policy forms part of these Terms.</p>
      </section>

      <section className="mb-10">
        <h2>26. Intellectual Property</h2>
        <p>All Yallah Baggage branding, logos, content, text, graphics and materials remain the intellectual property of Yallah Baggage. No materials may be copied, reproduced or distributed without written permission.</p>
      </section>

      <section className="mb-10">
        <h2>27. Third-Party Providers</h2>
        <p>Certain services may be fulfilled by third-party providers. Customers acknowledge that third-party operational limitations and terms may apply, and Yallah Baggage is not responsible for third-party operational failures outside its reasonable control.</p>
      </section>

      <section className="mb-10">
        <h2>28. Force Majeure</h2>
        <p>Yallah Baggage shall not be liable for delays or failures caused by events beyond reasonable control including: weather, natural disasters, airport restrictions, government actions, security incidents, traffic disruptions, strikes, technical failures, war/terrorism, and pandemics.</p>
      </section>

      <section className="mb-10">
        <h2>29. Miscellaneous</h2>
        <p>Failure to enforce any provision of these Terms does not constitute a waiver of rights. If any provision is deemed unenforceable, remaining provisions remain valid. These Terms are written in English. In case of translation conflicts, the English version prevails. Customers may not assign rights or obligations under these Terms without written consent.</p>
      </section>

      <section className="mb-10">
        <h2>30. Governing Law & Jurisdiction</h2>
        <p>These Terms shall apply to all Yallah Baggage operations conducted within the United Kingdom and the United Arab Emirates.</p>
        
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">30.1 United Kingdom Operations</h3>
            <p>For services operated within the United Kingdom, these Terms shall be governed by and interpreted in accordance with the laws of England and Wales. Any disputes arising in connection with UK operations shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">30.2 United Arab Emirates Operations</h3>
            <p>For services operated within the United Arab Emirates, these Terms shall be governed by and interpreted in accordance with the applicable laws and regulations of the United Arab Emirates.</p>
            <p className="mt-2">Where applicable, disputes relating to UAE operations may fall under the jurisdiction of Dubai Courts, DIFC Courts, ADGM Courts, or other competent UAE judicial or regulatory authorities depending on the operational entity, service location, contractual structure, and applicable law.</p>
            <p className="mt-2">Customers acknowledge that Yallah Baggage may operate through local operating entities, logistics partners, licensed transportation providers, warehousing providers, technology service providers, and independent contractors within the UAE.</p>
            <p className="mt-2">Customers further acknowledge that UAE customs laws apply to all transported or stored baggage, UAE aviation/transport regulations apply to airport operations, UAE data protection and cybersecurity rules apply to customer data, and certain items lawful in other countries may be prohibited in the UAE.</p>
            <p className="mt-2">Yallah Baggage reserves the right to comply fully with instructions, requests, investigations or orders issued by UAE law enforcement, customs, airport security, transport regulators, civil aviation authorities, or courts, including disclosure of customer information where legally required.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">30.3 International Operations</h3>
            <p>Where services involve cross-border transportation, international travel, or third-party international logistics providers, additional local laws, customs regulations, airport policies, airline policies and international transport regulations may apply. Customers remain solely responsible for ensuring compliance with all import, export, customs, airline and security regulations applicable to their baggage and belongings.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2>31. Contact Information</h2>
        <p>If you have any questions or require support regarding these Terms, please contact us:</p>
        <address className="not-italic bg-[#FDFCF9] border border-[#E5E5E5] rounded-2xl p-6 mt-4 inline-block">
          <strong className="text-[#0A2E6D]">Yallah Baggage</strong><br />
          Website: <a href="https://yallahbaggage.com" target="_blank" rel="noopener noreferrer" className="text-[#1E5BD7] hover:underline">https://yallahbaggage.com</a><br />
          Email: <a href="mailto:support@yallahbaggage.com" className="text-[#1E5BD7] hover:underline">support@yallahbaggage.com</a><br />
          Customer Support: Via website, WhatsApp, and approved support channels.
        </address>
      </section>
    </LegalLayout>
  );
}
