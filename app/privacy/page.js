export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{color:'#1A2744'}}>Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-1">Last updated: 30 April 2026</p>
      <p className="text-gray-400 text-sm mb-10">
        This policy is provided in accordance with Articles 13 and 14 of the EU General Data Protection Regulation (GDPR) and the German Federal Data Protection Act (BDSG).
      </p>

      <div className="space-y-8 text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>1. Data Controller</h2>
          <p className="mb-2">The data controller responsible for your personal data is:</p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <p className="font-semibold" style={{color:'#1A2744'}}>Inambebar</p>
            <p>Germany</p>
            <p>Email: <a href="mailto:privacy@inambebar.com" className="underline" style={{color:'#E07B29'}}>privacy@inambebar.com</a></p>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            We do not have a designated Data Protection Officer (DPO) as we do not meet the thresholds requiring mandatory DPO appointment under Art. 37 GDPR.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>2. What Data We Collect and Why</h2>

          <div className="space-y-4">

            <div className="border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-2" style={{color:'#1A2744'}}>Account Data</h3>
              <p className="text-sm mb-1"><strong>Data:</strong> Full name, email address, phone number, date of account creation.</p>
              <p className="text-sm mb-1"><strong>Purpose:</strong> Creating and managing your account; communicating with you about your account and transactions.</p>
              <p className="text-sm mb-1"><strong>Legal basis:</strong> Art. 6(1)(b) GDPR — processing is necessary for the performance of a contract (our Terms of Service) to which you are a party.</p>
              <p className="text-sm"><strong>Retention:</strong> For the duration of your account, plus 90 days after account deletion.</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-2" style={{color:'#1A2744'}}>Identity Verification (KYC) Data</h3>
              <p className="text-sm mb-1"><strong>Data:</strong> Government-issued photo ID (passport, national ID card, or driver's licence) and a selfie photograph.</p>
              <p className="text-sm mb-1"><strong>Purpose:</strong> Verifying your identity before you may post trips or shipment requests. This protects all platform users from fraud and impersonation, and allows us to fulfil obligations to report verified identities to law enforcement in cases of suspected criminal activity.</p>
              <p className="text-sm mb-1"><strong>Legal basis:</strong> Art. 6(1)(b) GDPR — processing is necessary to perform the contract (identity verification is a mandatory condition of platform use). Secondarily Art. 6(1)(f) — our legitimate interests in preventing fraud and ensuring platform safety.</p>
              <p className="text-sm mb-1"><strong>Retention:</strong> KYC documents are retained for 3 years after account deletion, after which they are permanently deleted. This retention period reflects our legal obligation to be able to cooperate with law enforcement in respect of transactions that may be under investigation.</p>
              <p className="text-sm mb-1"><strong>Note on biometric data:</strong> Your selfie is used only for manual visual comparison against your ID photograph by our review team. We do not use automated facial recognition software. Your selfie photograph is therefore not processed as biometric data within the meaning of Art. 9 GDPR.</p>
              <p className="text-sm"><strong>Storage:</strong> Stored on Supabase (Supabase Inc.), EU data centre (Frankfurt, Germany). A Data Processing Agreement is in place with Supabase.</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-2" style={{color:'#1A2744'}}>Trip and Shipment Listing Data</h3>
              <p className="text-sm mb-1"><strong>Data:</strong> Origin and destination cities, travel dates, available weight/space, package descriptions, declared item categories and values.</p>
              <p className="text-sm mb-1"><strong>Purpose:</strong> Operating the platform; matching Senders with Travelers; maintaining records of transactions for dispute resolution.</p>
              <p className="text-sm mb-1"><strong>Legal basis:</strong> Art. 6(1)(b) GDPR — contract performance.</p>
              <p className="text-sm"><strong>Retention:</strong> 3 years after the listing is closed or the account is deleted, whichever is later.</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-2" style={{color:'#1A2744'}}>Messages</h3>
              <p className="text-sm mb-1"><strong>Data:</strong> All messages sent through the Inambebar in-platform chat, including timestamps.</p>
              <p className="text-sm mb-1"><strong>Purpose:</strong> Facilitating communication between users; preserving evidence for dispute resolution; fraud prevention; compliance with legal requests from law enforcement.</p>
              <p className="text-sm mb-1"><strong>Legal basis:</strong> Art. 6(1)(b) GDPR — contract performance; Art. 6(1)(f) — legitimate interests in fraud prevention and platform safety.</p>
              <p className="text-sm"><strong>Retention:</strong> 3 years from the date the message was sent.</p>
            </div>

            <div className="border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-2" style={{color:'#1A2744'}}>Usage and Security Data</h3>
              <p className="text-sm mb-1"><strong>Data:</strong> IP address, browser type, pages visited, timestamps of login events.</p>
              <p className="text-sm mb-1"><strong>Purpose:</strong> Security monitoring, fraud detection, debugging.</p>
              <p className="text-sm mb-1"><strong>Legal basis:</strong> Art. 6(1)(f) GDPR — legitimate interests in platform security.</p>
              <p className="text-sm"><strong>Retention:</strong> 90 days.</p>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>3. Data Processors (Third Parties)</h2>
          <p className="text-sm mb-3">We use the following third-party data processors. Each is bound by a Data Processing Agreement with us and may only process your data on our documented instructions.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold border border-gray-100" style={{color:'#1A2744'}}>Processor</th>
                  <th className="text-left p-3 font-semibold border border-gray-100" style={{color:'#1A2744'}}>Purpose</th>
                  <th className="text-left p-3 font-semibold border border-gray-100" style={{color:'#1A2744'}}>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-100">Supabase Inc.</td>
                  <td className="p-3 border border-gray-100">Database, authentication, and file storage hosting</td>
                  <td className="p-3 border border-gray-100">EU (Frankfurt, Germany)</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-100">Resend Inc.</td>
                  <td className="p-3 border border-gray-100">Transactional email delivery</td>
                  <td className="p-3 border border-gray-100">USA (SCCs in place)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-100">Vercel Inc.</td>
                  <td className="p-3 border border-gray-100">Website hosting and deployment</td>
                  <td className="p-3 border border-gray-100">USA (SCCs in place)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">SCCs = EU Standard Contractual Clauses, an approved mechanism for lawful data transfer outside the EEA under Art. 46 GDPR.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>4. Disclosure to Authorities</h2>
          <p className="text-sm">We may disclose your personal data — including your verified identity documents, message history, and transaction records — to law enforcement, courts, or regulatory authorities when required to do so by applicable law, or where we have a good-faith belief that disclosure is necessary to prevent or report a crime. We do not proactively share your data with any government authority outside of these circumstances.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>5. Cookies</h2>
          <p className="text-sm">We use only technically necessary cookies required for authentication and security (session tokens). We do not use advertising, analytics tracking, or third-party cookies. No cookie consent banner is required as we rely solely on necessary cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>6. Your Rights Under GDPR</h2>
          <p className="text-sm mb-3">You have the following rights regarding your personal data. To exercise any of them, contact <a href="mailto:privacy@inambebar.com" className="underline" style={{color:'#E07B29'}}>privacy@inambebar.com</a>. We will respond within 30 days.</p>
          <div className="space-y-2 text-sm">
            {[
              { right: 'Right of access (Art. 15)', desc: 'Request a copy of all personal data we hold about you.' },
              { right: 'Right to rectification (Art. 16)', desc: 'Request correction of inaccurate or incomplete data.' },
              { right: 'Right to erasure (Art. 17)', desc: 'Request deletion of your data. Note: KYC documents may be retained for up to 3 years after account deletion as described in Section 2. Other data will be deleted promptly.' },
              { right: 'Right to restriction (Art. 18)', desc: 'Request that we restrict processing of your data in certain circumstances.' },
              { right: 'Right to data portability (Art. 20)', desc: 'Receive your account data in a machine-readable format.' },
              { right: 'Right to object (Art. 21)', desc: 'Object to processing based on our legitimate interests. We will cease processing unless we can demonstrate compelling legitimate grounds.' },
            ].map(item => (
              <div key={item.right} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-xs min-w-fit" style={{color:'#1A2744'}}>{item.right}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>7. Right to Lodge a Complaint</h2>
          <p className="text-sm mb-2">If you believe we are processing your personal data unlawfully, you have the right to lodge a complaint with the competent data protection supervisory authority.</p>
          <p className="text-sm mb-2">For users in Germany, the competent authority is the supervisory authority of the German federal state in which we are established. A directory of all German supervisory authorities is available at <a href="https://www.bfdi.bund.de" target="_blank" rel="noopener noreferrer" className="underline" style={{color:'#E07B29'}}>bfdi.bund.de</a>.</p>
          <p className="text-sm">Users in other EU member states may contact the supervisory authority of their country of habitual residence.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>8. Automated Decision-Making</h2>
          <p className="text-sm">We do not make any decisions about you solely by automated means that produce legal or similarly significant effects. Identity verification involves manual review by our team.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>9. Changes to This Policy</h2>
          <p className="text-sm">We may update this policy. If we make material changes, we will notify you by email or via a prominent notice on the platform at least 14 days before the change takes effect. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3" style={{color:'#1A2744'}}>10. Contact</h2>
          <p className="text-sm">For any privacy-related questions or to exercise your rights: <a href="mailto:privacy@inambebar.com" className="underline" style={{color:'#E07B29'}}>privacy@inambebar.com</a></p>
        </section>

      </div>
    </div>
  )
}
