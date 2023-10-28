import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Result } from './result';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Result {
    return this.appService.getHello();
  }
  @Post('save/:id')
  postSave(@Param() params: any, @Body() body: string): Result {
    return this.appService.postSave(params, body);
  }
  @Get('read/:id')
  getRead(@Param() params: any): Result {
    return this.appService.getRead(params);
  }
}
