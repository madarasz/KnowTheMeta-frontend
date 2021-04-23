const mwlTypes = ['banned', 'restricted']
const hiddenCycles = ['Magnum Opus Reprint', 'NAPD Multiplayer', 'Draft']

const filterCycles = function (cycleData) {
  return cycleData.filter(x => { return !hiddenCycles.includes(x.name) })
}

const transformPackData = function (cycleData, packData) {
  const results = []
  for (let i = 0; i < packData.length; i++) {
    results.push({
      code: packData[i].code,
      cycle_code: packData[i].cycle_code,
      name: packData[i].name,
      size: packData[i].size,
      date_release: packData[i].date_release,
      legal_reprints: [],
      rotated: cycleData.find(x => { return x.code === packData[i].cycle_code }).rotated
    })
  }
  return results
}

const transformCardData = function (cardData, packData, imgUrlTemplate) {
  const cards = {}
  const prints = {}
  for (let i = 0; i < cardData.length; i++) {
    prints[cardData[i].code] = cardData[i].title
    const legal = !packData.find(x => { return x.code === cardData[i].pack_code }).rotated
    if (cardData[i].title in cards) {
      // reprint
      if (legal) {
        for (let u = 0; u < cards[cardData[i].title].in_pack.length; u++) {
          packData.find(x => { return x.code === cards[cardData[i].title].in_pack[u] }).legal_reprints.push({
            title: cardData[i].title,
            code: cardData[i].code
          })
        }
      }
      cards[cardData[i].title].in_pack.push(cardData[i].pack_code)
      cards[cardData[i].title].legal = legal
      cards[cardData[i].title].identity = cardData[i].type_code === 'identity'
      cards[cardData[i].title].faction = cardData[i].faction_code
    } else {
      // new card
      cards[cardData[i].title] = {
        runner: cardData[i].side_code === 'runner',
        in_pack: [cardData[i].pack_code],
        legal: legal,
        identity: cardData[i].type_code === 'identity',
        faction: cardData[i].faction_code
      }
    }
  }
  return { cards: cards, prints: prints }
}

const sortMwlData = function (mwlData, cardData, printData) {
  const result = { banned: {}, restricted: {} }
  for (const prop in mwlData) {
    if (Object.prototype.hasOwnProperty.call(mwlData, prop)) {
      const mwlcard = mwlData[prop]
      const card = cardData[printData[prop]]
      card.code = prop // adding code for linking card stats
      const title = printData[prop]
      // banned
      if (('deck_limit' in mwlcard) && mwlcard.deck_limit === 0) {
        result.banned[title] = card
      }
      // restricted
      if (('is_restricted' in mwlcard) && mwlcard.is_restricted === 1) {
        result.restricted[title] = card
      }
    }
  }
  return result
}

function compareMwls (latestMwl, previousMwl, type) {
  const otherType = mwlTypes.find(x => x !== type)
  for (const prop in latestMwl[type]) {
    if (Object.prototype.hasOwnProperty.call(latestMwl[type], prop)) {
      if (prop in previousMwl[type]) {
        continue
      }
      if (prop in previousMwl[otherType]) {
        latestMwl[type][prop].badge = 'from ' + otherType
        continue
      }
      latestMwl[type][prop].badge = 'new'
    }
  }
}

function getRemoved (latestMwl, previousMwl, type) {
  for (const prop in previousMwl[type]) {
    if (Object.prototype.hasOwnProperty.call(previousMwl[type], prop)) {
      if ((!(prop in latestMwl.banned)) && (!(prop in latestMwl.restricted)) && previousMwl[type][prop].legal) {
        latestMwl.removed[prop] = previousMwl[type][prop]
        latestMwl.removed[prop].badge = 'from ' + type
      }
    }
  }
}

const addBadgesToMwl = function (latestMwl, previousMwl) {
  latestMwl.removed = {}
  mwlTypes.forEach(type => {
    compareMwls(latestMwl, previousMwl, type)
    getRemoved(latestMwl, previousMwl, type)
  })
}

const addRotationWarning = function (cycles, rotationWarning) {
  var rotationDate = new Date(rotationWarning.start_date)
  if (Date() > rotationDate) {
    return cycles
  } else {
    return cycles.map(function (cycle) {
      if (rotationWarning.new_cycle_codes.includes(cycle.code)) {
        cycle.label = 'new'
      }
      if (rotationWarning.rotating_cycle_codes.includes(cycle.code)) {
        cycle.label = 'rotates ' + rotationWarning.start_date
      }
      return cycle
    })
  }
}

const compareReleaseDates = function (a, b) {
  if (a.date_release > b.date_release) {
    return -1
  }
  return 0
}

export default {
  mwlTypes: mwlTypes,
  transformPackData: transformPackData,
  transformCardData: transformCardData,
  sortMwlData: sortMwlData,
  addBadgesToMwl: addBadgesToMwl,
  filterCycles: filterCycles,
  compareReleaseDates: compareReleaseDates,
  addRotationWarning: addRotationWarning
}
