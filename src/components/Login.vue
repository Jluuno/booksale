<template>
    <div class="login-container">
      <p>Login</p>
  
      <!-- 登录表单 -->
      <form class="login-form" @submit.prevent="login">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required />


  
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
  
        <button type="submit">登录</button>
         <!-- 添加注册按钮 -->
         <button type="button" @click="navigateToRegister">注册</button>
      </form>
  
       <!-- 返回登录页面的链接 -->
       <span><router-link to="/">返回主界面</router-link></span>
      <!-- 显示登录结果 -->
      <p class="login-message">{{ loginMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        loginMessage: '', // 用于显示登录结果消息
      };
    },
    methods: {

        navigateToRegister() {
      // 导航到注册页面
      this.$router.push('/register');
    },



        async login() {
  try {
    const response = await axios.post('http://localhost:25565/user/login', {
      userName: this.username,
      password: this.password,
    });

    if (response.data.code === 200) {
      this.loginMessage = '登录成功';

      // 保存用户信息到本地存储
      const userData = {
            username: this.username,
            avatar: response.data.data.avatar, // Add the avatar to the userData
          };
      localStorage.setItem('userData', JSON.stringify(userData));

      this.isLoggedIn = true;

      // 导航到主页面
      this.$router.push('/');
    } else {
      this.loginMessage = '用户名或密码错误';
    }
  } catch (error) {
    console.error('登录失败:', error);
    this.loginMessage = '登录失败，请稍后重试';
  }
},

  },
  };
  </script>
  
<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-left: 200%;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  margin-bottom: 5px;
}

input {
  padding: 8px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%; /* 让按钮占据整个宽度 */
}

button {
  flex: 1; /* 让按钮平均占据可用空间 */
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

.login-message {
  margin-top: 10px;
  color: #ff5555;
}
</style>