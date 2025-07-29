export default interface FinalAnswer {
  username: string;
  quizId: string;
  answers: Array<{
    filePath: string;
    lineNumber: string;
    errorTag: string;
  }>;
}
