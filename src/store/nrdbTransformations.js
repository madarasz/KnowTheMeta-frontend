const transformPackData = function (cycleData, packData) {
  const results = []
  for (let i = 0; i < packData.length; i++) {
    results.push({
      code: packData[i].code,
      cycle_code: packData[i].cycle_code,
      name: packData[i].name,
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
      cards[cardData[i].title].image_url = 'image_url' in cardData[i] ? cardData[i].image_url : imgUrlTemplate.replace('{code}', cardData[i].code) // keep image fresh
      cards[cardData[i].title].in_pack.push(cardData[i].pack_code)
      cards[cardData[i].title].legal = legal
    } else {
      // new card
      cards[cardData[i].title] = {
        runner: cardData[i].side_code === 'runner',
        in_pack: [cardData[i].pack_code],
        image_url: 'image_url' in cardData[i] ? cardData[i].image_url : imgUrlTemplate.replace('{code}', cardData[i].code),
        legal: legal
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

const addBadgesToMwl = function (latestMwl, previousMwl) {
  for (const prop in latestMwl.banned) {
    if (Object.prototype.hasOwnProperty.call(latestMwl.banned, prop)) {
      if (prop in previousMwl.banned) {
        continue
      }
      if (prop in previousMwl.restricted) {
        latestMwl.banned[prop].badge = 'from restricted'
        continue
      }
      latestMwl.banned[prop].badge = 'new'
    }
  }
  for (const prop in latestMwl.restricted) {
    if (Object.prototype.hasOwnProperty.call(latestMwl.restricted, prop)) {
      if (prop in previousMwl.restricted) {
        continue
      }
      if (prop in previousMwl.banned) {
        latestMwl.restricted[prop].badge = 'from banned'
        continue
      }
      latestMwl.restricted[prop].badge = 'new'
    }
  }
  latestMwl.removed = {}
  for (const prop in previousMwl.restricted) {
    if (Object.prototype.hasOwnProperty.call(previousMwl.restricted, prop)) {
      if ((!(prop in latestMwl.banned)) && (!(prop in latestMwl.restricted)) && previousMwl.restricted[prop].legal) {
        latestMwl.removed[prop] = previousMwl.restricted[prop]
        latestMwl.removed[prop].badge = 'from restricted'
      }
    }
  }
  for (const prop in previousMwl.banned) {
    if (Object.prototype.hasOwnProperty.call(previousMwl.banned, prop)) {
      if ((!(prop in latestMwl.banned)) && (!(prop in latestMwl.restricted)) && previousMwl.banned[prop].legal) {
        latestMwl.removed[prop] = previousMwl.banned[prop]
        latestMwl.removed[prop].badge = 'from banned'
      }
    }
  }
}

export default {
  transformPackData: transformPackData,
  transformCardData: transformCardData,
  sortMwlData: sortMwlData,
  addBadgesToMwl: addBadgesToMwl
}
