import { faker } from '@faker-js/faker';
import { generateRandomHex } from './generateRandomHex';
import clipboard from 'clipboardy';

import address from "../../../contract/address.json"

const total = 5;

describe('invoice spec', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr') // Set viewport to 375px x 667px
    cy.visit('/invoice')
  })
  describe("invoice", async () => {
    it('write address', async () => {
      cy.get('#selectInput').select('Custom');
      cy.get("#tokenAddress").clear().type(address.token)
      for (let index = 1; index < total; index++) {
        cy.get('#addElement').click()
      }
      for (let index = 0; index < total; index++) {
        cy.get(`#address${index}`).type(generateRandomHex())
        cy.get(`#name${index}`).type(faker.internet.userName())
        cy.get(`#notes${index}`).type(faker.lorem.lines(1))
        cy.get(`#quantity${index}`).type(faker.number.int({ min: 1, max: 10 }))
        cy.get(`#amount${index}`).type(faker.number.float({ min: 0.5, max: 10, precision: 0.01 }))
      }
      cy.get("#upload").click();
      cy.get("#clipboard").click();
      cy.get('#back').click()
      cy.get('#payment').click()
      cy.window().then(async (win) => {
        const text = await win.navigator.clipboard.readText()
        cy.get(`#findInput`).type(text)
        cy.get('#findButton').click()
        cy.get('#Appove').click()
        cy.wait(2000)
        cy.get('#sendTranscation').click()
      })

    })
  })
})