import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jwt from 'jsonwebtoken'

Vue.prototype.$http = axios.create({ baseURL: 'http://35.197.130.87:80/' })

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    user: {
      user_fb_id: null,
      jwtoken: null,
      isLoggedIn: false
    },
    todos: []
  },
  getters: {
    todos (state) {
      return state.todos.filter(todo => !todo.done)
    },
    doneTodos (state) {
      return state.todos.filter(todo => todo.done)
    }
  },
  mutations: {
    destroyTodo (state, destroyedTodo) {
      const todoIdx = state.todos.findIndex(todo => todo._id === destroyedTodo._id)
      state.todos.splice(todoIdx, 1)
    },
    updateTodo (state, updatedTodo) {
      const todoIdx = state.todos.findIndex(todo => todo._id === updatedTodo._id)
      state.todos[todoIdx] = updatedTodo
    },
    addAllTodos (state, todos) {
      state.todos = todos
    },
    setUser (state, jwtoken) {
      const decoded = jwt.decode(jwtoken)
      state.user.user_fb_id = decoded
      state.user.jwtoken = jwtoken
      state.user.isLoggedIn = true

      localStorage.setItem('jwtoken::todo', jwtoken)
    },
    unsetUser (state) {
      state.user.user_fb_id = null
      state.user.jwtoken = null
      state.user.isLoggedIn = false

      localStorage.removeItem('jwtoken::todo')
    }
  },
  actions: {
    postEditTodo (context, updatedTodo) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.put(`/${updatedTodo._id}`, updatedTodo, {headers: {jwtoken: context.state.user.jwtoken}})
        .then(updated => {
          context.commit('updateTodo', updatedTodo)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
      })
    },
    destroyTodo (context, todo) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.delete(`/${todo._id}`, {headers: {jwtoken: context.state.user.jwtoken}})
        .then(deleted => {
          context.commit('destroyTodo', todo)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
      })
    },
    toggleDone (context, todo) {
      todo.done = !todo.done

      return new Promise((resolve, reject) => {
        Vue.prototype.$http.put(`/${todo._id}`, todo, {headers: {jwtoken: context.state.user.jwtoken}})
        .then(updated => {
          context.commit('updateTodo', todo)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
      })
    },
    postTodo (context, todo) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http.post('/', todo, {headers: {jwtoken: context.state.user.jwtoken}})
        .then(todo => {
          resolve()
        })
        .catch(err => {
          reject(err)
        })
      })
    },
    getTodos (context) {
      return new Promise((resolve, reject) => {
        Promise.all([
          Vue.prototype.$http.get('/', {headers: {jwtoken: context.state.user.jwtoken}}),
          Vue.prototype.$http.get('/archives', {headers: {jwtoken: context.state.user.jwtoken}})
        ])
        .then(values => {
          const todos = values[0].data.data.concat(values[1].data.data)
          context.commit('addAllTodos', todos)
          resolve()
        })
        .catch(err => {
          reject(err)
        })
      })
    },
    loginFb (context) {
      console.log('LOGIN!!!!')
      return new Promise((resolve, reject) => {
        window.FB.login(response => {
          const token = response.authResponse.accessToken
          const fbId = response.authResponse.userID
          console.log('DAPET RESPON', {fb_token: token, fb_id: fbId})
          Vue.prototype.$http.get('/signin', {headers: {fb_token: token, fb_id: fbId}})
          .then(response => {
            console.log('SERVER: response.data')
            context.commit('setUser', response.data.data.jwtoken)
            resolve()
          })
          .catch(err => {
            reject(err)
          })
        }, {scope: 'public_profile'})
      })
    },
    checkLoginState (context, jwtoken) {
      if (jwtoken) context.commit('setUser', jwtoken)
    },
    logout (context) {
      context.commit('unsetUser')
    }
  }
})

export default store
