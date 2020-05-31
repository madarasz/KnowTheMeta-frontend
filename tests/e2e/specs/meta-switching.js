// https://docs.cypress.io/api/introduction/api.html
// https://medium.com/@itortv/how-to-integrate-cypress-and-cucumber-in-your-development-flow-in-just-a-few-weeks-96a46ac9165a
// https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/

describe('Meta Switching', () => {

  beforeEach (() => {
    cy.clearLocalStorage()
    // stub metas
    cy.server()
    cy.route('GET', 'https://alwaysberunning.net/ktm/metas.json', 'fixture:metas.json')
    cy.route('GET', 'https://alwaysberunning.net/ktm/uprising.json', 'fixture:uprising.json')
    cy.route('GET', 'https://alwaysberunning.net/ktm/uprising-booster-pack.json', 'fixture:uprising-booster-pack.json')
    // screen size
    cy.viewport(1000, 660)
  })

  const getStore = () => cy.window().its('app.$store')

  // checks meta data on identities
  function checkMetaIdentityData(side, meta) {
    cy.get(`[data-testid=table-popularity-${side}]`).find('tr').its('length').should('be.at.least', 6)
    cy.get(`#chart-popularity-${side}`).matchImageSnapshot(`chart-popularity-${side}-${meta}`)
    cy.get(`#chart-winrate-${side}`).matchImageSnapshot(`chart-winrate-${side}-${meta}`)
    cy.get(`#chart-side-winrate`).matchImageSnapshot(`chart-side-winrate-${meta}`)
  }

  it('Root visit gets forwarded to latest meta', () => {
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
    checkMetaIdentityData('runner', 'uprising')
    checkMetaIdentityData('corporation', 'uprising')
  }),

  it('Can change meta, meta is remembered', () => {
    cy.visit('/meta/uprising/ids')
    // save top popularity value
    cy.get('[data-testid=table-popularity-runner] > .v-data-table__wrapper > table > tbody > :nth-child(1) > .text-right').then(($cell) => {
      // navigate to second meta
      cy.get('[data-testid=icon-meta-select]')
        .click()
      cy.get('[data-testid=list-metas] > :nth-child(2)')
        .click()
        cy.get('[data-testid=table-popularity-runner] > .v-data-table__wrapper > table > tbody > :nth-child(1) > .text-right').then(($cellSecond) => {
          // check that the values are different for different metas
          expect($cellSecond.text()).not.to.eq($cell.text())
          checkMetaIdentityData('runner', 'uprising-booster-pack')
          checkMetaIdentityData('corporation', 'uprising-booster-pack')
        })
    })
    // check if selected meta is remembered
    cy.visit('/mwl')
    cy.contains('[data-testid=current-meta]', 'Uprising Booster Pack')
  })

  it('Can change meta, subview is remembered', () => {
    cy.visit('/meta/uprising/cards')
    cy.get('[data-testid=icon-meta-select]').click()
    cy.get('[data-testid=list-metas] > :nth-child(2)').click()
    cy.url().should('include', '/meta/uprising-booster-pack/cards')
  })

  it('If non-meta page is visited first, meta will be latest', () => {
    cy.visit('/mwl')
    cy.contains('[data-testid=current-meta] > .v-btn__content', 'Uprising')
  })
})
