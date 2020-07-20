<template>
  <v-btn depressed :color="$route.path.includes(url) ? 'highlight' : 'primary'" class="menu-button"
      :data-testid="'menu-' + text.toLowerCase()">
    <router-link :to="url" tag="span">
      <span :class="`d-none d-${breakpoint}-inline`">{{ text }}</span>
      <div :class="`d-inline d-${breakpoint}-none`">
        <v-row dense>
          <v-col class="pa-0">
            <v-icon color="white" class="">{{ icon }}</v-icon>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col class="pa-0 pl-1 pr-1 mobile-nav-text">
            {{ text }}
          </v-col>
        </v-row>
      </div>
    </router-link>
  </v-btn>
</template>

<script>
export default {
  name: 'NavResponsive',
  props: {
    text: String,
    icon: String,
    url: String,
    breakpoint: {
      type: String,
      default: 'sm'
    }
  }
}
</script>
