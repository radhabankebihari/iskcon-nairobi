import { templeInfo } from "@/data/site";
import { withSeo } from "@/lib/seo";

export const metadata = withSeo({
  title: "Terms and Conditions",
  description: "Terms and conditions for using the ISKCON Nairobi website.",
}, "/terms");

const lastUpdated = "July 27, 2026";
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

const termsSections = [
  {
    title: "1. Introduction and Acceptance",
    items: [
      `These Terms and Conditions govern your access to and use of ${platformUrl} and any associated digital services operated by ${templeInfo.name}, also known as ${templeInfo.legalName}, with its temple address at ${templeAddress}.`,
      "If ISKCON Nairobi publishes additional registered entity details, registration numbers, or statutory status information, those details will be read together with these Terms without limiting the protections stated here.",
      "By accessing, browsing, or using this website, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, you should not use this website.",
      "If you use the website on behalf of an organization, devotee group, congregation, or vendor, you confirm that you have authority to act on its behalf.",
      "If you are under 18, you may use this website only with the involvement and consent of a parent or legal guardian, especially for donations, bookings, form submissions, or any feature involving personal data.",
    ],
  },
  {
    title: "2. Nature of the Website and Religious Content",
    items: [
      "This website is operated as a religious, cultural, educational, and community service for sharing information about Gaudiya Vaishnava philosophy, temple programmes, festivals, deity worship, prasadam distribution, education, outreach, and related activities.",
      "Scriptural references, philosophical commentary, festival descriptions, and devotional teachings reflect the theological and philosophical positions of ISKCON and the Gaudiya Vaishnava tradition. They are provided for informational, educational, and devotional purposes only.",
      "Nothing on this website should be treated as medical, legal, financial, psychological, or professional advice. We do not warrant that participation in any programme, ritual, service, or activity will produce a particular spiritual, physical, or material outcome.",
    ],
  },
  {
    title: "3. Accounts, Forms, and Information You Provide",
    items: [
      "Certain features, including event registration, donation enquiries, guest-house enquiries, course applications, volunteer sign-ups, newsletter subscriptions, or contact forms, may require you to submit personal information.",
      "You agree to provide accurate, current, and complete information and to update it where necessary.",
      `If you believe information submitted through the website has been used without authorization, contact us at ${templeInfo.email}.`,
      "We may decline, suspend, or remove access to any submission, account, or request that contains false information, violates these Terms, or is inconsistent with the devotional and community purpose of the Temple.",
    ],
  },
  {
    title: "4. Donations, Seva, Bookings, and Payments",
    items: [
      "Donations, seva contributions, and offerings made to ISKCON Nairobi are voluntary religious or charitable contributions. Unless expressly stated for a specific campaign or transaction, completed donations are treated as non-refundable because of their charitable nature.",
      "Unless ISKCON Nairobi expressly accepts a restricted purpose in writing, donations are unconditional gifts for the Temple's religious, charitable, educational, community, and administrative purposes. If a designated purpose becomes impractical, completed, overfunded, or no longer suitable, ISKCON Nairobi may redirect the funds to a substantially similar religious or charitable purpose.",
      "A donation does not give the donor control over Temple governance, programme decisions, worship arrangements, staffing, beneficiary selection, or use of Temple property.",
      "Where online payment integration or external payment links are used, payments may be processed by third-party payment providers such as mobile money, card, bank-transfer, or other gateway providers. ISKCON Nairobi does not ask for or store full payment card numbers, CVV codes, or M-Pesa PINs on this website.",
      `If you believe a donation, seva payment, booking, or purchase was duplicated or processed in error, contact ${templeInfo.email} with proof of transaction as soon as possible. Refunds, where granted, are at the discretion of ISKCON Nairobi and will normally be processed to the original payment method where technically possible, less any non-recoverable processor fees where lawful and appropriate.`,
      "Users are responsible for ensuring payment details, donation purpose, amount, phone number, booking details, and recipient information are correct before submitting a transaction.",
      "Chargebacks, reversals, suspected fraud, unauthorized payments, or payment disputes may result in cancellation of the related booking, registration, order, or service and may be reported to the relevant payment provider or authority.",
      "Where event bookings, courses, prasadam orders, guest-house arrangements, or festival registrations are offered, additional pricing, cancellation, capacity, and attendance terms may be shown at the point of booking and will form part of these Terms for that transaction.",
      "ISKCON Nairobi may correct typographical, pricing, availability, or programme errors and may cancel or adjust any affected booking or order, with a refund where payment was collected and cancellation is appropriate.",
      "Donation receipts or acknowledgements may be issued where applicable and upon request. ISKCON Nairobi does not provide tax advice; donors should confirm any tax treatment with the Kenya Revenue Authority or their own advisor.",
    ],
  },
  {
    title: "5. Consumer Information, Prices, and Availability",
    items: [
      "We aim to provide accurate information about programmes, prices, availability, inclusions, capacities, timings, facilities, and services, but website information may contain errors or may become outdated.",
      "All paid services, room availability, course places, event capacity, transport arrangements, prasadam orders, and special requests remain subject to confirmation by the Temple office or the relevant organizer.",
      "Nothing in these Terms is intended to exclude, restrict, or modify any consumer protection right that cannot lawfully be excluded under the laws of Kenya.",
      "Where a user is entitled to a refund, correction, replacement, or other remedy under applicable law, these Terms will be read subject to that non-excludable right.",
    ],
  },
  {
    title: "6. Temple Premises, Events, and Attendance",
    items: [
      "Participation in temple programmes, festivals, classes, retreats, pilgrimages, farm visits, guest-house stays, prasadam distribution, volunteer service, and other in-person activities is subject to Temple rules, security directions, crowd-control instructions, and the sacred character of the premises.",
      "Visitors must behave respectfully, follow instructions from authorized Temple representatives, supervise their belongings, and avoid conduct that may disturb worship, endanger others, damage property, or offend the devotional environment.",
      "Parents and guardians are responsible for supervising children in public temple areas unless the child has been formally checked into a supervised Temple programme.",
      "ISKCON Nairobi may refuse entry, remove a visitor, cancel attendance, or restrict participation where reasonably necessary for safety, crowd control, security, religious discipline, legal compliance, or protection of the community.",
      "Visitors are responsible for their own personal property. ISKCON Nairobi is not liable for loss, theft, or damage to personal items except to the extent caused by proven negligence that cannot lawfully be excluded.",
      "Event schedules, speaker lineups, access routes, security arrangements, prasadam availability, darshan timings, and seating arrangements may change without notice due to religious, operational, safety, weather, security, government, health, or force majeure reasons.",
    ],
  },
  {
    title: "7. Prasadam, Food, and Allergy Notice",
    items: [
      "Prasadam and vegetarian meals are offered as part of the Temple's religious and community service. They are not medical, dietary, or nutritional advice.",
      "Food may contain or come into contact with milk, nuts, gluten, soy, sesame, spices, fruits, grains, or other allergens. Separate allergen-free preparation cannot be guaranteed unless expressly confirmed in writing for a specific arrangement.",
      "Guests with allergies, medical dietary requirements, or special restrictions must notify the Temple or event organizer before consuming prasadam or ordering food.",
      "ISKCON Nairobi is not responsible for allergic reactions, dietary incompatibilities, or personal health consequences where a guest has not disclosed relevant restrictions or where allergen-free preparation was not expressly confirmed.",
    ],
  },
  {
    title: "8. Guest House and Retreat Stay Rules",
    items: [
      "Guest-house enquiries, room selections, availability, prices, facilities, and stay dates are not confirmed until accepted by the Temple office or the authorized guest-house coordinator.",
      "Guests must comply with Temple discipline and guest-house rules, including any rules on check-in and check-out, visitors, noise, security, cleanliness, dress, worship spaces, and use of shared facilities.",
      "Meat, fish, eggs, alcohol, intoxicants, smoking, gambling, unlawful substances, disorderly conduct, and activities inconsistent with the Temple's spiritual environment are prohibited on Temple premises unless a stricter Temple rule applies.",
      "Guests may be responsible for loss, breakage, damage, extra cleaning, missing items, or misuse of facilities caused by them or by persons they invite onto the premises.",
      "ISKCON Nairobi may refuse, cancel, shorten, or terminate a stay where necessary for safety, non-payment, breach of rules, misrepresentation, operational necessity, religious observance, or protection of the Temple community.",
    ],
  },
  {
    title: "9. Photography, Video, Livestream, and Media",
    items: [
      "Temple events, festivals, classes, kirtans, processions, and public programmes may be photographed, recorded, livestreamed, or reported for religious, archival, educational, fundraising, and promotional purposes.",
      "By attending public Temple events or submitting photographs, videos, testimonials, or stories, you acknowledge that your image, voice, name, or contribution may appear incidentally or, where you consent, intentionally in Temple media.",
      "If you do not wish to be photographed or recorded, you should inform the organizer where practical and avoid clearly marked recording areas. ISKCON Nairobi will make reasonable efforts to respect such requests, but cannot guarantee exclusion from wide crowd shots or livestreams in public event settings.",
      "Close-up promotional use of identifiable children should be based on parent or guardian consent unless another lawful basis applies. Parents and guardians should notify organizers of any objection before or during the relevant programme.",
    ],
  },
  {
    title: "10. Children, Youth Programmes, and Safeguarding",
    items: [
      "Children and young people may participate in Temple programmes only with appropriate parental or guardian consent and supervision, unless they are enrolled in a supervised programme with its own procedures.",
      "Parents and guardians are responsible for providing accurate emergency contact details, relevant medical or allergy information, pick-up permissions, and any other information reasonably required for youth programmes.",
      "ISKCON Nairobi may require separate consent forms, safeguarding procedures, emergency authorizations, or programme rules for Sunday school, youth training, retreats, overnight stays, transport, farm visits, or similar activities.",
      "The Temple may refuse or discontinue participation in a children's or youth programme where necessary for safeguarding, safety, discipline, capacity, or welfare reasons.",
    ],
  },
  {
    title: "11. Volunteers and Service",
    items: [
      "Volunteer service is offered in a devotional and community spirit and does not create employment, agency, partnership, or entitlement to compensation unless separately agreed in writing.",
      "Volunteers must follow Temple instructions, safety rules, food-handling requirements, child-safeguarding rules, confidentiality obligations, media rules, and standards of Vaishnava conduct.",
      "ISKCON Nairobi may accept, decline, reassign, pause, or discontinue volunteer service at its discretion where necessary for safety, suitability, capacity, conduct, safeguarding, or operational reasons.",
      "Volunteers are responsible for acting honestly, carefully, and lawfully and may be held responsible for intentional misconduct, gross negligence, fraud, theft, harassment, abuse, or damage caused by their actions.",
    ],
  },
  {
    title: "12. User Conduct and Cybersecurity",
    items: [
      "You agree not to post, upload, submit, or transmit unlawful, defamatory, obscene, hateful, abusive, misleading, or discriminatory content, including content that disparages any religion, community, or individual.",
      "You must not impersonate ISKCON Nairobi, its officers, gurus, devotees, volunteers, or any other person or entity.",
      "You must not upload malware, attempt unauthorized access, disrupt the website, scrape or harvest data without written consent, spam users, or use the website for unrelated commercial solicitation.",
      "You must not use the website in a way that violates Kenyan law, including the Computer Misuse and Cybercrimes Act, 2018, or any applicable law in your jurisdiction.",
      "We may use reasonable technical measures to block abusive traffic, preserve security logs, investigate suspicious activity, suspend submissions, and cooperate with payment processors, hosting providers, law enforcement, regulators, or cybersecurity authorities where lawful and appropriate.",
      "We may monitor, remove, restrict, or refuse user-submitted content that violates these Terms or the purpose of the website.",
    ],
  },
  {
    title: "13. User-Submitted Content",
    items: [
      "Where the website allows submissions such as comments, testimonials, photographs, prayer requests, volunteer applications, or contact messages, you retain ownership of your content but grant ISKCON Nairobi a worldwide, royalty-free, non-exclusive license to use, reproduce, display, and distribute it for the Temple's religious, educational, charitable, administrative, and promotional purposes.",
      "You confirm that you own or have the necessary rights to any content you submit and that it does not infringe another person's intellectual property, privacy, or other rights.",
      "Prayer requests, blessing requests, personal messages, or sensitive submissions will be handled in line with our Privacy Policy and will not be published unless the relevant form clearly states that the submission may be public or you separately consent.",
    ],
  },
  {
    title: "14. Intellectual Property",
    items: [
      "Content on this website, including text, graphics, logos, images, audio, video, classes, kirtans, layouts, and software, is owned by ISKCON Nairobi, its licensors, its contributors, or relevant rights holders and is protected by Kenyan copyright law and applicable international treaties.",
      "The ISKCON name, emblem, and related marks are used in connection with the International Society for Krishna Consciousness and its authorized activities.",
      "You may view, download, and share website content for personal, non-commercial, devotional, or educational use only. You may not sell, commercially exploit, republish, or reproduce website content at scale without written permission from ISKCON Nairobi and, where applicable, the relevant rights holder.",
      "Scriptural translations and commentaries, including works published by the Bhaktivedanta Book Trust, remain the property of their respective copyright holders. Any use beyond fair dealing, licensed temple use, or permitted sharing requires separate permission from the relevant rights holder.",
    ],
  },
  {
    title: "15. Third-Party Links and Services",
    items: [
      "This website may link to third-party websites, forms, payment processors, maps, livestream platforms, social media pages, video platforms, registration forms, or messaging services.",
      "ISKCON Nairobi does not control and is not responsible for the content, security, availability, terms, or privacy practices of third-party services. Your use of third-party services is governed by their own terms and privacy policies.",
    ],
  },
  {
    title: "16. Disclaimers",
    items: [
      "The website and all content are provided on an as-is and as-available basis, without warranties of any kind to the maximum extent permitted by Kenyan law.",
      "ISKCON Nairobi does not warrant that the website will be uninterrupted, secure, error-free, or that event schedules, class timings, prasadam availability, guest-house availability, or festival details will not change without notice.",
      "Users experiencing a medical, mental-health, legal, or financial emergency should seek qualified professional help or emergency services and should not rely on website content for urgent assistance.",
      "Religious, cultural, pastoral, or community guidance offered through the Temple is not a substitute for professional medical, psychological, legal, financial, or emergency advice.",
      "References to expected benefits, spiritual practice, community service, education, or personal transformation are expressions of religious belief and community experience, not guarantees of results.",
    ],
  },
  {
    title: "17. Limitation of Liability",
    items: [
      "To the maximum extent permitted by Kenyan law, ISKCON Nairobi, its trustees, officers, employees, devotees, and volunteers shall not be liable for indirect, incidental, special, consequential, punitive, or exemplary damages, or for loss of data, revenue, goodwill, or opportunity arising from use of or inability to use the website.",
      "Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited under Kenyan law, including liability for fraud or for death or personal injury caused by proven negligence.",
      "Where liability cannot be excluded, ISKCON Nairobi's total aggregate liability for any claim arising from use of the website shall not exceed the total amount you paid to ISKCON Nairobi through the website in the twelve months before the claim, or KES 10,000, whichever is greater.",
    ],
  },
  {
    title: "18. Indemnification",
    items: [
      "You agree to indemnify and hold harmless ISKCON Nairobi, its trustees, officers, employees, devotees, and volunteers from any claim, liability, damage, loss, or expense, including reasonable legal fees, arising from your breach of these Terms, misuse of the website, or submission of content that infringes another person's rights.",
    ],
  },
  {
    title: "19. Suspension and Termination",
    items: [
      "We may suspend, restrict, or terminate your access to the website or its features, with or without notice, if we reasonably believe you have violated these Terms, submitted false information, engaged in fraudulent payment activity, or used the website in a manner harmful to ISKCON Nairobi, its community, or other users.",
      `You may stop using the website at any time and may request deletion of personal data by contacting ${templeInfo.email}, subject to records we may be required to retain for legal, accounting, security, or dispute-resolution purposes.`,
    ],
  },
  {
    title: "20. Changes to the Website and These Terms",
    items: [
      "We may modify, suspend, or discontinue any part of the website at any time.",
      "We may update these Terms from time to time. Material changes may be notified by a notice on the website or by email where we hold your email address. Continued use after changes take effect means you accept the revised Terms.",
    ],
  },
  {
    title: "21. Notices and Communications",
    items: [
      "We may communicate notices, confirmations, updates, cancellations, policy changes, receipts, and service information by email, phone, SMS, WhatsApp, website notice, social media notice, or other contact details you provide.",
      "You are responsible for ensuring that contact information submitted to the Temple is accurate and up to date.",
      "A notice sent to the latest contact details you provided will be treated as received unless we receive a delivery failure or applicable law requires a different method.",
    ],
  },
  {
    title: "22. Governing Law and Dispute Resolution",
    items: [
      "These Terms are governed by the laws of the Republic of Kenya.",
      "The parties should first attempt to resolve disputes through good-faith negotiation. Where appropriate in the Temple's spiritual community context, parties may also consider mediation through relevant ISKCON internal governance structures before litigation.",
      "Subject to good-faith negotiation or mediation where appropriate, the courts of Kenya shall have exclusive jurisdiction over disputes arising from these Terms or use of the website.",
    ],
  },
  {
    title: "23. General Provisions",
    items: [
      "If any provision of these Terms is held invalid or unenforceable, the remaining provisions will continue in effect.",
      "Failure by ISKCON Nairobi to enforce a provision does not constitute a waiver of that provision.",
      "These Terms, together with the Privacy Policy and any transaction-specific terms shown at the point of booking, donation, registration, or purchase, form the agreement between you and ISKCON Nairobi regarding the website.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="bg-temple-bg pb-section pt-32 sm:pt-36">
        <div className="content-width section-padding">
          <div className="mx-auto max-w-4xl">
            <header className="mb-10">
              <span className="eyebrow block mb-3">Use of This Site</span>
              <h1 className="section-title">
                Terms<br />
                <em className="not-italic font-normal">and Conditions</em>
              </h1>
            </header>

            <div className="mb-10 border border-gold/20 bg-white p-6 shadow-sm">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-gold-ink">Last Updated</p>
              <p className="mt-2 font-display text-2xl text-ink">{lastUpdated}</p>
              <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">
                These Terms apply to the ISKCON Nairobi website and related digital services. Please also read our{" "}
                <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
              </p>
            </div>

            <nav aria-labelledby="terms-table-of-contents" className="mb-10 border border-temple-sand bg-temple-cream p-6">
              <h2 id="terms-table-of-contents" className="font-display text-xl font-semibold text-ink">Table of Contents</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {termsSections.map((section) => (
                  <a
                    key={section.title}
                    href={`#${sectionId(section.title)}`}
                    className="tap-target font-body text-sm leading-relaxed text-ink/75 underline decoration-gold/30 underline-offset-4 transition-colors hover:text-primary"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </nav>

            <article className="space-y-9">
              {termsSections.map((section) => (
                <section key={section.title} className="border-b border-temple-sand pb-8 last:border-b-0">
                  <h2 id={sectionId(section.title)} className="scroll-mt-32 font-display text-2xl font-semibold text-ink">{section.title}</h2>
                  <div className="mt-4 space-y-3 font-body text-sm leading-relaxed text-ink/75">
                    {section.items.map((item, index) => (
                      <p key={item} id={subClauseId(section.title, index)} className="scroll-mt-32">
                        <span className="font-semibold text-ink">{subClauseNumber(section.title, index)} </span>
                        {item}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </article>

            <div className="mt-10 border border-temple-sand bg-temple-cream p-6">
              <h2 className="font-display text-xl font-semibold text-ink">Contact</h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">
                Questions about these Terms should be directed to{" "}
                <a href={`mailto:${templeInfo.email}`} className="text-primary underline">{templeInfo.email}</a>,{" "}
                <a href={`tel:${templeInfo.phoneHref}`} className="text-primary underline">{templeInfo.phoneDisplay}</a>, or {templeAddress}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
