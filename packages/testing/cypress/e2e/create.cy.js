import { faker } from '@faker-js/faker';
import { generateRandomHex } from './generateRandomHex';

describe('create spec', () => {
    it("list of payments", () => {
        cy.viewport('iphone-xr')
        cy.visit('/create')
        cy.get('#newList').click()
        for (let index = 0; index < 3; index++) {
            cy.get("#addInput").click();
            cy.get("#Amount" + index).type(faker.number.float({ min: 0.5, max: 10, precision: 0.01 }))
            cy.get("#Receiver" + index).type(generateRandomHex())
            cy.get("#Date" + index).type("2023-11-13")
        }
        cy.get("#submit").click();
        cy.get("#current").click();
        cy.get("#create").click();
        // cy.get("#payId").click();
    })
})