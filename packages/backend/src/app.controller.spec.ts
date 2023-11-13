import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Json } from './json';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';

const file = join(process.cwd(), `storage/100.json`);
const dummy = () => `${new Date().getMilliseconds()}`;

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  afterAll(async () => {
    try {
      unlinkSync(file);
      //console.log('File is deleted.');
    } catch (error) {
      console.error(error);
    }
  });
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toStrictEqual({
        success: true,
        message: 'Hello World!',
      });
    });
    it('should write file', () => {
      const params = {
        id: 100,
      };
      const json: Json[] = [];
      for (let index = 0; index < 10; index++) {
        json.push({
          address: dummy(),
          name: dummy(),
          note: dummy(),
          quantity: dummy(),
          amount: dummy(),
        });
      }
      expect(
        appController.postSave(params, JSON.stringify(json)),
      ).toStrictEqual({
        success: true,
        message: 'Data was saved successfully with id: 100',
      });
      expect(existsSync(file)).toBeTruthy();
    });
    it('should read file', () => {
      const params = {
        id: 100,
      };
      const json: Json[] = [];
      for (let index = 0; index < 10; index++) {
        json.push({
          address: dummy(),
          name: dummy(),
          note: dummy(),
          quantity: dummy(),
          amount: dummy(),
        });
      }
      expect(appController.getRead(params).success).toBeTruthy();
      expect(
        JSON.parse(appController.getRead(params).message).length,
      ).toBeGreaterThanOrEqual(10);
    });
  });
});
