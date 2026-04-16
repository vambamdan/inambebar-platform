import Link from 'next/link'

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{color:'#1A2744'}}>Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-2">Last updated: April 2026</p>
      <p className="text-gray-400 text-sm mb-10">
        By creating an account on Inambebar you agree to these terms in full.
        If you do not agree, do not use the platform.
      </p>

      <div className="space-y-10 text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>1. What Inambebar Is</h2>
          <p>Inambebar is a technology marketplace that connects individuals who wish to send packages ("Senders") with travelers who have available luggage space ("Travelers"). Inambebar does not ship, carry, own, inspect, or handle any packages. We are a platform only. All physical transactions are between Senders and Travelers directly.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>2. Eligibility & Identity</h2>
          <p className="mb-3">You must be at least 18 years old to use Inambebar. By creating an account you confirm that all information provided is accurate, complete, and belongs to you.</p>
          <p>Inambebar operates a mandatory Know Your Customer (KYC) process. All users must complete identity verification before posting trips or shipment requests. Unverified users may browse but cannot transact. Providing false identity documents is grounds for immediate permanent termination and may be reported to relevant authorities.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>3. KYC & Identity Verification</h2>
          <p className="mb-3">To complete verification you must submit a valid government-issued photo ID (passport, national ID card, or driver's license) and a live selfie. Your identity documents are stored securely and used solely for verification and dispute resolution.</p>
          <p>Verified users receive a blue checkmark on their profile. Verification may be revoked at any time if we discover the submitted documents were fraudulent or if account activity suggests identity misrepresentation.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>4. Shipment Declaration & Sender Responsibility</h2>
          <p className="mb-3">Senders must accurately and completely declare the contents, category, weight, and approximate value of every package. This declaration is stored permanently as a legal record. By submitting a shipment request, Senders confirm under their verified identity that the declaration is truthful.</p>
          <p className="mb-3">Senders are solely and exclusively responsible for:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Ensuring package contents comply with all applicable laws</li>
            <li>Compliance with customs import/export regulations of the origin, transit, and destination countries</li>
            <li>Compliance with airline and IATA regulations</li>
            <li>Proper packaging and sealing of items</li>
            <li>Accurate declaration of the commercial value of goods</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>5. Traveler Responsibility</h2>
          <p className="mb-3">Travelers are responsible for:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
            <li>Physically inspecting and photographing every package at the point of handoff</li>
            <li>Refusing any package they are not comfortable carrying</li>
            <li>Declaring all carried goods truthfully to customs authorities</li>
            <li>Complying with all airline baggage policies</li>
            <li>Never carrying packages that are unsealed, appear tampered with, or whose contents they cannot verify</li>
          </ul>
          <p className="font-semibold text-sm" style={{color:'#1A2744'}}>Travelers who carry packages on behalf of Senders remain legally responsible for the contents of their luggage under the laws of every country they transit through. Inambebar accepts no liability for customs seizures, fines, or legal proceedings arising from the contents of carried packages.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>6. Absolutely Prohibited Items</h2>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-3">
            <p className="font-bold text-red-700 text-sm mb-2">The following items are strictly prohibited on Inambebar under any circumstances:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-red-600">
              <li>Narcotics, controlled substances, or illegal drugs of any kind</li>
              <li>Weapons, firearms, ammunition, or explosives</li>
              <li>Counterfeit currency, goods, or documents</li>
              <li>Items subject to international sanctions or embargoes</li>
              <li>Human remains, organs, or biological samples</li>
              <li>Endangered species or products derived from them (CITES-protected)</li>
              <li>Child exploitation material of any kind</li>
              <li>Radioactive materials</li>
              <li>Any item whose transport constitutes a criminal offence in any transit country</li>
            </ul>
          </div>
          <p className="text-sm">Violation of this clause results in immediate permanent account termination and mandatory reporting to law enforcement in all relevant jurisdictions. Inambebar maintains full records of all user identity documents and communications, which will be provided to authorities upon request.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>7. Flight Route Customs Regulations</h2>
          <p className="mb-4 text-sm">All parties must comply with the customs and aviation regulations of every country on their route. The following is a summary of key regulations on the most common Inambebar corridors. This is a summary only — users are responsible for verifying current regulations with official sources before transacting.</p>

          <div className="space-y-5">

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>🇮🇷 Iranian Customs (All Routes Into Iran)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Duty-free personal goods allowance: approximately €80 per passenger for air travel</li>
                <li>Goods exceeding €80 require customs declaration and duty payment</li>
                <li>Commercial quantities of any item are subject to full import duties and permits</li>
                <li>Prohibited imports: alcohol, pork products, gambling equipment, anti-government material, pornography, satellite equipment (without permit), certain medications without prescription</li>
                <li>Electronics: one laptop, one mobile phone, and one camera are generally permitted duty-free. Additional items require declaration and may incur duties</li>
                <li>Gold and jewellery: declared if exceeding personal use quantities</li>
                <li>Foreign currency: amounts above $10,000 USD equivalent must be declared</li>
                <li>Medications: prescription medications must be accompanied by a prescription. Quantities must not exceed personal use (generally 3 months supply)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>🇹🇷 Turkey (Istanbul — IST) Transit & Entry</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Istanbul is the most common transit hub for Iran-Europe and Iran-North America routes</li>
                <li>Transit passengers (not clearing immigration) do not pass through Turkish customs but baggage must comply with IATA regulations</li>
                <li>Passengers clearing Turkish customs: €430 duty-free allowance for goods from non-EU countries</li>
                <li>Prohibited: narcotics, weapons, counterfeit goods, certain medications without prescription</li>
                <li>Turkish Airlines strictly enforces IATA dangerous goods regulations — lithium batteries, flammables, and pressurised containers are heavily restricted in checked baggage</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>🇦🇪 UAE (Dubai — DXB) Transit & Entry</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Dubai is a major hub for Iran-Africa, Iran-Asia, and Iran-Western routes</li>
                <li>Transit passengers through Dubai International do not clear UAE customs</li>
                <li>UAE prohibited items (relevant to transit): narcotics, pork products, pornographic material, certain medications (codeine, tramadol require prescription), gambling equipment, counterfeit goods</li>
                <li>Alcohol: permitted in personal quantities for non-Muslim adults entering UAE; not applicable to Iran-bound packages</li>
                <li>Duty-free allowance for UAE entry: AED 3,000 (~$800 USD) for personal goods</li>
                <li>Strict enforcement of narcotics — trace amounts can result in arrest under UAE law</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>🇩🇪 Germany / 🇪🇺 EU (Frankfurt — FRA, Amsterdam — AMS)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>EU duty-free threshold: €150 for goods imported from outside the EU (this applies to accompanied goods)</li>
                <li>Goods above €150 require customs declaration and VAT/duty payment</li>
                <li>Prohibited EU imports: narcotics, endangered species products, counterfeit goods, certain plant/food products without phytosanitary certificate</li>
                <li>Medications: personal quantities with prescription generally permitted. Commercial quantities require import permits</li>
                <li>Cash: amounts above €10,000 must be declared at EU border</li>
                <li>GDPR note: biometric and identity data of EU-resident users is processed in compliance with GDPR</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>🇬🇧 United Kingdom (London — LHR)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Post-Brexit duty-free allowance: £135 for goods (no customs duty below this threshold, but VAT may apply)</li>
                <li>Restricted items: certain food products, plant materials, medications in excess of personal supply</li>
                <li>Prohibited: narcotics, weapons, counterfeit goods, endangered species products</li>
                <li>Cash: amounts above £10,000 must be declared</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>🇨🇦 Canada (Toronto — YYZ)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Canadian residents returning: CAD $800 duty-free exemption after 48+ hours abroad. Goods carried for others do NOT qualify for this exemption and must be declared separately</li>
                <li>Prohibited Canadian imports: narcotics, certain weapons, hate material, products from sanctioned countries (note: Canada maintains sanctions related to Iran — users must verify current SEMA regulations)</li>
                <li>Medications: personal supply with prescription. Controlled substances require special permits</li>
                <li>Food: fresh fruits, vegetables, meat, and dairy products face strict import restrictions — CFIA inspection required</li>
                <li>Carrying goods for others: Canadian Border Services Agency (CBSA) requires declaration of all goods being carried on behalf of third parties. Failure to declare is a criminal offence</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>🇶🇦 Qatar (Doha — DOH)</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Qatar Airways is a common connection for Iran routes via Doha</li>
                <li>Transit passengers do not clear Qatari customs</li>
                <li>Qatar prohibited items: narcotics, pork products, alcohol (for Muslims), pornographic material, gambling equipment, certain medications</li>
                <li>Qatar maintains strict drug enforcement — any trace amounts may result in prosecution</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>✈️ IATA Dangerous Goods — All Flights</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>The IATA Dangerous Goods Regulations apply to all commercial flights regardless of route</li>
                <li>Lithium batteries: loose lithium batteries prohibited in checked baggage. Devices with batteries permitted in carry-on with restrictions on watt-hours</li>
                <li>Flammable liquids and gases: prohibited in checked baggage (aerosols, lighter fluid, paint)</li>
                <li>Pressurised containers: prohibited unless specifically permitted (e.g. medical oxygen with airline permission)</li>
                <li>Magnetised materials, corrosives, and oxidisers: prohibited without special airline approval</li>
                <li>Travelers are legally responsible for ensuring carried packages do not contain any IATA-prohibited dangerous goods, regardless of what the Sender has declared</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>8. Message Monitoring & Evidence</h2>
          <p>All messages sent through Inambebar's in-platform chat are stored permanently and may be reviewed by Inambebar for safety, fraud prevention, and dispute resolution. By using our messaging system, you explicitly consent to this monitoring. Complete message histories, including timestamps and user identity records, will be provided to law enforcement upon valid legal request and may be used as evidence in legal proceedings.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>9. Photo Documentation</h2>
          <p>Both parties are required to photograph packages at the point of handoff using the Inambebar platform. These photographs are timestamped, geotagged where possible, and stored permanently. Refusal to participate in photo documentation gives the other party grounds to cancel the transaction and, in cases of suspected fraud, to initiate a formal dispute.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>10. Payments & Fees</h2>
          <p>During the launch period (first 6 months from the date of this agreement), Inambebar charges no platform commission. After the launch period, a platform service fee applies to all completed transactions. The fee rate will be communicated with at least 30 days notice before it takes effect. The first 200 registered and verified members ("Founding Members") receive a permanently reduced lifetime rate.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>11. Disputes & Liability</h2>
          <p className="mb-3">Inambebar provides a dispute resolution process for transactions that go wrong. In a dispute, both parties' message histories, shipment declarations, handoff photos, and identity records will be reviewed. Inambebar's decision in a dispute is final.</p>
          <p>Inambebar is not liable for lost, stolen, damaged, or confiscated packages. We are not responsible for customs seizures, fines, legal proceedings, or any loss arising from the actions of users. All users transact at their own risk. Inambebar's maximum liability to any user is limited to the platform service fee paid in connection with the disputed transaction.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>12. Termination & Reporting</h2>
          <p>Inambebar reserves the right to permanently terminate any account at any time for violation of these Terms, suspicious activity, fraudulent behaviour, or failure to comply with KYC requirements. In cases involving suspected criminal activity — including customs fraud, drug trafficking, or theft — Inambebar will proactively report the user's verified identity and full activity record to the relevant authorities without prior notice to the user.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>13. Governing Law</h2>
          <p>These Terms are governed by the laws of Ontario, Canada. Any disputes arising from use of Inambebar that cannot be resolved through our internal dispute process shall be subject to the exclusive jurisdiction of the courts of Ontario, Canada.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>14. Contact</h2>
          <p>Legal: <a href="mailto:legal@inambebar.com" className="underline" style={{color:'#E07B29'}}>legal@inambebar.com</a></p>
        </section>
      </div>
    </div>
  )
}
