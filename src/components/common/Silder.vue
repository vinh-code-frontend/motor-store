<script setup lang="ts">
import Banner1 from "@/assets/images/banner1.png"
import Banner2 from "@/assets/images/banner2.jpg"

const BANNER = [Banner1, Banner2, Banner1, Banner2]
</script>

<template>
  <el-carousel class="slider-carousel-wrapper" trigger="click" height="600px">
    <el-carousel-item v-for="item in BANNER" :key="item">
      <img class="slider-img" :src="item" />
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped>
.slider-carousel-wrapper {
  margin-bottom: 24px;
}
.slider-img {
  width: 100%;
  object-fit: cover;
}
</style>
