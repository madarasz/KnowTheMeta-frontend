// https://docs.cypress.io/api/introduction/api.html
// https://medium.com/@itortv/how-to-integrate-cypress-and-cucumber-in-your-development-flow-in-just-a-few-weeks-96a46ac9165a
// https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/

describe('Meta Switching', () => {

  const getStore = () => cy.window().its('app.$store')

  it('root visit gets forwarded to latest meta', () => {
    // stub metas.json
    cy.server()
    cy.route('GET', 'https://alwaysberunning.net/ktm/metas.json', 'fixture:metas.json')
    // visit /
    cy.visit('/')
    cy.contains('div', 'Know the Meta')
    // check forwarding works
    cy.url().should('include', '/meta/')
    // check store values
    getStore().its('state.metas').should('have.keys', ['currentMetaCode', 'metaData', 'metaList'])
    getStore().its('state.metas.currentMetaCode').should('not.be.null')
    getStore().its('state.metas.metaList').should('have.length.of.at.least', 1)
    getStore().its('state.metas.metaData').should('not.have.key', undefined)
    getStore().its('state.metas.metaData').should('have.key', 'uprising')
    // check data
    cy.get('#table-popularity-runner').find('tr').its('length').should('be.at.least', 6)
    cy.get('#table-popularity-corporation').find('tr').its('length').should('be.at.least', 6)
    cy.get('#chart-popularity-runner > #pie-chart')
    cy.get('#chart-popularity-corporation > #pie-chart')
    cy.get('#chart-winrate-runner > #horizontalbar-chart')
    cy.get('#chart-winrate-corporation > #horizontalbar-chart')
  }),

  it('Can change meta', () => {
    cy.visit('/')
    cy.get('#icon-meta-select')
      .click()
  })
})
