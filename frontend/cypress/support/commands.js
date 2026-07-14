Cypress.Commands.add('login', () => {
  cy.session('authenticated-user', () => {
    cy.visit('/login')
    cy.contains('label', 'Usuário').find('input').type(Cypress.env('login'))
    cy.contains('label', 'Senha').find('input').type(Cypress.env('senha'), { log: false })
    cy.contains('button', 'Entrar').click()
    cy.location('pathname').should('eq', '/funcionarios')
  })
})
Cypress.Commands.add('getToken', () => cy.request({ method: 'POST', url: `${Cypress.env('apiUrl')}/auth/login`, body: { login: Cypress.env('login'), senha: Cypress.env('senha') } }).its('body.token'))
