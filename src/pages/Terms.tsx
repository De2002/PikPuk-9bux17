import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText } from "lucide-react";

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

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <div className="bg-foreground text-background">
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-background" />
          </div>
          <span className="text-xs font-sans uppercase tracking-widest text-background/50">Legal</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-background leading-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-background/50 font-sans text-sm">Last updated: July 2026</p>
      </div>
    </div>

    {/* Content */}
    <div className="max-w-3xl mx-auto px-6 py-14 space-y-12">

      <p className="font-sans text-base text-foreground/70 leading-relaxed border-l-4 border-border pl-5">
        By accessing or using PikPuk ("the Service"), you agree to be bound by these Terms of Service.
        Please read them carefully before using the platform. If you do not agree to these terms,
        you may not use the Service.
      </p>

      <Section title="1. Use of the Service">
        <p>
          PikPuk provides a free online library of classical literature for personal, non-commercial reading
          purposes. You may use the Service to read, browse, and bookmark works as permitted by these terms.
        </p>
        <p>
          You agree not to use the Service to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Reproduce, distribute, or republish any content from the Service without permission.</li>
          <li>Attempt to gain unauthorized access to any part of the platform or its infrastructure.</li>
          <li>Use automated tools, bots, or scrapers to extract content in bulk.</li>
          <li>Engage in any activity that disrupts, damages, or impairs the Service.</li>
          <li>Violate any applicable local, national, or international law or regulation.</li>
        </ul>
      </Section>

      <Section title="2. User Accounts">
        <p>
          You may create a free account to access features such as bookmarking. You are responsible for
          maintaining the confidentiality of your account credentials and for all activity that occurs
          under your account.
        </p>
        <p>
          You agree to provide accurate information when creating an account and to notify us promptly
          of any unauthorized use. PikPuk reserves the right to suspend or terminate accounts that
          violate these terms.
        </p>
      </Section>

      <Section title="3. Intellectual Property">
        <p>
          The literary works available on PikPuk are in the public domain and are reproduced for free
          public access. All original site content — including design, branding, annotations, synopses,
          and editorial text — is the property of PikPuk and may not be reproduced without prior
          written consent.
        </p>
        <p>
          "PikPuk," the PikPuk logo, and related marks are trademarks of the PikPuk Classics Library.
          Unauthorized use of these marks is prohibited.
        </p>
      </Section>

      <Section title="4. Content Accuracy">
        <p>
          We make reasonable efforts to ensure the accuracy of literary texts and editorial content on
          PikPuk. However, we cannot guarantee that all content is error-free. If you identify an
          inaccuracy, please contact us so we can investigate.
        </p>
        <p>
          PikPuk does not warrant that the Service will be uninterrupted, error-free, or free of
          harmful components. Use of the Service is at your own risk.
        </p>
      </Section>

      <Section title="5. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, PikPuk and its operators shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages arising out of or related to
          your use of the Service, even if advised of the possibility of such damages.
        </p>
        <p>
          Our total liability for any claim arising from these terms or your use of the Service shall not
          exceed the amount you paid us in the twelve months preceding the claim (if any).
        </p>
      </Section>

      <Section title="6. Third-Party Services">
        <p>
          The Service may contain links to third-party websites or services not operated by PikPuk.
          We have no control over and accept no responsibility for the content or practices of
          third-party sites. Accessing such links is at your own risk.
        </p>
      </Section>

      <Section title="7. Modifications to Terms">
        <p>
          PikPuk reserves the right to modify these Terms of Service at any time. We will indicate the
          date of the most recent revision at the top of this page. Your continued use of the Service
          following any changes constitutes acceptance of the updated terms.
        </p>
      </Section>

      <Section title="8. Governing Law">
        <p>
          These terms shall be governed by and construed in accordance with applicable law. Any disputes
          arising from these terms or your use of the Service shall be resolved through good-faith
          negotiation before any formal legal proceedings.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          If you have any questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:hello@pikpuk.com" className="underline underline-offset-2 text-foreground hover:text-foreground/70 transition-colors">
            hello@pikpuk.com
          </a>.
        </p>
      </Section>
    </div>

    <Footer />
  </div>
);

export default Terms;
