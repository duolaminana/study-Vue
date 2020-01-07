<template>
  <div class="app-container form-test">
    <el-tabs v-model="setType" @tab-click="handleClick(setType)">
      <el-tab-pane :label="$t('system.sysPwdSet.clientSetting')" name="0">
        <el-form ref="form1" :model="dateList" label-width="100px" size="small" label-position="top">
          <el-form-item :label="$t('system.sysPwdSet.passwordLength')">
            <el-row :gutter="28">
              <el-col :span="12">
                <el-form-item >
                  {{$t('system.sysPwdSet.pwdMin')}}：<el-input-number v-model="dateList.pwdMin" :min="0" label="最小长度"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.digit')}}
                </el-form-item>
                <el-form-item>
                  {{$t('system.sysPwdSet.pwdMax')}}：<el-input-number v-model="dateList.pwdMax" :min="0" label="最大长度"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.digit')}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('system.sysPwdSet.passwordComplexity')">
            <el-checkbox v-model="dateList.isNumeral" value="number " label="number ">{{$t('system.sysPwdSet.isNumeral')}}</el-checkbox>
            <el-checkbox v-model="dateList.isCapital" value="number " label="number ">{{$t('system.sysPwdSet.isCapital')}}</el-checkbox>
            <el-checkbox v-model="dateList.isLowercase" value="number " label="number ">{{$t('system.sysPwdSet.isLowercase')}}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('system.sysPwdSet.pwdHistory')">
            <el-col :span="3">
              <el-input-number v-model="dateList.pwdHistory" :min="0" label="描述文字"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.times')}}
            </el-col>
            <el-col :span="10">
              <span style="color: red">{{$t('system.sysPwdSet.explain1')}}</span>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('system.sysPwdSet.pwdUpdateSize')">
            <el-col :span="3">
              <el-input-number v-model="dateList.pwdUpdateSize" :min="0" label="描述文字"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.day')}}
            </el-col>
            <el-col :span="10">
              <span style="color: red">{{$t('system.sysPwdSet.explain2')}}</span>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('system.sysPwdSet.ErrorSetting')">
            <el-row :gutter="28">
              <el-col :span="5">
                <el-form-item>
                  {{$t('system.sysPwdSet.pwdErrorSize')}}：
                  <el-input-number v-model="dateList.pwdErrorSize" :min="0" label="错误锁定次数"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.times')}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <span style="color: red">{{$t('system.sysPwdSet.explain3')}}</span>
              </el-col>
            </el-row>
            <el-row :gutter="28">
              <el-col :span="12">
                <el-form-item>
                  {{$t('system.sysPwdSet.unlockTime')}}：
                  <el-input-number v-model="dateList.unlockTime" :min="0" label="解锁时间设置"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.hour')}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="onSubmit">{{$t('common.buttonText.save')}}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane :label="$t('system.sysPwdSet.serverSetting')" name="1">
        <el-form ref="form1" :model="dateList1" label-width="100px" size="small" label-position="top">
          <el-form-item :label="$t('system.sysPwdSet.passwordLength')">
            <el-row :gutter="28">
              <el-col :span="12">
                <el-form-item>
                  {{$t('system.sysPwdSet.pwdMin')}}：
                  <el-input-number v-model="dateList1.pwdMin" :min="0" label="最小长度"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.digit')}}
                </el-form-item>
                <el-form-item>
                  {{$t('system.sysPwdSet.pwdMax')}}：
                  <el-input-number v-model="dateList1.pwdMax" :min="0" label="最小长度"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.digit')}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('system.sysPwdSet.passwordComplexity')">
            <el-checkbox v-model="dateList1.isNumeral" value="number ">{{$t('system.sysPwdSet.isNumeral')}}</el-checkbox>
            <el-checkbox v-model="dateList1.isCapital" value="number ">{{$t('system.sysPwdSet.isCapital')}}</el-checkbox>
            <el-checkbox v-model="dateList1.isLowercase" value="number ">{{$t('system.sysPwdSet.isLowercase')}}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('system.sysPwdSet.pwdHistory')">
            <el-col :span="3">
              <el-input-number v-model="dateList1.pwdHistory" :min="0" label="描述文字"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.times')}}
            </el-col>
            <el-col :span="10">
              <span style="color: red">{{$t('system.sysPwdSet.explain1')}}</span>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('system.sysPwdSet.pwdUpdateSize')">
            <el-col :span="3">
              <el-input-number v-model="dateList1.pwdUpdateSize" :min="0" label="描述文字"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.day')}}
            </el-col>
            <el-col :span="10">
              <span style="color: red">{{$t('system.sysPwdSet.explain2')}}</span>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('system.sysPwdSet.ErrorSetting')">
            <el-row :gutter="28">
              <el-col :span="5">
                <el-form-item>
                  {{$t('system.sysPwdSet.pwdErrorSize')}}：
                  <el-input-number v-model="dateList1.pwdErrorSize" :min="0" label="错误锁定次数"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.times')}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <span style="color: red">{{$t('system.sysPwdSet.explain3')}}</span>
              </el-col>
            </el-row>
            <el-row :gutter="28">
              <el-col :span="12">
                <el-form-item>
                  {{$t('system.sysPwdSet.unlockTime')}}：
                  <el-input-number v-model="dateList1.unlockTime" :min="0" label="解锁时间设置"></el-input-number>&nbsp;&nbsp;{{$t('system.sysPwdSet.hour')}}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="onSubmit1">{{$t('common.buttonText.save')}}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { getPwdSetApi, updateByIdApi } from '@/api/system'
export default {
  data() {
    return {
      isNumeral: false,
      isCapital: false,
      isLowercase: false,

      dateList: {
        pwdMin: '',
        pwdMax: '',
        isNumeral: '',
        isCapital: '',
        isLowercase: '',
        pwdHistory: '',
        pwdUpdateSize: '',
        pwdErrorSize: '',
        unlockTime: ''
      },
      dateList1: {
        pwdMin: '',
        pwdMax: '',
        isNumeral: '',
        isCapital: '',
        isLowercase: '',
        pwdHistory: '',
        pwdUpdateSize: '',
        pwdErrorSize: '',
        unlockTime: ''
      },
      checkBoxValue: [],
      setType: '0',
      postData: {
        setType: 0
      }
    }
  },
  created() {
    this.getPwdSetFun()
  },
  methods: {
    getPwdSetFun() {
      if (this.setType === '0') {
        this.postData.setType = 0;
        getPwdSetApi(this.postData).then(res => {
          this.dateList = Object.assign(this.dateList, res.data);
          this.dateList.isNumeral = this.dateList.isNumeral === "1";
          this.dateList.isCapital = this.dateList.isCapital === "1";
          this.dateList.isLowercase = this.dateList.isLowercase === "1"
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
      if (this.setType === '1') {
        this.postData.setType = 1;
        getPwdSetApi(this.postData).then(res => {
          this.dateList1 = Object.assign(this.dateList1, res.data);
          this.dateList1.isNumeral = this.dateList1.isNumeral === "1";
          this.dateList1.isCapital = this.dateList1.isCapital === "1";
          this.dateList1.isLowercase = this.dateList1.isLowercase === "1"
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    onSubmit() {
      let obj = {};
      if (this.setType === '0') {
        this.dateList.setType = 0;
        obj = this.dateList;
      }
      updateByIdApi(obj).then(res => {
        this.dateList = res.data;
        this.$message.success(res.message);
        this.getPwdSetFun();
      }).catch(err => {
        this.$message(err.message);
      });
    },
    onSubmit1() {
      let obj = {};
      if (this.setType === '1') {
        this.dateList1.setType = 1;
        obj = this.dateList1
      }
      updateByIdApi(obj).then(res => {
        this.dateList = res.data;
        this.$message.success(res.message);
        this.getPwdSetFun();
      }).catch(err => {
        this.$message(err.message);
      });
    },
    handleClick(setType) {
      console.info(this.setType);
      this.postData.setType = this.setType;
      this.getPwdSetFun();
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/styles/variables.scss';

.form-test {
  /*width: 1000px;*/
  width: 90%;
  margin: 0 auto;
  font-size: 12px;
}
</style>

