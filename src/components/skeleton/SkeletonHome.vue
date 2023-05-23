<template>
  <div class="skeleton">
    <el-skeleton>
      <template #template>
        <el-skeleton-item variant="text" style="width: 300px; height: 40px" />
      </template>
    </el-skeleton>
    <div class="skeleton-content">
      <div class="skeleton-top">
        <el-skeleton style="display: flex; justify-content: space-between">
          <template #template>
            <el-skeleton-item variant="text" style="width: 250px; height: 40px; border-radius: 100px" />
            <el-skeleton-item variant="text" style="width: 200px; height: 40px" />
          </template>
        </el-skeleton>
      </div>
      <div class="skeleton-motors">
        <div v-for="box in boxes" class="skeleton-motor" :key="box">
          <el-skeleton class="skeleton-motor-img" :loading="true" animated>
            <template #template>
              <el-skeleton-item variant="image" />
            </template>
          </el-skeleton>
          <el-skeleton :loading="true" animated>
            <template #template>
              <el-skeleton-item variant="text" style="margin-top: 16px; margin-bottom: 8px" />
              <el-skeleton-item variant="text" style="width: 70%" />
              <el-skeleton-item variant="text" style="height: 50px; border-radius: 100px; margin-top: 12px" />
            </template>
          </el-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const loading = ref(true)
const currentDate = new Date().toDateString()
const boxes = ref(8)
</script>

<style scoped lang="scss">
.skeleton {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding-block: 24px;

  & > h2 {
    margin-bottom: 24px;
  }
}

.skeleton-motors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.skeleton-motor {
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
  padding: 12px;
  transition: all 0.3s ease;

  & p {
    margin-block: 4px;
    overflow: hidden;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    white-space: normal;

    & a {
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
    color: #cc2828;
  }
}

.skeleton-motor-img {
  overflow: hidden;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 4px;
  overflow: hidden;
  aspect-ratio: 1/1;
}

.skeleton-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.skeleton-search {
  border: 1px solid #ff3333;
  border-radius: 100px;
  overflow: hidden;
  display: flex;

  & input {
    padding: 6px 12px 6px 18px;
    flex: 1;
  }

  & button {
    padding-inline: 14px;
    line-height: 32px;

    color: #ffe6e6;
    background-color: #ff3333;
  }

  @media screen and (max-width: 430px) {
    width: 100%;
  }
}

.skeleton-filter {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
}

.skeleton-filter-trigger {
  display: flex;
  gap: 8px;
  align-items: center;
}

@media screen and (max-width: 1199px) {
  .skeleton {
    padding-inline: 24px;
  }

  .skeleton-motors {
    gap: 24px;
  }
}

@media screen and (max-width: 1064px) {
  .skeleton {
    padding-inline: 24px;
  }

  .skeleton-motors {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

@media screen and (max-width: 996px) {
  .skeleton {
    padding-inline: 16px;
  }

  .skeleton-motors {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media screen and (max-width: 700px) {
  .skeleton {
    padding-inline: 16px;
  }

  .skeleton-motors {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media screen and (max-width: 540px) {
  .skeleton {
    padding-inline: 16px;
  }

  .skeleton-motors {
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }
}
</style>

<style lang="scss">
.skeleton-motor-img {
  .el-skeleton__item.el-skeleton__image {
    height: 100%;
  }
}
</style>
