import { Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, CloudflareEnv } from '@/src/db';
import { socialProfiles } from '@/src/db/schema';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for this portfolio website. Learn how we handle your data.',
};

export default async function PrivacyPage() {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env.DB);
  
  const [socials, settings] = await Promise.all([
    db.select().from(socialProfiles),
    import('@/src/db/queries').then(m => m.getCachedSiteSettings(env.DB))
  ]);

  return (
    <main className="min-h-screen bg-dark-900 overflow-hidden">
      <Navbar settings={settings} />

      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-[var(--font-heading)]">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-dark-200 mt-4">Last updated: June 2026</p>
          </div>

          <div className="prose-dark space-y-8">
            <div className="glass-card rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">1. Introduction</h2>
              <p>
                Welcome to Raksha&apos;s portfolio website. This privacy policy explains how we collect,
                use, and protect your personal information when you visit our website or interact with our services.
              </p>
              <p>
                Your privacy is important to us, and we are committed to protecting any personal data you share
                with us through this website.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 text-dark-200 ml-4">
                <li><strong className="text-white">Contact Form Data:</strong> Name, email address, and message content when you submit the contact form.</li>
                <li><strong className="text-white">Usage Data:</strong> Anonymous analytics data such as page views, browser type, and device information.</li>
                <li><strong className="text-white">Cookies:</strong> We may use cookies for essential website functionality and analytics.</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">3. How We Use Your Information</h2>
              <p>The information we collect is used for:</p>
              <ul className="list-disc list-inside space-y-2 text-dark-200 ml-4">
                <li>Responding to your inquiries and messages</li>
                <li>Improving our website and content</li>
                <li>Understanding how visitors use our website</li>
                <li>Sending relevant updates if you&apos;ve opted in</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">4. Data Protection</h2>
              <p>
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. Your data is stored securely
                and is only accessible to authorized personnel.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">5. Third-Party Services</h2>
              <p>
                This website may use third-party services such as analytics providers and hosting services.
                These services may collect anonymous data to help us understand website performance and user behavior.
                We do not sell or share your personal data with third parties for marketing purposes.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-dark-200 ml-4">
                <li>Request access to your personal data</li>
                <li>Request correction or deletion of your data</li>
                <li>Withdraw consent for data processing</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">7. Contact</h2>
              <p>
                If you have any questions about this privacy policy or wish to exercise your rights,
                please contact us through our{' '}
                <a href="/contact" className="text-accent-400 hover:text-accent-300 underline underline-offset-4">
                  contact page
                </a>.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-[var(--font-heading)]">8. Changes to This Policy</h2>
              <p>
                We reserve the right to update this privacy policy at any time. Changes will be posted
                on this page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer socials={socials} settings={settings} />
    </main>
  );
}
