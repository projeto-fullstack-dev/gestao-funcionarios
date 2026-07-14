describe('Fluxos obrigatórios de Funcionários', () => {
  const created = { funcionarios: [], cargos: [], departamentos: [], empresas: [] }
  const stamp = `${Date.now()}`
  let references

  function request(token, method, resource, body) {
    return cy.request({ method, url: `${Cypress.env('apiUrl')}/${resource}`, headers: { Authorization: `Bearer ${token}` }, body })
      .then((response) => { if (response.body?.id) created[resource].push(response.body.id); return response.body })
  }

  beforeEach(() => {
    cy.login()
    cy.getToken().then((token) => {
      request(token, 'POST', 'empresas', { nome: `Empresa E2E ${stamp}`, razaoSocial: `Empresa E2E ${stamp} Ltda.`, cnpj: '45.723.174/0001-10' }).then((empresa) => {
        request(token, 'POST', 'cargos', { codigo: `FUNC-${stamp}`, descricao: `Cargo Funcionário ${stamp}` }).then((cargo) => {
          request(token, 'POST', 'departamentos', { codigo: `DEP-${stamp}`, descricao: `Departamento Funcionário ${stamp}` }).then((departamento) => { references = { empresa, cargo, departamento } })
        })
      })
    })
  })

  afterEach(() => {
    cy.getToken().then((token) => {
      ;['funcionarios', 'cargos', 'departamentos', 'empresas'].forEach((resource) => {
        created[resource].splice(0).forEach((id) => cy.request({ method: 'DELETE', url: `${Cypress.env('apiUrl')}/${resource}/${id}`, headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false }))
      })
    })
  })

  function employeePayload(index) {
    return {
      nome: `Funcionário Paginação ${stamp} ${index}`,
      cpf: `900.000.00${index}-${String(index).padStart(2, '0')}`,
      vinculos: [{ empresa: { id: references.empresa.id }, matricula: `${stamp.slice(-7)}${index}`, cargo: { id: references.cargo.id }, departamento: { id: references.departamento.id }, ativo: true }],
    }
  }

  it('cadastra funcionário com vínculo completo e edita vínculo existente', () => {
    const name = `Funcionário Interface ${stamp}`
    cy.visit('/funcionarios/novo')
    cy.contains('label', 'Nome do Funcionário').find('input').type(name)
    cy.contains('label', 'CPF').find('input').type('52998224725')
    cy.contains('button', 'Novo Vínculo').click()
    cy.contains('label', 'Empresa').find('select').select(references.empresa.nome)
    cy.contains('label', 'Matrícula').find('input').type(`${stamp.slice(-8)}1`)
    cy.contains('label', 'Cargo').find('select').select(references.cargo.descricao)
    cy.contains('label', 'Departamento').find('select').select(references.departamento.descricao)
    cy.contains('.modal', 'Confirmar').click()
    cy.intercept('POST', '**/api/funcionarios').as('create')
    cy.contains('button', 'Confirmar').click()
    cy.wait('@create').then(({ response }) => { expect(response.statusCode).to.eq(200); created.funcionarios.push(response.body.id) })
    cy.contains('td', name).parents('tr').within(() => cy.contains('button', 'Editar').click())
    cy.contains('tbody tr', references.cargo.descricao).within(() => cy.contains('button', 'Editar').click())
    cy.contains('label', 'Matrícula').find('input').clear().type(`${stamp.slice(-8)}2`)
    cy.contains('.modal', 'Confirmar').click()
    cy.intercept('PUT', '**/api/funcionarios/*').as('update')
    cy.contains('button', 'Confirmar').click()
    cy.wait('@update').its('response.statusCode').should('eq', 200)
  })

  it('pesquisa, pagina e gera relatório', () => {
    cy.getToken().then((token) => {
      for (let index = 1; index <= 6; index += 1) request(token, 'POST', 'funcionarios', employeePayload(index))
    })
    cy.visit('/funcionarios')
    cy.contains('label', 'Nome do Funcionário').find('input').type(`Funcionário Paginação ${stamp}`)
    cy.intercept('GET', '**/api/funcionarios*').as('search')
    cy.contains('button', 'Pesquisar').click()
    cy.wait('@search').its('response.statusCode').should('eq', 200)
    cy.contains('Página 1 de 2').should('be.visible')
    cy.contains('button', 'Próxima').click()
    cy.contains('Página 2 de 2').should('be.visible')
    cy.intercept('GET', '**/api/relatorios/FUNCIONARIOS').as('report')
    cy.contains('button', 'Baixar Relatório').click()
    cy.wait('@report').its('response.statusCode').should('eq', 200)
    cy.get('.Toastify__toast--success', { timeout: 15000 }).should('contain.text', 'Relatório gerado com sucesso.')
  })
})
