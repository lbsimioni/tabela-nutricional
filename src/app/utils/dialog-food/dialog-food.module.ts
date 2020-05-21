import { CookieService } from 'ngx-cookie-service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule, 
  MatButtonModule,
  MatDividerModule,
  MatIconModule
} from '@angular/material';

import { DialogFoodComponent } from './dialog-food.component';

@NgModule({
  declarations: [
    DialogFoodComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  exports: [
    DialogFoodComponent
  ],
  providers: [
    CookieService
  ]
})
export class DialogFoodModule { }
