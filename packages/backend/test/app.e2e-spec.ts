import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { join } from 'path';
import { unlinkSync } from 'fs';
import { Json } from 'src/json';

const file = join(process.cwd(), `storage/55.json`);

const result = {
  success: true,
  message: [
    {
      address: '0',
      name: '0',
      note: '0',
      quantity: '0',
      amount: '0',
    },
    {
      address: '1',
      name: '1',
      note: '1',
      quantity: '1',
      amount: '1',
    },
    {
      address: '2',
      name: '2',
      note: '2',
      quantity: '2',
      amount: '2',
    },
    {
      address: '3',
      name: '3',
      note: '3',
      quantity: '3',
      amount: '3',
    },
    {
      address: '4',
      name: '4',
      note: '4',
      quantity: '4',
      amount: '4',
    },
    {
      address: '5',
      name: '5',
      note: '5',
      quantity: '5',
      amount: '5',
    },
    {
      address: '6',
      name: '6',
      note: '6',
      quantity: '6',
      amount: '6',
    },
    {
      address: '7',
      name: '7',
      note: '7',
      quantity: '7',
      amount: '7',
    },
    {
      address: '8',
      name: '8',
      note: '8',
      quantity: '8',
      amount: '8',
    },
    {
      address: '9',
      name: '9',
      note: '9',
      quantity: '9',
      amount: '9',
    },
  ],
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    try {
      unlinkSync(file);
      //console.log('File is deleted.');
    } catch (error) {
      console.error(error);
    }
  });
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ success: true, message: 'Hello World!' });
  });
  it('/save (POST)', () => {
    const json: Json[] = [];
    for (let index = 0; index < 10; index++) {
      json.push({
        address: index.toString(),
        name: index.toString(),
        note: index.toString(),
        quantity: index.toString(),
        amount: index.toString(),
      });
    }

    return request(app.getHttpServer())
      .post('/save/55')
      .set('Accept', 'application/json')
      .send(json)
      .expect(201)
      .expect({
        success: true,
        message: 'Data was saved successfully with id: 55',
      });
  });
  it('/read (GET)', () => {
    return request(app.getHttpServer())
      .get('/read/55')
      .expect(200)
      .expect(result);
  });
});
