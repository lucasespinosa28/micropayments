import { faker } from '@faker-js/faker';
import { generateRandomHex } from './generateRandomHex';

describe('create spec', () => {
    it("list of payments", () => {
        cy.viewport('iphone-xr')
        cy.visit('/create')
        // cy.get('#newList').click()
        for (let index = 0; index < 3; index++) {
            cy.get("#addInput").click();
            cy.get("#Amount" + index).clear().type(faker.number.float({ min: 0.5, max: 10, precision: 0.01 }))
            cy.get("#Receiver" + index).type(generateRandomHex())
            cy.get("#Date" + index).type("2023-11-13")
            if (index == 1) {
                cy.get("#Date" + index).type("2023-11-14")
            }
        }
        // cy.get("#submit").click();
        // cy.get("#current").click();
        cy.scrollTo('bottom')
        cy.get("#create").click();
        cy.scrollTo('bottom')
        cy.get("#payId").click();

        // cy.get(".approve").each(($el) => {
        //     cy.wrap($el).click();
        //     cy.wait(1500);
        // });

        // cy.get(".deposit").each(($el) => {
        //     cy.wrap($el).click();
        //     cy.wait(1500);
        // });

        cy.get(".cancel").first().click();
    })
})