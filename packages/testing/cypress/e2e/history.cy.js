describe('pages', () => {
    beforeEach(() => {
        cy.visit('/historic')
    })
    it('have payments', () => {
        cy.get('h1').contains('Historic');
        cy.wait(1000)
        cy.get('.Title').each((item) => {
            cy.wrap(item).invoke('text').should('not.be.empty'); 
            cy.wrap(item).click();
          })
    })
})