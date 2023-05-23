<script setup lang="ts">
import Navbar from "@/components/menu/Navbar.vue"
import { store } from "@/store"
import { helper } from "@/utils/utils"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import CommonFooter from "@/components/common/Footer.vue"

document.title = "Chi tiết bài viết | Motor Store"
const route = useRoute()
const loading = ref(false)

const blogsData = computed(() => store.state.blogs)
const blogDetails = computed(() => blogsData.value?.blogs?.find((item) => item.id === route.params.id))

onMounted(async () => {
  loading.value = true
  await store.dispatch("getAllBlogs")
  console.log(blogDetails.value)
  loading.value = false
})
</script>
<template>
  <navbar />
  <div class="blog-details" v-loading="loading">
    <div class="blog-image">
      <img v-if="blogDetails?.img" :src="blogDetails.img" alt="" />
    </div>
    <h2 class="blog-title blog-font-title">
      {{ blogDetails?.title }}
    </h2>
    <div class="blog-description">
      <div v-if="blogDetails?.createdBy" class="left">Tác giả: {{ blogDetails?.createdBy }}</div>
      <div v-if="blogDetails?.createdDate" class="right">Đăng vào: {{ helper.getDate(blogDetails?.createdDate) }}</div>
    </div>
    <div class="blog-content" v-html="blogDetails?.content"></div>
  </div>
  <common-footer color="#3fb984" />
</template>
<style scoped lang="scss">
.blog-details {
  max-width: 1200px;
  width: 100%;
  padding-block: 40px;
  margin: 0 auto;
}

.blog-image {
  width: 100%;

  & img {
    width: 100%;
    height: 360px;

    object-fit: cover;
  }
}

.blog-title {
  text-align: center;
  font-weight: 48px;
  margin-block: 24px;
}

.blog-content {
  line-height: 1.8;
  font-size: 16px;
  font-weight: 400;
}

.blog-description {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  font-size: 15px;
  & .right {
    font-style: italic;
  }

  & .left {
    font-weight: bold;
  }
}
</style>
