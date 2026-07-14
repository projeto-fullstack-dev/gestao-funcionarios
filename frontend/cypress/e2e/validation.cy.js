describe('Validação dos cadastros', () => {
  beforeEach(() => cy.login())
  it('valida cargo em tempo real', () => { cy.visit('/cargos/novo'); cy.contains('label', 'Descrição').find('input').type('A').blur(); cy.contains('Use pelo menos 2 caracteres.').should('be.visible'); cy.contains('button', 'Confirmar').click(); cy.contains('Informe o código.').should('be.visible') })
  it('valida CPF e sua máscara', () => {
    cy.visit('/funcionarios/novo'); cy.contains('label', 'CPF').find('input').type('11111111111').blur(); cy.contains('Informe um CPF válido.').should('be.visible')
    cy.contains('label', 'CPF').find('input').clear().type('52998224725').should('have.value', '529.982.247-25'); cy.contains('Informe um CPF válido.').should('not.exist')
  })
  it('aceita somente números na matrícula', () => {
    cy.visit('/funcionarios/novo'); cy.contains('button', 'Novo Vínculo').click(); cy.contains('label', 'Matrícula').find('input').type('ABC123'); cy.contains('.modal', 'Confirmar').click()
    cy.contains('A matrícula deve conter apenas números.').should('be.visible')
  })
  it('valida CNPJ e sua máscara', () => {
    cy.visit('/empresas/nova'); cy.contains('label', 'CNPJ').find('input').type('11111111111111').blur(); cy.contains('Informe um CNPJ válido.').should('be.visible')
    cy.contains('label', 'CNPJ').find('input').clear().type('11222333000181').should('have.value', '11.222.333/0001-81')
  })
})
