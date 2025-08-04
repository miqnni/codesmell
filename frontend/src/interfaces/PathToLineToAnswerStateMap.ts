import { LineStateInAnswer } from "@/util/types";

export default interface PathToLineToAnswerStateMap {
  [key: string /* path */]: {
    [key: number /* line */]: LineStateInAnswer;
  };
}
