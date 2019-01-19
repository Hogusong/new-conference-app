import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  constructor() { }

  async onError(header: string, message: string) {
    console.log(header, message);
  }
}
