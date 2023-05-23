<template>
  <div class="skeleton-details">
    <el-skeleton :loading="true" animated>
      <template #template>
        <el-skeleton-item variant="text" style="width: 230px; height: 32px" />
      </template>
    </el-skeleton>
    <div class="skeleton-details-content">
      <div class="skeleton-details-left">
        <el-skeleton :loading="true" animated>
          <template #template>
            <el-skeleton-item style="min-height: 30px" />
            <el-skeleton-item style="min-height: 30px" />
            <el-skeleton-item style="min-height: 30px" />
            <el-skeleton-item style="min-height: 30px" />
            <el-skeleton-item style="min-height: 30px" />
          </template>
        </el-skeleton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.skeleton-details {
  max-width: 1200px;
  width: 100%;
  padding-block: 16px;
  margin: 24px auto;
  padding-top: 24px;

  @media screen and (max-width: 1200px) {
    padding-inline: 16px;
  }

  & > h3 {
    border-bottom: 1px solid #888;
    padding-bottom: 12px;
  }
}

.skeleton-details-content {
  display: grid;
  margin-top: 48px;
  align-items: center;
  gap: 32px;
}

.skeleton-details-right {
  display: grid;
  gap: 16px;

  & h3 {
    color: #e20404;
  }
}

.skeleton-details-note {
  margin-top: 40px;
}
</style>
