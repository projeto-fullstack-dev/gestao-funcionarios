describe('Responsividade', () => {
  beforeEach(() => cy.login())
  it('mantém a navegação acessível no mobile', () => { cy.viewport(390, 844); cy.visit('/funcionarios'); cy.get('.sidebar').should('be.visible'); cy.contains('a', 'Empresa').click(); cy.location('pathname').should('eq', '/empresas'); cy.contains('h1', 'Empresas').should('be.visible') })
})
