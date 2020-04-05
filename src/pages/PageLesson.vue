<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col">
      </div>
      <div class="col-6">
        <lesson-test/>
      </div>
      <div class="col">
      </div>
    </div>
    
  </div>
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