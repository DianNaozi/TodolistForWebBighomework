<template>
  <h2 style="text-align: center">Diary</h2>
  <div class="container">
    <div style="border: 1px solid #ccc" class="editor">
      <el-input v-model="diaryTitle" placeholder="请输入标题" clearable>
        <template #prepend>文章标题</template>
      </el-input>
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
      />
      <el-button type="primary" style="float: right; margin-top: 10px" size="big" @click="submitDairy">提交</el-button>
    </div>
    <div class="aside-card">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>往期文章</span>
          </div>
        </template>
        <div v-for="(item,index) in diaryList" :key="index" class="text item">
          {{ item.title }}
          <span style="display: inline-block;float: right">{{ formatTimeStyle(item.createtime) }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>

import '@wangeditor/editor/dist/css/style.css' // 引入 css

import {getCurrentInstance, onBeforeUnmount, ref, shallowRef, onMounted} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {ElMessage} from "element-plus";

export default {
  components: {Editor, Toolbar},
  setup() {
    const {proxy} = getCurrentInstance();
    const diaryList = ref([])
    const diaryTitle = ref('')

    // 内容 HTML
    const valueHtml = ref('')


    // 全查所有日记
    async function findAllDiary() {
      const {data: res} = await proxy.$http.get('/textitem/' + sessionStorage.getItem('id'))
      diaryList.value = res.data
    }

    // 提交日记
    async function submitDairy() {
      if (diaryTitle.value === '') {
        return ElMessage({
          type: 'warning',
          message: '标题不能为空'
        })
      }
      await proxy.$http.post('/textitem', {
        title: diaryTitle.value,
        content: valueHtml.value,
        createtime: new Date(),
        update: new Date(),
        uid: sessionStorage.getItem('id')
      }).then(res => {
        diaryTitle.value = ''
        valueHtml.value = ''
        findAllDiary()
        ElMessage({type: 'success', message: '文章提交成功(*^▽^*)'})
      })
    }

    // 处理时间格式
    function formatTimeStyle(date) {
      // 2022-06-17T09:48:20.000+00:00
      return date.slice(0, 10) + '  ' + date.slice(11, 20)
    }


    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()


    // 模拟 ajax 异步获取内容
    onMounted(() => {
      findAllDiary()
    })

    const toolbarConfig = {}
    const editorConfig = {placeholder: '请输入内容...'}

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      diaryList, formatTimeStyle, diaryTitle, submitDairy
    };
  }
}

</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  margin-right: 5rem;
}

.aside-card {
  display: flex;
  align-items: flex-start;
}

.editor {
  width: 65%;
  margin-left: 5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 24rem;
}

</style>
