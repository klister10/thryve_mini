// UCLA 3-Item Loneliness Scale (Hughes et al., 2004).
//
// Research / validation reference:
//   https://pubmed.ncbi.nlm.nih.gov/39479755/
// Practical guide to administering and scoring:
//   https://www.icmha.org/wp-content/uploads/2020/02/UCLA-Loneliness-Scale.pdf
//
// Scoring: each answer is worth 1-3 points, summed across the three questions
// for a total of 3-9. Per the scoring guide, 3-5 is "not lonely" and 6-9 is
// "lonely". The wording shown to the user is deliberately gentle; the numeric
// cut-off is the only clinical part.

export const QUESTIONS = [
  { id: 'companionship', text: 'How often do you feel that you lack companionship?' },
  { id: 'left-out', text: 'How often do you feel left out?' },
  { id: 'isolated', text: 'How often do you feel isolated from others?' },
];

// The same three answers apply to every question.
export const OPTIONS = [
  { label: 'Hardly ever', points: 1 },
  { label: 'Some of the time', points: 2 },
  { label: 'Often', points: 3 },
];

export const MIN_SCORE = 3;
export const MAX_SCORE = 9;
export const LONELY_THRESHOLD = 6; // 6-9 = lonely, 3-5 = not lonely

export function scoreAnswers(points) {
  return points.reduce((sum, p) => sum + p, 0);
}

// Copy is written to be warm rather than diagnostic.
export function getResult(score) {
  if (score >= LONELY_THRESHOLD) {
    return {
      isLonely: true,
      title: 'Thanks for sharing 💛',
      message:
        "You're in the right place. There are lots of things we can do together to help you feel less lonely. And remember: feeling lonely does not mean you are alone.",
    };
  }
  return {
    isLonely: false,
    title: "You're feeling connected 🌿",
    message:
      "You've made a lot of progress. You're feeling more connected today. Keep going, you're doing great!",
  };
}
