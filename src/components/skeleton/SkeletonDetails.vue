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
            <el-skeleton-item variant="image" style="min-height: 240px" />
          </template>
        </el-skeleton>
      </div>
      <div class="skeleton-details-right">
        <el-skeleton :loading="true" animated>
          <template #template>
            <el-skeleton-item variant="text" style="margin-block: 8px; height: 24px; width: 50%" />
            <el-skeleton-item variant="text" style="margin-block: 8px; height: 24px; width: 60%" />
            <el-skeleton-item variant="text" style="margin-block: 8px; height: 24px; width: 70%" />
            <el-skeleton-item variant="text" style="margin-block: 8px; height: 24px; width: 90%" />
          </template>
        </el-skeleton>
      </div>
    </div>
    <div class="skeleton-details-note">
      <el-skeleton :loading="true" animated>
        <template #template>
          <div style="display: flex; gap: 24px">
            <el-skeleton-item variant="text" style="width: 60%; height: 200px" />
            <el-skeleton-item variant="text" style="width: 40%; height: 200px" />
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.skeleton-details {
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

.skeleton-details-left {
  & img {
    width: 100%;
  }
}

.skeleton-details-content {
  display: grid;
  margin-top: 30px;
  grid-template-columns: repeat(2, 1fr);
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
