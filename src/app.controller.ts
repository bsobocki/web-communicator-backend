import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { testData } from './testdata/testData';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  postTestData(): testData {
    return {
      str: "Hello there!",
      nums: [42, 2137, 69]
    }
  }
}
