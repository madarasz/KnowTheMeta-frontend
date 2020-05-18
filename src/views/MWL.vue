<template>
  <v-content>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4 d-none d-md-block">
      <desktop-card :title="mwlDataCurrent.name" :subtitle="getSubtitle">
        <!-- Banned -->
        <template v-slot:pretext>
          <v-card-title class="card-subtitle">
            <div class="overline">Banned</div>
          </v-card-title>
        </template>
        <v-row>
          <v-col cols="6" class="divider-on-right">
            <card-lister :card-list="bannedRunner"/>
          </v-col>
          <v-col>
            <card-lister :card-list="bannedCorp"/>
          </v-col>
        </v-row>
        <!-- Restricted -->
        <template v-slot:posttext>
          <v-card-title class="card-subtitle">
            <div class="overline">Restricted</div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6" class="divider-on-right">
                <card-lister :card-list="restrictedRunner"/>
              </v-col>
              <v-col>
                <card-lister :card-list="restrictedCorp"/>
              </v-col>
            </v-row>
          </v-card-text>
        </template>
      </desktop-card>
    </div>
  </v-content>
</template>

<script>
import axios from 'axios'
import DesktopCard from '@/components/header/DesktopCard.vue'
import CardLister from '@/components/widget/CardLister.vue'

export default {
  components: {
    DesktopCard,
    CardLister
  },
  data: () => ({
    mwlDataCurrent: {},
    cardData: {},
    currentBanned: [],
    currentRestricted: [],
    imageUrlTemplate: ''
  }),
  mounted: function () {
    this.getMWLData()
  },
  methods: {
    getMWLData: function () {
      axios.get('https://netrunnerdb.com/api/2.0/public/mwl').then((response) => {
        this.mwlDataCurrent = response.data.data[response.data.data.length - 1]
        this.getCardData()
      }).catch(() => {
        // error handling
      })
    },
    getCardData: function () {
      axios.get('https://netrunnerdb.com/api/2.0/public/cards').then((response) => {
        this.imageUrlTemplate = response.data.imageUrlTemplate
        this.cardData = response.data.data.map(x => {
          return {
            code: x.code,
            title: x.title,
            runner: x.side_code === 'runner',
            image_url: 'image_url' in x ? x.image_url : this.imageUrlTemplate.replace('{code}', x.code)
          }
        })
        this.sortBannedAndRestricted()
      }).catch(() => {
        // error handling
      })
    },
    sortBannedAndRestricted: function () {
      for (const prop in this.mwlDataCurrent.cards) {
        console.log(this.mwlDataCurrent.cards[prop])
        if (Object.prototype.hasOwnProperty.call(this.mwlDataCurrent.cards, prop)) {
          const card = this.mwlDataCurrent.cards[prop]
          if (('deck_limit' in card) && card.deck_limit === 0) {
            this.currentBanned.push(this.cardData.filter(x => { return x.code === prop })[0])
          }
          if (('is_restricted' in card) && card.is_restricted === 1) {
            this.currentRestricted.push(this.cardData.filter(x => { return x.code === prop })[0])
          }
        }
      }
    }
  },
  computed: {
    getSubtitle: function () {
      return 'latest mwl, from: ' + this.mwlDataCurrent.date_start
    },
    bannedRunner: function () {
      return this.currentBanned.filter(x => { return x.runner })
    },
    bannedCorp: function () {
      return this.currentBanned.filter(x => { return !x.runner })
    },
    restrictedRunner: function () {
      return this.currentRestricted.filter(x => { return x.runner })
    },
    restrictedCorp: function () {
      return this.currentRestricted.filter(x => { return !x.runner })
    }
  }
}
</script>

<style scoped>
.divider-on-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.card-subtitle {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 4px 16px;
  display: block;
  text-align: center;
}
</style>
