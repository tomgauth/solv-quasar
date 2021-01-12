<template>
  <q-page padding class="row justify-center items-center">
    <q-card class="q-pa-lg learn-card column">
      <q-card-section>
      test card
      </q-card-section>
      <q-card-section class="text-center q-gutter-sm btn-container">
        <div>
          <q-btn  round color="black" class="q-pa-sm" text-color="white" unelevated  icon="pause" />
        </div>
        <div>
          <q-btn  round color="black" class="q-pa-sm" text-color="white" unelevated  icon="play_arrow" />
        </div>
        <div>
          <q-btn  round color="black" class="q-pa-sm" text-color="white" unelevated  icon="stop" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { firebaseStorage } from '../../src/boot/firebase'

export default {
  // name: 'PageName',
  data(){
    return {
      
    }
  },
  mounted(){
    this.$store.dispatch("playlist/populateCurrentQueue");
  }
}
</script>
