<script setup lang="ts">
import type { IMotor } from "@/utils/type"
import { helper } from "@/utils/utils"
import { store } from "@/store"
import { ERole } from "@/utils/type"
import { ElMessageBox, ElNotification } from "element-plus"
import { computed } from "vue"

interface IProps {
  motors?: IMotor[]
  title?: string
  isLoading?: boolean
}

const $props = defineProps<IProps>()
const loginUser = computed(() => store.state.loginUser)

const addToCart = async (data: IMotor) => {
  if (!loginUser.value.role) {
    ElMessageBox.alert("Bạn cần phải đăng nhập để thực hiện chức năng này", {
      title: "Thông báo",
      confirmButtonText: "OK",
    })
  } else if (loginUser.value.role === ERole.User) {
    try {
      await ElMessageBox.confirm(`Xác nhận thêm ${data.name} vào giỏ hàng?`, {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
        title: "Thông báo",
      })
      await store.dispatch("addToCart", {
        quantity: 1,
        motorId: data.id,
      })
      await store.dispatch("getCart")
      ElNotification({
        type: "success",
        title: "Thành công",
        message: `Đã thêm ${data.name} vào giỏ hàng`,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

const getFirstPhoto = (data: any) => {
  return data[0]
}
</script>
<template>
  <h2 class="motor-wrapper-title">{{ $props.title }}</h2>
  <div class="home-motors" v-loading="$props.isLoading">
    <div v-for="motor in $props.motors" class="home-motor" :key="motor.id">
      <div class="home-motor-img">
        <img v-if="motor.image && motor.image?.length! > 0" :src="getFirstPhoto(motor.image)" />
      </div>
      <p>
        <router-link :to="`/motor-${motor.id}`">
          {{ motor.name }}
        </router-link>
      </p>
      <div v-if="motor.salePrice && motor.salePrice !== 'undefined'" class="has-sale-price">
        <h4>{{ helper.formatCurrency(+motor.salePrice) }}</h4>
        <h4 class="old-price">{{ helper.formatCurrency(+motor.price!) }}</h4>
      </div>
      <h4 v-else>{{ helper.formatCurrency(+motor.price!) }}</h4>
      <div v-if="store.state.loginUser.role !== ERole.Admin" class="add-motor-to-cart" @click="addToCart(motor)">
        <font-awesome-icon icon="fa-solid fa-shopping-cart" />
        Thêm vào giỏ hàng
      </div>
      <div v-if="motor.salePrice && motor.salePrice !== 'undefined'" class="has-sale-flag"><span>SALE</span></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.motor-wrapper-title {
  margin-bottom: 24px;
  color: red;
}
.home-motors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 24px;
}

.home-motor {
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
  padding: 12px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background-color: #ffe6e6;
  }

  & p {
    margin-block: 4px;
    overflow: hidden;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    white-space: normal;
    font-weight: 500;

    & a {
      cursor: pointer;
      position: relative;

      &::after {
        content: "";
        background-color: #333;
        bottom: 0;
        width: 0;
        left: 50%;
        height: 2px;
        position: absolute;
        transition: all 0.3s ease;
      }

      &:hover::after {
        width: 100%;
        left: 0;
      }
    }
  }

  & h4 {
    font-weight: 500;
    color: #cc2828;
  }
}

.home-motor-img {
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 1/1;
  margin-bottom: 12px;
  & img {
    width: 100%;
    margin-bottom: 4px;
    transition: all 0.3s ease;
    overflow: hidden;
    aspect-ratio: 1/1;
    object-fit: cover;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.has-sale-price {
  display: flex;
  gap: 8px;
  align-items: center;

  & h4:last-child {
    text-decoration: line-through;
    color: #929292;
  }
}

.has-sale-flag {
  position: absolute;
  top: 0;
  right: 12px;
  & span {
    position: relative;
    background-color: rgba(255, 212, 36, 0.9);
    color: #fff;
    font-size: 13px;
    padding: 4px 3px;

    &::after {
      content: "";
      width: 0;
      height: 0;
      left: 0;
      bottom: -4px;
      position: absolute;
      border-color: transparent rgba(255, 212, 36, 0.9);
      border-style: solid;
      border-width: 0 18px 4px;
    }
  }
}

@media screen and (max-width: 1199px) {
  .home-motors {
    gap: 24px;
  }
}

@media screen and (max-width: 1064px) {
  .home-motors {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media screen and (max-width: 996px) {
  .home-motors {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media screen and (max-width: 700px) {
  .home-motors {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media screen and (max-width: 540px) {
  .home-motors {
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }
}
</style>
