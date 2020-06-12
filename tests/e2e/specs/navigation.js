describe('Navigation', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    // stub netrunnerdb
    cy.server()
    cy.route('GET', 'https://alwaysberunning.net/ktm/metas.json', 'fixture:metas.json')
    cy.route('GET', 'https://alwaysberunning.net/ktm/uprising.json', 'fixture:uprising.json')
    // TODO: stub these as well, getting strange error
    // cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/cycles', 'fixture:cycles.json')
    // cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/packs', 'fixture:packs.json')
    // cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/cards', 'fixture:cards.json')
    // cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/mwl', 'fixture:mwl.json')
    // screen size
    cy.viewport(1000, 660)
  })

  it('Navigate menu points, check titles and urls', () => {
    cy.visit('/')
    // check forwarding works
    cy.url().should('include', '/meta/')
    cy.title().should('eq', 'Identities - Uprising - Know the Meta - Netrunner')
    // navigate to decks
    cy.get('[href="#decks"]').click()
    cy.url().should('include', '/decks')
    cy.title().should('eq', 'Decks - Uprising - Know the Meta - Netrunner')
    // navigate to cards
    cy.get('[href="#cards"]').click()
    cy.url().should('include', '/cards')
    cy.title().should('eq', 'Cards - Uprising - Know the Meta - Netrunner')
    // navigate to MWL
    cy.get('[data-testid=menu-mwl]').click()
    cy.url().should('include', '/mwl')
    cy.title().should('eq', 'Most Wanted List (MWL) - Know the Meta - Netrunner')
    // navigate to Rotation
    cy.get('[data-testid=menu-rotation]').click()
    cy.url().should('include', '/rotation')
    cy.title().should('eq', 'Rotation - Know the Meta - Netrunner')
  })

  it('Navigate to card first, use back button', () => {
    cy.visit('/card/25001-reina-roja-freedom-fighter')
    cy.title().should('eq', 'Reina Roja: Freedom Fighter - Know the Meta - Netrunner')
    cy.get('[data-testid=menu-back]').click()
    cy.url().should('include', '/meta/')
    cy.title().should('eq', 'Identities - Uprising - Know the Meta - Netrunner')
  })

  // checks page title, app bar title then navigates back
  function cardCheck(cardTitle) {
    cy.contains('[data-testid=card-title]', cardTitle)
    cy.title().should('eq', cardTitle + ' - Know the Meta - Netrunner')
    cy.get('[data-testid=menu-back]').click()
  }

  it('Navigate to card stats from meta, use back button', () => {
    // meta identities
    cy.visit('/meta/uprising-booster-pack/ids')
    cy.title().should('eq', 'Identities - Uprising Booster Pack - Know the Meta - Netrunner')
    // popular identities link
    cy.get('[data-testid=table-popularity-runner] > .v-data-table__wrapper > table > tbody > :nth-child(1) > .text-left > a').click()
    cardCheck('419: Amoral Scammer')
    cy.title().should('eq', 'Identities - Uprising Booster Pack - Know the Meta - Netrunner')
    // meta cards
    cy.get('[href="#cards"]').click()
    cy.title().should('eq', 'Cards - Uprising Booster Pack - Know the Meta - Netrunner')
    // popular cards in meta - card image link
    cy.get('[data-testid=popular-runner] > .pl-3 > :nth-child(1) > :nth-child(1) > .text-center > .d-inline-flex > a > .v-responsive > .v-responsive__content').click()
    cardCheck('Mystic Maemi')
    cy.title().should('eq', 'Cards - Uprising Booster Pack - Know the Meta - Netrunner')
    // ice table link
    cy.get('[data-testid=table-icebreakers] > .v-data-table__wrapper > table > tbody > :nth-child(4) > .text-start > a').click()
    cardCheck('Atman')
    cy.title().should('eq', 'Cards - Uprising Booster Pack - Know the Meta - Netrunner')
    // impressive cards in meta - card text link
    cy.get('[data-testid=winning-runner] > :nth-child(1) > :nth-child(1) > :nth-child(2) > .card-title > a').click()
    cardCheck('Wanton Destruction')
    cy.title().should('eq', 'Cards - Uprising Booster Pack - Know the Meta - Netrunner')
    // MWL
    cy.get('[data-testid=menu-mwl]').click()
    // card image link
    cy.get('[data-testid=list-runner-banned] > :nth-child(1) > :nth-child(1) > :nth-child(1) > .text-center > .d-inline-flex > a > .v-responsive > .v-responsive__content').click()
    cardCheck('GPI Net Tap')
    cy.title().should('eq', 'Most Wanted List (MWL) - Know the Meta - Netrunner')
    // card text link
    cy.get('[data-testid=list-runner-restricted] > :nth-child(1) > :nth-child(1) > :nth-child(2) > .card-title > a').click()
    cardCheck('Tech Trader')
    cy.title().should('eq', 'Most Wanted List (MWL) - Know the Meta - Netrunner')
    // Rotation - card text link
    cy.get('[data-testid=menu-rotation]').click()
    cy.get('[data-testid=rotation-rotated-core2] > .v-expansion-panel > .v-expansion-panel-header > .v-expansion-panel-header__icon > .v-icon > svg').scrollIntoView().click()
    cy.get('[data-testid=rotation-rotated-core2-cards] > div > small > :nth-child(4) > a').scrollIntoView().click()
    cardCheck('Stimhack')
    cy.title().should('eq', 'Rotation - Know the Meta - Netrunner')
  })
})    
