<template>
  <div>
    <Nav></Nav>
    <router-view></router-view>
  </div>
</template>

<script>
import TodoList from "../components/TodoList.vue";
import Nav from "../components/Nav.vue";

export default {
  name: "Todo",
  components: {
    TodoList, Nav
  }
}
</script>

<style scoped>

</style>
