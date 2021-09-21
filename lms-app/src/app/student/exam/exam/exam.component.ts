import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ExamService } from 'src/app/services/exam.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit {
  constructor(
    private examService: ExamService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  data;

  ngOnInit(): void {
    this.getExamsDetails();
  }
  ionViewWillEnter(): void {
    this.getExamsDetails();
  }

  public getExamsDetails() {
    this.examService.getExams().subscribe(async (data) => {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
      });

      await loading.present();
      if (data) {
        this.data = data;
        await loading.dismiss();
      }
    });
  }
  public takeExam(duration, percentage, exam_id) {
    this.examAlert(duration, percentage, exam_id);
  }
  async examAlert(duration, percentage, exam_id) {
    duration = duration / 60;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Take Exam?',
      message: `Duration: <b>${duration} minutes</b> <br> Average Exam: <b>${percentage}%</b> <br><br> <small class="color:red">Important! At the end of the exam, be sure to click on the Flag Icon button, which is located on the top right...</small>`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {},
        },
        {
          text: 'Yes',
          handler: () => {
            this.startExam(exam_id);
          },
        },
      ],
    });

    await alert.present();
  }
  startExam(exam_id) {
    this.examService.startExam(exam_id).subscribe((data) => {
      this.router.navigate(['student', 'exam', exam_id]);
    });
  }
}
