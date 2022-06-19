<template>
  <div class="box">
    <div class="left"></div>
    <!--    登录界面-->
    <div class="right" v-show="isLoginPage">
      <h4>登 录</h4>
      <form>
        <input class="acc" type="text" placeholder="用户名" v-model="logname">
        <input class="acc" type="password" placeholder="密码" v-model="logpassword">
        <input class="submit" type="button" @click="login" value="Login">
      </form>
      <div class="fn">
        <a href="javascript:;" @click="isLoginPage = !isLoginPage;clearFormData()">注册账号</a>
        <a href="javascript:;">找回密码</a>
      </div>
    </div>
    <!--    注册界面-->
    <div class="right" v-show="!isLoginPage">
      <h4>注 册</h4>
      <form>
        <el-popover
            v-model:visible=cknameAlertVisible
            placement="top"
            trigger="contextmenu"
            :width="200"
            content="用户名重复"
            effect="dark"
            transition="el-fade-in-linear"
        >
          <template #reference>
            <input class="register-acc" type="text" placeholder="用户名" v-model="name" @blur="isSamename" maxlength="13">
          </template>
        </el-popover>
        <input class="register-acc" type="password" placeholder="密码" v-model="password">
        <input class="register-acc" type="password" placeholder="确认密码" v-model="repassword">
        <input class="submit" type="button" @click="register" value="Register">
      </form>
      <div class="fn">
        <a href="javascript:;" @click="isLoginPage=!isLoginPage;clearFormData()">登录</a>
        <a href="javascript:;">找回密码</a>
      </div>
    </div>
  </div>

</template>

<script>
import {getCurrentInstance, ref} from "vue";
import {useRouter} from "vue-router"
import {ElMessage} from "element-plus";

export default {
  name: "Login",
  setup() {
    const router = useRouter()
    const isLoginPage = ref(true)
    const password = ref("")
    const repassword = ref("")
    const name = ref("")
    const logname = ref("")
    const logpassword = ref("")
    const samename = ref("")
    const cknameAlertVisible = ref('false')


    const {proxy} = getCurrentInstance();

    // 清除表单数据
    function clearFormData() {
      password.value = ''
      repassword.value = ''
      name.value = ''
      logname.value = ''
      logpassword.value = ''
    }


    // 登录逻辑
    async function login() {
      if (logname.value === '') {
        return ElMessage({
              message: '登录用户名不能为空',
              type: 'warning',
            }
        )
      }
      if (logpassword.value === '') {
        return ElMessage({
              message: '登录密码不能为空',
              type: 'warning',
            }
        )
      }
      // 登录
      await proxy.$http.post('/user/login', {
        name: logname.value,
        password: logpassword.value
      }).then(async res => {
        console.log(res.data.code)
        if (res.data.code === 20001) {
          ElMessage({
                message: res.data.message,
                type: 'error',
              }
          )
          clearFormData()
        }
        if (res.data.code === 20000) {
          // 查找当前的用户信息
          const {data: res} = await proxy.$http.get('/user/ckname/' + logname.value)
          // 路由传参跳转
          router.push(
              {
                path: '/todo',
              }
          )
          // 将用户名存储到session中
          sessionStorage.setItem('username', logname.value)
          sessionStorage.setItem('id', res.data.id)
        }
      }).catch(err => {
        console.log(err)
      })
    }

    // 注册逻辑
    async function register() {
      // 用户名不为null
      if (name.value === '') {
        return ElMessage({
              message: '用户名不能为空',
              type: 'warning',
            }
        )
      }
      if (password.value === '') {
        return ElMessage({
              message: '密码不能为空',
              type: 'warning',
            }
        )
      }
      if (password.value === '') {
        return ElMessage({
              message: '重复密码不能为空',
              type: 'warning',
            }
        )
      }
      // 判断是否重复注册
      if (samename.value !== '') {
        return ElMessage({
              message: '用户名重复,请重新取过',
              type: 'warning',
            }
        )
      }

      // 密码是否一致
      if (password.value !== repassword.value) {
        return ElMessage({
              message: '两次输入密码不一致',
              type: 'error',
            }
        )
      } else {
        // 发送请求注册
        await proxy.$http.post('/user/register', {
          password: password.value,
          name: name.value,
        }).then(res => {
          this.isLoginPage = true
          ElMessage({
                message: '注册成功(*^▽^*)',
                type: 'success',
              }
          )
        })
      }
    }

    // 输入的名字是否重名
    async function isSamename() {
      if (name.value === '') {
        return
      }
      const {data: res} = await proxy.$http.get('/user/ckname/' + name.value)
      if (res.data !== null) {
        //用户名重复
        samename.value = 'yes'
        cknameAlertVisible.value = true
      } else {
        samename.value = ''
        cknameAlertVisible.value= false
      }
    }

    return {
      login,
      isLoginPage,
      register, password, name, repassword, logname, logpassword, clearFormData,
      isSamename, samename, cknameAlertVisible
    }
  }
}
</script>

<style lang="less" scoped>

::selection {
  color: #fff;
  background-color: rgb(144, 129, 241);
}

.box {
  display: flex;
  overflow: hidden;
  width: 930px;
  height: 550px;
  background-color: rgba(255, 255, 255, 60%);
  border-radius: 1.5rem;
  margin: 20px auto;
  box-shadow: 0 0 1rem 0.2rem rgb(0 0 0 / 10%);

  .left {
    position: relative;
    width: 35%;
    height: 100%;
    background-color: skyblue;
  }

  .left::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(../assets/left.jpeg);
    background-size: cover;
    opacity: 80%;
  }

  .right {
    display: flex;
    width: 65%;
    flex-direction: column;
    align-items: center;

    h4 {
      color: rgb(144, 129, 241);
      font-size: 2rem;
      margin-top: 5rem;
    }

    form {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .acc {
        outline: none;
        width: 80%;
        height: 5rem;
        font-size: 1.2rem;
        margin-top: 1rem;
        padding: 1rem 0 0 1.6rem;
        border: none;
        border-bottom: 1px solid rgb(144, 129, 241);
        color: rgb(144, 129, 241);
        background-color: rgba(0, 0, 0, 0);
      }

      .register-acc {
        outline: none;
        width: 80%;
        height: 3rem;
        font-size: 1.2rem;
        margin-top: 1rem;
        padding: 1rem 0 0 1.6rem;
        border: none;
        border-bottom: 1px solid rgb(144, 129, 241);
        color: rgb(144, 129, 241);
        background-color: rgba(0, 0, 0, 0);
      }

      .acc:focus {
        outline: none;
        color: rgb(144, 129, 241);
        padding: 1rem 0 0 1.6rem;
      }

      register-acc:focus {
        outline: none;
        color: rgb(144, 129, 241);
        padding: 1rem 0 0 1.6rem;
      }
    }

    .submit {
      width: 50%;
      height: 4rem;
      color: #f6f6f6;
      background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
      font-size: 1.4rem;
      border: none;
      border-radius: 0.5rem;
      margin: 2rem 0 0 50%;
      transform: translateX(-50%);
    }

    .submit:hover {
      box-shadow: 0 0 2rem -0.5rem rgb(0 0 0 / 15%);
    }

    .fn {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      width: 70%;

      a {
        font-size: 1.3rem;
        margin-top: 1rem;
        padding: 1rem 2rem;
        color: #666;
      }

      a:hover {
        color: rgb(144, 129, 241);
      }
    }
  }
}
</style>
