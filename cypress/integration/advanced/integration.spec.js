// integration.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe('Test Advanced Query Page', () => {
  it('Visits the advanced page', () => {
    cy.visit('/explorer/advanced');
  })

  // it('Reset things to make screenshots work', () => {
  //   cy.get('html').invoke('css', 'height', 'initial');
  //   cy.get('body').invoke('css', 'height', 'initial');
  // })

  it('Can add nodes', () => {
    cy.get('.button').contains('Add Node').click();
    cy.get('#cy').click(100, 100);
    cy.get('#cy').click(100, 300);
    cy.get('#cy').click(300, 100);
    cy.get('#cy').click(500, 100);
    cy.get('#cy').click(300, 300);
    // cy.screenshot('add-nodes');
  })
  
  it('Can add edges', () => {
    cy.get('.button').contains('Add Edge').click();
    cy.get('#cy').then($el => $el[0].getBoundingClientRect()).then((rect) => {
      cy.get('#cy').trigger('mousedown', { which: 1, clientX: rect.x + 100, clientY: rect.y + 100 })
        .trigger('mousemove', { which: 1, clientX: rect.x + 300, clientY: rect.y + 100 })
        .trigger('mouseup');
      cy.get('#cy').trigger('mousedown', { which: 1, clientX: rect.x + 100, clientY: rect.y + 100 })
        .trigger('mousemove', { which: 1, clientX: rect.x + 100, clientY: rect.y + 300 })
        .trigger('mouseup');
      cy.get('#cy').trigger('mousedown', { which: 1, clientX: rect.x + 100, clientY: rect.y + 100 })
        .trigger('mousemove', { which: 1, clientX: rect.x + 300, clientY: rect.y + 300 })
        .trigger('mouseup');
    });
    
    // cy.screenshot('add-edges');
  })

  it('Can remove nodes', () => {
    cy.get('#cy').rightclick(500, 100);
    cy.get('#cy').rightclick(100, 300);
    // cy.screenshot('remove-nodes');
  })

  it('Can remove edges', () => {
    //remove edge only
    cy.get('#cy').rightclick(100, 200);
    //remove node and edge
    cy.get('#cy').rightclick(300, 300);
    // cy.screenshot('remove-edges');
  })

  it('Can enter a sample query', () => {
    cy.get('.button').contains('Edit').click();
    cy.get('#cy').click();
    cy.wait(500);
    cy.get('#cy').click(100, 100);
    cy.get('.tippy-content:visible').find('.multiple').first().click().type('MONDO:0005737');
    cy.get('.tippy-content:visible').find('.addition').click();
    cy.get('.tippy-content:visible').find('.multiple').eq(1).click().type('disease');
    cy.get('.tippy-content:visible').find('.item').first().click();

    cy.get('#cy').click();
    cy.wait(500);
    cy.get('#cy').click(300, 100);
    cy.get('.tippy-content:visible').find('.multiple').eq(1).click().type('gene');
    cy.get('.tippy-content:visible').find('.item').first().click();
  })
  
  // it('Can specify and remove an input', () => {
  //   cy.get('.button').contains('Edit').click();
  //   cy.get('#cy').click(100, 100);
  //   cy.get('.tippy-content:visible').find('.multiple').first().click().type('ebola');
  //   cy.get('.tippy-content:visible').find('.addition').click();
  //   cy.get('.tippy-content:visible').find('.delete').click();
  // })

  // it('Can enter a sample query', () => {
  //   cy.get('#cy').click();
  //   cy.wait(500);
  //   cy.get('#cy').click(100, 100);
  //   cy.get('.tippy-content:visible').find('.multiple').first().click().type('ebola');
  //   cy.get('.tippy-content:visible').find('.item').contains('Ebola hemorrhagic fever').click();
  //   cy.get('#cy').click();
  //   cy.wait(500);
  //   cy.get('#cy').click(300, 100);
  //   cy.get('.tippy-content:visible').find('.multiple').eq(1).click().type('gene');
  //   cy.get('.tippy-content:visible').find('.item').first().click();
  // })

  it('Can successfully make a query', () => {
    cy.get('.button:visible').contains('Query').click();
    cy.get('table:visible', { timeout: 15000}).should('exist');
  })

  it('Has a popup when an entry is clicked', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(2)').click();
    cy.get('.popup:visible').contains('equivalent_identifiers').should('exist');
    cy.get('tbody > :nth-child(1) > :nth-child(3)').click();
    cy.get('.popup:visible').contains('Publications').should('exist');
    cy.get('tbody > :nth-child(1) > :nth-child(4)').click();
    cy.get('.popup:visible').contains('equivalent_identifiers').should('exist');
  })

  it('Can add/remove things on graph from table', () => {
    //make sure item gets added
    cy.get('tbody > :nth-child(1) > :nth-child(5)').find('.checkbox').click();
    cy.get('#cy').click();
    cy.get('#cy').click(300, 100); 
    cy.get('.tippy-content:visible').find('.multiple').first().find('.label').should('exist');

    //make sure item can be removed
    cy.get('tbody > :nth-child(1) > :nth-child(5)').find('.checkbox').click();
    cy.get('#cy').click();
    cy.get('#cy').click(300, 100); 
    cy.get('.tippy-content:visible').find('.multiple').first().find('.label').should('not.exist');
  })

  it('Can sort', () => {
    cy.get('.button:visible').contains('Sort').click();
    cy.get('.accordion:visible').find('.title').contains('target').click();
    cy.get('.accordion:visible').find('.content:visible').find('button').contains('name').click();
    cy.get('tbody > :nth-child(1) > :nth-child(4)').contains('td', /^A/);
    cy.get('thead > tr > :nth-child(4)').click();
    cy.get('tbody > :nth-child(1) > :nth-child(4)').contains('td', /^Z/);

  })

  it('Can filter', () => {
    //make sure when affected_by option is selected, all of the entries are affected_by
    cy.get('.button:visible').contains('Filter').click();
    cy.get('.accordion:visible').find('.title').contains('edge').click();
    cy.get('.accordion:visible').find('.content:visible').find('.title').contains('predicate').click();
    cy.get('.multiple:visible').first().click().type('affected');
    cy.get('.item:visible').contains('affected').click();
    cy.get('tbody > :nth-child(n) > :nth-child(3)').each(($el, index, $list) => {
      cy.wrap($el).contains('affected');
    })
  })
});