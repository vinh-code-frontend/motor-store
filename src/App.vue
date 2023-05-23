<script setup lang="ts">
import { computed } from "vue"
import { store } from "./store"
import { helper } from "./utils/utils"
import { ERole } from "./utils/type"

const getCartFromStorage = localStorage.getItem("cart")
const loginUser = computed(() => store.state.loginUser)
if (getCartFromStorage) {
  store.commit("setCart", JSON.parse(getCartFromStorage))
}

const getAccessToken = helper.getCookieValue("accessToken")

if (getAccessToken) {
  store.dispatch("decodeToken", getAccessToken)
}

if (loginUser.value && loginUser.value?.role === ERole.User) {
  store.dispatch("getOrdersList")
  store.dispatch("getCart")
}
</script>

<template>
  <router-view />
</template>
<style scoped></style>
