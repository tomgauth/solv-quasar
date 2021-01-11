<template>
  <q-page class="row items-center justify-center" padding>
      <q-card  class="q-pa-lg learn-card column">
        <q-card-section class="row justify-center">
          <h6 class="text-h5 q-my-lg">{{ phrasesToBeLearned.length }} phrases to learn</h6>
        </q-card-section>
        <q-card-section>
          <q-scroll-area style="height: 40vh" :thumb-style="thumbStyle" :bar-style="barStyle">
            <q-list  separator>
                <q-item v-for="phrase in phrasesToBeLearned" :key="phrase[0]" >
                  <q-item-section>
                    <div>
                      <span class="text-subtitle2">{{ phrase[1].fr }}</span>
                    </div>
                    <div>
                      <span class="text-grey-7">{{ phrase[1].en }}</span>
                    </div> 
                  </q-item-section>
                </q-item>
            </q-list>  
          </q-scroll-area>  
        </q-card-section>
        <q-card-section class="text-center btn-container">
           <q-btn to="/lesson-play" round color="black" class="q-pa-sm" text-color="white" unelevated  icon="play_arrow" />
        </q-card-section>
      </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  // name: 'PageName',
  data(){
    return {
    thumbStyle: {
      right: '4px',
      borderRadius: '5px',
      backgroundColor: 'dark',
      width: '6px',
      opacity: 0.75
    },

    barStyle: {
      right: '2px',
      borderRadius: '9px',
      backgroundColor: '#e2e2e2',
      width: '9px',
      opacity: 0.2
    },
    phrasesToBeLearned:[]
   }
  },
  computed: {
  ...mapGetters('items', ['items', 'arrayOfItems', 'getItemByName', 'dueItems']),
  ...mapState('items', ['items', 'itemIndex'])
  },
  mounted: function () {
    this.phrasesToBeLearned = this.arrayOfItems.filter(item => item[1].selected);
  }
}
</script>
<style>

.btn-container{
justify-self: flex-end;
margin-top: auto;
}

</style>