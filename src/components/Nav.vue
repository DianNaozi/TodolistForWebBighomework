<template>
  <ul class="shell">
    <router-link to="/todolist">
      <li class="button border-radius-left">
        <span><el-icon :size="40" :color="color">
          <List/>
        </el-icon>代办 </span>
      </li>
    </router-link>
    <router-link to="/diary">
      <li class="button">
      <span>
        <el-icon :size="40" :color="color">
        <Edit/>
      </el-icon>记事本</span>
      </li>
    </router-link>
    <router-link to="/calendar">
      <li class="button">
        <span>
          <el-icon :size="40" :color="color"><Postcard/></el-icon>日历
        </span>
      </li>
    </router-link>
    <router-link to="/userinfo">
      <li class="button">
        <span><el-icon :size="40" :color="color"><Avatar/></el-icon>{{ username }}</span>
      </li>
    </router-link>

    <li class="button border-radius-right" @click="this.centerDialogVisible = true">
      <span>退出</span>
    </li>
  </ul>

  <!--  退出对话框-->
  <el-dialog v-model="centerDialogVisible" title="警告" width="30%" center>
    <span style="color: #3e391c">
      退出之后就要重新登录了！
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="logout">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "Nav",
  data() {
    return {
      username: '',
      centerDialogVisible: false
    }
  },
  methods: {
    logout() {
      this.centerDialogVisible = false;
      sessionStorage.clear();
      this.$router.push(
          {path: '/'}
      )
    }
  },
  mounted() {
    this.username = sessionStorage.getItem('username')
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 20px;
  color: #f4f1de;
}

body {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to right, #a18cd1, #fbc2eb);
}

.shell {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.border-radius-left {
  border-radius: 30px 0 0 30px;
}

.border-radius-right {
  border-radius: 0 30px 30px 0;
}

.button,
.portrait {
  background-color: #50536e;
  width: 170px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  transition: .3s;
  cursor: pointer;
}

.portrait::before {
  content: '';
  display: block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transform: translate(30px, -30px);
  /*background-image: url('./portrait.png');*/
  background-size: cover;
  border: 10px solid #fff;
}

.information {
  width: 220px;
  background-color: #e07a5f;
  transform: translate(-20px, -200px);
  border-radius: 10px;
  padding: 20px 0;
  line-height: 0;
  height: 0;
  transition: .3s;
  opacity: 0;

}

.button:hover {
  background-color: #d15a39;
}

.button li:hover {
  background-color: #ffb29d;
}

.button ul li {
  height: 0;
  transition: .2s;
  opacity: 0;
  transform: translateY(-65px);
  background-color: #e07a5f;
}

.button:hover li {
  height: 65px;
  opacity: 1;
  transform: translateY(0);
}

.portrait:hover .information {
  opacity: 1;
  line-height: 65px;
  transform: translate(-20px, -10px);
  height: auto;
}
</style>
