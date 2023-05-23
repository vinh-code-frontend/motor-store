<script setup lang="ts">
import Navbar from "@/components/menu/Navbar.vue"
import { store } from "@/store"
import { helper } from "@/utils/utils"
import { computed, onMounted, ref } from "vue"
import CommonFooter from "@/components/common/Footer.vue"

document.title = "Bài viết | Motor Store"
const loading = ref(false)
const blogData = computed(() => store.state.blogs)
const searchInput = ref("")

const searchBlogs = async () => {
  loading.value = true
  await store.dispatch("searchBlog", searchInput.value)
  loading.value = false
}

onMounted(async () => {
  loading.value = true
  await store.dispatch("getAllBlogs")
  loading.value = false
})
</script>
<template>
  <navbar />
  <div class="blogs" v-loading="loading">
    <div class="blogs-top">
      <h3 class="blogs-title">Bài viết</h3>
      <div class="blogs-search">
        <input type="text" v-model="searchInput" placeholder="Tìm kiếm bài viết..." />
        <button @click="searchBlogs"><font-awesome-icon icon="fa-solid fa-search" /></button>
      </div>
    </div>
    <div v-if="blogData.total" class="blogs-content">
      <div v-for="blog in blogData.blogs" :key="blog.id" class="blog">
        <div class="blog-img">
          <img :src="blog.img" />
        </div>
        <router-link :to="`/blog-${blog.id}`" class="blog-title">{{ blog.title }}</router-link>
        <p class="blog-auth"><u>Tác giả:</u> {{ blog.createdBy }}</p>
        <div class="blog-content" v-html="blog.content"></div>
        <div class="blog-date">Ngày đăng: {{ helper.getDate(blog.createdDate) }}</div>
      </div>
    </div>
    <div v-if="!blogData.total" class="nodata">Chưa có bài viết</div>
  </div>
  <common-footer color="#3fb984" />
</template>
<style scoped lang="scss">
.blogs {
  margin: 48px auto;
  width: 100%;
  padding-top: 32px;
  max-width: 1200px;

  .blogs-title {
    color: #3fb984;
    font-size: 24px;
  }
}

.blogs-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.blogs-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.blogs-search {
  border: 1px solid #3fb984;
  border-radius: 100px;
  overflow: hidden;
  display: flex;

  & input {
    padding: 6px 12px 6px 18px;
    flex: 1;
  }

  & button {
    padding-inline: 14px;
    line-height: 32px;
    cursor: pointer;

    color: #d4ffec;
    background-color: #3fb984;
  }

  @media screen and (max-width: 500px) {
    width: 100%;
  }
}

.blog {
  border: 1px solid #3fb984;
  padding: 18px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3fb98433;
  }
}

.blog-img {
  overflow: hidden;
  border-radius: 8px;

  & img {
    width: 100%;
    aspect-ratio: 3/2;
    object-fit: cover;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.blog-content {
  overflow: hidden;
  display: -webkit-box;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 14px;
  margin-block: 4px;
}

.blog-title {
  transition: all 0.3s ease;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    color: #3fb984;
    text-decoration: underline;
  }
}

.blog-date {
  font-size: 11px;
  font-style: italic;
  text-align: right;
  margin-top: 4px;
}

.blog-auth {
  font-size: 14px;
}

.nodata {
  text-align: center;
}

@media screen and (max-width: 1199px) {
  .blogs {
    padding-inline: 24px;
  }
}

@media screen and (max-width: 1024px) {
  .blogs-content {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 800px) {
  .blogs-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 500px) {
  .blogs-content {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
