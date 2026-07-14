const catalogs = [
  { resource: 'cargos', title: 'Cargos', singular: 'Cargo', report: 'CARGOS' },
  { resource: 'departamentos', title: 'Departamentos', singular: 'Departamento', report: 'DEPARTAMENTOS' },
]

catalogs.forEach(({ resource, title, singular, report }) => {
  describe(`Fluxos obrigatórios de ${title}`, () => {
    const ids = []
    const stamp = `${Date.now()}${resource === 'cargos' ? 1 : 2}`
    const apiUrl = () => `${Cypress.env('apiUrl')}/${resource}`

    beforeEach(() => cy.login())

    afterEach(() => {
      cy.getToken().then((token) => {
        ids.splice(0).forEach((id) => cy.request({ method: 'DELETE', url: `${apiUrl()}/${id}`, headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false }))
      })
    })

    function createByApi(token, index) {
      return cy.request({
        method: 'POST', url: apiUrl(), headers: { Authorization: `Bearer ${token}` },
        body: { codigo: `E2E-${stamp}-${index}`, descricao: `${singular} E2E ${stamp} ${index}` },
      }).then(({ body }) => { ids.push(body.id); return body })
    }

    it('cadastra e edita pela interface', () => {
      const code = `UI-${stamp}`
      const description = `${singular} Interface ${stamp}`
      const edited = `${description} Editado`
      cy.intercept('POST', `**/api/${resource}`).as('create')
      cy.visit(`/${resource}/novo`)
      cy.contains('label', `Descrição do ${singular}`).find('input').type(description)
      cy.contains('label', `Código do ${singular}`).find('input').type(code)
      cy.contains('button', 'Confirmar').click()
      cy.wait('@create').then(({ response }) => { expect(response.statusCode).to.eq(200); ids.push(response.body.id) })
      cy.contains('td', code).parents('tr').within(() => cy.contains('button', 'Editar').click())
      cy.intercept('PUT', `**/api/${resource}/*`).as('update')
      cy.contains('label', `Descrição do ${singular}`).find('input').clear().type(edited)
      cy.contains('button', 'Confirmar').click()
      cy.wait('@update').its('response.statusCode').should('eq', 200)
      cy.contains('td', edited).should('be.visible')
    })

    it('pesquisa, pagina e gera relatório', () => {
      cy.getToken().then((token) => {
        for (let index = 1; index <= 6; index += 1) createByApi(token, index)
      })
      cy.visit(`/${resource}`)
      cy.contains('label', 'Código').find('input').type(`E2E-${stamp}`)
      cy.intercept('GET', `**/api/${resource}*`).as('search')
      cy.contains('button', 'Pesquisar').click()
      cy.wait('@search').its('response.statusCode').should('eq', 200)
      cy.contains('Página 1 de 2').should('be.visible')
      cy.contains('button', 'Próxima').click()
      cy.contains('Página 2 de 2').should('be.visible')
      cy.intercept('GET', `**/api/relatorios/${report}`).as('report')
      cy.contains('button', 'Baixar Relatório').click()
      cy.wait('@report').its('response.statusCode').should('eq', 200)
      cy.get('.Toastify__toast--success', { timeout: 15000 }).should('contain.text', 'Relatório gerado com sucesso.')
    })
  })
})
