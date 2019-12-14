<template>
  <q-page padding class="flex flex-center">
    <list/>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data () {
    return {
    }
  },
  components: {
      'list' : require('components/List/List.vue').default
  }

}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>