const winrate = function (identity) {
  if (identity === undefined || identity.wins === undefined || identity.draws === undefined || identity.losses === undefined) {
    return 0
  }
  return Math.round((identity.wins / (identity.wins + identity.draws + identity.losses)) * 1000) / 10
}

export default {
  factionCodeToColor: function (factionCode) {
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
  },
  shortenIdentity: function (title) {
    if (typeof title !== 'string') {
      return ''
    }
    if (title.indexOf('Haas-Bioroid') > -1 || title.indexOf('Jinteki') > -1 || title.indexOf('NBN') > -1 || title.indexOf('Weyland Consortium') > -1) {
      return title.substring(title.indexOf(':') + 1)
    }
    return title.substring(0, title.indexOf(':'))
  },
  winrate: winrate,
  compareWinrates: function (a, b) {
    const winrateA = winrate(a)
    const winrateB = winrate(b)
    if (winrateA > winrateB) {
      return -1
    }
    return 0
  }
}
