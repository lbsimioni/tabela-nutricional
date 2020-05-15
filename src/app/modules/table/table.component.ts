import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

import { Food } from '../../models/food-datatable.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  leftContentClick: boolean = true;
  rightContentClick: boolean = true;
  valueSearch: string = "";

  data: Food[] = [
    new Food("Teste", "g", 100), 
    new Food("Teste2", "g", 200)
  ];
  displayedColumns: string[] = ['description', 'base_qty'];
  dataSource = new MatTableDataSource(this.data);
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  leftSideBarClick(): void {
    this.leftContentClick = !this.leftContentClick;
  }

  rightSideBarClick(): void {
    this.rightContentClick = !this.rightContentClick;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
