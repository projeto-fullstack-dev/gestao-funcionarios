describe('Autenticação e sessão', () => {
  it('redireciona uma rota privada para o login', () => { cy.clearCookies(); cy.clearAllSessionStorage(); cy.visit('/funcionarios'); cy.location('pathname').should('eq', '/login') })
  it('exibe Toastify para credenciais inválidas', () => {
    cy.visit('/login'); cy.contains('label', 'Usuário').find('input').type('invalido'); cy.contains('label', 'Senha').find('input').type('invalida'); cy.get('[aria-label="Mostrar senha"]').click(); cy.contains('label', 'Senha').find('input').should('have.attr', 'type', 'text'); cy.contains('button', 'Entrar').click()
    cy.get('.Toastify__toast--error').should('be.visible'); cy.location('pathname').should('eq', '/login'); cy.get('[aria-label="Ocultar senha"]').should('be.visible').click(); cy.contains('label', 'Senha').find('input').should('have.attr', 'type', 'password')
  })
  it('autentica e encerra a sessão', () => { cy.login(); cy.visit('/funcionarios'); cy.contains('h1', 'Funcionários').should('be.visible'); cy.contains('button', 'Sair').click(); cy.location('pathname').should('eq', '/login') })
})
