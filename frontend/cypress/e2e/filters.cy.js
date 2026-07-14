describe('Filtros e paginação', () => {
  beforeEach(() => cy.login())

  const expectQuery = (interception, expected) => {
    const query = new URL(interception.request.url).searchParams
    Object.entries(expected).forEach(([name, value]) => expect(query.get(name), name).to.equal(value))
  }

  it('pesquisa cargos na página zero e preserva o filtro ao paginar', () => {
    cy.intercept('GET', '**/api/cargos*', (request) => request.reply({ content: [], number: Number(request.query.page), totalPages: 2 })).as('cargos')
    cy.visit('/cargos'); cy.wait('@cargos')
    cy.contains('label', 'Descrição do Cargo').find('input').type('Desenvolvedor'); cy.contains('button', 'Pesquisar').click()
    cy.wait('@cargos').then((interception) => expectQuery(interception, { descricao: 'Desenvolvedor', page: '0', size: '5' }))
    cy.contains('button', 'Próxima').click()
    cy.wait('@cargos').then((interception) => expectQuery(interception, { descricao: 'Desenvolvedor', page: '1', size: '5' }))
  })

  it('envia os filtros de funcionários para o endpoint', () => {
    cy.intercept('GET', '**/api/funcionarios*').as('funcionarios'); cy.visit('/funcionarios'); cy.wait('@funcionarios')
    cy.contains('label', 'Nome do Funcionário').find('input').type('Ana'); cy.contains('label', 'CPF').find('input').type('52998224725'); cy.contains('button', 'Pesquisar').click()
    cy.wait('@funcionarios').then((interception) => expectQuery(interception, { nome: 'Ana', cpf: '529.982.247-25', page: '0', size: '5' }))
  })

  it('envia os filtros de departamentos para o endpoint', () => {
    cy.intercept('GET', '**/api/departamentos*').as('departamentos'); cy.visit('/departamentos'); cy.wait('@departamentos')
    cy.contains('label', 'Descrição do Departamento').find('input').type('Tecnologia'); cy.contains('button', 'Pesquisar').click()
    cy.wait('@departamentos').then((interception) => expectQuery(interception, { descricao: 'Tecnologia', page: '0', size: '5' }))
  })

  it('envia os filtros de empresas para o endpoint', () => {
    cy.intercept('GET', '**/api/empresas*').as('empresas'); cy.visit('/empresas'); cy.wait('@empresas')
    cy.contains('label', 'Razão Social').find('input').type('Dixi Ltda'); cy.contains('button', 'Pesquisar').click()
    cy.wait('@empresas').then((interception) => expectQuery(interception, { razaoSocial: 'Dixi Ltda', page: '0', size: '5' }))
  })
})
