import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Food } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private readonly urlJson: string = 'assets/json';

  constructor(
    private http: HttpClient
  ) { }

  categories(): Observable<any> {
    return this.http.get<any>(`${this.urlJson}/category.json`);
  }

  foods(): Observable<Food[]> {
    return this.http.get<any>(`${this.urlJson}/food.json`);
  }
}
