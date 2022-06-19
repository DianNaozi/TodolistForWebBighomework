<template>
  <div>
    <div class="todo-list">
      <!-- Heading -->
      <h2 class="text-center">Todo List</h2>
      <!-- Input -->
      <div class="flex-container">
        <input type="text" v-model="task" placeholder="Enter task"/>
        <button @click="submitTask">
          SUBMIT
        </button>
      </div>

      <!-- Task table -->
      <table class="tasks">
        <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th>Del</th>
          <th>Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>
							<span :class="{ 'line-through': task.status === 3 }">
								{{ task.name }}
							</span>
          </td>
          <td>
							<span class="pointer noselect" @click="changeStatus(index)" :class="{
                            'text-danger': task.status === 1,
                            'text-success': task.status === 3,
                            'text-warning': task.status === 2
                          }">
								{{ getStuteName(task.status) }}
							</span>
          </td>
          <td class="text-center">
            <div @click="deleteTask(task.id)">
              <button>del</button>
            </div>
          </td>
          <td class="text-center">
            <div @click="editTask(index)">
              <button>edit</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>

</template>

<script>
import axios from 'axios'
import {ElMessage} from "element-plus";

export default {
  name: "TodoList",
  data() {
    return {
      task: '',
      tasks: [],
      inputState: 0,
      editIndex: -1,
      basketName: '',
      user: {}
    }
  },
  methods: {
    // 提交todo
    async submitTask() {
      if (this.task !== '' && this.inputState === 0) {
        await this.$http.post('/todoitem/',
            {
              name: this.task,
              status: 1,
              uid: sessionStorage.getItem('id')
            })
      }
      if (this.inputState === 1 && this.task !== '') {
        this.tasks[this.editIndex].name = this.task
        // 修改todoitem
        await this.$http.put('/todoitem', this.tasks[this.editIndex])
        this.inputState = 0
      }
      this.task = ''
      await this.getTodoList()
    },
    // 改变todo状态
    async changeStatus(index) {
      // 1:to-do  2:in-progress 3:finished
      if (this.tasks[index].status === 1) {
        this.tasks[index].status = 2
      } else if (this.tasks[index].status === 2) {
        this.tasks[index].status = 3
      } else {
        this.tasks[index].status = 1
      }
      await this.$http.put('/todoitem', this.tasks[index])
    },
    // 删除todo任务
    async deleteTask(id) {
      await this.$http.delete('/todoitem/' + id)
          .then(res => {
            this.getTodoList()
          }).catch(err => {
            ElMessage({
                  message: '删除失败',
                  type: 'error',
                }
            )
          })
    },
    // 编辑todo任务
    async editTask(index) {
      this.task = this.tasks[index].name
      this.inputState = 1
      this.editIndex = index
    },
    // 获取todo列表
    async getTodoList() {
      const {data: res} = await this.$http.get('/todoitem/findAllItem/' + sessionStorage.getItem('id'))
      this.tasks = res.data
    },
    // 状态渲染
    getStuteName(status) {
      // 1:to-do  2:in-progress 3:finished
      switch (status) {
        case 1:
          return 'to-do';
        case 2:
          return 'in-progress'
        case 3:
          return 'finished'
      }
    }
  },
  mounted() {
    this.getTodoList()
  }

}
</script>

<style lang="less" scoped>
.todo-list {
  max-width: 600px;
  margin: 0 auto;
  font-size: 15px;
}

.text-center {
  text-align: center;
}

.flex-container {
  display: flex;
}

.flex-container input {
  flex: 1;
  height: 30px;
  font-size: 1.2em;
}

.tasks {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

.tasks td,
.tasks th {
  border: 1px solid #ddd;
  padding: 8px;
}

.tasks tr:nth-child(even) {
  background-color: #f2f2f2;
}

.tasks th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}

.pointer {
  cursor: pointer;
}

.noselect {
  user-select: none;
}

.line-through {
  text-decoration: line-through;
}

.text-danger {
  color: red;
}

.text-warning {
  color: darkorange
}

.text-success {
  color: green;
}
</style>
