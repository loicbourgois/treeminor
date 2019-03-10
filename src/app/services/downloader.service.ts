import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  constructor(private http: HttpClient) { }

  getTextFile(filename: string) {
    return this.http.get(filename, {responseType: 'text'})
      .pipe(
        tap(
          data => this.log(filename, data),
          error => this.logError(filename, error)
        )
      );
  }

  log(filename, data) {
    console.log('Finished downloading ', filename);
  }

  logError(filename, error) {
    console.error(filename, error);
  }
}
