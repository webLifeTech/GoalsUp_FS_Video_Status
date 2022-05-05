import { Injectable, resolveForwardRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  serverURl: string = 'http://hdvideostatus.lifetechsapps.com/appv1/videoapi/';
  serverQuotesApiURl: string = '';
  constructor(
    public http: HttpClient
  ) { }

  get(url: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.serverURl + url).subscribe((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }

  post(url: string, data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.serverURl + url, data).subscribe((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }

  Qpost(url: string, data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.serverQuotesApiURl + url, data).subscribe((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }


  put(url?: string, data?: any) {
    return new Promise((resolve, reject) => {
      this.http.put(this.serverURl + url, data).subscribe((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }

  delete(url?: string, data?: any) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.serverURl + url + data).subscribe((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }

  postFormData(url?: string, formData?: FormData, options?) {
    return new Promise((resolve, reject) => {
      this.http.post(this.serverURl + url, formData).subscribe((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      })
    })
  }


}
