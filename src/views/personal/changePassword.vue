<template>
  <div class="app-container change-password">
    <el-form ref="form" :model="form" label-width="140px" size="small" :rules="formRules" class="change-form">
      <el-form-item :label="$t('common.personal.account')" prop="account">
        <el-input v-model="userInfo.userAccount" disabled />
      </el-form-item>
      <el-form-item :label="$t('common.personal.oldPassword')" prop="oldPwd">
        <el-input v-model="form.oldPwd" type="password" placeholder="Old password"/>
      </el-form-item>
      <el-form-item :label="$t('common.personal.newPassword')" prop="newPwd">
        <el-input v-model="form.newPwd" type="password" placeholder="New password" />
      </el-form-item>
      <el-form-item :label="$t('common.personal.checkPassword')" prop="newPwd1">
        <el-input v-model="form.newPwd1" type="password" placeholder="Confirm password."/>
      </el-form-item>
      <el-form-item style="text-align: center;margin: 30px 0">
        <el-button size="small" type="primary" @click="submit('form')">{{$t('common.buttonText.save')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePassword } from '@/api/user';
import md5 from 'js-md5';
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please enter the old password'));
      } else if (value.toString().length < 6) {
        callback(new Error('Password length is at least 6 bits'))
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again.'));
      } else if (value !== this.form.newPwd) {
        callback(new Error('The confirm password is inconsistent!'));
      } else {
        callback();
      }
    };
    return {
      confirmLoading: false,
      form: {
        oldPwd: '',
        newPwd: '',
        newPwd1: ''
      },
      formRules: {
        oldPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        newPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        newPwd1: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let formData = new FormData();
          // formData.append('oldPwd', md5(this.form.oldPwd));
          // formData.append('newPwd', md5(this.form.newPwd));
          let { oldPwd, newPwd } = this.form;
          let obj = {
            oldPwd: md5(oldPwd),
            newPwd: md5(newPwd)
          };
          changePassword(obj).then(res => {
            this.$message.success('Change Password Success')
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';

.change-password {
  width: 90%;
  margin: 0 auto;
  .change-form {
    width: 400px;
    margin: 100px auto;
  }
}
</style>

