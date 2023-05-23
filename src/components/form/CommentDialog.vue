<script setup lang="ts">
import { store } from "@/store"
import type { IComment } from "@/utils/type"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { ref } from "vue"

const isVisible = ref(false)
const loading = ref(false)
const dialogRef = ref()
const commentData = ref<IComment>({})
const commentTitle = ref({
  label: "",
  button: "",
})
const motorId = ref("")
const emit = defineEmits(["getMotorDetails"])
const editor = ClassicEditor

const openDialog = (data?: any) => {
  console.log(data)
  isVisible.value = true
  if (data.id) {
    commentData.value = { ...data }
    commentTitle.value = {
      label: "Chỉnh sửa bình luân",
      button: "Cập nhật",
    }
    motorId.value = ""
  } else {
    commentData.value = {}
    motorId.value = data.motorId
    commentTitle.value = {
      label: "Bình luận",
      button: "Gửi",
    }
  }
}

const onReady = (data: any) => {
  console.log("CKEditor is Ready!")
}

const onChange = (data: any) => {
  console.log(commentData.value.comment)
}

const createOrEditComment = async () => {
  if (commentData.value.id) {
    // Edit
    loading.value = true
    await store.dispatch("editComment", { cmtId: commentData.value.id, comment: commentData.value.comment })
    emit("getMotorDetails")
    loading.value = false
  } else {
    // Create
    loading.value = true
    await store.dispatch("newComment", { motorId: motorId.value, comment: commentData.value.comment })
    emit("getMotorDetails")
    loading.value = false
  }
  isVisible.value = false
}

const handleClose = () => {
  isVisible.value = false
}
defineExpose({
  openDialog,
})
</script>
<template>
  <div class="comment-dialog" v-loading="loading">
    <el-dialog v-model="isVisible" ref="dialogRef">
      <template #header>
        <p class="primary-color" style="font-size: 18px; font-weight: 600">{{ commentTitle.label }}</p>
      </template>
      <div class="comment-dialog-content">
        <ckeditor :editor="editor" v-model="commentData.comment" @ready="onReady" @input="onChange"></ckeditor>
      </div>
      <template #footer>
        <el-button color="#626aef" plain @click="handleClose">Đóng</el-button>
        <el-button color="#626aef" :disabled="!commentData.comment" @click="createOrEditComment">{{
          commentTitle.button
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.comment-dialog-content {
  .ck-content {
    min-height: 120px;
  }
}
</style>
