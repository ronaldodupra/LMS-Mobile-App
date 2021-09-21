import { OnlineExamModel } from "../model/online_exam.model";
import { QuestionBankModel } from "../model/question_bank.model";

export interface examInterface {
  examDetails: OnlineExamModel;
  questionBank: QuestionBankModel[];
}
