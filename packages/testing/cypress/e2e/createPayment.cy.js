import { faker } from '@faker-js/faker';
import { generateRandomHex } from './generateRandomHex';

describe('complete payment spec', () => {
    it("list of payments", () => {
        cy.viewport('iphone-xr')
        cy.visit('/')
        cy.wait(2000);
        cy.get("#create").click();
        cy.screenshot("part1")
        // cy.get('#newList').click()
        for (let index = 0; index < 10; index++) {
            cy.get("#addInput").click();
            cy.get("#Amount" + index).clear().type(faker.number.float({ min: 0.5, max: 10, precision: 0.01 }))
            cy.get("#Receiver" + index).type(generateRandomHex())
            cy.get("#Date" + index).type("2023-11-16")
            if (index == 0) {
                cy.get("#Date" + index).type("2023-11-20")
            }
        }
        cy.screenshot("part2")
        cy.scrollTo('bottom')
        cy.get("#create").click();
        cy.scrollTo('bottom')
        cy.screenshot("part3")
        cy.get("#payId").click();
        cy.screenshot("part4")
    })
})