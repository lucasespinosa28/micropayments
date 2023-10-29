import { faker } from '@faker-js/faker';
import { generateRandomHex } from './generateRandomHex';

describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/invoice')
  })
  describe("table", () => {
    it('delete table', () => {
      for (let index = 0; index < 3; index++) {
        cy.get('#addElement').click()
      }
      cy.get(`#remove1`).click()
    })
    it('create table', () => {
      for (let index = 0; index < 10; index++) {
        cy.get(`#address${index}`).should('exist')
        cy.get('#addElement').click()
      }
    })
    it('write address', () => {
      for (let index = 0; index < 9; index++) {
        cy.get('#addElement').click()
      }
      for (let index = 0; index < 10; index++) {
        cy.get(`#address${index}`).type(generateRandomHex())
        cy.get(`#name${index}`).type(faker.internet.userName())
        cy.get(`#notes${index}`).type(faker.lorem.lines(1))
        cy.get(`#quantity${index}`).type(faker.number.int({ mine:1, max: 10 }))
        cy.get(`#amount${index}`).type(faker.number.float({ min: 10, max: 100, precision: 0.01 }) )
      }
    })
  })
})