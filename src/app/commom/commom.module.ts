import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
    BrowserModule,
    RouterModule,
    NavbarModule,
    FooterModule
  ]
})
export class CommomModule { }
