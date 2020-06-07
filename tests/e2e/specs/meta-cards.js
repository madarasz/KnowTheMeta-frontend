describe('Meta Cards', () => {

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

    function cardCheck(testid, card) {
        cy.contains(`[data-testid=${testid}] > div > div > :nth-child(2) > .card-title > a`, card.title)
        cy.contains(`[data-testid=${testid}] > div > div > .mb--4 > .text-center > em`, card.popularity)
        cy.contains(`[data-testid=${testid}] > div > div > :nth-child(4)> .text-center > em`, card.winrate)
    }

    function tableCheck(tableid, card) {
        cy.contains(`[data-testid=table-${tableid}] > .v-data-table__wrapper > table > tbody > tr > .text-start`, card.title)
        cy.contains(`[data-testid=table-${tableid}] > .v-data-table__wrapper > table > tbody > tr > :nth-child(2)`, card.popularity)
        cy.contains(`[data-testid=table-${tableid}] > .v-data-table__wrapper > table > tbody > tr > :nth-child(3)`, card.winrate)
        cy.contains(`[data-testid=table-${tableid}] > .v-data-table__wrapper > table > tbody > tr > :nth-child(4)`, card.avg)
    }

    function metaCheck(data) {
        // popular cards
        Object.keys(data.popular).forEach(side => {
            data.popular[side].forEach(card => {
                cardCheck(`popular-${side}`,card)
            })
        })
        // breakers
        data.breakers.forEach(card => {
            tableCheck('icebreakers', card)
        })
        // ice
        data.ice.forEach(card => {
            tableCheck('ice', card)
        })
        // ice/breaker type check
        data['breaker-types'].forEach(btype => {
            cy.contains('[data-testid=table-icebreakers] > .v-data-table__wrapper > table > tbody > tr > .text-start', btype)
        })
        data['ice-types'].forEach(btype => {
            cy.contains('[data-testid=table-ice] > .v-data-table__wrapper > table > tbody > tr > .text-start', btype)
        })      
        // impressive winrates
        Object.keys(data.winning).forEach(side => {
            data.winning[side].forEach(card => {
                cardCheck(`winning-${side}`,card)
            })
        })
    }

    it('Meta cards information is correct', () => {
        cy.visit('/meta/uprising/cards')
        cy.fixture('validation-meta-cards.json').then(validation => {
            metaCheck(validation.uprising)
        })
    })

    it('Meta switching', () => {
        cy.visit('/meta/uprising/cards')
        // uprising-booster-pack meta
        cy.get('[data-testid=icon-meta-select]').click()
        cy.get('[data-testid=list-metas] > :nth-child(2)').click()
        cy.fixture('validation-meta-cards.json').then(validation => {
            metaCheck(validation['uprising-booster-pack'])
        })
        // back to uprising meta
        cy.get('[data-testid=icon-meta-select]').click()
        cy.get('[data-testid=list-metas] > :nth-child(1)').click()
        cy.fixture('validation-meta-cards.json').then(validation => {
            metaCheck(validation.uprising)
        })
    })
})