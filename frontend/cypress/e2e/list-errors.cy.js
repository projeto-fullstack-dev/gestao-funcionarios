describe('Erros nas listagens', () => {
  beforeEach(() => cy.login())
  const cases = [['funcionarios', 'Não foi possível carregar os funcionários.'], ['cargos', 'Não foi possível carregar os cargos.'], ['departamentos', 'Não foi possível carregar os departamentos.'], ['empresas', 'Não foi possível carregar as empresas.']]
  cases.forEach(([resource, message]) => it(`mostra o erro de ${resource} na listagem`, () => {
    cy.intercept('GET', `**/api/${resource}*`, { statusCode: 500, body: {} }).as('listRequest'); cy.visit(`/${resource}`); cy.wait('@listRequest')
    cy.get('.list-error').should('be.visible').and('contain.text', message); cy.get('.modal-overlay').should('not.exist')
  }))
})
