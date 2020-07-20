var clusters = []
const stopClusterCount = 2
const stopClusterDistance = 20
// Cluster class for deck archetype clustering
class Cluster {
  constructor (elements) {
    this.elements = elements
    this.findCenter()
    this.calculateStrength()
  }

  findCenter () {
    this.center = { x: 0, y: 0 }
    for (var i = 0; i < this.elements.length; i++) {
      this.center.x += this.elements[i].xCoordinate
      this.center.y += this.elements[i].yCoordinate
    }
    this.center.x = this.center.x / this.elements.length
    this.center.y = this.center.y / this.elements.length
  }

  calculateStrength () {
    this.strength = 0
    var biggestStrength = -1
    for (var i = 0; i < this.elements.length; i++) {
      var strength = this.elements[i].successScore
      if (strength > biggestStrength) {
        biggestStrength = strength
        this.strengthIndex = i
      }
      this.strength += strength
    }
  }

  merge (cluster) {
    for (var i = 0; i < cluster.elements.length; i++) {
      this.elements.push(cluster.elements[i])
    }
    this.findCenter()
    this.calculateStrength()
  }
}

// find smallest distance between deck archetype clusters
const findSmallestDistance = function (clusters) {
  var smallestDistance = 10000
  var a = 0
  var b = 1
  if (clusters.length > 1) {
    for (var i = 0; i < clusters.length - 1; i++) {
      for (var u = i + 1; u < clusters.length; u++) {
        var distance = Math.sqrt(Math.pow(clusters[i].center.x - clusters[u].center.x, 2) + Math.pow(clusters[i].center.y - clusters[u].center.y, 2))
        if (distance < smallestDistance) {
          smallestDistance = distance
          a = i
          b = u
        }
      }
    }
    // console.log('Smallest distance: ' + smallestDistance)
  }
  return { distance: smallestDistance, index1: a, index2: b }
}

const initClusters = function (deckData) {
  clusters = []
  deckData.forEach(deck => {
    clusters.push(new Cluster([{
      xCoordinate: deck.xCoordinate,
      yCoordinate: deck.yCoordinate,
      id: deck.deck.id,
      successScore: deck.successScore,
      deckSummary: deck.deckSummary,
      rankSummary: deck.rankSummary,
      title: deck.deck.title,
      player: deck.deck.player
    }]))
  })
}

const reduceClusters = function () {
  var aggData = findSmallestDistance(clusters)
  while (clusters.length > stopClusterCount && aggData.distance < stopClusterDistance) {
    // console.log('Cluster length: ' + clusters.length)
    clusters[aggData.index1].merge(clusters[aggData.index2])
    clusters.splice(aggData.index2, 1)
    aggData = findSmallestDistance(clusters)
  }
}

const processIdentity = function (deckData) {
  initClusters(deckData)
  reduceClusters()
  return clusters
}

const processMeta = function (metaData) {
  const result = []
  metaData.forEach(identity => {
    const idClusters = processIdentity(identity.decks)
    idClusters.forEach(cluster => {
      if (typeof cluster.strengthIndex === 'number') {
        result.push({
          ...cluster.elements[cluster.strengthIndex],
          indentityTitle: identity.identity.title,
          factionCode: identity.identity.factionCode,
          identityCode: identity.identity.code
        })
      }
    })
  })
  result.sort(compareSuccess)
  return result
}

// compare function for successScore
const compareSuccess = function (a, b) {
  if (a.successScore > b.successScore) {
    return -1
  }
  return 0
}

export default {
  processIdentity: processIdentity,
  processMeta: processMeta
}
