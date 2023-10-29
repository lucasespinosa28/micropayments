import { faker } from '@faker-js/faker';
import { generateRandomHex } from './generateRandomHex';

describe('pages', () => {
    beforeEach(() => {
        cy.visit('/')
    })
    it('Home', () => {
        cy.get('h1').contains('dev');
    })
    it('History', () => {
        cy.get('#historic').click()
        cy.get('h1').contains('Historic');
        cy.get('#back').click()
        cy.get('h1').contains('dev');
    })
    it('Invoice', () => {
        cy.get('#invoice').click()
        cy.get('h1').contains('Invoice');
        cy.get('#back').click()
        cy.get('h1').contains('dev');
    })
    it('Payment', () => {
        cy.get('#payment').click()
        cy.get('h1').contains('Payment');
        cy.get('#back').click()
        cy.get('h1').contains('dev');
    })
})