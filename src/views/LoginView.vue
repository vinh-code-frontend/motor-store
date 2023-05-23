<script setup lang="ts">
import { ElNotification, type FormInstance, type FormRules } from "element-plus"
import { reactive, ref } from "vue"
import { type ILoginUser, ERole } from "@/utils/type"
import { store } from "@/store"
import { useRouter } from "vue-router"

const router = useRouter()
const loading = ref(false)
const formInstanceRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: "Tài khoản không được để trống",
    },
  ],
  password: [
    {
      required: true,
      message: "Mật khẩu không được để trống",
    },
  ],
})
const formModel = ref<ILoginUser>({})

const handleSubmit = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      handleLogin()
    } else {
      console.log("error submit!")
      return false
    }
  })
}

const handleLogin = async () => {
  loading.value = true
  try {
    const temp: any = {
      Email: formModel.value.email,
      Password: formModel.value.password,
    }
    await store.dispatch("login", temp)
    if (store.state.loginUser.role && store.state.loginUser.role === ERole.Admin) {
      router.push("/admin-dashboard")
    } else if (store.state.loginUser.role && store.state.loginUser.role === ERole.User) {
      await store.dispatch("getOrdersList")
      await store.dispatch("getCart")
      router.push("/")
    }
    ElNotification({
      type: "success",
      title: "Thành công",
      message: "Đăng nhập thành công!",
    })
    loading.value = false
  } catch (error: any) {
    if (error.response && error.response.data === "User not found.") {
      ElNotification({
        type: "error",
        title: "Thất bại",
        message: "Tài khoản không tồn tại!",
      })
    } else if (error.response && error.response.data === "Wrong password.") {
      ElNotification({
        type: "error",
        title: "Thất bại",
        message: "Mật khẩu bạn nhập không đúng!",
      })
    } else {
      ElNotification({
        type: "error",
        title: "Thất bại",
        message: "Lỗi bất định",
      })
    }
    loading.value = false
  }
}

document.title = "Đăng nhập | Motor Store"
</script>

<template>
  <div class="login auth-background">
    <div class="login-form">
      <h2>Đăng nhập</h2>
      <el-form
        ref="formInstanceRef"
        :model="formModel"
        :rules="rules"
        label-position="top"
        require-asterisk-position="right"
        @submit.prevent
      >
        <el-form-item prop="email" label="Tài khoản" size="large">
          <el-input v-model="formModel.email" placeholder="Nhập tài khoản của bạn" />
        </el-form-item>
        <el-form-item prop="password" label="Mật khẩu" size="large">
          <el-input v-model="formModel.password" type="password" placeholder="Nhập mật khẩu của bạn" />
        </el-form-item>
        <div class="login-button">
          <el-button color="#626aef" @click="handleSubmit(formInstanceRef)" :loading="loading">Đăng nhập</el-button>
        </div>
      </el-form>
      <div class="login-notes">
        <span> Bạn chưa có tải khoản? </span>
        <router-link to="/register" class="primary-color hover">Đăng ký ngay</router-link>
      </div>
      <router-link to="/" class="back-to-home">Quay lại trang chủ</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  background-color: #fff;
  padding: 20px 32px;
  min-width: 420px;
  border-radius: 24px;

  & h2 {
    margin-bottom: 12px;
    text-align: center;
  }
}

.login-form-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;

  & input {
    border: 1px solid #ccc;
    border-radius: 6px;
    line-height: 24px;
    padding: 4px 12px;
  }
}

.login-button {
  text-align: center;
  margin: 28px 0 16px;
}

.login-notes {
  font-size: 13px;
  text-align: center;
  margin-bottom: 8px;
}
</style>
