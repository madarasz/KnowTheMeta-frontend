describe('Card Stats', () => {
  beforeEach(() => {
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
    cy.fixture('validation-card-stats.json').then(cards => {
      Object.keys(cards).forEach(card => {
        cy.visit(cards[card].url)
        // check card title
        cy.contains('[data-testid=card-title]', card)
        // check card chart
        cy.get('#card-chart').matchImageSnapshot(`card-chart-${cards[card].url.split('/')[2]}`)
        // check print packs
        cards[card].packs.forEach(pack => {
          cy.contains('[data-testid=pack-name]', pack)
          cy.get('body').then(($body) => {
            if ($body.find('.v-window__next > .v-btn').length) {
              cy.get('.v-window__next > .v-btn').click()
            }
          })
        })
        // low data warning
        if (cards[card].lowDataWarning) {
          cy.get('[data-testid=warning-low-data]')
        } else {
          cy.get('[data-testid=warning-low-data]').should('not.exist')
        }
        // card warnings
        if (cards[card].banned) {
          cy.get('[data-testid=warning-banned]')
        } else {
          cy.get('[data-testid=warning-banned]').should('not.exist')
        }
        if (cards[card].restricted) {
          cy.get('[data-testid=warning-restricted]')
        } else {
          cy.get('[data-testid=warning-restricted]').should('not.exist')
        }
        if (cards[card].rotated) {
          cy.get('[data-testid=warning-rotated]')
        } else {
          cy.get('[data-testid=warning-rotated]').should('not.exist')
        }
        // check chart explanation
        cy.get('[data-testid=card-chart-explanation]').should('not.visible')
        cy.get('[data-testid=explain-chart]').click()
        cy.get('[data-testid=card-chart-explanation]')
        if (cards[card].mwlWarning) {
          cy.get('[data-testid=mwlWarning]')
        } else {
          cy.get('[data-testid=mwlWarning]').should('not.exist')
        }
        if (cards[card].lowDataWarning) {
          cy.get('[data-testid=lowDataWarning]')
        } else {
          cy.get('[data-testid=lowDataWarning]').should('not.exist')
        }
        // close
        cy.get('[data-testid=close-explanation]').click()
        cy.get('[data-testid=card-chart-explanation]').should('not.visible')
      })
    })
  })
})
