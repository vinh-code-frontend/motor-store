<script setup lang="ts">
import Navbar from "@/components/menu/Navbar.vue"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { helper } from "@/utils/utils"
import { store } from "@/store"
import { ERole } from "@/utils/type"
import SkeletonDetails from "@/components/skeleton/SkeletonDetails.vue"
import { ElMessageBox, ElNotification } from "element-plus"
import CommentDialog from "@/components/form/CommentDialog.vue"
import MotorWrapper from "@/components/common/MotorWrapper.vue"
import CommonFooter from "@/components/common/Footer.vue"

const route = useRoute()
const motorData = computed(() => store.state.motors)
const motorDetail = computed(() => motorData.value?.find((item) => item.id === route.params.id))
const relatedMotors = computed(() =>
  motorData.value
    ?.filter((motor) => motor.type === motorDetail.value?.type && motor.id !== motorDetail.value?.id)
    .slice(0, 4)
)
const loading = ref(false)
const loginUser = computed(() => store.state.loginUser)
const comments = computed(() => store.state.comments)
const commentDialogRef = ref()
const commentLoading = ref(false)

document.title = `Thông tin chi tiết | Motor Store`

const addToCart = async (data: any) => {
  if (!loginUser.value.role) {
    ElMessageBox.alert("Bạn cần phải đăng nhập để thực hiện chức năng này", {
      title: "Thông báo",
      confirmButtonText: "OK",
    })
  } else if (loginUser.value.role === ERole.User) {
    try {
      await ElMessageBox.confirm(`Xác nhận thêm sản phẩm vào giỏ hàng?`, {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
        title: "Thông báo",
      })
      await store.dispatch("addToCart", {
        quantity: 1,
        motorId: motorDetail.value?.id,
      })
      await store.dispatch("getCart")

      ElNotification({
        type: "success",
        title: "Thành công",
        message: `Đã thêm vào giỏ hàng`,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

const openDialog = (data?: any) => {
  commentDialogRef.value?.openDialog(data)
}

const deleteComment = async (id?: string) => {
  try {
    await ElMessageBox.confirm("Xác nhận xóa bình luận", {
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      title: "Thống báo",
      type: "warning",
    })
    try {
      commentLoading.value = true
      await store.dispatch("removeComment", id)
      await store.dispatch("getAllMotors")
      await store.dispatch("getComment", motorDetail.value?.id)
      commentLoading.value = false
      ElNotification({
        type: "success",
        title: "Thành công",
        message: "Xóa bình luận thành công",
      })
    } catch (error) {
      ElNotification({
        type: "error",
        title: "Thất bại",
        message: "Lỗi bất định",
      })
      commentLoading.value = false
    }
  } catch (error) {
    console.log(error)
  }
}

const getFirstPhoto = (data: any) => {
  return data[0]
}

const getData = async () => {
  commentLoading.value = true
  await store.dispatch("getComment", motorDetail.value?.id)
  commentLoading.value = false
}

onMounted(async () => {
  loading.value = true
  await store.dispatch("getAllMotors")
  await store.dispatch("getComment", motorDetail.value?.id)
  loading.value = false
})
</script>
<template>
  <navbar />
  <skeleton-details v-if="loading" />
  <div v-if="!loading" class="details">
    <h3>Thông tin motor: {{ motorDetail?.name }}</h3>
    <div class="details-content">
      <div class="details-left">
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in motorDetail?.image" :key="item">
            <img :src="item" :alt="motorDetail?.name" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="details-right">
        <h3>{{ motorDetail?.name }}</h3>
        <div v-if="motorDetail?.salePrice && motorDetail.salePrice !== 'undefined'" class="has-sale-price">
          <h4>Giảm giá còn: {{ helper.formatCurrency(+motorDetail.salePrice) }}</h4>
          <h4 class="old-price">Giá gốc: {{ helper.formatCurrency(+motorDetail.price!) }}</h4>
        </div>
        <h4 v-else>{{ helper.formatCurrency(+motorDetail?.price!) }}</h4>
        <p><b> Danh mục sản phẩm: </b>{{ motorDetail?.type }}</p>
        <div class="add-motor-to-cart" v-if="store.state.loginUser.role !== ERole.Admin" @click="addToCart">
          <font-awesome-icon icon="fa-solid fa-shopping-cart" />
          Thêm vào giỏ hàng
        </div>
      </div>
    </div>
    <motor-wrapper :motors="relatedMotors" :title="'Sản phẩm liên quan'" />
    <div class="details-bottom">
      <div class="details-note">
        <h3>Miêu tả sản phẩm</h3>
        <div v-html="motorDetail?.description" class="details-description"></div>
      </div>
      <div class="details-comment" v-if="loginUser.email" v-loading="commentLoading">
        <div class="top">
          <h3>Bình luận của khách hàng</h3>
          <el-button type="danger" size="small" @click="openDialog({ motorId: motorDetail?.id })">Bình luận</el-button>
        </div>
        <div class="comments" v-if="comments.length > 0">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="left">
              <p :style="{ backgroundColor: helper.randomColor().background }">
                {{ helper.getFirstLetter(comment.createdBy!) }}
              </p>
            </div>
            <div class="right">
              <h3>
                <p>{{ comment.createdBy }}</p>
                <el-tag v-if="loginUser.email === comment.createdBy" type="warning">Bạn</el-tag>
              </h3>
              <p v-html="comment.comment"></p>
              <p class="italic">Update vào lúc: {{ helper.getDate(comment.modifyDate) }}</p>
            </div>
            <div class="details-comment-actions" v-if="loginUser.email === comment.createdBy">
              <el-dropdown trigger="click">
                <font-awesome-icon icon="fa-solid fa-ellipsis" class="action-comment-icon" />
                <template #dropdown>
                  <el-dropdown-menu class="home-filter-menu">
                    <el-dropdown-item @click="openDialog(comment)">Chỉnh sửa </el-dropdown-item>
                    <el-dropdown-item @click="deleteComment(comment.id)">Xóa </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="comments" v-else>
          <div class="nodata">Chưa có bình luận</div>
        </div>
      </div>
    </div>
  </div>
  <common-footer color="#f56c6c" />

  <comment-dialog ref="commentDialogRef" @get-motor-details="getData" />
</template>
<style scoped lang="scss">
.details {
  max-width: 1200px;
  width: 100%;
  padding-block: 16px;
  margin: 0 auto;

  @media screen and (max-width: 1200px) {
    padding-inline: 16px;
  }

  & > h3 {
    border-bottom: 1px solid #888;
    padding-bottom: 12px;
  }
}

.details-left {
  & img {
    width: 100%;
  }
}

.details-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 32px;
  background-color: #ffe6e6;
  padding: 12px;
  padding-top: 30px;
  margin-bottom: 24px;
}

.details-right {
  display: grid;
  gap: 16px;
  align-self: flex-start;
  padding-top: 10%;

  & h3 {
    color: #e20404;
  }
}

.details-bottom {
  display: grid;
  grid-template-columns: 60% auto;
  margin-block: 40px;
  gap: 24px;
}

.details-note {
  border: 1px solid #ffa7a7;
  border-radius: 10px;
  padding: 24px;

  & h3 {
    margin-bottom: 18px;
    color: #e20404;
  }
}

.old-price {
  text-decoration: line-through;
  color: #adadad;
}

.details-comment {
  border: 1px solid #ffa7a7;
  padding: 24px;
  border-radius: 6px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    gap: 14px;
    flex-wrap: wrap;

    & > h3 {
      color: #e20404;
    }
  }
}

.comments {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment {
  display: flex;
  border: 1px solid #f8adad;
  border-radius: 14px;
  padding: 10px;
  gap: 12px;
  position: relative;
  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 54px;
      aspect-ratio: 1/1;
      font-size: 20px;
      text-transform: uppercase;
      border-radius: 12px;
    }
  }

  .right {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;

    h3 {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h3,
    p {
      line-height: 1;
    }
  }
}

.details-comment-actions {
  position: absolute;
  top: 8px;
  right: 12px;
  cursor: pointer;
}

.action-comment-icon:focus {
  outline: none;
  border: none;
}

@media screen and (max-width: 1024px) {
  .details-bottom {
    grid-template-columns: 1fr;
  }
}
</style>
<style lang="scss">
.details-left {
  .el-carousel__container {
    height: 400px;
  }
}

.details-description {
  .table {
    margin-top: 12px;
    display: inline-block;
    text-align: center;

    table {
      border-collapse: collapse;
    }

    td {
      border: 1px solid black;
      padding: 4px 24px;
      border-collapse: collapse;
    }
  }
}
</style>
