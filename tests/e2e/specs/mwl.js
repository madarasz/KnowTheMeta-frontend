describe('MWL', () => {

  beforeEach (() => {
    cy.clearLocalStorage()
    // stub netrunnerdb
    cy.server()
    cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/cycles', 'fixture:cycles.json')
    cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/packs', 'fixture:packs.json')
    cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/cards', 'fixture:cards.json')
    cy.route('GET', 'https://netrunnerdb.com/api/2.0/public/mwl', 'fixture:mwl.json')
    // screen size
    cy.viewport(1000, 660)
  })

  it('Validate MWL entries', () => {
    cy.visit('/mwl')
    cy.fixture('validation-mwl.json').then(validation => {
      // iterate sides
      Object.keys(validation).forEach(side => {
        // iterate banned/restricted/removed
        Object.keys(validation[side]).forEach(list => {
          // iterate card list
          if (validation[side][list].length > 0) {
            // validate card title
            validation[side][list].forEach(card => {
              if (typeof card === 'string') {
                // without badge
                cy.contains(`[data-testid=list-${side}-${list}] .card-title > a`, card)
              } else {
                // with badge
                cy.contains(`[data-testid=list-${side}-${list}] .card-title > a[badge='${card.badge}']`, card.title)
              }
            })
            // check card count
            cy.get(`[data-testid=list-${side}-${list}] .card-title > a`).its('length').should('eq', validation[side][list].length)
          } else {
            // empty list
            cy.contains(`[data-testid=list-${side}-${list}] > .overline`, 'no cards')
          }
        })
      })
    })
  })
})