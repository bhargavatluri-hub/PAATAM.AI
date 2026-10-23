import { siteConfig } from "@/config/site";

/**
 * What the website chatbot knows about Paatam. It answers only from this text,
 * so keep it in line with the site copy and the content and claims policy in the
 * README: no unverified numbers, customers, accuracy figures or compliance claims.
 */
export const knowledge = `
# Paatam.ai

Tagline: Turning Assessments into Learning Intelligence.

Paatam is a teacher-first learning intelligence platform for schools in India. It turns handwritten student
assessments (answer sheets from tests, homework and exams) into actionable learning insights, with AI-assisted
evaluation and teachers always in control.

## The problem it solves
- Evaluating stacks of handwritten answer sheets, totalling marks and noting common mistakes takes hours that could go to teaching.
- A mark shows how a student performed on the day, not which concept they missed or why.
- With many students and sections, spotting individual learning gaps and class-wide patterns consistently is difficult.
- Parents often receive a number without the context to know where their child is struggling or how to help.

## How it works (six steps)
1. Upload: scan or photograph completed answer sheets and upload them as images or documents.
2. Interpret: document intelligence and OCR read the handwritten answers and organise them question by question.
3. Evaluate: subject-aware AI compares each response with the school's own answer key, rubric and marking scheme, and suggests marks with a rationale.
4. Discover: concept-level strengths, learning gaps and class-wide patterns are drafted for the teacher.
5. Teacher review: the teacher checks every suggestion, edits marks, corrects feedback and approves what is final.
6. Share: only approved feedback reaches students and parents, including through WhatsApp where the school chooses.
Nothing is final until a teacher approves it.

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
- Honest about AI: handwriting varies and AI can make mistakes, which is why teacher review is built into every step.

## FAQs
- Does Paatam grade on its own? No. It suggests marks, feedback and insights against the school's marking scheme; a teacher reviews, edits and approves every result.
- Will it replace teachers? No. It supports teachers' expertise and frees time for teaching.
- Handwriting accuracy? It varies with handwriting and scan quality. The AI can make mistakes, so the original answer sheet stays alongside every suggestion and the teacher has the final word. Do not quote accuracy percentages.
- Classes: starting with schools serving students in Classes 6–12. Subjects and assessment formats are discussed with each school.
- Languages: the school should tell us which languages its assessments use; we will be clear about what is supported today and won't claim support we haven't verified.
- Student data: treated as sensitive. The website never asks for student data. Data handling for a pilot is explained to each school.

## Company and stage
- Built by ABC Learning Technologies Private Limited, founded in Visakhapatnam, with an office at the Ratan Tata Innovation Hub.
- DPIIT-recognised startup under the Government of India's Startup India programme.
- Founders: Bhargav Atluri (Co-Founder & CEO; 10+ years scaling enterprise AI and customer experience solutions across Asia-Pacific, Japan and China at Cisco, Ericsson and Infobip) and Nikitha Atluri (Co-Founder & Head of Learning; psychologist, educator and counsellor who brings the learning-science lens).
- Paatam is a young company. Five schools in Andhra Pradesh are in discussion to start pilots. Pilots start from Diwali 2026.
- Designed for Indian classrooms, starting in Andhra Pradesh, including rural and underserved communities.

## Working with Paatam (pilot)
1. A conversation about how the school runs assessments today.
2. Agree together on a few classes and subjects to start with.
3. The school's teachers try Paatam and give honest feedback on what works.
Schools can book a demo on the Demo page (${siteConfig.url}/demo) or send an enquiry on the Contact page (${siteConfig.url}/contact).

## Not published (do not guess)
Pricing, contract terms, exact supported languages and subjects, integrations with other school software,
hosting location and compliance certifications are not published. For these, offer to have the team follow up.
`.trim();
