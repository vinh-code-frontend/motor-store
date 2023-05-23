<script setup lang="ts">
import { ElNotification, type FormInstance, type FormRules } from "element-plus"
import { reactive, ref } from "vue"
import type { ILoginUser } from "@/utils/type"
import { store } from "@/store"
import { useRouter } from "vue-router"

const router = useRouter()
const loading = ref(false)
const formInstanceRef = ref<FormInstance>()
const formModel = ref<ILoginUser>({})

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
  fullname: [
    {
      required: true,
      message: "Tên không được để trống",
    },
  ],
  phone: [
    {
      required: true,
      message: "Số điện thoại không được để trống",
    },
  ],
})

const handleSubmit = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      handleRegister()
    } else {
      console.log("error submit!")
      return false
    }
  })
}

const handleRegister = async () => {
  loading.value = true
  try {
    const temp: any = {
      Email: formModel.value.email,
      Password: formModel.value.password,
      Fullname: formModel.value.fullname,
      Phone: formModel.value.phone,
    }
    await store.dispatch("register", temp)

    router.push("/login")
    ElNotification({
      type: "success",
      title: "Thành công",
      message: "Đăng ký thành công!",
    })
    loading.value = false
  } catch (error: any) {
    ElNotification({
      type: "error",
      title: "Thất bại",
      message: "Lỗi bất định",
    })
    console.log(error)
    loading.value = false
  }
}

document.title = "Đăng ký | Motor Store"
</script>

<template>
  <div class="register auth-background">
    <div class="register-form">
      <h2>Đăng ký</h2>
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
        <el-form-item prop="fullname" label="Tên đầy đủ" size="large">
          <el-input v-model="formModel.fullname" placeholder="Nhập tên của bạn" />
        </el-form-item>
        <el-form-item prop="phone" label="Số điện thoại" size="large">
          <el-input v-model="formModel.phone" placeholder="Nhập số điện thoại của bạn" />
        </el-form-item>
        <div class="register-button">
          <el-button color="#626aef" @click="handleSubmit(formInstanceRef)" :loading="loading">Đăng ký</el-button>
        </div>
      </el-form>
      <div class="register-notes">
        <span> Bạn đã có tải khoản? </span>
        <router-link to="/login" class="primary-color hover">Đăng nhập ngay</router-link>
      </div>
      <router-link to="/" class="back-to-home">Quay lại trang chủ</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register {
  min-height: 100vh;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-form {
  background-color: #fff;
  padding: 20px 32px;
  min-width: 420px;
  border-radius: 24px;

  & h2 {
    margin-bottom: 12px;
    text-align: center;
  }
}

.register-form-item {
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

.register-button {
  text-align: center;
  margin: 28px 0 16px;
}

.register-notes {
  font-size: 13px;
  text-align: center;
  margin-bottom: 8px;
}
</style>
