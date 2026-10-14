# Sample: Class 7 Hindi (Maharashtra SSC), handwritten answer sheet

Synthetic test material for handwritten-assessment evaluation. The student, school and answers are fictional.

| File | What it is |
| --- | --- |
| `question-paper.pdf`, `question-paper-page-*.jpg` | Printed first-semester paper, Hindi (सुलभभारती), 40 marks, 2 hours |
| `answer-sheet.pdf`, `answer-sheet-page-*.jpg` | 4-page handwritten answer sheet (blue ballpoint on ruled paper, phone-scan look) |
| `answer-key.pdf` | Model answers and marking scheme |

Regenerate with `python3 scripts/sample-papers/generate_hindi_class7.py` (`--seed N` gives a different hand/layout).
Content lives in `scripts/sample-papers/hindi_class7_content.py`.

## Planted corrections and mistakes

Corrections the student made (should not cost marks): scribbled-out `सौ` → `पचास` (Q1.1ख), struck `गाँव` → `बच्चों` (Q1.3ख),
caret insertions (Q1.4, Q2.3, essay), `भुखा` → `भूखा`, `बेटि` → `बेटी`, `पिछे` → `पीछे`, `सूर्यो + दय` → `सूर्य + उदय`,
`राम` → `मोहन`, `बुखार` rewritten, `बहुत` struck, `धुआँ` scribbled out.

Real mistakes left in the answers:

| Where | Mistake | Expected deduction |
| --- | --- | --- |
| Q1 (2)(ख) | `प्रशंशा` (should be प्रशंसा) | −0.5 |
| Q1 (4) | `देते है` (should be हैं) | −0.5 |
| Q2 (4) | Lesson from only one doha | −1 |
| Q3 (1) | `नदीयाँ` (should be नदियाँ) | −0.5 |
| Q4 (1) | `कृपया … की कृपा करें` (redundant) | −1 |

`सीता बाजार गयी` (Q3.6ख) is acceptable per the key.

**Expected score: 36.5 / 40** (Q1 7, Q2 7, Q3 11.5, Q4 11).
