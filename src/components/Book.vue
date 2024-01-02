<template>
    <div id="app">
      <div class="sidebar">

        <h2 style="color: #fab6b6;">图书分类</h2>
      <ul>
        <li v-for="category in categories" :key="category.id" @click="filterBooks(category.id)">
          {{ category.name }}
        </li>
      </ul>

      <div class="purchase-list">
        <h2 style="color: #fab6b6;">图书购买清单</h2>
        <ul>
          <li v-for="book in purchaseList" :key="book.id" @click="navigateToBookDetail(book.id)">
            {{ book.name }}
          </li>
        </ul>
      </div>
      
    </div>


      <div class="main">
        <div class="header">
          <h2 style="color: #fab6b6;">图书列表</h2>
          <div class="search-container">
        <input v-model="searchQuery" type="text" placeholder="搜索书名" />
        <button @click="searchBooks">搜索</button>
      </div>
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span class="pagination-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
          </div>
          <div>
            <button v-if="!isLoggedIn" @click="navigateToLogin">登录</button>
            
            <h3 style="margin-top: 25%;" v-if="isLoggedIn">
              <span v-if="!isUsernameModified">欢迎您，<a style="color: red;">{{ username }}</a></span>
              <span v-else>欢迎您，<a style="color: red;">{{ userInfo.userName }}</a></span>
            </h3>

            <img v-if="isLoggedIn" :src="avatar" alt="User Avatar" style="width: 50px; height: 50px; border-radius: 50%;" />
            <!-- 添加个人中心按钮 -->
            <button v-if="isLoggedIn" @click="openUserProfile">个人中心</button>
               <!-- 添加个人中心弹窗 -->
                  <div v-if="showUserProfile" class="user-profile">
                    <h2>个人中心</h2>
                    <form @submit.prevent="updateUserInfo">
                      <label for="userId">用户ID：</label>
                      <input type="text" v-model="userInfo.id" disabled />

                      <label for="username">用户名：</label>
                      <input type="text" v-model="userInfo.userName" />

                      <label for="password">密码：</label>
                      <input type="password" v-model="userInfo.password" />

                      <label for="avatar">头像：</label>
                      <img :src="userInfo.avatar" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%;" />
                      <input type="text" v-model="userInfo.avatar" />

                      <button type="submit">更新用户信息</button>
                    </form>
                    <button @click="closeUserProfile">关闭</button>
                  </div>


            <button v-if="isLoggedIn" @click="logoutAndShowAlert" style="margin-bottom: 50%;">退出</button>
          </div>
        </div>
        <div class="books">
          <div v-for="(book, index) in filteredBooks" :key="index" class="book">
            <img :src="book.img" alt="Book Cover" />
           
            <div class="details">
              <router-link :to="{ name: 'book-detail', params: { id: book.id } }">
                <router-link :to="{ name: 'book-detail', params: { id: book.id } }">
                <h3 style="color: #888;" @click="onBookClick(book.id)">{{ book.name }}</h3>
              </router-link>

            </router-link>
              <p style="color: #9C9C9C;">作者: {{ book.author }}</p>
              <!-- 修改图书的价格部分 -->
              <p class="price"> ￥{{ parseFloat(book.price).toFixed(2) }}</p>

            </div>
          </div>
        </div>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <span class="pagination-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </div>

 
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    props: {
    onBookClick: Function
  },
    data() {
      return {
        books: [],
        filteredBooks: [],
        pageSize: 15,
        currentPage: 1,
        total: 0,
        searchQuery: "", // 新增搜索框的绑定变量
        categories: [], // 新的属性用于存储分类
        selectedCategoryId: null,
        purchaseList: [], // 新增图书购买清单数据
        isLoggedIn: false, // 新增状态变量，表示用户是否已登录
        showUserProfile: false, // 控制个人中心弹窗的显示
        userInfo: {
          id: null,
          userName: "",
          password: "",
          avatar: "",
        },
        isUsernameModified: false,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.total / this.pageSize);
      },
      
    },

    mounted() {
      this.fetchBooks();
      this.fetchCategories(); // 在组件挂载时获取分类
      this.fetchPurchaseList(); // 在组件挂载时获取图书购买清单数据

      // 检查用户是否已登录
  const userData = localStorage.getItem('userData'); // 假设用户信息已保存在本地存储中
  if (userData) {
    const { username } = JSON.parse(userData);
    const{avatar}=JSON.parse(userData);
    this.isLoggedIn = true;
    this.username = username;
    this.avatar=avatar;
  }
    },

    methods: {
      async openUserProfile() {
    try {
      const userNameToFetch = this.isUsernameModified ? this.userInfo.userName : this.username;
      const response = await axios.get("http://localhost:25565/user/info?userName="+ userNameToFetch);
      this.userInfo = response.data.data;
      this.showUserProfile = true;
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  },
  closeUserProfile() {
    this.showUserProfile = false;
  },
  async updateUserInfo() {
    try {
      const response = await axios.put("http://localhost:25565/user/update", this.userInfo);
      if (response.data.code === 200) {
        alert("用户信息更新成功！");
        this.isUsernameModified = true; // 用户名已修改
        this.closeUserProfile();
      } else {
        alert("用户信息更新失败，请稍后重试！");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("用户信息更新失败，请稍后重试！");
    }
  },

      async logoutAndShowAlert() {
      try {
        // 执行退出登录操作
        await this.logout();

        // 成功退出后显示弹窗
        alert('成功退出登录！');
      } catch (error) {
        console.error('退出登录失败:', error);
        alert('退出登录失败，请稍后重试！');
      }
    },
      //登出
      async logout() {
      // 清除本地存储的用户信息
      localStorage.removeItem('userData');

      // 更新状态
      this.isLoggedIn = false;
      this.username = '';

      // 可以在退出后执行其他操作，例如导航到登录页面
      this.$router.push({ name: 'Book' });
    },

      navigateToLogin() {
      // 导航到登录页面
      this.$router.push({ name: 'login' });
    },

      navigateToBookDetail(bookId) {
      // 导航到图书详情页面
      this.$router.push({ name: 'book-detail', params: { id: bookId } });
    },

      async fetchPurchaseList() {
      try {
        const response = await axios.get("http://localhost:25565/book/name");
        this.purchaseList = response.data.data;
      } catch (error) {
        console.error("Error fetching purchase list:", error);
      }
    },
      // 添加 handleClick 方法
    handleClick(bookId) {
      // 可以在这里进行导航或者其他点击书名后的操作
      // 例如，如果你想使用 Vue Router 进行导航，可以使用如下方式：
      this.$router.push({ name: 'book-detail', params: { id: bookId } });
    },
      async fetchBooks() {
      try {
        const response = await axios.get("http://localhost:25565/book/list", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            name: this.searchQuery,
          },
        });
        const data = response.data.data;
        this.books = data.rows;
        this.filteredBooks = this.books;
        this.total = data.total;
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },
       async fetchCategories() {
      try {
        const response = await axios.get("http://localhost:25565/category/list");
        this.categories = response.data.data;
      } catch (error) {
        console.error("获取分类时出错:", error);
      }
    },

filterBooks(categoryId) {
       if (categoryId === this.selectedCategoryId) {
        this.selectedCategoryId = null;
        this.fetchBooks(); // 如果取消选择分类，仍然调用原有的fetchBooks()方法
      } else {
        this.selectedCategoryId = categoryId;
        this.currentPage = 1;
        this.fetchCategoryBooks(); // 点击分类时调用新的方法获取图书信息
      } 

    },

    async fetchCategoryBooks() {
      try {
        let apiUrl = "http://localhost:25565/book/category/" + this.selectedCategoryId;

        const response = await axios.get(apiUrl, {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            name: this.searchQuery,
          },
        });

        const data = response.data;
        this.books = data.data; // Assuming the books data is in the "data" field
        this.filteredBooks = this.books;
        this.total = Math.max(1, Math.ceil(data.data.length / this.pageSize) * this.pageSize);

      } catch (error) {
        console.error("Error fetching category books:", error);
      }
    },

      searchBooks() {
      this.currentPage = 1; // 重置当前页码
      this.fetchBooks(); // 重新发起查询
    },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.fetchBooks();
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.fetchBooks();
        }
      },
     /*  filterBooks(category) {
        if (category === 'all') {
          this.filteredBooks = this.books;
        } else {
          this.filteredBooks = this.books.filter(book => book.category === category);
        }
        this.currentPage = 1;
      }, */
      searchBooks() {
        this.currentPage = 1; // 重置当前页码
        this.fetchBooks(); // 重新发起查询
      },
    },
  };
  </script>
  
  
  
  
  

  
  <style>
  #app {
    display: flex;
  }

  .search-container {
  display: flex;
  align-items: center;
}

.search-container input {
  padding: 5px;
  margin-right: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.search-container button {
  padding: 5px 10px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}

  .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 15%;
  margin-bottom: 10px; /* 为标题和分页信息之间添加一些间隔 */
  background-color: #f0f0f0;
  height: 100px;
}

.pagination-info {
  font-size: 14px;
  color: #555;
}
  
  .sidebar {
  width: 20%;
  height: 40%;
  padding: 20px;
  background-color: #f0f0f0;
}

.sidebar h2 {
  margin-bottom: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  cursor: pointer;
  padding: 5px;
  margin-bottom: 5px;
  background-color: #fcd3d3;
  border-radius: 5px;
  color: white
}

.main {
  flex: 1;
  padding: 20px;
}
  
  .books {
    display: flex;
    flex-wrap: wrap;
  }
  
  .book {
    margin: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 150px;
    background-color: #f0f0f0;
  }
  
  .book img {
    width: 100%;
    height: auto;
    border-radius: 5px;
  }
  
  .details {
    margin-top: 10px;
  }
  
  .pagination {
    margin-top: 20px;
    margin-right: 15%;
    display: flex;
    align-items: center;
  }
  
  .pagination button {
    margin-right: 10px;
    cursor: pointer;
    padding: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
  }
  
  .pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }


  /* 在你的样式表中添加以下规则 */
.book p.price {
  color: red;
}


.purchase-list {
  margin-top: 20px;
}

.purchase-list h2 {
  margin-bottom: 10px;
}

.purchase-list ul {
  list-style: none;
  padding: 0;
}

.purchase-list li {
  cursor: pointer;
  padding: 5px;
  margin-bottom: 5px;
  background-color: #fcd3d3;
  border-radius: 5px;
  color: white;
}




/* 新增样式用于居中弹出表单 */
.user-profile {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999; /* 保证表单在最上层 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-profile form {
  width: 100%; /* 让表单宽度占满容器 */
}

.user-profile label {
  margin-bottom: 10px;
}

.user-profile img {
  margin: 10px 0;
}

.user-profile button {
  margin-top: 10px;
}
  </style>