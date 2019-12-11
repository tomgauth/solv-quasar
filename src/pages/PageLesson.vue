<template>
  <q-page padding class="flex flex-center">
    <lesson-test/>
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
      'lesson-test' : require('components/Lesson/LessonTest.vue').default
  }

}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>