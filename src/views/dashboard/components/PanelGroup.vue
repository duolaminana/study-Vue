<template>
  <el-row :gutter="30" class="panel-group">
    <el-col :xs="12" :sm="12" :md="10" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper" @click="goRouter">
          <img :src="userInfo.photoPath" class="user-avatar">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text card-panel-name">{{userInfo.userName}}</div>
          <div class="card-panel-text">{{$t('common.personal.sex')}}：{{ userInfo.userSex === 1 ? '男': '女' }}</div>
          <div class="card-panel-text">{{$t('common.personal.account')}}：{{ userInfo.userAccount }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="14" :lg="16" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('common.personal.department')}}：{{ userInfo.departmentStr || 'Null'}}</div>
          <div class="card-panel-text">{{$t('common.personal.position')}}：{{ userInfo.position || 'Null'}}</div>
          <div class="card-panel-text">{{$t('common.personal.email')}}：{{ userInfo.emailAddress }}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    goRouter() {
      this.$router.push('/personal/userInfo')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col{
    /*margin-bottom: 30px;*/
  }
  .card-panel {
    height: 130px;
    font-size: 12px;
    overflow: hidden;
    color: #666;
    display: -webkit-flex;
    display: flex;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    -webkit-border-radius: 10px;
    border-radius: 10px;
    .card-panel-icon-wrapper {
      padding: 15px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      .user-avatar {
        width: 105px;
        height: 105px;
        -webkit-border-radius: 10px;
        border-radius: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .card-panel-description {
      font-weight: bold;
      padding: 15px;
      flex: 1;
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      justify-content: space-around;
      .card-panel-text {
        line-height: 16px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 12px;
      }
      .card-panel-name {
        color: black;
        font-size: 18px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
