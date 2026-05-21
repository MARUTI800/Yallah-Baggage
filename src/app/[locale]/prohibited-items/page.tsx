"use client";

import React from "react";
import { LegalLayout } from "@/components/ui/legal-layout";
import { AlertTriangle, FileText } from "lucide-react";

export default function ProhibitedItemsPage() {
  return (
    <LegalLayout 
      title="Prohibited Items" 
      lastUpdated="May 2026" 
      icon={AlertTriangle}
    >
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
        <p className="text-amber-800 font-bold m-0 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" /> 
          Important Notice
        </p>
        <p className="text-amber-700 text-sm mt-2 mb-0">
          For the safety of our handlers and to comply with UAE regulations, the following items are strictly prohibited from being transported or stored by Yallah Baggage.
        </p>
      </section>

      {/* PDF Download Link */}
      <div className="flex justify-end mb-8">
        <a 
          href="/prohibited-items.pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-xs font-black text-[#8B7280] hover:text-[#0A2E6D] transition-colors uppercase tracking-[0.2em]"
        >
          <FileText className="w-4 h-4 text-[#1E5BD7]" />
          Download PDF Version
        </a>
      </div>

      <p className="lead text-[#4A4A4A] mb-8">
        This Prohibited & Restricted Items Policy (&quot;Policy&quot;) forms part of the Terms of Service of Yallah Baggage (&quot;Yallah Baggage&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) and applies to all customers using our baggage collection, transportation, storage, handling, concierge, and delivery services.
      </p>

      <p className="text-[#4A4A4A] mb-8">
        Our policy is designed to ensure the safety of our customers, employees, drivers, partners, storage facilities, transportation providers, and the public. Certain items are prohibited or restricted from being transported, stored, or handled through our services due to safety, legal, customs, aviation, and operational requirements.
      </p>

      <p className="text-[#4A4A4A] mb-10">
        By using our services, you acknowledge and agree that you are solely responsible for the contents of your baggage and that all items transported through Yallah Baggage comply with applicable laws, airline regulations, UAE regulations, customs requirements, and this Policy.
      </p>

      <section className="mb-10">
        <h2>1. Customer Responsibility</h2>
        <p>Customers are fully responsible for:</p>
        <ul>
          <li>The contents of all baggage, luggage, boxes, containers, and personal belongings provided to Yallah Baggage.</li>
          <li>Ensuring that no prohibited or illegal items are included.</li>
          <li>Declaring any restricted items before collection.</li>
          <li>Complying with all applicable local and international laws.</li>
          <li>Ensuring transported items comply with airline, airport, customs, and destination country regulations.</li>
        </ul>
        
        <p className="mt-4">Yallah Baggage reserves the right, at its sole discretion, to:</p>
        <ul>
          <li>Refuse collection or transportation of any item.</li>
          <li>Cancel or suspend services.</li>
          <li>Inspect baggage where legally permitted.</li>
          <li>Report suspicious or illegal items to authorities.</li>
          <li>Dispose of prohibited or dangerous goods where required by law or safety regulations.</li>
        </ul>
        
        <p className="mt-4 text-sm font-semibold text-red-600">
          Failure to comply with this Policy may result in refusal of service, cancellation without refund, reporting to authorities, confiscation of items, additional fees, or legal action.
        </p>
      </section>

      <section className="mb-10">
        <h2>2. Strictly Prohibited Items</h2>
        <p>The following items are strictly prohibited from being transported, stored, or handled by Yallah Baggage under any circumstances:</p>
        
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Illegal Drugs & Narcotics</h3>
            <p className="mb-2">Including but not limited to:</p>
            <ul>
              <li>Controlled substances.</li>
              <li>Recreational drugs.</li>
              <li>Narcotics.</li>
              <li>Cannabis products where prohibited.</li>
              <li>Drug paraphernalia.</li>
              <li>Any illegal substances under UAE or international law.</li>
            </ul>
            <p className="text-sm italic mt-2 text-[#8B7280]">
              The United Arab Emirates maintains a strict zero-tolerance anti-drug policy. Even trace amounts of illegal substances may result in criminal penalties.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Weapons, Firearms & Ammunition</h3>
            <p className="mb-2">Including but not limited to:</p>
            <ul>
              <li>Firearms and ammunition.</li>
              <li>Replica firearms and BB or air guns.</li>
              <li>Explosives and pyrotechnics.</li>
              <li>Tasers, stun guns, and pepper spray.</li>
              <li>Martial arts weapons and knives prohibited by law.</li>
              <li>Swords or offensive weapons.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Explosives & Flammable Materials</h3>
            <p className="mb-2">Including but not limited to:</p>
            <ul>
              <li>Fireworks, dynamite, and gunpowder.</li>
              <li>Fuel, gasoline, propane, and butane.</li>
              <li>Lighter fluid and ignitable substances.</li>
              <li>Explosive devices and flammable chemicals.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Hazardous & Toxic Materials</h3>
            <p className="mb-2">Including but not limited to:</p>
            <ul>
              <li>Corrosive chemicals and acids.</li>
              <li>Toxic substances and radioactive materials.</li>
              <li>Biohazard materials and infectious substances.</li>
              <li>Chemical agents, hazardous waste, and industrial chemicals.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Counterfeit, Illegal or Restricted Goods</h3>
            <p className="mb-2">Including but not limited to:</p>
            <ul>
              <li>Counterfeit products and pirated content.</li>
              <li>Fraudulent documentation and stolen property.</li>
              <li>Illegal imports or exports.</li>
              <li>Gambling devices prohibited by UAE law.</li>
              <li>Items associated with black magic, witchcraft, or sorcery prohibited under UAE regulations.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Perishable or Unsafe Goods</h3>
            <p className="mb-2">Including but not limited to:</p>
            <ul>
              <li>Spoiled or perishable food.</li>
              <li>Live animals and human remains.</li>
              <li>Unsecured liquids and strong-smelling substances.</li>
              <li>Any item likely to leak, spill, or damage other baggage.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2>3. Restricted Items</h2>
        <p>The following items may be accepted only under specific conditions, subject to declaration, airline rules, customs regulations, and operational approval. Yallah Baggage reserves the right to refuse any restricted item at any time.</p>
        
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Alcohol</h3>
            <p>Alcoholic beverages may be transported only where permitted by applicable law and airline regulations. Alcohol exceeding permitted volume limits or prohibited by destination country regulations may not be accepted. Customers are solely responsible for ensuring compliance with customs and import laws.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Lithium Batteries & Power Banks</h3>
            <p>Lithium batteries, power banks, and battery-powered devices may pose fire risks and are subject to airline and transport restrictions. Restrictions may apply to power banks, spare batteries, e-scooters, hoverboards, smart luggage, and battery-powered devices. Damaged, defective, or recalled batteries are strictly prohibited. Yallah Baggage reserves the right to refuse transportation of any lithium battery device.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Electronic Devices</h3>
            <p className="mb-2">Including laptops, tablets, mobile phones, cameras, drones, and smart devices. Customers transport electronic devices entirely at their own risk. Yallah Baggage is not liable for:</p>
            <ul>
              <li>Internal damage or data loss.</li>
              <li>Battery malfunction or manufacturer defects.</li>
              <li>Security inspections or confiscation.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Drones</h3>
            <p>Drone transportation may be restricted depending on airline policies, airport regulations, and destination country laws. Lithium batteries may need to be removed and carried separately where applicable.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">E-Cigarettes & Vaping Devices</h3>
            <p>E-cigarettes and vaping devices containing batteries may be subject to transportation restrictions. These items may not be accepted in checked baggage under airline policies. Customers are responsible for compliance with destination laws and airline regulations.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Medication</h3>
            <p className="mb-2">Customers carrying prescription medication are responsible for:</p>
            <ul>
              <li>Ensuring legality in destination countries.</li>
              <li>Carrying valid prescriptions.</li>
              <li>Obtaining any required government approvals.</li>
            </ul>
            <p className="mt-2">Certain medications legal in other countries may be prohibited or controlled in the UAE. For controlled medication entering the UAE, approval from the UAE Ministry of Health and Prevention (MOHAP) may be required. Yallah Baggage is not liable for confiscation, delays, penalties, or customs actions relating to medication.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">Aerosols, Liquids & Pressurized Containers</h3>
            <p>Restrictions may apply to aerosols, pressurized containers, sprays, toiletries, fuel cartridges, and gas canisters. All such items remain subject to airline and transport regulations.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2>4. Valuable Items</h2>
        <p>Customers are strongly advised not to place valuable items in baggage handled by Yallah Baggage. This includes but is not limited to:</p>
        <ul>
          <li>Cash, coins, or negotiable securities.</li>
          <li>Jewellery, high-value watches, diamonds, or precious metals.</li>
          <li>Passports, original legal documents, identification, credit cards, or plane tickets.</li>
          <li>Electronics, business documents, confidential information, luxury goods, and keys.</li>
        </ul>
        <p className="mt-4 italic font-semibold">
          Unless expressly agreed in writing, Yallah Baggage accepts no liability for loss, theft, damage, or disappearance of valuables.
        </p>
      </section>

      <section className="mb-10">
        <h2>5. UAE Customs & Regulatory Compliance</h2>
        <p>Customers are solely responsible for complying with UAE customs laws, import/export regulations, airport security requirements, airline baggage regulations, and destination country laws. Certain items legal in one country may be prohibited in another. Yallah Baggage does not guarantee that any item will be permitted through customs, airport security, or airline screening processes.</p>
      </section>

      <section className="mb-10">
        <h2>6. Security Screening & Inspection Rights</h2>
        <p>Yallah Baggage reserves the right to refuse any baggage, request additional information, conduct inspections where legally permitted, remove prohibited items, and cooperate with law enforcement and regulatory authorities.</p>
        <p className="mt-4">Where suspicious, illegal, or dangerous items are identified, Yallah Baggage may:</p>
        <ul>
          <li>Suspend services immediately.</li>
          <li>Refuse delivery.</li>
          <li>Report the matter to relevant authorities.</li>
          <li>Surrender items to airport security, customs, police, or government agencies.</li>
        </ul>
        <p className="mt-2 text-sm font-semibold">No compensation or refund will be provided in such circumstances.</p>
      </section>

      <section className="mb-10">
        <h2>7. Airline & Third-Party Regulations</h2>
        <p>Yallah Baggage works alongside airports, hotels, transportation providers, drivers, storage facilities, and third-party partners. Acceptance of baggage remains subject to airline policies, airport regulations, customs authorities, local laws, and third-party operational restrictions. Yallah Baggage is not responsible for airline refusals, delayed baggage clearance, security confiscations, customs seizures, missed flights, regulatory actions, or third-party handling decisions.</p>
      </section>

      <section className="mb-10">
        <h2>8. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Yallah Baggage shall not be liable for:</p>
        <ul>
          <li>Loss or confiscation of prohibited items or government seizures.</li>
          <li>Customs penalties or airport/airline security actions.</li>
          <li>Delays caused by inspections.</li>
          <li>Damage resulting from prohibited or undeclared items.</li>
          <li>Losses arising from customer non-compliance with laws or regulations.</li>
        </ul>
        <p className="mt-4">Customers agree to indemnify and hold harmless Yallah Baggage, its employees, contractors, partners, and affiliates against any claims, liabilities, damages, penalties, losses, or expenses arising from violations of this Policy.</p>
      </section>

      <section className="mb-10">
        <h2>9. Updates to This Policy</h2>
        <p>Yallah Baggage reserves the right to modify or update this Policy at any time without prior notice. The latest version will always be available on our website. Continued use of our services constitutes acceptance of the updated Policy.</p>
      </section>

      <section className="mb-10">
        <h2>10. Contact Us</h2>
        <p>If you have questions regarding this Policy or whether an item may be transported, please contact us:</p>
        <address className="not-italic bg-[#FDFCF9] border border-[#E5E5E5] rounded-2xl p-6 mt-4 inline-block">
          <strong className="text-[#0A2E6D]">Yallah Baggage</strong><br />
          Email: <a href="mailto:support@yallahbaggage.com" className="text-[#1E5BD7] hover:underline">support@yallahbaggage.com</a><br />
          Website: <a href="https://yallahbaggage.com" target="_blank" rel="noopener noreferrer" className="text-[#1E5BD7] hover:underline">https://yallahbaggage.com</a>
        </address>
      </section>
    </LegalLayout>
  );
}
