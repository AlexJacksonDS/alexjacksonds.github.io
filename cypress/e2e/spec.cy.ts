describe('template spec', () => {
  it('passes', () => {
    cy.viewport(1897, 1154)
    cy.visit('http://localhost:3000/Transamerica');
    cy.contains('Reset Board').click();

    cy.get('.clipLine').each(($el, index, $list) => {
      if ($el.hasClass("unconnected") || $el.hasClass("unconnectedTwo")) {
        cy.wrap($el).click({force: true});
      }
    });

    cy.get('.clipLine').each(($el, index, $list) => {
      if ($el.hasClass("unconnected") || $el.hasClass("unconnectedTwo")) {
        cy.wrap($el).click({force: true});
      }
    });

    cy.get('.clipLine').each(($el, index, $list) => {
      if ($el.hasClass("unconnected") || $el.hasClass("unconnectedTwo")) {
        cy.wrap($el).click({force: true});
      }
    });

    cy.get('.clipLine').each(($el, index, $list) => {
      if ($el.hasClass("unconnected") || $el.hasClass("unconnectedTwo")) {
        cy.wrap($el).click({force: true});
      }
    });

    cy.get('.clipLine').each(($el, index, $list) => {
      if ($el.hasClass("unconnected") || $el.hasClass("unconnectedTwo")) {
        cy.wrap($el).click({force: true});
      }
    });

    cy.get('.clipLine').each(($el, index, $list) => {
      if ($el.hasClass("unconnected") || $el.hasClass("unconnectedTwo")) {
        cy.wrap($el).click({force: true});
      }
    });
  })
})