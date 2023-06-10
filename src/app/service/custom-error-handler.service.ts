import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor() { }
  handleError(error: unknown): void {
    // throw new Error('Method not implemented.');
    console.warn('Caught a custom error', error);
  }
}
