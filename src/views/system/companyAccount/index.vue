<template>
  <div class="app-container companySetting">
    <el-tabs v-model="setType">
      <el-tab-pane :label="$t('system.business.enterpriseParameter')" name="0">
        <companySet />
      </el-tab-pane>

      <el-tab-pane :label="$t('system.business.rawParameter')" name="1">
        <materialSet />
      </el-tab-pane>

      <el-tab-pane :label="$t('system.business.salesOrderParameter')" name="2">
        <productSale />
      </el-tab-pane>

      <el-tab-pane :label="$t('system.business.purchaseOrderParameter')" name="3">
        <productBuy />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>

import companySet from './companySet'
import materialSet from './materialSet'
import productSale from './productSale'
import productBuy from './productBuy'
export default {
  components: {
    companySet,
    materialSet,
    productSale,
    productBuy
  },
  data() {
    return {
      setType: 0
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .companySetting {
    /*width: 1000px;*/
    width: 100%;
    margin: 0 auto;
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
  }
</style>

