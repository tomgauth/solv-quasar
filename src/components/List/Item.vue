<template>
    <div>
		  <q-item
        :class="!item.selected ? 'bg-white-1' : 'bg-green-1'"
        >
		    <q-item-section side
          @click="updateItem({ id: id, updates: { selected: !item.selected } } )"          
          v-ripple
          clickable>
		      <q-checkbox
          :value="item.selected"
          class="no-pointer-events" />
		    </q-item-section>

		    <q-item-section>
		      <q-item-label>
		      	{{ item.fr }}
		      </q-item-label>
		    </q-item-section>

		    <q-item-section>
		          <q-item-label
		          	caption>
		          	<small>{{ item.en }}</small>
		          </q-item-label>
        </q-item-section>
		    <q-item-section>
          <q-select 
            outlined 
            @input="updateItem({ id: id, updates: { status: item.status } })"
            v-model="item.status" 
            :value="item.status"
            :options="statuses" 
             />
        </q-item-section>
        <q-item-section side>
		      <q-item-label>
            <div class="row">
            <q-btn
              :loading="loading"
              :percentage="percentage"
              round
              color="deep-orange"
              @click="simulateProgress(); playAudio(item.name);"
              icon="play_arrow"
              />
            <q-btn 
              @click.stop="showEditItem = true"
              flat 
              round 
              dense 
              color="primary" 
              icon="edit"/>
		      	<q-btn 
              @click.stop="promptToDelete(id)"
              flat 
              round 
              dense 
              color="red" 
              icon="delete"/>
            </div>
		      </q-item-label>
		    </q-item-section>
    <q-dialog v-model="showEditItem">
      <edit-item 
        @close="showEditItem = false" 
        :item="item"
        :id="id" />
    </q-dialog>
		  </q-item>
      
    </div>
</template>




<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { firebaseStorage } from '../../boot/firebase'

export default {
    props: ['item', 'id'],
    data () {
      return{
        storageRef: firebaseStorage.ref(),
        loading: false,
        percentage: 0,
        showEditItem: false,
        statuses: ["to review","ok","learnt"]
      }
    },
    methods: {
      ...mapActions('items', ['updateItem', 'deleteItem']),
      	playAudio (itemID) {
          console.log(this.item.audio_url)
          var audio = new Audio(this.item.audio_url)
          audio.play().catch(function(error) {
            console.error()
          });
        },
        simulateProgress () {
          // we set loading state

          this.loading = true
          this.percentage = 0

          this.interval = setInterval(() => {
            this.percentage += Math.floor(10)
            if (this.percentage >= 100) {
              clearInterval(this.percentage)
              this.loading = false
            }
          }, 300)
        },
      promptToDelete(id) {
          this.$q.dialog({
            title: 'Confirm',
            message: 'Do you want to delete this sentence?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            console.log('deleted')
            this.deleteItem(id)
          })
      }
    },
    components: {
      'edit-item': require('components/List/Modals/EditItem.vue').default
    }
}
</script>


<style scoped>

</style>