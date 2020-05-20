import { element } from 'protractor';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { 
  MatSort, 
  MatTableDataSource, 
  MatPaginator,
  MatSnackBar, 
  MatDialog
   } from '@angular/material';

import { DialogFoodComponent } from 'src/app/utils'
import { Food, FoodList } from '../../models';
import { TableService } from './service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  leftContentClick: boolean = true;
  rightContentClick: boolean = true;
  valueSearch: string = "";

  // Variáveis de loading
  categoryLoading: boolean = true;
  tableLoading: boolean = true;
  foodListLoading: boolean = true;

  categoryActual: number = 0;
  categories: any[] = []; 
  foodList: FoodList[] = [];
  matBadgeText: number = 0;
  matBadgeHidden: boolean = true;
  
  // Tabela de Comida principal
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

  // Tabela de Comida para Lista
  displayedColumnsList: string[] = [
    'qtd',
    'description',
    'energy',
    'delete'
  ];
  dataSourceList = new MatTableDataSource(this.foodList);

  @ViewChild(MatSort, {static: true}) sort: MatSort;

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

  initTable(): void {
    this.tableLoading = true;
    this.leftSideBarClick(true);
    this.rightSideBarClick(true);
    this.dataSource = new MatTableDataSource(this.dataCurrent);
    this.dataSource.sort = this.sort;
    this.tableLoading = false;
  }

  getCategoria(id: number): string {
    if (this.categories.length > 0){
      return this.categories[id - 1].category;
    }
  }

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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  // Lista de Alimentos selecionados
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

  getFoodTable(): void {
    if (this.cookieService.get('foodList'))
      this.foodList = JSON.parse(this.cookieService.get('foodList'));
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
      if(food.qtd === 0)
        food.qtd = 1;
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

  changeQtdFood(element: FoodList, value: number, base: boolean = false): void {
    let qtd: number = 0;
    let indice = this.foodList.indexOf(element);

    if (base) {
      qtd = this.foodList[indice].qtd;
    }
    this.foodList[indice].qtd = qtd + value;

    if (this.foodList[indice].qtd === 0) {
      this.removeFood(this.foodList[indice]);
    }

    this.saveCookie(JSON.stringify(this.foodList));
  }

  inputQtdFood(event: Event, element: FoodList): void {
    let value = Number((event.target as HTMLInputElement).value);
    this.changeQtdFood(element, value);
  }

  // Scack Bar
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

  saveCookie(value: string): void {
    this.cookieService.set('foodList', value)
  }

  buttonCategoryDisabled(id: number): boolean {
    return this.categoryActual === id;
  }

}
