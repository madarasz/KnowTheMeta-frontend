describe('Card Search', () => {
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

  it('Card Search functionality works', () => {
    cy.visit('/')
    cy.get('.v-autocomplete__content').should('not.visible')
    cy.get('[data-testid=card-search]').click()
    cy.get('.v-autocomplete__content').should('not.visible')
    cy.get('[data-testid=card-search]').type('a')
    cy.get('.v-autocomplete__content').should('not.visible')
    cy.get('[data-testid=card-search]').type('u')
    // items found after 2nd character
    cy.get('.v-autocomplete__content')
    cy.contains('.v-menu__content > [role=listbox] > .v-list-item', 'no such card').should('not.visible')
    cy.contains('.v-menu__content > [role=listbox] > .v-list-item', 'Aurora')
    cy.contains('.v-menu__content > [role=listbox] > .v-list-item', 'Dinosaurus')
    // only one item after 3rd character
    cy.get('[data-testid=card-search]').type('m')
    cy.contains('.v-menu__content > [role=listbox] > .v-list-item', 'Aumakua')
    cy.get('.v-menu__content > [role=listbox]').find('.v-list-item').its('length').should('eq', 1)
    // navigate there
    cy.get('.v-menu__content > [role=listbox] > .v-list-item').click()
    cy.contains('[data-testid=card-title]', 'Aumakua')
  })

  it('Card Search - negative path', () => {
    cy.visit('/')
    cy.get('[data-testid=card-search]').click()
    // no card found
    cy.get('[data-testid=card-search]').type('asdf')
    cy.get('.v-autocomplete__content')
    cy.contains('.v-menu__content > [role=listbox] > .v-list-item', 'no such card')
    // use clear icon
    cy.get('[aria-label="clear icon"]').click()
    cy.get('.v-autocomplete__content').should('not.visible')
  })
})
