import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Result } from './result';

@Injectable()
export class AppService {
  getHello(): Result {
    return { success: true, message: 'Hello World!' };
  }
  postSave(params: any, body: string): Result {
    if (params.id == undefined) {
      return { success: false, message: 'id undefined' };
    }
    try {
      writeFileSync(
        join(process.cwd(), `storage/${params.id}.json`),
        JSON.stringify(body),
        {
          encoding: 'utf8',
          flag: 'w',
        },
      );
      return {
        success: true,
        message: `Data was saved successfully with id: ${params.id}`,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  getRead(params: any) {
    if (params.id == undefined) {
      return { success: false, message: 'id undefined' };
    }
    try {
      const file = readFileSync(
        join(process.cwd(), `storage/${params.id}.json`),
        {
          encoding: 'utf8',
          flag: 'r',
        },
      );
      return {
        success: true,
        message: JSON.parse(file),
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
