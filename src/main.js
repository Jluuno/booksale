import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createRouter, createWebHistory } from 'vue-router';  // 使用 Vue 3 的方式导入

// 导入 BookDetail 组件
import BookDetail from './components/BookDetail.vue';
import Book from './components/Book.vue';
import Login from './components/Login.vue';
import register from './components/Register.vue'
const app = createApp(App);

// 使用 Element Plus
app.use(ElementPlus);

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: '/', 
        name:'Book',
        component: Book,
        meta: { requiresAuth: true } 
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: BookDetail,
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
      },
      {
        path: '/register',
        name: 'register',
        component: register,
      },
    // 其它路由配置...
  ],
});

// 将路由实例添加到应用中
app.use(router);

// 挂载应用
app.mount('#app');
