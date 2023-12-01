import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  template: `
    <mat-paginator
      [length]="totalItems"
      [pageSize]="itemsPerPage"
      [pageSizeOptions]="[10, 25, 50]"
      (page)="pageChanged.emit($event)"
    ></mat-paginator>
  `,
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Output() pageChanged = new EventEmitter<PageEvent>();
}
