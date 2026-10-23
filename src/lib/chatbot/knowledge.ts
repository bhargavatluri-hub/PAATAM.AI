import { siteConfig } from "@/config/site";

/**
 * What the website chatbot knows about Paatam. It answers only from this text,
 * so keep it in line with the site copy and the content and claims policy in the
 * README: no unverified numbers, customers, accuracy figures or compliance claims.
 */
export const knowledge = `
# Paatam.ai

Tagline: Turning Assessments into Learning Intelligence.

Paatam.ai is a DPIIT-recognised EdTech startup from Andhra Pradesh. It is a teacher-first learning intelligence
platform for schools in India that turns handwritten student assessments (answer sheets from tests, homework and
exams) into teacher-approved learning insights, using a multi-agent AI system with the teacher always in control.

The name comes from "పాఠం" (paatam), Telugu for "lesson": every assessment holds a lesson about what a student
understands and what they need next.

What makes it different: Paatam starts from the paper answer sheet and ends with teacher-approved insight for every
stakeholder, instead of moving tests onto screens.

## The problem it solves
- Evaluating stacks of handwritten answer sheets, totalling marks and noting common mistakes takes hours that could go to teaching.
- A mark shows how a student performed on the day, not which concept they missed or why.
- With many students and sections, spotting individual learning gaps and class-wide patterns consistently is difficult.
- Parents often receive a number without the context to know where their child is struggling or how to help.
- Principals and coordinators lack a timely, concept-level view across classes.
The result: learning gaps go unnoticed and accumulate, most of all in schools with limited time, staff and digital resources.

## How it works (six steps)
1. Upload: scan or photograph completed answer sheets and upload them as images or documents.
2. Interpret: document intelligence and OCR read the handwritten answers and organise them question by question.
3. Evaluate: subject-aware AI compares each response with the school's own answer key, rubric and marking scheme, and suggests marks with a rationale.
4. Discover: concept-level strengths, learning gaps and class-wide patterns are drafted for the teacher.
5. Teacher review: the teacher checks every suggestion, edits marks, corrects feedback and approves what is final.
6. Share: only approved feedback reaches students and parents, including through WhatsApp where the school chooses.
Nothing is final until a teacher approves it.

## The AI evaluation pipeline (five specialised agents, then the teacher)
Answer sheets are scanned with a phone camera or scanner, whole stacks at once. Then five AI agents each do one job:
1. Vision agent: finds pages, questions and answer regions.
2. OCR + structure agent: reads the handwriting, question by question.
3. Answer verification agent: checks each answer was read correctly.
4. Subject grading agent: drafts marks and feedback against the school's own answer keys, rubrics and marking schemes, including step-wise partial credit.
5. QA agent: checks marks and feedback for consistency.
Finally the teacher reviews, edits and approves. Only teacher-approved results reach teachers' dashboards (class gaps, next steps),
principals (school-wide trends), students (what to practise next) and parents (updates on WhatsApp).
A rubric knowledge base and an exam generator make it a continuous loop: each assessment informs the next lesson and the next paper.

## Product modules
- Overview / grading command centre: multi-agent marking for handwritten tests, homework and exams; shows what's scanned and what needs sign-off.
- Classes: every section, subject and student at a glance, and the concepts a whole section is struggling with.
- Student Analytics: each student's performance tracked across exams, subjects and concepts, to spot progress or a slide early.
- Knowledge Base: upload answer keys and marking rubrics once; Paatam evaluates against the school's scheme, not a generic one.
- Exam Generator: pick class, chapters, marks and difficulty mix to get a draft question paper the teacher edits and approves.
- Coordinator view: coordinators are mapped to multiple classes and sections per curriculum; compare section performance and see gaps shared across sections.
- Head of School dashboard: school-wide and class-wise performance, topics not being understood, low-scoring sections, and students who need help.
- Student Portal: teacher-approved marks, question-by-question feedback and what to practise next.
- Parent WhatsApp: scores and feedback after every exam, weekly summaries and monthly reports, each sent only after teacher approval.

## Who it helps
- School leaders (principals, coordinators, management): concept-level understanding across sections and subjects, not just averages; early help for students falling behind; clearer, teacher-approved parent communication.
- Teachers: help with the repetitive parts of evaluation. Review AI-suggested marks with a rationale, correct any mark or comment, validate learning insights. Nothing goes to a parent without their approval.
- Students: feedback that explains mistakes and what to practise, not just a score.
- Parents: understandable, teacher-approved updates, including on WhatsApp, with marks, topics mastered, where support is needed and one practical way to help at home.

## Fits the school's existing process
- Students keep writing on paper. Teachers keep setting and conducting assessments as today.
- The workflow starts with a simple upload of scanned or photographed answer sheets, so it suits schools at any level of digital readiness.
- The school's own answer keys, rubrics and marking schemes decide how answers are evaluated.

## Responsible AI principles
- Teachers hold final authority; AI output is a suggestion until a teacher approves it.
- Every AI result is reviewable, with a rationale.
- Parent messages need teacher approval.
- Student work is treated as sensitive information and is never used in public demonstrations.
- Data protection: student work is sent over encrypted connections and is visible only to authorised school staff.
- Honest about AI: handwriting varies and AI can make mistakes, which is why teacher review is built into every step.

## FAQs
- Does Paatam grade on its own? No. It suggests marks, feedback and insights against the school's marking scheme; a teacher reviews, edits and approves every result.
- Will it replace teachers? No. It supports teachers' expertise and frees time for teaching.
- Handwriting accuracy? It varies with handwriting and scan quality. The AI can make mistakes, so the original answer sheet stays alongside every suggestion and the teacher has the final word. Do not quote accuracy percentages.
- Classes: starting with schools serving students in Classes 6–12. Subjects and assessment formats are discussed with each school.
- Languages: the school should tell us which languages its assessments use; we will be clear about what is supported today and won't claim support we haven't verified.
- Student data: treated as sensitive, sent over encrypted connections and visible only to authorised school staff. The website never asks for student data. Further details of data handling for a pilot are explained to each school.
- What does a school need to start? Its existing paper assessments and a phone camera or scanner.

## Company and stage
- Built by ABC Learning Technologies Private Limited. Registered office: RTIH (Ratan Tata Innovation Hub), 5th Floor, VMRDA – The DECK, Siripuram, Visakhapatnam, Andhra Pradesh 530003.
- DPIIT-recognised startup under the Government of India's Startup India programme (DPIIT No. DIPP286348).
- Founders: Bhargav Atluri (Co-Founder & CEO; 10+ years scaling enterprise AI and customer experience solutions across Asia-Pacific, Japan and China at Cisco, Ericsson and Infobip) and Nikitha Atluri (Co-Founder & Head of Learning; psychologist, educator and counsellor who brings the learning-science lens).
- Paatam is a young company. The product is built (a grading desk with the nine modules above, from evaluation to parent updates) and www.paatam.ai launched with a narrated product demo. Five schools in Andhra Pradesh are in discussion to start pilots, beginning from Diwali 2026.
- Roadmap: pilots with partner schools in Andhra Pradesh (measuring time saved and teacher acceptance of AI suggestions); then the first paid schools on annual subscriptions; then more schools, subjects and languages across Andhra Pradesh, including school groups; then other states across India, including rural and underserved communities. Do not give dates beyond the pilots.
- Designed for Indian classrooms, starting in Andhra Pradesh, including rural and underserved communities.

## Pricing and how schools buy
- Paatam is sold to schools as a subscription, with a pilot as the starting point. Customers are private and government-aided schools; the decision makers are principals, correspondents and management.
- Pricing is tailored to each school. It depends on the number of classes and students and on the modules the school starts with (for example Automated Correction & Grading, Exam Generator and Knowledge Base). The team shares a quote after understanding the school's needs. Never quote a price, a per-student figure or any other number for pricing; offer to have the team prepare a quote and collect the visitor's details.
- Schools can start small with a few classes and subjects, then add more classes, subjects and modules. School groups and chains are welcome.

## Working with Paatam (pilot)
1. A conversation about how the school runs assessments today.
2. Agree together on a few classes and subjects to start with.
3. The school's teachers try Paatam and give honest feedback on what works.
Schools can book a demo on the Demo page (${siteConfig.url}/demo) or send an enquiry on the Contact page (${siteConfig.url}/contact).

## Contact
- Email: bhargav@paatam.in or nikitha@paatam.in
- Phone / WhatsApp: +91 95826 32863
- Website: ${siteConfig.url}
Share these when a visitor asks how to reach the team, but still offer to take their details so the team can reach out.

## Not published (do not guess)
Price figures, contract terms, discounts, exact supported languages and subjects, integrations with other school software,
hosting location, compliance certifications and accuracy figures are not published. For these, offer to have the team follow up.
`.trim();
