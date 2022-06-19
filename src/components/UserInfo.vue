<template>
  <div class="box_form">
    <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        style="max-width: 460px"
    >
      <el-form-item label="用户名">
        <el-input v-model="formLabelAlign.name" @blur="isSamename" disabled/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formLabelAlign.phone"/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formLabelAlign.email"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="margin: 0 auto" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import {ref, getCurrentInstance, onMounted} from 'vue'
import {ElMessage} from "element-plus";

export default {
  name: "UserInfo",
  setup() {
    const labelPosition = ref('top')
    const nameSame = ref('')
    const {proxy} = getCurrentInstance()

    let formLabelAlign = ref({
      id: sessionStorage.getItem('id'),
      name: '',
      phone: '',
      email: '',
    })

    onMounted(async () => {
      const {data: res} = await proxy.$http.get('/user/' + sessionStorage.getItem('id'))
      formLabelAlign.value = res.data
    })

    const onSubmit = async () => {
      if (nameSame.value !== '') {
        return ElMessage({
          type: 'warning',
          message: '用户名重名了'
        })
      }
      // 发送修改请求
      const {data: res} = await proxy.$http.put('/user', formLabelAlign.value)
      if (res.code === 20000){
        sessionStorage.setItem('username',formLabelAlign.value.name)
        return ElMessage({
          type:'success',
          message:'用户信息修改成功'
        })
      }
    }

    // 输入的名字是否重名
    async function isSamename() {
      if (formLabelAlign.name === '') {
        return ElMessage({
          type: 'warning',
          message: '用户名不能为空'
        })
      }
      const {data: res} = await proxy.$http.get('/user/ckname/' + formLabelAlign.value.name)
      if (res.data !== null && sessionStorage.getItem('username') !== formLabelAlign.value.name) {
        //用户名重复
        nameSame.value = 'yes'
      } else {
        nameSame.value = ''
      }
    }


    return {
      onSubmit, labelPosition, formLabelAlign, isSamename
    }
  }


}
</script>

<style scoped>
.box_form {
  display: flex;
  justify-content: center;
}
</style>
