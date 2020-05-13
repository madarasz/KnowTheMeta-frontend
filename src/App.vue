<template>
  <div id="app">
    <v-app id="app">
      <v-app-bar dark color="#2c3653" dense app>
        <!-- <v-app-bar-nav-icon>
        </v-app-bar-nav-icon> -->
        <v-toolbar-side-icon class="mr-4">
          <v-img :src="require('./assets/ktm.png')" width="24px"/>
        </v-toolbar-side-icon>
        <v-toolbar-title class="mr-4">
          Know the Meta
        </v-toolbar-title>
        <v-toolbar-items>
          <v-btn depressed color="#2c3653">
            <router-link to="Meta" tag="span">
              Uprising
            </router-link>
          </v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn depressed color="#2c3653">
            <router-link to="MWL" tag="span">
              MWL
            </router-link>
          </v-btn>
          <v-btn depressed color="#2c3653">
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
