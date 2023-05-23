<script setup lang="ts">
import Navbar from "@/components/menu/Navbar.vue"
import { computed, onMounted, ref, onBeforeUnmount } from "vue"
import { store } from "@/store"
import CommonFooter from "@/components/common/Footer.vue"
import SkeletonHome from "@/components/skeleton/SkeletonHome.vue"
import Slider from "@/components/common/Silder.vue"
import MotorWrapper from "@/components/common/MotorWrapper.vue"

const allMotor = computed(() => store.state.motors)
const allType = computed(() => store.state.types)
const famousMotor = computed(() => store.state.motors?.filter((motor) => motor.famous === 1))
const loading = ref(false)
const loading2 = ref(false)
const totalMotors = computed(() => store.state.totalMotors)
const currentPage = ref(1)
const filterChoices = ref({
  search: "",
  sale: 0,
  type: "",
  price: "",
})
document.title = "Trang chủ | Motor Store"

const searchMotor = async () => {
  loading2.value = true
  await store.dispatch("searchMotor", filterChoices.value.search)
  loading2.value = false
}

const resetMotor = async () => {
  loading2.value = true
  await store.dispatch("searchMotor", "")
  filterChoices.value = {
    search: "",
    sale: 0,
    type: "",
    price: "",
  }
  loading2.value = false
}

const handleFilterMotor = async (payload: any) => {
  loading2.value = true
  await store.dispatch("filterMotor", payload)
  loading2.value = false
}

onMounted(async () => {
  loading.value = true
  await store.dispatch("getAllTypes")
  await store.dispatch("searchMotorWithPaginate", {
    pageNumber: 1,
    pageSize: 24,
  })
  console.log(store.state.motors)
  loading.value = false
})

const getMoreData = async () => {
  loading.value = true
  currentPage.value = currentPage.value + 1
  await store.dispatch("searchMotorWithPaginate", {
    pageNumber: currentPage.value,
    pageSize: 24,
  })
  loading.value = false
}

onBeforeUnmount(() => {
  filterChoices.value = {
    search: "",
    sale: 0,
    type: "",
    price: "",
  }
})
</script>
<template>
  <navbar />
  <skeleton-home v-if="loading" />
  <div v-if="!loading" class="home">
    <slider />
    <motor-wrapper :motors="famousMotor" :title="'Sản phẩm nổi bật'" />
    <h2 style="color: red">Danh sách sản phẩm</h2>
    <div class="home-content">
      <div class="home-filter-title">
        <h3>Lọc sản phẩm</h3>
      </div>
      <div class="home-filter" v-loading="loading2">
        <div class="home-filter-item">
          <div class="home-filter-item-title">Danh mục</div>
          <el-radio-group v-model="filterChoices.type">
            <el-radio label="">Toàn bộ</el-radio>
            <el-radio v-for="item in allType" :label="item.name" :key="item.id" />
          </el-radio-group>
        </div>
        <div class="home-filter-item">
          <div class="home-filter-item-title">Giá</div>
          <el-radio-group v-model="filterChoices.price">
            <el-radio class="home-filter-price-item" value="" label="">Toàn bộ</el-radio>
            <el-radio class="home-filter-price-item" value="first" label="first">Dưới 5 triệu</el-radio>
            <el-radio class="home-filter-price-item" value="second" label="second">Từ 5 đến 15 triệu</el-radio>
            <el-radio class="home-filter-price-item" value="third" label="third">Từ 15 đến 30 triệu</el-radio>
            <el-radio class="home-filter-price-item" value="fourth" label="fourth"> Trên 30 triệu</el-radio>
          </el-radio-group>
        </div>
        <div class="home-filter-item">
          <div class="home-filter-item-title">Ưu đãi</div>
          <el-radio-group v-model="filterChoices.sale">
            <el-radio :value="0" :label="0">Toàn bộ</el-radio>
            <el-radio :value="1" :label="1">Đang giảm giá</el-radio>
          </el-radio-group>
        </div>
        <div style="align-self: flex-end">
          <el-button color="#f56c6c" plain @click="resetMotor">Reset </el-button>
          <el-button color="#f56c6c" style="color: #fff" @click="handleFilterMotor(filterChoices)">Lọc </el-button>
        </div>
      </div>
      <div class="home-search">
        <input v-model="filterChoices.search" type="text" placeholder="Tìm kiếm theo tên..." :disabled="loading2" />
        <button @click="searchMotor"><font-awesome-icon icon="fa-solid fa-search" :disabled="loading2" /></button>
      </div>
      <motor-wrapper :motors="allMotor" :is-loading="loading2" />
      <div
        v-if="totalMotors! > allMotor?.length!"
        style="text-align: center; margin: 24px 0; cursor: pointer; text-decoration: underline"
        @click="getMoreData"
      >
        Xem thêm
      </div>
    </div>
  </div>
  <common-footer color="#f56c6c" />
</template>
<style scoped lang="scss">
.home {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-block: 24px;
}

.home-search {
  border: 1px solid #f56c6c;
  border-radius: 100px;
  overflow: hidden;
  display: flex;
  max-width: 600px;
  width: 100%;
  margin-block: 24px;

  & input {
    padding: 6px 12px 6px 18px;
    flex: 1;
    line-height: 30px;
    font-size: 15px;
  }

  & button {
    padding-inline: 14px;
    line-height: 32px;
    cursor: pointer;

    color: #ffe6e6;
    background-color: #f56c6c;
    transition: all 0.3s ease;
    &:hover {
      background-color: red;
    }
  }

  @media screen and (max-width: 430px) {
    width: 100%;
  }
}

.home-filter-title {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding-top: 8px;
}

.home-filter {
  border: 1px solid #f56c6c;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  flex-wrap: wrap;
  row-gap: 24px;
  column-gap: 48px;
  padding: 12px 24px;
}

.home-filter-item-title {
  color: #f56c6c;
  font-weight: 600;
}

.home-filter-trigger {
  display: flex;
  gap: 8px;
  align-items: center;
}

@media screen and (max-width: 1199px) {
  .home {
    padding-inline: 24px;
  }
}

@media screen and (max-width: 1064px) {
  .home {
    padding-inline: 24px;
  }
}

@media screen and (max-width: 996px) {
  .home {
    padding-inline: 16px;
  }
}

@media screen and (max-width: 700px) {
  .home {
    padding-inline: 16px;
  }
}

@media screen and (max-width: 540px) {
  .home {
    padding-inline: 16px;
  }
}
</style>

<style lang="scss">
.home-filter-menu {
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background-color: #ffe6e6;
    color: #ff3333;
  }
}

.home {
  .home-filter {
    .el-checkbox__inner {
      border-color: #f56c6c;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-radio__input.is-checked .el-radio__inner {
      background-color: #f56c6c;
      border-color: #f56c6c;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label,
    .el-radio__input.is-checked + .el-radio__label {
      color: #f56c6c;
    }
  }
}
</style>
