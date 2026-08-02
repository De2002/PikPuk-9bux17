import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield } from "lucide-react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <section className="space-y-4">
    <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
    <div className="h-px bg-border" />
    <div className="space-y-3 font-sans text-sm text-foreground/75 leading-[1.85]">
      {children}
    </div>
  </section>
);

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <div className="bg-foreground text-background">
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-background" />
          </div>
          <span className="text-xs font-sans uppercase tracking-widest text-background/50">Legal</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-background leading-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-background/50 font-sans text-sm">Last updated: July 2026</p>
      </div>
    </div>

    {/* Content */}
    <div className="max-w-3xl mx-auto px-6 py-14 space-y-12">

      <p className="font-sans text-base text-foreground/70 leading-relaxed border-l-4 border-border pl-5">
        Your privacy matters to us. This Privacy Policy explains what information PikPuk collects,
        how we use it, and what choices you have. We aim to collect only what is necessary and
        to be fully transparent about how it is handled.
      </p>

      <Section title="1. Information We Collect">
        <p><strong className="text-foreground font-semibold">Account information:</strong>{" "}
          When you create an account, we collect your email address and a username you choose.
          We do not collect your name, phone number, or payment information.
        </p>
        <p><strong className="text-foreground font-semibold">Reading activity:</strong>{" "}
          We store bookmarks you save. We may store which chapters you have read to support
          a "resume reading" feature. This data is associated with your account and
          never shared with third parties.
        </p>
        <p><strong className="text-foreground font-semibold">Guest usage:</strong>{" "}
          If you read without an account, we store limited data in your browser's local storage —
          specifically, a count and timestamp of short stories read in the current week.
          This data never leaves your device and is not sent to our servers.
        </p>
        <p><strong className="text-foreground font-semibold">Technical data:</strong>{" "}
          Our hosting infrastructure may automatically collect standard server logs including
          IP addresses, browser type, and pages accessed. This data is used only for security
          monitoring and aggregate performance analysis.
        </p>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide and maintain your account and saved bookmarks.</li>
          <li>To send account-related emails (e.g., sign-in verification codes).</li>
          <li>To improve the Service based on aggregate, anonymised usage patterns.</li>
          <li>To detect and prevent abuse, fraud, or security incidents.</li>
          <li>To comply with legal obligations where required.</li>
        </ul>
        <p>
          We do not sell your personal data. We do not use your data for advertising or
          share it with marketing partners.
        </p>
      </Section>

      <Section title="3. Data Storage and Security">
        <p>
          Your account data is stored securely using Supabase, a PostgreSQL-based cloud database
          service. All data is encrypted at rest and in transit using TLS. Access to your personal
          data is restricted to authenticated requests and enforced by row-level security policies.
        </p>
        <p>
          While we take reasonable technical measures to protect your information, no system is
          entirely immune to security threats. We encourage you to use a strong, unique password
          for your account.
        </p>
      </Section>

      <Section title="4. Data Retention">
        <p>
          We retain your account and bookmark data for as long as your account is active.
          If you delete your account, your personal data will be permanently removed from
          our systems within 30 days, except where retention is required by law.
        </p>
        <p>
          Server logs are retained for a maximum of 90 days and then deleted.
        </p>
      </Section>

      <Section title="5. Cookies and Local Storage">
        <p>
          PikPuk does not use advertising cookies or third-party tracking cookies. We use:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-foreground font-semibold">Authentication tokens:</strong>{" "}
            Stored in browser local storage to keep you signed in across sessions.
          </li>
          <li>
            <strong className="text-foreground font-semibold">Guest reading state:</strong>{" "}
            A weekly counter stored in local storage to track short story access for
            non-authenticated users. No personal identifiers are stored.
          </li>
        </ul>
        <p>
          You can clear local storage at any time through your browser settings. This will
          sign you out of your account.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Object to or restrict certain processing of your data.</li>
          <li>Receive a copy of your data in a portable format.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:hello@pikpuk.com" className="underline underline-offset-2 text-foreground hover:text-foreground/70 transition-colors">
            hello@pikpuk.com
          </a>.
          We will respond within 30 days.
        </p>
      </Section>

      <Section title="7. Children's Privacy">
        <p>
          PikPuk is not directed at children under the age of 13. We do not knowingly collect
          personal information from children under 13. If you believe a child has provided
          us with personal data, please contact us and we will delete it promptly.
        </p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will update the
          "last updated" date at the top of this page. For significant changes, we may also
          notify account holders by email.
        </p>
        <p>
          Your continued use of the Service after any changes constitutes acceptance of the
          revised Privacy Policy.
        </p>
      </Section>

      <Section title="9. Contact Us">
        <p>
          If you have questions or concerns about this Privacy Policy or how we handle your data,
          please contact us at{" "}
          <a href="mailto:hello@pikpuk.com" className="underline underline-offset-2 text-foreground hover:text-foreground/70 transition-colors">
            hello@pikpuk.com
          </a>.
        </p>
      </Section>
    </div>

    <Footer />
  </div>
);

export default Privacy;
