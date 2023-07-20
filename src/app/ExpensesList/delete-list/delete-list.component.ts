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
  @ViewChild('deleteModal') closeModal?: ElementRef;

  constructor(private service: ApiService, private route: Router) {}

  ngOnInit(): void {}

  DeleteExpenseList() {
    if (this.listId) {
      try {
        document.getElementById('testBtn')?.click()
        //this.closeModal?.nativeElement.click();

        this.service.DeleteExpensesList(this.listId)
        this.route.navigate(['/']);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
