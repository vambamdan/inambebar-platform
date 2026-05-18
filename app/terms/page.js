import Link from 'next/link'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-3xl mx-auto px-4 py-14">

      <h1 className="text-3xl font-black mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>Terms of Service</h1>
      <p className="text-sm mb-2" style={{ color: FG3 }}>Last updated: April 2026</p>

      {/* Trilingual legal notice */}
      <div className="rounded-xl px-4 py-3 mb-6 text-xs leading-relaxed"
        style={{ background: 'rgba(224,123,41,0.06)', border: '1px solid rgba(224,123,41,0.18)', color: '#F5B380' }}>
        <p className="mb-1">This legal document is available in English only. The English version is the legally binding version.</p>
        <p className="mb-1" dir="rtl" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>این سند قانونی فقط به زبان انگلیسی در دسترس است. نسخه انگلیسی از نظر قانونی الزام‌آور است.</p>
        <p>Bu hukuki belge yalnızca İngilizce olarak mevcuttur. İngilizce sürüm yasal olarak bağlayıcıdır.</p>
      </div>

      <p className="text-sm mb-10 leading-relaxed" style={{ color: FG3 }}>
        By creating an account on Inambebar you agree to these terms in full. If you do not agree, do not use the platform.
      </p>

      <div className="space-y-10 leading-relaxed" style={{ color: FG2 }}>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>1. What Inambebar Is</h2>
          <p className="text-sm">Inambebar is a technology marketplace that connects individuals who wish to send packages (&ldquo;Senders&rdquo;) with travelers who have available luggage space (&ldquo;Travelers&rdquo;). Inambebar does not ship, carry, own, inspect, or handle any packages. We are a platform only. All physical transactions are between Senders and Travelers directly.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>2. Eligibility &amp; Identity</h2>
          <p className="mb-3 text-sm">You must be at least 18 years old to use Inambebar. By creating an account you confirm that all information provided is accurate, complete, and belongs to you.</p>
          <p className="text-sm">Inambebar operates a mandatory Know Your Customer (KYC) process. All users must complete identity verification before posting trips or shipment requests. Unverified users may browse but cannot transact. Providing false identity documents is grounds for immediate permanent termination and may be reported to relevant authorities.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>3. KYC &amp; Identity Verification</h2>
          <p className="mb-3 text-sm">To complete verification you must submit a valid government-issued photo ID (passport, national ID card, or driver&apos;s license) and a live selfie. Your identity documents are stored securely and used solely for verification and dispute resolution.</p>
          <p className="text-sm">Verified users receive a blue checkmark on their profile. Verification may be revoked at any time if we discover the submitted documents were fraudulent or if account activity suggests identity misrepresentation.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>4. Shipment Declaration &amp; Sender Responsibility</h2>
          <p className="mb-3 text-sm">Senders must accurately and completely declare the contents, category, weight, and approximate value of every package. This declaration is stored permanently as a legal record. By submitting a shipment request, Senders confirm under their verified identity that the declaration is truthful.</p>
          <p className="mb-3 text-sm">Senders are solely and exclusively responsible for:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Ensuring package contents comply with all applicable laws</li>
            <li>Compliance with customs import/export regulations of the origin, transit, and destination countries</li>
            <li>Compliance with airline and IATA regulations</li>
            <li>Proper packaging and sealing of items</li>
            <li>Accurate declaration of the commercial value of goods</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>5. Traveler Responsibility</h2>
          <p className="mb-3 text-sm">Travelers are responsible for:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
            <li>Physically inspecting and photographing every package at the point of handoff</li>
            <li>Refusing any package they are not comfortable carrying</li>
            <li>Declaring all carried goods truthfully to customs authorities</li>
            <li>Complying with all airline baggage policies</li>
            <li>Never carrying packages that are unsealed, appear tampered with, or whose contents they cannot verify</li>
          </ul>
          <p className="font-semibold text-sm" style={{ color: FG1 }}>Travelers who carry packages on behalf of Senders remain legally responsible for the contents of their luggage under the laws of every country they transit through. Inambebar accepts no liability for customs seizures, fines, or legal proceedings arising from the contents of carried packages.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>6. Absolutely Prohibited Items</h2>
          <div className="rounded-xl p-5 mb-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)' }}>
            <p className="font-bold text-sm mb-2" style={{ color: '#FCA5A5' }}>The following items are strictly prohibited on Inambebar under any circumstances:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: '#FCA5A5' }}>
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
          <p className="text-sm" style={{ color: FG2 }}>Violation of this clause results in immediate permanent account termination and mandatory reporting to law enforcement in all relevant jurisdictions. Inambebar maintains full records of all user identity documents and communications, which will be provided to authorities upon request.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: FG1 }}>7. Flight Route Customs Regulations</h2>
          <p className="mb-4 text-sm" style={{ color: FG2 }}>All parties must comply with the customs and aviation regulations of every country on their route. The following is a summary of key regulations on the most common Inambebar corridors. This is a summary only — users are responsible for verifying current regulations with official sources before transacting.</p>

          <div className="space-y-4">
            {[
              {
                flag: '🇮🇷', title: 'Iranian Customs (All Routes Into Iran)',
                items: [
                  'Duty-free personal goods allowance: approximately €80 per passenger for air travel',
                  'Goods exceeding €80 require customs declaration and duty payment',
                  'Commercial quantities of any item are subject to full import duties and permits',
                  'Prohibited imports: alcohol, pork products, gambling equipment, anti-government material, pornography, satellite equipment (without permit), certain medications without prescription',
                  'Electronics: one laptop, one mobile phone, and one camera are generally permitted duty-free. Additional items require declaration and may incur duties',
                  'Gold and jewellery: declared if exceeding personal use quantities',
                  'Foreign currency: amounts above $10,000 USD equivalent must be declared',
                  'Medications: prescription medications must be accompanied by a prescription. Quantities must not exceed personal use (generally 3 months supply)',
                ],
              },
              {
                flag: '🇹🇷', title: 'Turkey (Istanbul — IST) Transit & Entry',
                items: [
                  'Istanbul is the most common transit hub for Iran-Europe and Iran-North America routes',
                  'Transit passengers (not clearing immigration) do not pass through Turkish customs but baggage must comply with IATA regulations',
                  'Passengers clearing Turkish customs: €430 duty-free allowance for goods from non-EU countries',
                  'Prohibited: narcotics, weapons, counterfeit goods, certain medications without prescription',
                  'Turkish Airlines strictly enforces IATA dangerous goods regulations — lithium batteries, flammables, and pressurised containers are heavily restricted in checked baggage',
                ],
              },
              {
                flag: '🇦🇪', title: 'UAE (Dubai — DXB) Transit & Entry',
                items: [
                  'Dubai is a major hub for Iran-Africa, Iran-Asia, and Iran-Western routes',
                  'Transit passengers through Dubai International do not clear UAE customs',
                  'UAE prohibited items (relevant to transit): narcotics, pork products, pornographic material, certain medications (codeine, tramadol require prescription), gambling equipment, counterfeit goods',
                  'Alcohol: permitted in personal quantities for non-Muslim adults entering UAE; not applicable to Iran-bound packages',
                  'Duty-free allowance for UAE entry: AED 3,000 (~$800 USD) for personal goods',
                  'Strict enforcement of narcotics — trace amounts can result in arrest under UAE law',
                ],
              },
              {
                flag: '🇩🇪', title: 'Germany / 🇪🇺 EU (Frankfurt — FRA, Amsterdam — AMS)',
                items: [
                  'EU duty-free threshold: €150 for goods imported from outside the EU (this applies to accompanied goods)',
                  'Goods above €150 require customs declaration and VAT/duty payment',
                  'Prohibited EU imports: narcotics, endangered species products, counterfeit goods, certain plant/food products without phytosanitary certificate',
                  'Medications: personal quantities with prescription generally permitted. Commercial quantities require import permits',
                  'Cash: amounts above €10,000 must be declared at EU border',
                  'GDPR note: biometric and identity data of EU-resident users is processed in compliance with GDPR',
                ],
              },
              {
                flag: '🇬🇧', title: 'United Kingdom (London — LHR)',
                items: [
                  'Post-Brexit duty-free allowance: £135 for goods (no customs duty below this threshold, but VAT may apply)',
                  'Restricted items: certain food products, plant materials, medications in excess of personal supply',
                  'Prohibited: narcotics, weapons, counterfeit goods, endangered species products',
                  'Cash: amounts above £10,000 must be declared',
                ],
              },
              {
                flag: '🇨🇦', title: 'Canada (Toronto — YYZ)',
                items: [
                  'Canadian residents returning: CAD $800 duty-free exemption after 48+ hours abroad. Goods carried for others do NOT qualify for this exemption and must be declared separately',
                  'Prohibited Canadian imports: narcotics, certain weapons, hate material, products from sanctioned countries (note: Canada maintains sanctions related to Iran — users must verify current SEMA regulations)',
                  'Medications: personal supply with prescription. Controlled substances require special permits',
                  'Food: fresh fruits, vegetables, meat, and dairy products face strict import restrictions — CFIA inspection required',
                  'Carrying goods for others: Canadian Border Services Agency (CBSA) requires declaration of all goods being carried on behalf of third parties. Failure to declare is a criminal offence',
                ],
              },
              {
                flag: '🇶🇦', title: 'Qatar (Doha — DOH)',
                items: [
                  'Qatar Airways is a common connection for Iran routes via Doha',
                  'Transit passengers do not clear Qatari customs',
                  'Qatar prohibited items: narcotics, pork products, alcohol (for Muslims), pornographic material, gambling equipment, certain medications',
                  'Qatar maintains strict drug enforcement — any trace amounts may result in prosecution',
                ],
              },
              {
                flag: '✈️', title: 'IATA Dangerous Goods — All Flights',
                items: [
                  'The IATA Dangerous Goods Regulations apply to all commercial flights regardless of route',
                  'Lithium batteries: loose lithium batteries prohibited in checked baggage. Devices with batteries permitted in carry-on with restrictions on watt-hours',
                  'Flammable liquids and gases: prohibited in checked baggage (aerosols, lighter fluid, paint)',
                  'Pressurised containers: prohibited unless specifically permitted (e.g. medical oxygen with airline permission)',
                  'Magnetised materials, corrosives, and oxidisers: prohibited without special airline approval',
                  'Travelers are legally responsible for ensuring carried packages do not contain any IATA-prohibited dangerous goods, regardless of what the Sender has declared',
                ],
              },
            ].map(({ flag, title, items }) => (
              <div key={title} className="rounded-xl p-5" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                <h3 className="font-bold text-sm mb-3" style={{ color: FG1 }}>{flag} {title}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: FG2 }}>
                  {items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>8. Message Monitoring &amp; Evidence</h2>
          <p className="text-sm">All messages sent through Inambebar&apos;s in-platform chat are stored permanently and may be reviewed by Inambebar for safety, fraud prevention, and dispute resolution. By using our messaging system, you explicitly consent to this monitoring. Complete message histories, including timestamps and user identity records, will be provided to law enforcement upon valid legal request and may be used as evidence in legal proceedings.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>9. Photo Documentation</h2>
          <p className="text-sm">Both parties are required to photograph packages at the point of handoff using the Inambebar platform. These photographs are timestamped, geotagged where possible, and stored permanently. Refusal to participate in photo documentation gives the other party grounds to cancel the transaction and, in cases of suspected fraud, to initiate a formal dispute.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>10. Payments &amp; Fees</h2>
          <p className="text-sm">During the launch period (first 6 months from the date of this agreement), Inambebar charges no platform commission. After the launch period, a platform service fee applies to all completed transactions. The fee rate will be communicated with at least 30 days notice before it takes effect. The first 200 registered and verified members (&ldquo;Founding Members&rdquo;) receive a permanently reduced lifetime rate.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>11. Disputes &amp; Liability</h2>
          <p className="mb-3 text-sm">Inambebar provides a dispute resolution process for transactions that go wrong. In a dispute, both parties&apos; message histories, shipment declarations, handoff photos, and identity records will be reviewed. Inambebar&apos;s decision in a dispute is final.</p>
          <p className="text-sm">Inambebar is not liable for lost, stolen, damaged, or confiscated packages. We are not responsible for customs seizures, fines, legal proceedings, or any loss arising from the actions of users. All users transact at their own risk. Inambebar&apos;s maximum liability to any user is limited to the platform service fee paid in connection with the disputed transaction.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>12. Termination &amp; Reporting</h2>
          <p className="text-sm">Inambebar reserves the right to permanently terminate any account at any time for violation of these Terms, suspicious activity, fraudulent behaviour, or failure to comply with KYC requirements. In cases involving suspected criminal activity — including customs fraud, drug trafficking, or theft — Inambebar will proactively report the user&apos;s verified identity and full activity record to the relevant authorities without prior notice to the user.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>13. Governing Law</h2>
          <p className="mb-3 text-sm">These Terms are governed by the laws of the Federal Republic of Germany, excluding its conflict-of-law provisions. Any disputes arising from use of Inambebar that cannot be resolved through our internal dispute process shall be subject to the exclusive jurisdiction of the competent courts in Germany.</p>
          <p className="text-sm" style={{ color: FG3 }}>If you are a consumer habitually resident in another EU member state, you retain the protection of the mandatory consumer protection provisions of your country of residence, and may bring proceedings in the courts of that country.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{ color: FG1 }}>14. Contact</h2>
          <p className="text-sm">Legal: <a href="mailto:legal@inambebar.com" className="underline transition-opacity hover:opacity-80" style={{ color: '#E07B29' }}>legal@inambebar.com</a></p>
        </section>

      </div>
    </div>
    </div>
  )
}
