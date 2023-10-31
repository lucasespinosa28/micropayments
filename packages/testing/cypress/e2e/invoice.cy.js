import { faker } from '@faker-js/faker';
import { generateRandomHex } from './generateRandomHex';

import address from "../../../contract/address.json" 

describe('invoice spec', () => {
  beforeEach(() => {
    cy.visit('/invoice')
  })
  describe("invoice", () => {
    it('write address', () => {
      cy.get('#selectInput').select('Custom');
      cy.get("#tokenAddress").clear().type(address.token)
      for (let index = 0; index < 9; index++) {
        cy.get('#addElement').click()
      }
      for (let index = 0; index < 10; index++) {
        cy.get(`#address${index}`).type(generateRandomHex())
        cy.get(`#name${index}`).type(faker.internet.userName())
        cy.get(`#notes${index}`).type(faker.lorem.lines(1))
        cy.get(`#quantity${index}`).type(faker.number.int({ min:1, max: 10 }))
        cy.get(`#amount${index}`).type(faker.number.float({ min: 0.5, max: 10, precision: 0.01 }) )
      }
      cy.get("#upload").click();
    })
  })
})