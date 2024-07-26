import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  dept="web technology";
  constructor() { }
  getdepartment()
  {
    return this.dept;
  }
}
