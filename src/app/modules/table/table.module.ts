import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { 
  MatDividerModule, 
  MatIconModule, 
  MatTooltipModule,
  MatDialogModule,
  MatSortModule,
  MatTableModule,
  MatInputModule,
  MatButtonModule
} from '@angular/material';

import { TableComponent } from './table.component';

@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class TableModule { }
