import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.prototype.$http = axios.create({ baseURL: 'http://localhost:3000/' })

Vue.use(Vuex)

let store = new Vuex.Store({

})

export default store