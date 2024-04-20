import { Injectable } from '@nestjs/common';
import { LocalStorageRepository } from './database/LocalStorageRepository';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'This server is running! :)';
  }
}
