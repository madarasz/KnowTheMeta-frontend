describe('Meta Switching', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    // stub metas
    cy.server()
    cy.route('GET', 'https://alwaysberunning.net/ktm/metas.json', 'fixture:metas.json')
    cy.route('GET', 'https://alwaysberunning.net/ktm/uprising.json', 'fixture:uprising.json')
    cy.route('GET', 'https://alwaysberunning.net/ktm/uprising-booster-pack.json', 'fixture:uprising-booster-pack.json')
    // screen size
    cy.viewport(1000, 660)
  })

  it('Popularity more / less buttons working', () => {
    cy.visit('/meta/uprising/ids')
    cy.get('#chart-popularity-runner').matchImageSnapshot('chart-popularity-runner-uprising')
    cy.get('[data-testid=button-pop-more-runner]').click()
    cy.get('#chart-popularity-runner').matchImageSnapshot('chart-popularity-runner-uprising-more')
    cy.get('[data-testid=button-pop-less-runner]').click()
    cy.get('#chart-popularity-runner').matchImageSnapshot('chart-popularity-runner-uprising')
  })
})
