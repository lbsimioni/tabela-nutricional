import { CookieService } from 'ngx-cookie-service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isString, isNumber } from 'util';

import { FoodList } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dialog-food',
  templateUrl: './dialog-food.component.html',
})
export class DialogFoodComponent {
  private readonly COOKIE_KEY: string = environment.cookieKey;

  //#region KEYS TRANSLATE
  private readonly KEYS_TRANSLATE: string[][] = [['id',  'id'],  ['description',  'descrição'], ['base_qty',  'quantidade Base'], ['base_unit',  'unidade base'], ['category_id',  'Categoria ID'], ['attributes',  'atributos'], ['Nutrients',  'Nutrientes'], ['energy',  'energia'], ['kcal',  'kcal'], ['kj',  'kj'], ['ashes',  'cinzas'], ['calcium',  'cálcio'], ['carbohydrate',  'carboidrato'], ['cholesterol',  'colesterol'], ['copper',  'cobre'], ['fiber',  'fibra'], ['humidity',  'umidade'], ['lipid',  'lipídico'], ['magnesium',  'magnésio'], ['manganese',  'manganês'], ['niacin',  'niacina'], ['phosphorus',  'fósforo'], ['potassium',  'potássio'], ['protein',  'proteína'], ['pyridoxine',  'piridoxina'], ['retinol',  'retinol'], ['riboflavin',  'riboflavina'], ['sodium',  'sódio'], ['thiamine',  'tiamina'], ['vitaminC',  'vitamina C'], ['zinc',  'zinco'], ['amino_acids',  'aminoácidos'], ['alanine',  'alanina'], ['arginine',  'arginina'], ['aspartic',  'aspártico'], ['cystine',  'cistina'], ['glutamic',  'glutâmico'], ['glycine',  'glicina'], ['histidine',  'histidina'], ['isoleucine',  'isoleucina'], ['leucine',  'leucina'], ['lysine',  'lisina'], ['methionine',  'metionina'], ['phenylalanine',  'fenilalanina'], ['proline',  'prolina'], ['serine',  'serina'], ['threonine',  'treonina'], ['tryptophan',  'triptofano'], ['tyrosine',  'tirosina'], ['valine',  'valina'], ['fatty_acids',  'ácidos graxos'], ['saturated',  'saturado'], ['monounsaturated',  'monoinsaturado'], ['polyunsaturated',  'poliinsaturado'], ['12:0',  '12:0'], ['14:0',  '14:0'], ['16:0',  '16:0'], ['18:0',  '18:0'], ['20:0',  '20:0'], ['22:0',  '22:0'], ['24:0',  '24:0'], ['16:1',  '16:1'], ['18:1',  '18:1'], ['20:1',  '20:1'], ['18:2',  '18:2'], ['18:3',  '18:3'], ['18:1t',  '18:1t'], ['18:2t',  '18:2t']];
  //#endregion

  //#region  Variables
  values: any[] = [];
  valuesSecond: any[] = [];
  valuesThird: any[] = [];
  keys: any[] = [];
  //#endregion

  constructor(
    public dialogRef: MatDialogRef<DialogFoodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookieService: CookieService
  ) { 
    this.getValues();
    this.getKeys();
  }

  //#region Function to get Keys of Objects
  getKeys(): void {
    this.keys = Object.keys(this.data);
  }

  getKeysFromArray(array: any[], values: boolean = true): any[] {
    if (values)
      this.getValuesFromArray(array);
    else 
      this.getValuesFromArrayThird(array);
    return Object.keys(array);
  }
  //#endregion

  //#region Controls Functions
  cantShow(key: string): boolean {
    return (key === 'base_qty') || (key === 'base_unit') || (key === 'category_id'); 
  }

  isPortion(key: string): boolean {
    return (key === 'base_qty');
  }

  isObjectNew(value: any[]): boolean {
    return isString(value) ? false : Object.values(value).length > 2;
  }
  //#endregion

  //#region Functions to get Values of Objects
  getValues(): void {
    this.values = Object.values(this.data);
  }

  getValuesFromArray(array: any[]): void {
    this.valuesSecond = Object.values(array);
  }

  getValuesFromArrayThird(array: any[]): void {
    this.valuesThird = Object.values(array);
  }
  //#endregion

  //#region Auxiliary Functions
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

  traslateKey(key: string): string {
    var value: string = key;
    this.KEYS_TRANSLATE.find(
      k => {
        if (k[0] === key) {
          value = k[1];
          return;
        }
      }
    );

    return value;
  }
  //#endregion

  //#region Component Functions
  save(): void {
    let v = this.values;
    let pDescription = this.keys.indexOf('description');
    let pAttr = this.keys.indexOf('attributes');
    let pPortion = this.keys.indexOf('base_qty');
    let position = 1;
    

    let newList: FoodList[]  = [];
    if (this.cookieService.get(this.COOKIE_KEY)) {
      newList = JSON.parse(this.cookieService.get(this.COOKIE_KEY));
      if (newList.length > 0) {
        let lastItem = newList[newList.length - 1];
        position = lastItem.position + 1;
      }
    }
    let data: FoodList = { 
      id: v[0], 
      description: v[pDescription],
      energyBase: v[pAttr].energy.kcal,
      energy: v[pAttr].energy.kcal,
      portionBase: v[pPortion],
      portion: v[pPortion],
      portionUnit: v[pPortion + 1],
      position: position, 
      lido: false  
    };
    this.close(data);
  }

  close(data?: FoodList): void {
    this.dialogRef.close(data);
  }
  //#endregion

}
