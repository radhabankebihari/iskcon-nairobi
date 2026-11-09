import { templeInfo } from "@/data/site";
import { withSeo } from "@/lib/seo";

export const metadata = withSeo({
  title: "Privacy Policy",
  description: "Privacy policy for the ISKCON Nairobi website.",
}, "/privacy");

const lastUpdated = "November 9, 2026";
const platformUrl = "https://iskconnairobi.com";
const templeAddress = templeInfo.addressLines.join(", ");

const parseClauseTitle = (title: string) => {
  const match = title.match(/^(\d+(?:\.\d+)*)\.\s+(.+)$/);
  return {
    number: match?.[1] ?? "",
    label: match?.[2] ?? title,
  };
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const sectionId = (title: string) => {
  const { number, label } = parseClauseTitle(title);
  const numberPart = number.replace(/\./g, "-");
  return `section-${numberPart}-${slugify(label)}`;
};

const subClauseNumber = (title: string, index: number) => {
  const { number } = parseClauseTitle(title);
  return `${number}.${index + 1}`;
};

const subClauseId = (title: string, index: number) => {
  const { label } = parseClauseTitle(title);
  return `section-${subClauseNumber(title, index).replace(/\./g, "-")}-${slugify(label)}`;
};

const dataCategories = [
  ["Identity data", "Full name and, where relevant for children's programmes, date of birth.", "Provided directly by you."],
  ["Contact data", "Email address, phone number, physical address, or postal address.", "Provided directly by you."],
  ["Transaction data", "Donation or seva amount, payment reference, payment method metadata, order or booking history.", "Generated through website use or payment processors."],
  ["Account data", "Username, password credentials where accounts exist, and account preferences.", "Provided directly by you."],
  ["Engagement data", "Event RSVPs, course applications, volunteer sign-ups, newsletter subscriptions, and programme interests.", "Provided directly by you."],
  ["Communications", "Messages, prayer requests, testimonials, support queries, and contact-form submissions.", "Provided directly by you."],
  ["Media data", "Photographs, video, livestream footage, audio recordings, testimonials, and public event images.", "Captured at Temple programmes or submitted by you."],
  ["Technical data", "Page-view data and approximate city from hosting network headers where available.", "Collected automatically when you browse."],
  ["Children's data", "Parent or guardian contact details, emergency contacts, age/date of birth where needed, programme attendance, and relevant medical or allergy notes.", "Provided by a parent, guardian, or authorized programme contact."],
  ["Sensitive data", "Religious interest inherent to the website's purpose and, only where voluntarily provided, dietary, allergy, health, prayer, pastoral, or safeguarding information relevant to a service request.", "Provided directly by you or by a parent/guardian with consent."],
];

const legalBasis = [
  ["Processing donations, seva payments, bookings, and orders", "Performance of a contract, consent, or legitimate interest."],
  ["Managing accounts or login features", "Performance of a contract."],
  ["Sending event, festival, programme, and newsletter updates", "Consent or legitimate interest for existing engaged users, with opt-out available."],
  ["Responding to enquiries, prayer requests, and support messages", "Consent or legitimate interest."],
  ["Improving and securing the website", "Legitimate interest, subject to cookie preferences where required."],
  ["Maintaining accounting, tax, and compliance records", "Legal obligation."],
  ["Preventing fraud, abuse, or unauthorized access", "Legitimate interest and legal obligation."],
  ["Photographing, filming, livestreaming, or archiving public Temple events", "Legitimate interest, consent where required, and religious/community purpose."],
  ["Managing children, youth, safeguarding, and emergency information", "Consent, explicit consent where needed, vital interests, legitimate interest, and legal obligation."],
  ["Processing sensitive or special-category data", "Explicit consent or voluntary public disclosure where applicable."],
];

const privacySections = [
  {
    title: "1. Who We Are",
    content: [
      `${templeInfo.name}, also known as ${templeInfo.legalName}, operates ${platformUrl} from ${templeAddress}.`,
      "If ISKCON Nairobi publishes additional registered entity details, registration numbers, or statutory status information, those details will be read together with this Policy.",
      "For personal data collected through this website, ISKCON Nairobi acts as the data controller unless a third-party service states otherwise.",
      "We process personal data in accordance with Kenya's Data Protection Act, 2019 and its subsidiary regulations, as administered by the Office of the Data Protection Commissioner.",
      `Privacy contact: ${templeInfo.email}.`,
    ],
  },
  {
    title: "3. How We Collect Data",
    content: [
      "On the current website, contact and guest-house enquiries, Kirtan Safari interest and registration submissions, push subscription preferences, and basic page-view and app-install events are sent from the website server to Google Sheets through Google Apps Script. The Sheet contains the submitted details and event timestamps; website analytics records the page path and an approximate city when the hosting provider supplies one.",
      "We collect data directly from you when you submit forms, register interest, make an enquiry, request prayer or blessings, sign up to volunteer, subscribe to updates, book an event, apply for a course, or contact us.",
      "We may collect data from a parent or guardian where a child is enrolled in a youth programme, class, festival service, retreat, or other supervised activity.",
      "We may collect photographs, video, audio, and livestream footage during Temple programmes, festivals, kirtans, classes, processions, community service, and other public events.",
      "We may collect limited technical data automatically through cookies, analytics, logs, and similar technologies when you browse the website, open a page, or install the website as an app.",
      "We may receive confirmation data from third parties such as payment processors, registration forms, email tools, messaging platforms, or social media services when you choose to use those services.",
    ],
  },
  {
    title: "5. Payment Data",
    content: [
      "We do not store complete debit or credit card numbers, CVV codes, M-Pesa PINs, or other full payment credentials on this website.",
      "Where payments are enabled, they are processed through third-party providers such as mobile money, card, bank-transfer, or other payment gateways. Those providers apply their own security standards, terms, and privacy policies.",
      "We may retain transaction metadata such as amount, date, purpose, payer contact information, and transaction reference for receipts, accounting, donor records, fraud prevention, and legal compliance.",
      "If a transaction appears fraudulent, unauthorized, reversed, or disputed, we may retain related records and share necessary information with payment processors, banks, mobile-money providers, law enforcement, regulators, or professional advisors.",
    ],
  },
  {
    title: "6. How We Share Data",
    content: [
      "We do not sell personal data.",
      "Google processes the website's form, push-subscription and basic analytics records through Google Sheets and Apps Script. The hosting provider processes requests needed to serve the website and its forms.",
      "We may share personal data with payment processors and financial institutions to complete transactions; service providers who support website hosting, email, SMS, WhatsApp, analytics, CRM, forms, security, or automation; ISKCON governing bodies where needed for coordination, reporting, festivals, safeguarding, or governance; regulators and authorities where required by Kenyan law; and professional advisors such as auditors or lawyers.",
      "Service providers who process personal data for us are expected to be bound by appropriate confidentiality, security, and data-processing obligations before receiving personal data.",
      "Where a service provider is located outside Kenya, we take reasonable steps to ensure appropriate safeguards are applied, consistent with Kenya's cross-border transfer requirements.",
    ],
  },
  {
    title: "7. Data Retention",
    content: [
      "We retain personal data only for as long as necessary for the purposes described in this Policy, including legal, accounting, reporting, dispute-resolution, and security requirements.",
      "Our approved retention target is 24 months for contact and guest-house enquiries and event registration or interest submissions in the website's Google Sheet, subject to legal obligations or active disputes. Automated cleanup is not yet active; contact us to request review or deletion of older records.",
      "Our approved retention target is 12 months for basic website analytics records in the Google Sheet. Automated cleanup is not yet active; contact us about older records.",
      "Donation and financial transaction records may be retained according to Kenyan financial and tax record-keeping requirements, generally for at least five to seven years where applicable.",
      "Account data is retained while an account is active and for a reasonable period after closure. Marketing and newsletter data is retained until you unsubscribe or withdraw consent.",
      "Prayer requests, pastoral communications, allergy notes, child programme details, safeguarding information, and other sensitive communications are retained only as long as needed for their purpose, then deleted, anonymized, or securely archived where legal or safeguarding obligations require retention.",
      "Media files may be retained for religious, historical, archival, educational, reporting, or promotional purposes unless removal is requested and removal is practical, lawful, and proportionate.",
    ],
  },
  {
    title: "8. Your Rights",
    content: [
      "Under Kenya's Data Protection Act, 2019, you have the right to be informed of how your personal data is used, access personal data we hold about you, object to processing, request correction of false or misleading data, request deletion of false or misleading data, and withdraw consent where processing is based on consent.",
      `To exercise these rights, contact ${templeInfo.email}. We will respond within the timeframe required by law.`,
      "You may opt out of direct marketing messages through the unsubscribe link, reply instructions, or by contacting us. Service, safety, transaction, event-change, or legal notices may still be sent where necessary.",
      "Parents and guardians may contact us about personal data relating to their children, subject to verification and applicable safeguarding or legal retention duties.",
      "If you are not satisfied with our response, you may lodge a complaint with the Office of the Data Protection Commissioner in Kenya.",
    ],
  },
  {
    title: "9. Cookies and Tracking Technologies",
    content: [
      "The website may use cookies and similar technologies to enable core functionality, remember preferences, understand usage, improve performance, secure the website, and support event or programme communication.",
      "If we use analytics, advertising, retargeting, embedded social media, or similar non-essential tracking, we will provide an appropriate cookie notice or consent mechanism where required.",
      "You can control cookies through your browser settings and, where available, through a cookie consent tool on the website. Disabling non-essential cookies may affect some features.",
    ],
  },
  {
    title: "10. Data Security",
    content: [
      "We apply reasonable technical and organizational measures appropriate to the risk, including HTTPS encryption in transit, access controls, and restricted internal access to personal data on a need-to-know basis.",
      "We may preserve access logs, transaction records, form submissions, and security information where reasonably necessary to investigate fraud, cyber abuse, unauthorized access, safety incidents, safeguarding concerns, or legal claims.",
      "No digital system is completely secure. If a data breach is likely to result in risk to your rights, we will notify the Office of the Data Protection Commissioner and affected users as required by applicable Kenyan law.",
    ],
  },
  {
    title: "11. Children's Data",
    content: [
      "Where the website supports programmes for minors, such as Sunday school, youth programmes, training classes, retreats, transport, or festival service, we collect only the personal data necessary for that programme and require consent from a parent or legal guardian where required.",
      "Children's data may include emergency contacts, medical or allergy notes, attendance records, pick-up permissions, media consent preferences, and safeguarding information where necessary.",
      "Parents or guardians may contact us to review, correct, or request deletion of a minor's personal data, subject to records we are legally required to retain or must retain for safeguarding reasons.",
    ],
  },
  {
    title: "12. International Users",
    content: [
      "Although this website is operated from Kenya, it may be accessed by devotees, guests, and supporters outside Kenya.",
      "If you access the website from outside Kenya, your data may be processed in Kenya and in jurisdictions where our service providers operate, in accordance with this Policy and applicable safeguards.",
    ],
  },
  {
    title: "13. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, services, or legal requirements.",
      "The Last Updated date at the top of this Policy shows the most recent revision. Material changes may be communicated through a website notice or by email where appropriate.",
    ],
  },
  {
    title: "14. Media, Public Events, and Consent",
    content: [
      "Temple programmes and public events may be photographed, filmed, livestreamed, or recorded for religious, archival, educational, reporting, fundraising, and promotional purposes.",
      "If you do not want to appear in identifiable close-up media, you should notify the organizer where practical. We will make reasonable efforts to respect such requests, but wide crowd images, public processions, livestreams, and incidental appearances may not always be avoidable.",
      "Close-up promotional use of identifiable children should be based on parent or guardian consent unless another lawful basis applies.",
    ],
  },
];

const privacyToc = [
  privacySections[0].title,
  "2. Personal Data We Collect",
  privacySections[1].title,
  "4. Legal Basis and Purpose of Processing",
  ...privacySections.slice(2).map((section) => section.title),
  "15. Contact Us",
];

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-temple-bg pb-section pt-32 sm:pt-36">
        <div className="content-width section-padding">
          <div className="mx-auto max-w-4xl">
            <header className="mb-10">
              <span className="eyebrow block mb-3">How We Handle Data</span>
              <h1 className="section-title">
                Privacy<br />
                <em className="not-italic font-normal">Policy</em>
              </h1>
            </header>

            <div className="mb-10 border border-gold/20 bg-white p-6 shadow-sm">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-gold-ink">Last Updated</p>
              <p className="mt-2 font-display text-2xl text-ink">{lastUpdated}</p>
              <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">
                This Privacy Policy explains how ISKCON Nairobi collects, uses, shares, and protects personal data through this website and related digital services.
              </p>
            </div>

            <nav aria-labelledby="privacy-table-of-contents" className="mb-10 border border-temple-sand bg-temple-cream p-6">
              <h2 id="privacy-table-of-contents" className="font-display text-xl font-semibold text-ink">Table of Contents</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {privacyToc.map((title) => (
                  <a
                    key={title}
                    href={`#${sectionId(title)}`}
                    className="tap-target font-body text-sm leading-relaxed text-ink/75 underline decoration-gold/30 underline-offset-4 transition-colors hover:text-primary"
                  >
                    {title}
                  </a>
                ))}
              </div>
            </nav>

            <article className="space-y-10">
              <section className="border-b border-temple-sand pb-8">
                <h2 id={sectionId(privacySections[0].title)} className="scroll-mt-32 font-display text-2xl font-semibold text-ink">{privacySections[0].title}</h2>
                <div className="mt-4 space-y-3 font-body text-sm leading-relaxed text-ink/75">
                  {privacySections[0].content.map((item, index) => (
                    <p key={item} id={subClauseId(privacySections[0].title, index)} className="scroll-mt-32">
                      <span className="font-semibold text-ink">{subClauseNumber(privacySections[0].title, index)} </span>
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              <section className="border-b border-temple-sand pb-8">
                <h2 id={sectionId("2. Personal Data We Collect")} className="scroll-mt-32 font-display text-2xl font-semibold text-ink">2. Personal Data We Collect</h2>
                <div className="mt-5 overflow-x-auto card-surface">
                  <table className="w-full min-w-[680px] border-collapse text-left font-body text-xs text-ink/75">
                    <thead className="bg-temple-cream text-ink">
                      <tr>
                        <th className="border-b border-temple-sand px-4 py-3 font-semibold">Category</th>
                        <th className="border-b border-temple-sand px-4 py-3 font-semibold">Examples</th>
                        <th className="border-b border-temple-sand px-4 py-3 font-semibold">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataCategories.map(([category, examples, source]) => (
                        <tr key={category} className="border-b border-temple-sand last:border-b-0">
                          <td className="px-4 py-3 font-semibold text-ink">{category}</td>
                          <td className="px-4 py-3">{examples}</td>
                          <td className="px-4 py-3">{source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="border-b border-temple-sand pb-8">
                <h2 id={sectionId(privacySections[1].title)} className="scroll-mt-32 font-display text-2xl font-semibold text-ink">{privacySections[1].title}</h2>
                <div className="mt-4 space-y-3 font-body text-sm leading-relaxed text-ink/75">
                  {privacySections[1].content.map((item, index) => (
                    <p key={item} id={subClauseId(privacySections[1].title, index)} className="scroll-mt-32">
                      <span className="font-semibold text-ink">{subClauseNumber(privacySections[1].title, index)} </span>
                      {item}
                    </p>
                  ))}
                </div>
              </section>

              <section className="border-b border-temple-sand pb-8">
                <h2 id={sectionId("4. Legal Basis and Purpose of Processing")} className="scroll-mt-32 font-display text-2xl font-semibold text-ink">4. Legal Basis and Purpose of Processing</h2>
                <div className="mt-5 overflow-x-auto card-surface">
                  <table className="w-full min-w-[620px] border-collapse text-left font-body text-xs text-ink/75">
                    <thead className="bg-temple-cream text-ink">
                      <tr>
                        <th className="border-b border-temple-sand px-4 py-3 font-semibold">Purpose</th>
                        <th className="border-b border-temple-sand px-4 py-3 font-semibold">Legal Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {legalBasis.map(([purpose, basis]) => (
                        <tr key={purpose} className="border-b border-temple-sand last:border-b-0">
                          <td className="px-4 py-3 font-semibold text-ink">{purpose}</td>
                          <td className="px-4 py-3">{basis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {privacySections.slice(2).map((section) => (
                <section key={section.title} className="border-b border-temple-sand pb-8 last:border-b-0">
                  <h2 id={sectionId(section.title)} className="scroll-mt-32 font-display text-2xl font-semibold text-ink">{section.title}</h2>
                  <div className="mt-4 space-y-3 font-body text-sm leading-relaxed text-ink/75">
                    {section.content.map((item, index) => (
                      <p key={item} id={subClauseId(section.title, index)} className="scroll-mt-32">
                        <span className="font-semibold text-ink">{subClauseNumber(section.title, index)} </span>
                        {item}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </article>

            <div id={sectionId("15. Contact Us")} className="mt-10 scroll-mt-32 border border-temple-sand bg-temple-cream p-6">
              <h2 className="font-display text-xl font-semibold text-ink">15. Contact Us</h2>
              <div className="mt-3 space-y-2 font-body text-sm leading-relaxed text-ink/75">
                <p>{templeInfo.name}</p>
                <p>{templeAddress}</p>
                <p>
                  Email: <a href={`mailto:${templeInfo.email}`} className="text-primary underline">{templeInfo.email}</a>
                </p>
                <p>
                  Phone: <a href={`tel:${templeInfo.phoneHref}`} className="text-primary underline">{templeInfo.phoneDisplay}</a>
                </p>
                <p>
                  Office of the Data Protection Commissioner, Kenya:{" "}
                  <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.odpc.go.ke</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
