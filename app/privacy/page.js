export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2" style={{color:'#1A2744'}}>Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: April 2026</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold mb-2" style={{color:'#1A2744'}}>1. Information We Collect</h2>
          <p>We collect information you provide when creating an account (name, email, phone), information from identity verification (government ID, selfie photos), trip and shipment listing data, all messages sent through our platform, and device and usage data for security purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2" style={{color:'#1A2744'}}>2. How We Use Your Information</h2>
          <p>We use your information to operate the platform, match Senders with Travelers, process payments, verify identities, resolve disputes, prevent fraud, comply with legal obligations, and improve our services. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2" style={{color:'#1A2744'}}>3. Message Storage & Monitoring</h2>
          <p>All messages sent through Inambebar are stored on our servers and may be reviewed by our team for safety and dispute resolution. Users are informed of this at the time of messaging. Message data is retained for a minimum of 3 years or as required by law.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2" style={{color:'#1A2744'}}>4. Identity Verification Data</h2>
          <p>Identity documents and biometric data collected during verification are stored securely and used solely for verification purposes. This data may be disclosed to law enforcement upon valid legal request.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2" style={{color:'#1A2744'}}>5. Data Sharing</h2>
          <p>We share data with payment processors (Stripe), identity verification services, and cloud infrastructure providers. We may disclose data to law enforcement, regulatory bodies, or courts when required by law or to protect the safety of our users.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2" style={{color:'#1A2744'}}>6. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data by contacting us. Note that some data may be retained for legal compliance reasons even after account deletion.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2" style={{color:'#1A2744'}}>7. Cookies</h2>
          <p>We use essential cookies for authentication and security. We do not use advertising or tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2" style={{color:'#1A2744'}}>8. Contact</h2>
          <p>For privacy inquiries: <a href="mailto:privacy@inambebar.com" className="underline" style={{color:'#E07B29'}}>privacy@inambebar.com</a></p>
        </section>
      </div>
    </div>
  )
}
