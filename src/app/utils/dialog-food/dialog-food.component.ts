import { CookieService } from 'ngx-cookie-service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isString, isNumber, isNullOrUndefined } from 'util';

import { FoodList } from 'src/app/models';

@Component({
  selector: 'app-dialog-food',
  templateUrl: './dialog-food.component.html',
})
export class DialogFoodComponent {
  values: any[] = [];
  keys: any[] = [];

  valuesSecond: any[] = [];
  valuesThird: any[] = []

  constructor(
    public dialogRef: MatDialogRef<DialogFoodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService
  ) { 
    this.getValues();
    this.getKeys();
  }

  getValues(): void {
    this.values = Object.values(this.data);
  }

  getKeys(): void {
    this.keys = Object.keys(this.data);
  }

  isObjectNew(value: any[]): boolean {
    return isString(value) ? false : Object.values(value).length > 2;
  }

  // Metodos utilizados para montar as informações principais dos alimentos
  cantShow(key: string): boolean {
    return (key === 'base_qty') || (key === 'base_unit') || (key === 'category_id'); 
  }

  isPortion(key: string): boolean {
    return (key === 'base_qty');
  }

  // Metodos utilizados para montar as informações dentro de um array
  getValuesFromArray(array: any[]): void {
    this.valuesSecond = Object.values(array);
  }

  getValuesFromArrayThird(array: any[]): void {
    this.valuesThird = Object.values(array);
  }

  getKeysFromArray(array: any[], values: boolean = true): any[] {
    if (values)
      this.getValuesFromArray(array);
    else 
      this.getValuesFromArrayThird(array);
    return Object.keys(array);
  }

  getValue(array: any[]): string {
    if(isString(array) || isNumber(array))
      return array.toString();

    var v = Object.values(array);

    if (isNumber(v[0]) && isNumber(v[1])) {
      return `${Number(v[0]).toFixed(2)} kcal`;
    }

    var unit = v[1] === 'percents' ? "%" : v[1];

    if(isString(v[0])) {
      if (v[0] === 'NA')
        return "Não informado";
      return `${v[0]} ${unit}`;
    }

    return `${Number(v[0]).toFixed(2)}${unit}`;
  }

  // Ações
  save(): void {
    let v = this.values;
    let pDescription = this.keys.indexOf('description');
    let pAttr = this.keys.indexOf('attributes');
    let position = 1;
    

    let newList: FoodList[]  = [];
    if (this.cookieService.get('foodList')) {
      newList = JSON.parse(this.cookieService.get('foodList'));
      if (newList.length > 0) {
        let lastItem = newList[newList.length - 1];
        position = lastItem.position + 1;
      }
    }
    let data: FoodList = { 
      id: v[0], 
      description: v[pDescription],
      energy: v[pAttr].energy.kcal,
      qtd: 1,
      position: position, 
      lido: false  
    };
    this.onNoClick(data);
  }

  onNoClick(data?: FoodList): void {
    this.dialogRef.close(data);
  }

}
