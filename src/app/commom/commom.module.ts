import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommomComponent } from './commom.component';
import { NavbarModule } from './navbar';
import { FooterModule } from './footer';

@NgModule({
  declarations: [
    CommomComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NavbarModule,
    FooterModule
  ]
})
export class CommomModule { }
