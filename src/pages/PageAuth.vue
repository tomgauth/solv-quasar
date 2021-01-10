<template>
  <q-page padding class="row items-center">
        <q-card class="login-card q-pa-lg">
          <div>
            <h5 class="text-primary text-center">Solv App</h5>
          </div>
          <q-separator />
          <q-tabs
            v-model="tab"
            dense
            class="text-grey q-py-lg"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="login" label="Login" />
            <q-tab name="register" label="Register" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="login">
              <login-register :tab="tab"/>
            </q-tab-panel>

            <q-tab-panel name="register">
              <login-register :tab="tab"/>
            </q-tab-panel>
          </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>

export default {
    data () {
    return {
      tab: 'login'
    }
  },
  components: {
      'login-register' : require('components/Auth/LoginRegister.vue').default
  }

}
</script>

<style>
.login-card{
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    }
</style>