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
  }
}
