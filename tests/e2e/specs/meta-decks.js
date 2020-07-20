describe('Meta Decks', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    // stub metas
    cy.server()
    cy.route('GET', 'https://alwaysberunning.net/ktm/metas.json', 'fixture:metas.json')
    cy.route('GET', 'https://alwaysberunning.net/ktm/uprising.json', 'fixture:uprising.json')
    cy.route('GET', 'https://alwaysberunning.net/ktm/decks/uprising.json', 'fixture:decks-uprising.json')
    // screen size
    cy.viewport(1000, 660)
  })

  it('Meta decks information is correct, navigation', () => {
    cy.visit('/meta/uprising/decks')
    // first runner deck
    cy.contains('[data-testid=runner-decks-row-0] > :nth-child(2)', 'OK, BOOMERang - 1st & 2nd at German Nats')
    cy.contains('[data-testid=runner-decks-row-0] > :nth-child(2)', 'by Pinsel')
    cy.contains('[data-testid=runner-decks-row-0] > :nth-child(2)', '3x Gbahali, 3x Street Peddler, 1x Corroder, 1x Stargate, 2x Simulchip')
    // first corp deck
    cy.contains('[data-testid=corp-decks-row-0] > :nth-child(2)', 'Spombo Asa - 1st at German Nationals 2019')
    cy.contains('[data-testid=corp-decks-row-0] > :nth-child(2)', 'by Pinsel')
    cy.contains('[data-testid=corp-decks-row-0] > :nth-child(2)', '2x Arella Salvatore, 3x Calibration Testing')
    // click more
    cy.get('[data-testid=button-pop-more-runner]').click()
    cy.contains('[data-testid=runner-decks-row-15] > :nth-child(2)', 'Quarantined Adam')
    cy.contains('[data-testid=runner-decks-row-15] > :nth-child(2)', 'by ToThBeBe')
    cy.contains('[data-testid=runner-decks-row-15] > :nth-child(2)', '3x PAD Tap, 3x Stimhack, 1x Buffer Drive, 1x Engolo, 1x Odore, 3x Rezeki, 1x Misdirection, 1x The Turning Wheel, 2x Reclaim, 1x Corroder')
    // navigate away
    cy.get('[href="#ids"]').click()
    // go back
    cy.go('back')
    cy.contains('[data-testid=runner-decks-row-15] > :nth-child(2)', 'Quarantined Adam')
    cy.contains('[data-testid=runner-decks-row-15] > :nth-child(2)', 'by ToThBeBe')
    cy.contains('[data-testid=runner-decks-row-15] > :nth-child(2)', '3x PAD Tap, 3x Stimhack, 1x Buffer Drive, 1x Engolo, 1x Odore, 3x Rezeki, 1x Misdirection, 1x The Turning Wheel, 2x Reclaim, 1x Corroder')
  })
})
