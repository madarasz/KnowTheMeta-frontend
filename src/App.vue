<template>
  <div id="app">
    <v-app id="app">
      <v-app-bar dark color="primary" dense app>
        <!-- <v-app-bar-nav-icon>
        </v-app-bar-nav-icon> -->
        <div class="mr-4">
          <v-img :src="require('./assets/ktm.png')" width="24px"/>
        </div>
        <v-toolbar-title class="mr-4 d-none d-sm-flex">
          Know the Meta
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn depressed color="primary">
            <router-link to="Meta" tag="span">
              Uprising
            </router-link>
          </v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn depressed color="primary">
            <router-link to="MWL" tag="span">
              MWL
            </router-link>
          </v-btn>
          <v-btn depressed color="primary">
            <router-link to="Rotation" tag="span">
              Rotation
            </router-link>
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <router-view/>
    </v-app>
  </div>
</template>

<style scoped>
  @import './assets/main.css';
</style>
