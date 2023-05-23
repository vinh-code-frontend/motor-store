<script setup lang="ts">
import Navbar from "@/components/menu/Navbar.vue"
import QuantityDialog from "@/components/form/QuantityDialog.vue"
import { store } from "@/store"
import { computed, onMounted, ref, watch } from "vue"
import { helper } from "@/utils/utils"
import { Delete } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import type { ICart } from "@/utils/type"
import CommonFooter from "@/components/common/Footer.vue"

document.title = "Giỏ hàng | Motor Store"

const loading = ref(false)
const getYourCart = computed(() => store.state.cart)
const getCartPayload = computed(() =>
  store.state.cart?.map((item) => ({
    motorId: item.motorId,
    quantity: item.quantity,
  }))
)
const addressData = ref("")
const isEmptyAddress = ref(false)

const isRemoveAll = ref(false)
const quantityDialog = ref()
const deleteCart = async (cartId?: string) => {
  try {
    await ElMessageBox.confirm(`Xác nhận sản phẩm khỏi giỏ hàng?`, {
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      type: "warning",
      title: "Thông báo",
    })
    loading.value = true
    await store.dispatch("deleteCart", cartId)

    await store.dispatch("getCart")

    loading.value = false
    ElMessage({
      type: "success",
      message: `Đã thêm xóa sản phẩm khỏi giỏ hàng`,
    })
  } catch (error) {
    console.log(error)
  }
}

const removeAllCart = async () => {
  getYourCart.value?.forEach(async (cart) => {
    await store.dispatch("deleteCart", cart.cartId)
  })
  await store.dispatch("getCart")
}

const createOrder = async () => {
  if (!addressData.value) {
    isEmptyAddress.value = true
    return
  }
  try {
    await ElMessageBox.confirm(`Xác nhận đặt hàng`, {
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      type: "warning",
      title: "Thông báo",
    })
    try {
      loading.value = true
      await store.dispatch("newOrder", { motorData: getCartPayload.value, address: addressData.value }).then(() => {
        removeAllCart()
      })
      await store.dispatch("getCart")

      isRemoveAll.value = true
      await store.dispatch("getOrdersList")
      addressData.value = ""
      loading.value = false
      ElMessage({
        type: "success",
        message: `Chúc mừng bạn đã đặt hàng thành công`,
      })
    } catch (error) {
      loading.value = false

      ElMessage({
        type: "error",
        message: `Lỗi bất định`,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const openDialog = (cart?: ICart) => {
  quantityDialog.value?.openDialog(cart)
}

const getData = async () => {
  loading.value = true
  await store.dispatch("getCart")
  loading.value = false
}

watch(
  () => addressData.value,
  () => {
    isEmptyAddress.value = false
  }
)

onMounted(async () => {
  loading.value = true
  await store.dispatch("getCart")
  loading.value = false
})
</script>
<template>
  <navbar />
  <div class="cart-wrapper" v-loading="loading">
    <div class="cart">
      <div v-if="!getYourCart?.length || isRemoveAll" style="text-align: center">Bạn chưa chọn sản phẩm nào</div>
      <div v-if="getYourCart?.length && !isRemoveAll">
        <h3>
          Giỏ hàng
          <font-awesome-icon icon="fa-solid fa-cart-shopping" />
        </h3>
        <div class="cart-content">
          <div v-for="cart in getYourCart" :key="cart.cartId" class="cart-item">
            <div class="cart-item-content">
              <div class="cart-item-content-left">
                <img :src="cart.motorImg" width="100" />
              </div>
              <div class="cart-item-content-right">
                <div class="context">
                  <b>Tên sản phẩm: {{ cart.motorName }}</b>
                  <p v-if="cart.priceSale">Đơn giá: {{ helper.formatCurrency(+cart.priceSale!) }}</p>
                  <p v-else>Đơn giá: {{ helper.formatCurrency(+cart.price!) }}</p>
                  <p>Số lượng: {{ cart.quantity }}</p>
                  <i style="display: flex; align-items: flex-end; gap: 4px"
                    ><b>Thành tiền:</b>
                    <p>
                      {{ helper.formatCurrency(+cart.totalPrice!) }}
                    </p></i
                  >
                </div>
                <div class="total"></div>
              </div>
            </div>
            <el-button class="cart-remove" type="danger" :icon="Delete" circle @click="deleteCart(cart.cartId)" />
            <div class="cart-actions">
              <font-awesome-icon icon="fa-solid fa-ellipsis" class="action-icon" @click="openDialog(cart)" />
            </div>
          </div>
        </div>
        <div class="get-order">
          <div class="cart-address-dialog-content">
            <label class="card-address-dialog-label">Địa chỉ nhận hàng <span>*</span></label>
            <el-input
              v-model="addressData"
              size="large"
              type="textarea"
              placeholder="Nhập địa chỉ nhận hàng"
              :class="isEmptyAddress && 'cart-address-error-input'"
            />
            <div v-if="isEmptyAddress" class="cart-address-error-text">Vui lòng điền địa chỉ nhận hàng</div>
          </div>
          <el-button type="danger" @click="createOrder" class="order-now-button">
            <p style="margin-right: 12px">Đặt hàng ngay</p>
            <font-awesome-icon icon="fa-solid fa-bag-shopping" />
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <common-footer color="#f56c6c" />

  <quantity-dialog ref="quantityDialog" @get-data="getData" />
</template>
<style scoped lang="scss">
.cart {
  max-width: 1200px;
  margin: 0 auto;
  padding-block: 24px;
}

.cart-content {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.cart-remove {
  position: absolute;
  top: -12px;
  left: -12px;
}

.cart-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #fff;
}

.cart-item {
  border: 1px solid red;
  border-radius: 12px;
  position: relative;
  padding: 8px;
}

.cart-item-content {
  display: flex;
  gap: 23px;
}

.cart-item-content-left {
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 120px;
    aspect-ratio: 1/1;
    object-fit: cover;
  }
}

.cart-item-content-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-around;
  gap: 12px;

  b {
    color: #f56c6c;
  }
  .context {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    p,
    b,
    i {
      line-height: 1;
    }
    p {
      font-size: 13px;
      font-weight: 500;
    }
    i {
      font-size: 14px;
    }
  }
}

.get-order {
  margin-block: 44px;
  text-align: center;
  gap: 32px;
  border: 1px solid #f56c6c;
  padding: 20px 24px;
  border-radius: 12px;
  display: inline-block;
  max-width: 600px;
  width: 100%;
}

.action-icon:focus {
  outline: none;
  border: none;
}

.order-now-button {
  margin-top: 24px;
  border-radius: 100px;
  padding: 20px 24px;
  font-size: 16px;
}

@media screen and (max-width: 1200px) {
  .cart {
    padding-inline: 24px;
  }
}

@media screen and (max-width: 920px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

.card-address-dialog-label {
  padding-bottom: 8px;
  display: block;
  text-align: left;

  & span {
    color: red;
  }
}

.cart-address-error-text {
  color: #f56c6c;
  font-size: 12px;
  padding-top: 4px;
  line-height: 1;
  text-align: left;
}
</style>

<style lang="scss">
.cart-address-dialog-content {
  textarea {
    min-height: 120px !important;
  }
}

.cart-address-error-input {
  textarea,
  textarea:hover,
  textarea:focus {
    box-shadow: 0 0 0 1px #f56c6c;
  }
}

.cart-address-dialog {
  .el-dialog__body {
    padding-block: 18px;
  }
}
</style>
