<script setup lang="ts">
import type { ILoginUser } from "@/utils/type"
import { ElNotification, type FormInstance, type FormRules } from "element-plus"
import { store } from "@/store"
import { reactive, ref } from "vue"

const drawer = ref(false)
const userData = ref<ILoginUser>({})
const loading = ref(false)
const drawerTitle = ref({
  label: "",
  button: "",
})
const drawerRef = ref()
const formInstanceRef = ref<FormInstance>()
const roleSelecter = ref("USER")

const rules = ref<FormRules>({
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
const openDrawer = (data?: ILoginUser) => {
  drawer.value = true
  if (data) {
    userData.value = { ...data }
    drawerTitle.value = {
      label: "Chỉnh sửa thông tin người dùng",
      button: "Cập nhật",
    }
    roleSelecter.value = data.roleid === "1" ? "ADMIN" : "USER"
  } else {
    userData.value = {}
    roleSelecter.value = "USER"
    drawerTitle.value = {
      label: "Thêm người dùng mới",
      button: "Lưu",
    }
  }
}

const handleCancel = () => {
  drawerRef.value.close()
  formInstanceRef.value?.resetFields()
}

const handleSubmit = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      if (userData.value?.id) {
        updateUser(userData.value)
      } else {
        createUser()
      }
    } else {
      console.log("error submit!")
      return false
    }
  })
}

const updateUser = async (userData: any) => {
  try {
    loading.value = true

    await store.dispatch("editUser", {
      Email: userData.email,
      Phone: userData.phone,
      Roleid: roleSelecter.value === "ADMIN" ? "1" : "2",
      Fullname: userData.fullname,
    })

    await store.dispatch("getAllUsers")
    loading.value = false
    drawer.value = false
    roleSelecter.value = "USER"
    ElNotification({
      type: "success",
      title: "Thành công",
      message: "Cập nhật thành công!",
    })
  } catch (error) {
    loading.value = false
    ElNotification({
      type: "error",
      title: "Thất bại",
      message: "Lỗi bất định",
    })
  }
}

const createUser = async () => {
  loading.value = true
  try {
    const temp: any = {
      Email: userData.value.email,
      Password: userData.value.password,
      Fullname: userData.value.fullname,
      Phone: userData.value.phone,
    }
    await store.dispatch("register", temp)
    await store.dispatch("getAllUsers")

    ElNotification({
      type: "success",
      title: "Thành công",
      message: "Đăng ký thành công!",
    })
    loading.value = false
    drawer.value = false
    roleSelecter.value = "USER"
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

defineExpose({
  openDrawer,
})
</script>
<template>
  <div>
    <el-drawer
      ref="drawerRef"
      v-model="drawer"
      class="order-drawer"
      :before-close="handleCancel"
      style="min-width: 480px"
    >
      <template #header>
        <h3 class="primary-color">{{ drawerTitle.label }}</h3>
      </template>
      <el-form
        ref="formInstanceRef"
        :model="userData"
        :rules="rules"
        label-position="top"
        require-asterisk-position="right"
        v-loading="loading"
      >
        <el-form-item prop="fullname" label="Tên người dùng">
          <el-input v-model="userData.fullname" placeholder="Nhập vào tên người dùng" />
        </el-form-item>
        <el-form-item prop="email" label="Tài khoản">
          <el-input v-model="userData.email" placeholder="Nhập vào email" :disabled="!!userData.id" />
        </el-form-item>

        <el-form-item v-if="userData.id" label="Phân quyền">
          <el-select v-model="roleSelecter">
            <el-option label="USER" value="USER" />
            <el-option label="ADMIN" value="ADMIN" />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="Số điện thoại">
          <el-input v-model="userData.phone" placeholder="Số điện thoại" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button color="#626aef" plain @click="handleCancel">Đóng</el-button>
        <el-button color="#626aef" @click="handleSubmit(formInstanceRef)">{{ drawerTitle.button }}</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss"></style>
