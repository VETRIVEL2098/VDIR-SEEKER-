// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public dropdownValuesSubject = new BehaviorSubject<any>(null);
  dropdownValues$: Observable<any> = this.dropdownValuesSubject.asObservable();

  public searchQuerySubject = new BehaviorSubject<any>(null);
  searchQuery$: Observable<any> = this.searchQuerySubject.asObservable();

  updateDropdownValues(values: any) {
    this.dropdownValuesSubject.next(values);
    console.log(values);
  }

  updateSearchQuery(query: any) {
    this.searchQuerySubject.next(query);
    console.log(query);
  }

}
