<script lang="ts" setup>
import { computed, onMounted, ref } from "vue"
import { ElTable } from "element-plus"
import { helper } from "@/utils/utils"
import { store } from "@/store"

const singleTableRef = ref<InstanceType<typeof ElTable>>()
const chartData = computed(() => store.state.chart)
const loading = ref(true)
const currentPage = ref(1)

const pagingData = computed(() => {
  const startIndex: number = (currentPage.value - 1) * 10
  const endIndex: number = currentPage.value * 10
  return chartData.value.orders?.slice(startIndex, endIndex)
})

onMounted(async () => {
  loading.value = true
  await store.dispatch("getChart", { status: "1" })
  loading.value = false
})
</script>
<template>
  <div class="statistical">
    <div class="statistical-content">
      <div class="statistical-holder">
        <h3 class="primary-color" style="margin-bottom: 24px">Danh sách đơn hàng đã thanh toán</h3>
        <el-table v-loading="loading" ref="singleTableRef" :data="pagingData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="100" label="STT" />
          <el-table-column prop="orderId" label="Mã đơn hàng" min-width="230" show-overflow-tooltip />
          <el-table-column prop="createdBy" label="Tài khoản" min-width="140" show-overflow-tooltip />
          <el-table-column label="Thành tiền" min-width="130" show-overflow-tooltip>
            <template #default="scope">
              {{ helper.formatCurrency(scope.row.totalPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="address" min-width="240" label="Địa chỉ" show-overflow-tooltip>
            <template #default="scope">
              <p v-if="scope.row.address">{{ scope.row.address }}</p>
              <p v-else>Trống</p>
            </template>
          </el-table-column>
          <el-table-column label="Ngày khởi tạo" min-width="180">
            <template #default="scope">
              <div>{{ helper.getDate(scope.row.createdDate) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Trạng thái" min-width="180" show-overflow-tooltip fixed="right">
            <template #default="scope">
              <el-tag type="warning" v-if="scope.row.status === 0">Chưa thanh toán</el-tag>
              <el-tag type="success" v-if="scope.row.status === 1">Đã thanh toán</el-tag>
              <el-tag type="danger" v-if="scope.row.status === 2">Đã hủy</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="common-flex" v-show="!loading">
          <div class="common-count">{{ chartData.total }} đơn hàng</div>
          <div class="common-paginate">
            <el-pagination
              v-model:current-page="currentPage"
              :total="chartData?.orders?.length"
              background
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.statistical {
  width: 100%;
  flex: 1;
}
.statistical-content {
  position: relative;
  height: fit-content;
}

.statistical-holder {
  position: absolute;
  inset: 0;

  & h3 {
    margin-bottom: 12px;
  }
}

.statistical-calc-boxes {
  display: grid;
  align-items: center;
  grid-template-columns: repeat(auto-fill, 250px);
  column-gap: 32px;
  row-gap: 16px;
  text-align: center;
  margin-block: 24px;
}

.statistical-calc-box {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 12px;

  & h4 {
    font-weight: 600;
    margin-bottom: 12px;
  }
}

.statistical-count {
  font-size: 15px;
  margin-top: 24px;
}
</style>
