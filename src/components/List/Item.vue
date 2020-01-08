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
            {{item.status.name}}
        </q-item-section>
        <q-item-section side>
		      <q-item-label>
            <div class="row">
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

export default {
    props: ['item', 'id'],
    data () {
      return{
        showEditItem: false,
        statuses: ["to review","ok","learnt"]
      }
    },
    methods: {
      ...mapActions('items', ['updateItem', 'deleteItem']),
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