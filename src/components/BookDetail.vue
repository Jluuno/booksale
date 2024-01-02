<!-- bookDetails.vue -->

<template>
    <div class="book-details-container">
      <div class="book-details-content">
        <div class="book-details-info">
          <h2>{{ bookData.name }}</h2>
          <p>作者: {{ bookData.author }}</p>
          <p>价格: ¥{{ bookData.price }}</p>
          <button @click="buyNow">立即购买</button>
          <!-- 返回登录页面的链接 -->
       <span><router-link to="/">返回主界面</router-link></span>

          <!-- Attachment Download Section -->
      <div class="attachment-section">
        <button @click="downloadAttachment">下载附件</button>
      </div>
        </div>
        <div class="book-details-image">
          <img :src="bookData.img" alt="Book Cover" />
        </div>
      </div>
  
      <!-- Comment Section -->
      <div class="comment-section">
        <h3>评论区</h3>
        <textarea v-model="newComment" placeholder="发表评论"></textarea>
        <button @click="addComment">发表评论</button>
  
        <div v-for="(comment, index) in comments" :key="index" class="comment">
          <p>{{ comment }}</p>
        </div>
      </div>
      

      
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        bookData: {},
        newComment: '',
        comments: [], // Array to store comments
      };
    },
    methods: {
      fetchBookDetails() {
        const bookId = this.$route.params.id;
        const apiUrl = `http://localhost:25565/book/details/${bookId}`;
  
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            this.bookData = data.data;
          })
          .catch(error => {
            console.error('Error fetching book details:', error);
          });
      },
      buyNow() {
        // Implement your buy now logic here
        // For simplicity, just show an alert
        alert('购买成功！');
      },
      addComment() {
        if (this.newComment.trim() !== '') {
          this.comments.push(this.newComment);
          this.newComment = ''; // Clear the input after adding a comment
        }
      },
      downloadAttachment() {
        // Implement your attachment download logic here
        // For simplicity, just show an alert
        alert('附件下载成功！');
      },
    },
    mounted() {
      // Fetch book details from the API endpoint
      this.fetchBookDetails();
    },
  };
  </script>
  

<style scoped>
.book-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.book-details-content {
  display: flex;
  max-width: 800px;
  width: 100%;
  justify-content: center; /* 让内容水平居中 */
  border: 1px solid #ccc;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 10px;
}

.book-details-info {
  flex: 1;
}

.book-details-info h2 {
  margin-top: 0;
}

.book-details-info p {
  margin-bottom: 10px;
}

.book-details-info button {
  padding: 15px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.book-details-image {
  display: flex;
  align-items: center;
}

.book-details-image img {
  max-width: 300px;
  height: auto;
  border-radius: 5px;
}


.comment-section {
  margin-top: 600px;
  margin-left: -384px;
}

.comment-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.comment-section textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.comment-section button {
  padding: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.comment {
  margin-top: 10px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}


.attachment-section {
  margin-top: 20px;
  margin-left: 200px;
}

.attachment-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.attachment-section button {
  padding: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}


router-link {
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap; /* 防止换行 */
  margin-left:15%;
}
</style>
