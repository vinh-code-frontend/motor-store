<script setup lang="ts">
import { store } from "@/store"
import { ERole } from "@/utils/type"
import { computed } from "vue"

interface IProps {
  color?: string
}

const $props = defineProps<IProps>()
const loginUser = computed(() => store.state.loginUser)

const contacts = {
  email: "motorstore@email.com",
  phone: "+84123456789",
}
</script>
<template>
  <div class="footer-background" :style="{ '--footer-primary-color': `${$props?.color || '#626aef'}` }">
    <div class="footer">
      <div class="footer-content">
        <div class="footer-content-left-item">
          <h3 class="footer-logo footer-left-item">
            <font-awesome-icon icon="fa-solid fa-motorcycle" />
            Motor Store
          </h3>
          <div class="footer-left-item">Đỉa chỉ: Xã ABC Huyện DEF tỉnh Hưng Yên</div>
          <div class="footer-left-item">Số điện thoại: {{ contacts.phone }}</div>
          <div class="footer-left-item">Email: {{ contacts.email }}</div>
        </div>
        <div class="footer-content-item">
          <h3>Mục lục</h3>
          <div class="footer-menu">
            <router-link to="/">Trang chủ</router-link>
            <router-link to="/blogs">Bài viết</router-link>
            <router-link v-if="loginUser.role === ERole.User" to="/cart"> Giỏ hàng </router-link>
            <router-link v-if="loginUser.role === ERole.User" to="/order"> Đơn hàng </router-link>
          </div>
        </div>
        <div class="footer-content-item">
          <h3>Liên hệ</h3>
          <div class="footer-social">
            <a href="https://www.facebook.com/" target="_blank">
              <font-awesome-icon icon="fa-brands fa-square-facebook" />
            </a>
            <a :href="`mailto:${contacts.email}`" target="_blank">
              <font-awesome-icon icon="fa-solid fa-envelope" />
            </a>
            <a :href="`tel:${contacts.phone}`" target="_blank">
              <font-awesome-icon icon="fa-solid fa-phone" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-policy">Copyright © 2023 Motor store</div>
  </div>
</template>
<style scoped lang="scss">
.footer-background {
  background-color: #131313;
  font-size: 14px;
  margin-top: 40px;

  & h3 {
    font-size: 18px;
  }
}

.footer {
  margin: 0 auto;
  color: #fff;
  max-width: 1200px;
  width: 100%;
  padding: 60px 12px;
}

.footer-content {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
}

.footer-policy {
  color: #fff;
  background-color: var(--footer-primary-color);
  text-align: center;
  padding: 12px;
}

.footer-menu {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  & a {
    transition: all 0.3s ease;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 50%;
      background-color: var(--footer-primary-color);
      transition: all 0.3s ease;
    }

    &:hover {
      color: var(--footer-primary-color);
      &::after {
        width: 100%;
        left: 0;
      }
    }
  }
}

.footer-social {
  display: flex;
  gap: 20px;
  font-size: 20px;
  margin-top: 12px;
  flex-wrap: wrap;

  & a {
    transition: all 0.3s ease;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -2px;
      left: 50%;
      background-color: var(--footer-primary-color);
      transition: all 0.3s ease;
    }

    &:hover {
      color: var(--footer-primary-color);
      &::after {
        width: 100%;
        left: 0;
      }
    }
  }
}

.footer-content-left-item {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .footer-logo {
    font-size: 40px;
    font-style: italic;
    line-height: 1;
    margin-bottom: 20px;
  }
}

@media screen and (max-width: 800px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
