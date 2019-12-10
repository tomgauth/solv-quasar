<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>

  import { mapActions } from 'vuex'
  import { firebaseAuth } from './boot/firebase'

  export default {
    name: 'App',
    methods : {
      ...mapActions('auth', ['handleAuthStateChange'])
    },
    mounted() {
      this.handleAuthStateChange()
      this.handleAuthStateChange()
    }
  }
</script>
