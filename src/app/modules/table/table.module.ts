import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
  MatButtonModule,
  MatListModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatSelectModule
} from '@angular/material';

import { TableComponent } from './table.component';
import { TableService } from './service';
import { DialogFoodComponent } from 'src/app/utils';

@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
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
    MatButtonModule,
    MatListModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  entryComponents: [
    DialogFoodComponent
  ],
  providers: [
    TableService
  ]
})
export class TableModule { }
