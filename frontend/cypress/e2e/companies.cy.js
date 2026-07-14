describe('Cadastro de empresas', () => {
  beforeEach(() => cy.login())
  it('cadastra, edita e exclui pela interface', () => {
    const name = `Empresa Cypress ${Date.now()}`; const editedName = `${name} Editada`; const cnpj = '45.723.174/0001-10'
    cy.getToken().then((token) => cy.request({ url: `${Cypress.env('apiUrl')}/empresas?cnpj=${encodeURIComponent(cnpj)}&size=100`, headers: { Authorization: `Bearer ${token}` } }).its('body.content').then((items) => items.forEach((item) => cy.request({ method: 'DELETE', url: `${Cypress.env('apiUrl')}/empresas/${item.id}`, headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false }))))
    cy.intercept('POST', '**/api/empresas').as('createCompany'); cy.visit('/empresas/nova'); cy.contains('label', 'Nome').find('input').type(name); cy.contains('label', 'Razão Social').find('input').type(`${name} Ltda.`); cy.contains('label', 'CNPJ').find('input').type(cnpj); cy.contains('button', 'Confirmar').click()
    cy.wait('@createCompany').its('response.statusCode').should('eq', 200); cy.location('pathname').should('eq', '/empresas'); cy.contains('td', name).parents('tr').within(() => cy.get('.icon-button').first().click())
    cy.intercept('PUT', '**/api/empresas/*').as('updateCompany'); cy.contains('label', 'Nome').find('input').clear().type(editedName); cy.contains('button', 'Confirmar').click(); cy.wait('@updateCompany').its('response.statusCode').should('eq', 200); cy.contains('td', editedName).parents('tr').within(() => cy.get('.icon-button.danger').click())
    cy.intercept('DELETE', '**/api/empresas/*').as('deleteCompany'); cy.get('.modal').contains('button', 'Excluir').click(); cy.wait('@deleteCompany').its('response.statusCode').should('eq', 204); cy.contains('td', editedName).should('not.exist')
  })
})
