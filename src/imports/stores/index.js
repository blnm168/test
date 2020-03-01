import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations } from './state'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

// store.subscribe((mutation, state) => {
//    console.log(state)
//    console.log(mutation)
// })

export default store
