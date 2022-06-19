<template>
  <h2 style="text-align: center">Calendar</h2>
  <el-calendar>
    <template #dateCell="{ data }">
      <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-').slice(1).join('-') }}
      <div>
          <span>
            <el-icon :size="30" color="green" v-show="todoFinishs.includes(data.day)"><check/></el-icon>
            <el-icon :size="30" color="#5098FFFF" v-show="diaryDays.includes(data.day)"><Postcard/></el-icon>
          </span>
      </div>
      </p>
    </template>
  </el-calendar>
</template>

<script>
import {ref, getCurrentInstance, onMounted} from "vue"

export default {
  name: "Calendar",
  setup() {
    const diaryDays = ref([])
    const todoFinishs = ref([])
    const {proxy} = getCurrentInstance()

    // 查找所有的日记的时间并渲染到日历上
    async function findAllDirayTime() {
      const {data: res} = await proxy.$http.get('/textitem/findCreateTime/' + sessionStorage.getItem('id'))
      let data = res.data
      // "2022-06-17 09:48:20"
      for (let i = 0; i < data.length; i++) {
        // 去重
        let time = data[i].slice(0, 10)
        console.log(diaryDays.value.includes(time))
        if (!diaryDays.value.includes(time)) {
          diaryDays.value.push(time)
        }
      }
    }

    // 查找当天的todo是否完成
    async function checkTodoAll() {
      const {data: res} = await proxy.$http.get('/todoitem/checkFinishAll/' + sessionStorage.getItem('id'))
      let data = res.data
      // "2022-06-17 09:48:20"
      for (let i = 0; i < data.length; i++) {
        // 去重
        let time = data[i].slice(0, 10)
        if (!todoFinishs.value.includes(time)) {
          todoFinishs.value.push(time)
        }
      }
    }

    onMounted(() => {
      findAllDirayTime()
      checkTodoAll()
    })


    return {
      diaryDays, todoFinishs
    }
  }
}
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
</style>
