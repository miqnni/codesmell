import ErrorTag from "./ErrorTag";

export default interface SubmissionResults {
  correctAnswers: ErrorTag[];
  incorrectAnswers: ErrorTag[];
  missingAnswers: ErrorTag[];
  score: number;
  scorePercent: number;
}
