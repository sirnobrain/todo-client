<template>
  <md-toolbar class="md-dense">
    <h2 class="md-title" style="flex: 1">Todo Fancy</h2>

    <md-button v-show="!user.isLoggedIn" class="md-raised md-dense" @click="loginFb">
      FB Login
    </md-button>

    <md-button v-show="user.isLoggedIn" class="md-raised md-dense" @click="logout">
      Sign out
    </md-button>

    <md-button 
    id="add-todo" v-show="user.isLoggedIn" 
    class="md-icon-button" @click="openAddTodo">
      <md-icon>add</md-icon>
      <md-tooltip md-direction="bottom">Add Todo</md-tooltip>
    </md-button>

    <md-dialog @close="closedAddTodo"
    md-open-from="#add-todo" md-close-to="#add-todo" ref="add-todo">
      <md-dialog-title>Add Todo</md-dialog-title>

      <md-dialog-content>
        <form>
          <md-input-container>
            <label>Todo</label>
            <md-input v-model="text"></md-input>
          </md-input-container>
          <md-chips v-model="tags" md-input-placeholder="Tags"/>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeAddTodo">Cancel</md-button>
        <md-button class="md-primary" @click="postTodo">Create</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-toolbar>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      text: '',
      tags: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    openAddTodo () {
      this.$refs['add-todo'].open()
    },
    closeAddTodo () {
      this.$refs['add-todo'].close()
    },
    postTodo () {
      const todo = {
        text: this.text,
        tags: this.tags.join(';')
      }
      this.$store.dispatch('postTodo', todo)
      .then(() => {
        location.reload()
        this.$refs['add-todo'].close()
      })
      .catch(err => {
        console.log(err)
      })
    },
    closedAddTodo () {
      this.text = ''
      this.tags = []
    },
    loginFb () {
      this.$store.dispatch('loginFb')
      .then(() => {
        this.$store.dispatch('getTodos')
      })
      .catch(err => {
        console.log(err)
      })
    },
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md-toolbar {
    padding: 64px 0;
    display: flex;
    flex-direction: column;
  }
  .md-title {
    padding-left: 0;
    margin-left: 0!important;
  }
</style>
