<template>
  <div id="home">

    <div id="archives-wrapper" class="container">
      <Toolbar></Toolbar>
      <md-list class="md-double-line">
        <md-subheader>Archives</md-subheader>
        <md-list-item v-for="doneTodo in doneTodos" :key="doneTodo._id">
          <div class="md-list-text-container">
            <span>{{doneTodo.text}}</span>
            <span><span v-for="tag in doneTodo.tags"> #{{tag}}</span></span>
          </div>

          <md-button class="md-icon-button md-list-action" @click="toggleDone(doneTodo)">
            <md-icon class="md-accent">undo</md-icon>
            <md-tooltip md-direction="bottom">Undo</md-tooltip>
          </md-button>
          <md-button class="md-icon-button md-list-action" @click="destroyTodo(doneTodo)">
            <md-icon class="md-warn">delete_forever</md-icon>
            <md-tooltip md-direction="bottom">Delete</md-tooltip>
          </md-button>
        </md-list-item>
      </md-list>
    </div>

    <div id="todo-wrapper" class="container">
      <md-subheader>To Do</md-subheader>
      <md-card v-for="todo in todos" :key="todo._id">
        <md-card-area>
          <md-card-header>
            <div class="md-title">{{todo.text}}</div>
            <div class="md-subhead"><span v-for="tag in todo.tags">#{{tag}} </span></div>
          </md-card-header>
        </md-card-area>

        <md-card-actions>
          <md-button class="md-icon-button md-warn" @click="destroyTodo(todo)">
            <md-icon>delete_forever</md-icon>
            <md-tooltip md-direction="bottom">Delete</md-tooltip>
          </md-button>
          <md-button id="edit-todo" class="md-icon-button md-accent" @click="openEditTodo(todo)">
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="bottom">Edit</md-tooltip>
          </md-button>
          <md-button class="md-icon-button md-primary" @click="toggleDone(todo)">
            <md-icon>done</md-icon>
            <md-tooltip md-direction="bottom">Done</md-tooltip>
          </md-button>
        </md-card-actions>
      </md-card>
    </div>

    <md-dialog @close="closedEditTodo" md-open-from="#edit-todo" md-close-to="#edit-todo" ref="edit-todo">
      <md-dialog-title>Edit Todo</md-dialog-title>

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
        <md-button class="md-primary" @click="closeEditTodo">Cancel</md-button>
        <md-button class="md-primary" @click="postEditTodo">Post Edit</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'

export default {
  name: 'Home',
  components: {Toolbar},
  data () {
    return {
      todo: null,
      text: '',
      tags: []
    }
  },
  methods: {
    openEditTodo (todo) {
      this.todo = todo
      this.tags = todo.tags.join(';').split(';')
      this.text = todo.text

      this.$refs['edit-todo'].open()
    },
    closeEditTodo () {
      this.$refs['edit-todo'].close()
    },
    closedEditTodo () {
      this.todo = null
      this.text = ''
      this.tags = []
    },
    postEditTodo () {
      let updatedTodo = this.todo
      updatedTodo.text = this.text
      updatedTodo.tags = this.tags
      console.log('UPDATED', updatedTodo)
      this.$store.dispatch('postEditTodo', updatedTodo)
      .then(() => {
        this.$refs['edit-todo'].close()
      })
      .catch(err => {
        console.log(err)
      })
    },
    destroyTodo (todo) {
      this.$store.dispatch('destroyTodo', todo)
    },
    toggleDone (todo) {
      this.$store.dispatch('toggleDone', todo)
    }
  },
  computed: {
    todos () {
      return this.$store.getters.todos.sort((a, b) => a.createdAt - b.creataedAt)
    },
    doneTodos () {
      return this.$store.getters.doneTodos.sort((a, b) => a.createdAt - b.creataedAt)
    }
  },
  created () {
    if (this.$store.state.user.isLoggedIn) this.$store.dispatch('getTodos')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#home {
  display: flex;
  justify-content: center;
}
.md-subheader {
  font-size: 18px;
  letter-spacing: 1.5px;
}
.container h2 {
  text-align: center;
}
#todo-wrapper {
  width: 62%;
  padding: 32px 64px;
}
.md-card-header {

}
#archives-wrapper {
  width: 38%;
  padding: 0px 0px;
  min-height: 100vh;
  -webkit-box-shadow: 1px 0px 2px 0px rgba(153,153,153,1);
  -moz-box-shadow: 1px 0px 2px 0px rgba(153,153,153,1);
  box-shadow: 1px 0px 2px 0px rgba(153,153,153,1);
}
.md-list {
  background: transparent;
  padding: 32px 32px;
}
.md-card {
  box-shadow: none;
  margin-bottom: 8px;
}
.md-card:last-child {
  margin-bottom: 0;
}
.md-card-header, .md-card-actions {
  padding-top: 0px;
  padding-bottom: 0px;
}
.md-title {
  font-size: 18px;
}
.md-subhead {
  text-align: right;
}
</style>
