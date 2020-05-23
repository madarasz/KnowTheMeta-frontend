describe('Meta Switching', () => {

    beforeEach (() => {
      cy.clearLocalStorage()
      // stub metas
      cy.server()
      cy.route('GET', 'https://alwaysberunning.net/ktm/metas.json', 'fixture:metas.json')
      cy.route('GET', 'https://alwaysberunning.net/ktm/uprising.json', 'fixture:uprising.json')
      cy.route('GET', 'https://alwaysberunning.net/ktm/uprising-booster-pack.json', 'fixture:uprising-booster-pack.json')
      // screen size
      // cy.viewport(1920, 1080)
    })

    it('Popularity more / less buttons working', () => {
        cy.visit('/meta/uprising')
        cy.get(`[data-testid=chart-popularity-runner] > #pie-chart`).matchImageSnapshot(`chart-popularity-runner-uprising`)
        cy.get('[data-testid=button-pop-more-runner]').click()
        cy.get(`[data-testid=chart-popularity-runner] > #pie-chart`).matchImageSnapshot(`chart-popularity-runner-uprising-more`)
        cy.get('[data-testid=button-pop-less-runner]').click()
        cy.get(`[data-testid=chart-popularity-runner] > #pie-chart`).matchImageSnapshot(`chart-popularity-runner-uprising`)
    })

})