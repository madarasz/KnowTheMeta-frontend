// sums up matches for identity
const matchCount = function (entry) {
  return entry.wins + entry.draws + entry.losses
}

// calculates winrate for identity
const winrate = function (entry) {
  if (entry === undefined || entry.wins === undefined || entry.draws === undefined || entry.losses === undefined) {
    return 0
  }
  return Math.round((entry.wins / (matchCount(entry))) * 1000) / 10
}

// shortens identity title
const shortenIdentity = function (title) {
  if (typeof title !== 'string') {
    return ''
  }
  const beforeColon = title.substring(0, title.indexOf(':'))
  if (beforeColon === 'Haas-Bioroid' || beforeColon === 'Jinteki' ||
        beforeColon === 'NBN' || beforeColon === 'Weyland Consortium') {
    return title.substring(title.indexOf(':') + 2)
  }
  return beforeColon
}

// shortens identity title to the minimum
const shortestIdentity = function (title) {
  const result = this.shortenIdentity(title)
  // shorthands
  switch (result) {
    case 'Controlling the Message':
      return 'Ctm'
    case 'Builder of Nations':
      return 'BoN'
    case 'Jinteki Biotech':
      return 'Biotech'
    case 'Personal Evolution':
      return 'PE'
    case 'Replicating Perfection':
      return 'RP'
    case 'Ken "Express" Tenma':
      return 'Ken' // instead of 'Express'
  }
  // if it's short enough return it
  if (result.length < 14) {
    return result
  }
  // get nickname between "s
  if (result.indexOf('"') > -1) {
    return result.substring(result.indexOf('"') + 1, result.lastIndexOf('"'))
  }
  // if it's one word only
  if (result.indexOf(' ') === -1) {
    return result
  }
  // get first word
  return result.substring(0, result.indexOf(' '))
}

const shortenMeta = function (metaname) {
  if (!metaname || metaname.length === 0) {
    return 'loading'
  }
  if (metaname.length < 10) {
    return metaname
  }
  let shortName = metaname
  // TODO: invonve pack code
  if (shortName.indexOf('Uprising') > -1) {
    shortName = shortName.replace('Uprising', 'U R')
  }
  if (shortName.indexOf('Booster Pack') > -1) {
    shortName = shortName.replace('Booster Pack', 'B P')
  }
  if (shortName.indexOf('Downfall ') > -1) {
    shortName = shortName.replace('Downfall ', 'D F ')
  }
  return shortName.replace(/ /g, '')
}

// returns RGB code for faction
const factionCodeToColor = function (factionCode) {
  switch (factionCode) {
    case 'shaper':
      return '#7EAC39'
    case 'anarch':
      return '#AC5439'
    case 'criminal':
      return '#3962AC'
    case 'haas-bioroid':
      return '#702871'
    case 'weyland-consortium':
      return '#1B654F'
    case 'jinteki':
      return '#8f1E0A'
    case 'nbn':
      return '#CB953A'
    case 'apex':
      return '#8B0000'
    case 'sunny-lebeau':
      return '#000000'
    case 'adam':
      return '#B8860B'
    default:
      return '#aaaaaa'
  }
}

// compare function for win rates
const compareWinrates = function (a, b) {
  const winrateA = winrate(a)
  const winrateB = winrate(b)
  if (winrateA > winrateB) {
    return -1
  }
  return 0
}
// compare function for popularity
const comparePopularity = function (a, b) {
  if (a.used > b.used) {
    return -1
  }
  return 0
}

const winrateError = function (entry) {
  const wr = winrate(entry) / 100
  // the actual math
  return Math.sqrt(wr * (1 - wr) / matchCount(entry)) * 100
}

const cardUrl = function (card) {
  return '/card/' + card.code + '/' + card.title.toLowerCase().replace(/\s/g, ' ').replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
}

export default {
  factionCodeToColor: factionCodeToColor,
  shortenIdentity: shortenIdentity,
  shortestIdentity: shortestIdentity,
  winrate: winrate,
  winrateError: winrateError,
  matchCount: matchCount,
  compareWinrates: compareWinrates,
  comparePopularity: comparePopularity,
  shortenMeta: shortenMeta,
  cardUrl: cardUrl
}
