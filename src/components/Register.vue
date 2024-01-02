<template>
    <div class="register-container">
      <p>Register</p>
  
      <!-- 注册表单 -->
      <form class="register-form" @submit.prevent="register">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required />
  
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
  
        <button type="submit">注册</button>
      </form>
  
      <!-- 显示注册结果 -->
      <p class="register-message">{{ registerMessage }}</p>
  
      <!-- 返回登录页面的链接 -->
      <router-link to="/login" style="display: inline-block;">返回登录</router-link>

      

    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        registerMessage: '', // 用于显示注册结果消息
      };
    },
    methods: {
      async register() {
        try {
          const response = await axios.post('http://localhost:25565/user/register', {
            userName: this.username,
            password: this.password,
          });
  
          if (response.data.code === 200) {
            this.registerMessage = '注册成功';
  
            // 注册成功后可以在这里进行其他操作
  
            // 跳转到登录页面
            this.$router.push('/login');
          } else {
            this.registerMessage = '注册失败，请重试';
          }
        } catch (error) {
          console.error('注册失败:', error);
          this.registerMessage = '注册失败，请稍后重试';
        }
      },
    },
  };
  </script>
  
  <style>
  .register-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    /* margin-left: 200%; */
    margin-left: 190%;
  }
  
  .register-form {
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
  
  button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .register-message {
    margin-top: 10px;
    color: #ff5555;
  }
  

  .router-link-exact-active {
  white-space: nowrap;
}

  /* 添加返回登录链接的样式 */
 /* 添加返回登录链接的样式 */
router-link {
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap; /* 防止换行 */
}

  </style>
  