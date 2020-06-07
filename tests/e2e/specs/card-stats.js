describe('Card Stats', () => {

    beforeEach (() => {
      cy.clearLocalStorage()
      // stub metas
      cy.server()
      cy.route('GET', 'https://alwaysberunning.net/ktm/metas.json', 'fixture:metas.json')
      cy.route('GET', 'https://alwaysberunning.net/ktm/uprising.json', 'fixture:uprising.json')
      cy.route('GET', 'https://alwaysberunning.net/ktm/uprising-booster-pack.json', 'fixture:uprising-booster-pack.json')
      cy.route('GET', 'https://alwaysberunning.net/ktm/downfall-mwl-3-2.json', 'fixture:downfall-mwl-3-2.json')
      cy.route('GET', 'https://alwaysberunning.net/ktm/downfall-mwl-3-3.json', 'fixture:downfall-mwl-3-3.json')
      cy.route('GET', 'https://alwaysberunning.net/ktm/downfall.json', 'fixture:downfall.json')
      // screen size
      cy.viewport(1000, 660)
    })

    it('Check card stats', () => {
        cy.visit('/card/11104-tapwrm')
        // cy.fixture('validation-meta-cards.json').then(validation => {
        //     metaCheck(validation.uprising)
        // })
    })
})