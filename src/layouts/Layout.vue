<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          SOLV French
        </q-toolbar-title>

          <q-btn 
          v-if="!loggedIn"
          to="/auth"
          flat
          icon-right="account_circle"
          label="Login"
          />

          <q-btn 
          v-else
          @click="logoutUser"
          flat
          icon-right="account_circle"
          label="Logout"
          />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item
         v-for="nav in navs"
         :key="nav.label"
         :to="nav.to"
         exact
         clickable
         >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
        </q-item>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { openURL } from 'quasar'
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false,
      navs : [
        {
          label: 'Lesson',
          icon: "settings_voice",
          to: '/'
        },
        {
          label: 'List',
          icon: "list",
          to: '/list'
        },
        {
          label: 'Settings',
          icon: "settings",
          to: '/settings'
        }     
      ]
    }
  },
  computed : {
    ...mapState('auth', ['loggedIn'])
  },
  methods: {
    ...mapActions('auth', ['logoutUser'] ),
    openURL
  }
}
</script>
