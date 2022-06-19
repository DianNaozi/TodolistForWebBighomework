import {createRouter, createWebHashHistory} from 'vue-router'
import Login from '../views/Login.vue'
import Todo from "../views/Todo.vue"
import Calendar from "../components/Calendar.vue";
import TodoList from "../components/TodoList.vue";
import Diary from "../components/Diary.vue";
import UserInfo from "../components/UserInfo.vue";
import {ElMessage} from "element-plus";

const router = createRouter(
    {
        history: createWebHashHistory(),
        routes: [
            {
                path: '/',
                redirect: '/login'
            },
            {
                path: '/todo',
                component: Todo,
                meta: {isAuth: true},
                redirect: '/todolist',
                children: [
                    {
                        path: '/todolist',
                        component: TodoList
                    },
                    {
                        path: '/calendar',
                        component: Calendar
                    },
                    {
                        path: '/diary',
                        component: Diary
                    },
                    {
                        path: '/userinfo',
                        component: UserInfo
                    }
                ]
            },
            {
                path: '/login',
                component: Login
            },

        ]
    }
)

// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.meta.isAuth) {
        console.log(sessionStorage.getItem('username'))
        if (sessionStorage.getItem('username') !== null) {
            next()
        } else {
            ElMessage({
                message: '您尚未登录',
                type: 'warning'
            })
            router.push(
                {path: '/login'}
            )
        }
    } else {
        next()
    }
})

export default router
