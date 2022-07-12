import storage from './storage.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private encrypt: boolean = false;

  constructor() { }

  /**
   * 
   * @param encrypt 
   * @returns 
   */
  public config(encrypt: boolean) {
    this.encrypt = encrypt;
    return this;
  }

  /**
   * 
   * @param key 
   * @param value 
   */
  public set(key: string, value: any) {
    storage.set(key, value, {encrypt: this.encrypt});
  }

  /**
   * 
   * @param key 
   * @returns 
   */
  public get(key: string) {
    return storage.get(key, { decrypt: this.encrypt })
  }

  /**
   * 
   * @param key 
   * @returns 
   */
   public remove(key: string) {
    return storage.remove(key)
  }

}
