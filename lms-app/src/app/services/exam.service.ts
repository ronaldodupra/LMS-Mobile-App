import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SERVER_URL } from "src/environments/environment";
import { isArray } from "util";
import { examInterface } from "../interface/exam.interface";
import { QuestionBankModel } from "../model/question_bank.model";
@Injectable({
  providedIn: "root",
})
export class ExamService {
  api: string;
  constructor(private http: HttpClient) {
    this.api = SERVER_URL;
  }

  public getExams() {
    return this.http.get(`${this.api}/exams`);
  }
  public getExamQuestions(examId: number): Observable<examInterface> {
    return this.http.get<examInterface>(`${this.api}/exams/${examId}`);
  }
  public startExam(examId: number) {
    return this.http.post(`${this.api}/exams/startExam`, {
      examId,
    });
  }
  public getExamResultId(examId: number): Observable<Number> {
    return this.http.get<Number>(`${this.api}/exams/${examId}/getExamResultId`);
  }
  public submitExam(examId: number, examResultId, answer): Observable<string> {
    const data = answer.items;
    data.forEach((e) => {
      if (e.correct_answers == "essay") {
        e.submitted_answer = "<p>" + e.submitted_answer + "</p>";
      }
    });
    return this.http.post<string>(
      `${this.api}/exams/${examResultId}/${examId}`,
      data
    );
  }
}
