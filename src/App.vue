<!-- App.vue -->
<script setup>
import Book from './components/Book.vue';
import BookDetail from './components/BookDetail.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedBookId = ref(null);

// 点击书籍时跳转到详情页
const goToBookDetail = (bookId) => {
  router.push({ name: 'book-detail', params: { id: bookId } });
};
</script>


<template>
  <div>
    <header>
      <router-view></router-view>
    </header>

    <main>
     
    </main>
  </div>
</template>

