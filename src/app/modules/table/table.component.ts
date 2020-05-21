import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { 
  MatSort, 
  MatTableDataSource, 
  MatPaginator,
  MatSnackBar, 
  MatDialog
   } from '@angular/material';
   import * as XLSX from 'xlsx';
import { DialogFoodComponent } from 'src/app/utils'
import { Food, FoodList } from '../../models';
import { TableService } from './service';
import { environment } from 'src/environments/environment';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  private readonly COOKIE_KEY: string = environment.cookieKey;
  private readonly HEADER_EXPORT: string[] = ['Descrição', 'Porção', 'Energia'];

  //#region Loading variables
  categoryLoading: boolean = true;
  tableLoading: boolean = true;
  foodListLoading: boolean = true;
  //#endregion

  //#region SideBar Variables
  categoryActual: number = 0;
  categories: any[] = []; 
  leftContentClick: boolean = true;
  rightContentClick: boolean = true;
  //#endregion

  //#region Auxiliary Variables 
  matBadgeText: number = 0;
  matBadgeHidden: boolean = true;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  valueSearch: string = "";
  //#endregion
  
  //#region Tables
    //#region Table Food Principal
    dataFull: Food[] = [];
    dataCurrent: Food[] = [];
    displayedColumns: string[] = [
      'description', 
      'category',
      'portion', 
      'energy',
      'verMais'
    ];
    dataSource = new MatTableDataSource(this.dataCurrent);
    //#endregion

    //#region Table Food List (Side bar)
    foodList: FoodList[] = [];
    displayedColumnsList: string[] = [
      'description',
      'portion',
      'energy',
      'delete'
    ];
    dataSourceList = new MatTableDataSource(this.foodList);
    //#endregion
  //#endregion
  
  constructor(
    private service: TableService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.initCategories();
    this.initFoods();
    this.initTableList();
  }

  // Function

  initTable(): void {
    this.tableLoading = true;
    this.leftSideBarClick(true);
    this.rightSideBarClick(true);
    this.dataSource = new MatTableDataSource(this.dataCurrent);
    this.dataSource.sort = this.sort;
    this.tableLoading = false;
    this.applyTextFilter();
  }

  //#region Async Function, init datas
  initCategories(): void {
    this.categoryLoading = true;
    this.service.categories().subscribe(
      response => {
        this.categories = response;
      }
    );
    this.categoryLoading = false;
  }

  initFoods(): void {
    this.tableLoading = true;
    this.service.foods().subscribe(
      response => {
        this.dataFull = response;
        this.dataCurrent = response;
        this.initTable();
      }
    );
  }
  //#endregion

  //#region Side Bar Controls
  leftSideBarClick(value: boolean = !this.leftContentClick): void {
    if (window.innerWidth < 600)
      this.rightContentClick = true;
    this.leftContentClick = value;
  }

  rightSideBarClick(value: boolean = !this.rightContentClick): void {
    if (window.innerWidth < 600)
      this.leftContentClick = true;
    this.rightContentClick = value;
    this.foodList.forEach(
      f => {
        f.lido = true;
      }
    );
    this.matBadgeText = 0;
    this.matBadgeHidden = true;
    this.saveCookie(JSON.stringify(this.foodList));
  }
  //#endregion

  //#region Auxiliary Function 
  applyTextFilter(): void {
    this.tableLoading = true;
    this.dataSource.filter = this.valueSearch.trim().toLowerCase();
    this.tableLoading = false;
  }

  filterCategory(id: number): void {
    this.tableLoading = true;
    this.categoryActual = id;
    if (id === 0) {
      this.dataCurrent = this.dataFull;
    } else {
      this.dataCurrent = this.dataFull.filter(
        value => {
          return value.category_id === id;
        }
      );
    }
    this.initTable();
  }

  getCategoria(id: number): string {
    if (this.categories.length > 0){
      return this.categories[id - 1].category;
    }
  }
  //#endregion

  //#region Table Food List
  initTableList(): void {
    this.foodListLoading = true;
    this.getFoodTable();
    this.dataSourceList = new MatTableDataSource(this.foodList);
    this.dataSourceList.sort = this.sort;
    this.matBadgeText = 0;
    this.foodList.find(
      f => {
        if (!f.lido) 
          this.matBadgeText++;
      }
    );
    this.matBadgeHidden = this.matBadgeText === 0;
    this.foodListLoading = false;
  }

    //#region FoodListControl
    getFoodTable(): void {
      if (this.cookieService.get(this.COOKIE_KEY))
        this.foodList = JSON.parse(this.cookieService.get(this.COOKIE_KEY));
      else
        this.foodList = [];
    }

    addFood(food: FoodList): void {
      this.foodListLoading = true;
      let find = this.foodList.find(
        f => {
          if(f.id === food.id)
            return food;
        }
      );
      if (typeof find === 'undefined') {
        if (food.portion === 0)
          food.portion = food.portionBase;
        this.foodList.push(food);
        if(this.foodList.length > 1) {
          this.foodList.sort(
            (a, b) => {
              return a.position - b.position;
            }
          );
        }
        this.saveCookie(JSON.stringify(this.foodList));
        this.initTableList();
      } else {
        this.foodListLoading = false;
        this.snackBar.open('Alimento já está em sua lista', '', {
          duration: 2000,
        })
      }
    }

    removeAllFood(): void {
      let list = this.foodList;
      this.foodList = [];
      this.saveCookie(JSON.stringify(this.foodList));

      this.initTableList();

      let message = 'Lista excluida com sucesso';
      let action = 'Desfazer';

      this.snackBar.open(message, action, {
        duration: 2000,
      }).onAction().subscribe(() => {
        this.saveCookie(JSON.stringify(list));
        this.initTableList();
      });;
    }

    removeFood(foodList: FoodList): void {
      let i = this.foodList.indexOf(foodList);
      this.foodList.splice(i, 1);

      this.saveCookie(JSON.stringify(this.foodList));

      this.initTableList();
      this.openSnackBar(foodList);
    } 
    //#endregion

    //#region FoodListActions
  changePortionFood(event: Event, element: FoodList): void {
    let value = Number((event.target as HTMLInputElement).value);
    let indice = this.foodList.indexOf(element);

    if (value > 0) {
      this.foodList[indice].portion = value;
      let food = this.foodList[indice];
      let peso = food.portion / food.portionBase;
      this.foodList[indice].energy = food.energyBase * peso;

    } else {
      this.removeFood(this.foodList[indice]);
    }

    this.saveCookie(JSON.stringify(this.foodList));
    this.initTableList();
  }

  calcPortion(): string {
    let value = this.foodList.map(f => f.portion).reduce(
      (acc, value) => acc + value, 0);

    if(value >= 1000) {
      return `${value / 1000} Kg`;
    } 

    return `${value} g`
  }

  calcKcal(): string {
    let value = this.foodList.map(f => f.energy).reduce(
      (acc, value) => acc + value, 0);

    return `${value.toFixed(2)} kcal`
  }
  //#endregion

  //#endregion

  //#region Bar
  openSnackBar(food: FoodList): void {
    let message = 'Item excluido com sucesso';
    let action = 'Desfazer';

    this.snackBar.open(message, action, {
      duration: 2000,
    }).onAction().subscribe(() => {
      this.addFood(food)
    });;
  }

  openFoodDialog(id: number): void {
    var food = this.dataFull.filter(
      value => {
        return value.id === id;
      }
    );
    const dialogRef = this.dialog.open(DialogFoodComponent, {
      width: '80%',
      data: food[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined')
        this.addFood(result);
    });
  }
  //#endregion

  //#region  Geral
  saveCookie(value: string): void {
    this.cookieService.set(this.COOKIE_KEY, value)
  }

  buttonCategoryDisabled(id: number): boolean {
    return this.categoryActual === id;
  }
  //#endregion

  //#region Export
  exportAsExcel(): void {
    var table = this.createTable();
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(table);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Tabela Nutricional.xlsx');

  }

  exportAsPdf(): void {
    let doc = new jsPDF();
    let body = [];

    this.foodList.forEach(
      f => {
        body.push(
          [f.description, `${f.portion} ${f.portionUnit}`, f.energy.toFixed(2)]
        );
      }
    );

    doc.autoTable({
      head: [this.HEADER_EXPORT],
      body: body
    });


    doc.save('Tabela Nutricional.pdf');
  }

  createTable(): any {
    let thead: string = "<thead><tr>";
    let tbody: string = "<tbody>";

    this.HEADER_EXPORT.forEach(
      k => {
        thead += `<th>${k}</th>`;
      }
    );
    thead += '</tr></thead>';

    this.foodList.forEach(
      f => {
        tbody += 
        `<tr>
          <td>${f.description}</td> 
          <td>${f.portion} ${f.portionUnit}</td>
          <td>${f.energy.toFixed(2)}</td>
        </tr>`;
      }
    );
    tbody += "</tbody>";

    let t = document.createElement('table');
    t.innerHTML = thead + tbody;
    return t;
  }
  //#endregion
}
