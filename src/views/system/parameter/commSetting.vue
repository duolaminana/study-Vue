<template>
  <div class="app-container email-setting">

    <div class="form-title">{{$t('system.mailSettings.notificationSettings')}}</div>
    <el-form ref="form1" :model="entity" label-width="200px" size="small" label-position="right" style="margin-top: 20px">
      <el-form-item :label="$t('system.mailSettings.systemEmail')" style="margin-bottom: 70px!important;">
        <el-input v-model="entity.systemEmailAddress" :placeholder="$t('system.mailSettings.systemEmail')" class="form-dialog-width"/>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.sysHost')">
        <el-input v-model="entity.sysHost" :placeholder="$t('system.mailSettings.sysHost')" class="form-dialog-width"/>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.username')">
        <el-input v-model="entity.username" :placeholder="$t('system.mailSettings.username')" class="form-dialog-width">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.password')">
        <el-col :span="6">
          <el-input v-model="entity.password" :placeholder="$t('system.mailSettings.code')" class="form-dialog-width" />
        </el-col>
        <el-col :span="10">
          <span style="color: red">{{$t('system.mailSettings.explain1')}}</span>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.smtpProtocol')">
        <el-input v-model="entity.smtpProtocol" :placeholder="$t('system.mailSettings.smtpProtocol')" class="form-dialog-width">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.smtpPort')">
        <el-col :span="6">
          <el-input v-model="entity.smtpPort" :placeholder="$t('system.mailSettings.smtpPort')" class="form-dialog-width" />
        </el-col>
        <el-col :span="10">
          <span style="color: red">{{$t('system.mailSettings.explain2')}}</span>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('system.mailSettings.emailTest')" style="margin-top: 70px!important;">
        <el-input v-model="entity.testEmail" :min="0" :placeholder="$t('system.mailSettings.emailTest')" class="form-dialog-width">
        </el-input>
        <el-button type="primary" @click="onTest">{{$t('common.buttonText.test')}}</el-button>
      </el-form-item>
      <el-form-item style="text-align: center;margin: 30px 100px">
        <el-button type="primary" @click="onSubmit">{{$t('common.buttonText.save')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getOneSysNoticeEmailConfig, saveOrUpdateSysNoticeEmailConfig, testSysNoticeEmailConfig } from '@/api/system';

export default {
  data() {
    return {
      entity: {
        systemEmailAddress: '',
        sysHost: '',
        username: '',
        password: '',
        smtpProtocol: '',
        smtpPort: '',
        testEmail: ''
      }
    }
  },
  created() {
    this.getConfigSetFun()
  },
  methods: {
    getConfigSetFun() {
      getOneSysNoticeEmailConfig({}).then(res => {
        if (res.data) {
          this.entity = res.data;
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    onSubmit() {
      saveOrUpdateSysNoticeEmailConfig(this.entity).then(res => {
        this.$message.success("Save operation successful!");
        this.getConfigSetFun();
      }).catch(err => {
        this.$message(err.message);
      });
    },
    onTest() {
      if (this.entity.testEmail === '' || this.entity.testEmail == null) {
        this.$message("The email address sent cannot be empty!");
        return;
      }
      testSysNoticeEmailConfig(this.entity).then(res => {
        this.$message("Send operation successful!");
        this.getConfigSetFun();
      }).catch(err => {
        this.$message.error(err.message);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.email-setting {
  /*width: 1000px;*/
  width: 90%;
  margin: 0 auto;

  .form-title {
    font-weight: bold;
    font-size: 14px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
  }
}
</style>

