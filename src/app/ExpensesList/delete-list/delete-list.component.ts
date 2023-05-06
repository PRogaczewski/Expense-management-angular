import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['./delete-list.component.css'],
})
export class DeleteListComponent implements OnInit {
  @Input() listId?: number;
  @ViewChild('closeModal') closeModal?: ElementRef;

  constructor(private service: ApiService, private route: Router) {}

  ngOnInit(): void {}

  DeleteExpenseList() {
    if (this.listId) {
      try {
        this.service.DeleteExpensesList(this.listId)

        this.closeModal?.nativeElement.click();
        this.route.navigate(['/']);

      } catch (err) {
        console.log(err);
      }
    }
  }
}
