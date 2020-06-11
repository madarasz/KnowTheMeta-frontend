describe('Rotation', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    // stub netrunnerdb
    cy.server()
    cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/cycles', 'fixture:cycles.json')
    cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/packs', 'fixture:packs.json')
    cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/cards', 'fixture:cards.json')
    // screen size
    cy.viewport(1000, 660)
  })

  it('Validate Rotation entries', () => {
    cy.visit('/rotation')
    // cycle titles
    cy.contains('[data-testid=rotation-legal] > :nth-child(1) > .v-card__title', 'Ashes')
    cy.contains('[data-testid=rotation-rotated] > :nth-child(1) > .v-card__title', 'Revised Core Set')
    // pack details
    cy.contains('[data-testid=rotation-legal-ur] > :nth-child(1)', 'Uprising')
    cy.contains('[data-testid=rotation-legal-ur] > :nth-child(2)', '65 cards')
    cy.contains('[data-testid=rotation-legal-ur] > :nth-child(3)', '2019-12-31')
    cy.contains('[data-testid=rotation-rotated-core2] > .v-expansion-panel > .v-expansion-panel-header > .row > :nth-child(1)', 'Revised Core Set')
    cy.contains('[data-testid=rotation-rotated-core2] > .v-expansion-panel > .v-expansion-panel-header > .row > :nth-child(2)', '91 / 132')
    cy.contains('[data-testid=rotation-rotated-core2] > .v-expansion-panel > .v-expansion-panel-header > .row > :nth-child(3)', '2017-12-14')
    cy.contains('[data-testid=rotation-legal-urbp] > :nth-child(1)', 'Uprising Booster Pack')
    cy.contains('[data-testid=rotation-legal-df] > :nth-child(1)', 'Downfall')
    // legal card list
    cy.get('[data-testid=rotation-rotated-core2] > .v-expansion-panel > .v-expansion-panel-header > .v-expansion-panel-header__icon > .v-icon > svg').click()
    cy.contains('[data-testid=legal-list-core2]', 'Datasucker')
  })
})
