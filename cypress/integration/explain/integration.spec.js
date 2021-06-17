
describe('Test Explain Query Page', () => {
  it('Visits the explain page', () => {
    cy.visit('/explain');
  })

  it('Make example query', () => {
    //select the example query
    cy.get('.button:visible').contains('Example 1').click();
    cy.get('.button:visible').contains('Continue').click();

    //select the first option
    cy.get('tr:visible').find('input').first().click();
    cy.get('.button:visible').contains('Continue').click();
  })
});