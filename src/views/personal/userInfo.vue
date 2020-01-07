<template>
  <div class="app-container userInfo">
    <div class="userForm">
      <el-form ref="addMenu" :model="userInfo" label-width="90px" label-position="left" size="small" :rules="userRules">
        <div class="user-item">
          <div class="user-right">
            <el-form-item :label="$t('common.personal.firstName')">
              {{userInfo.firstName}}
            </el-form-item>
            <el-form-item :label="$t('common.personal.lastName')">
              {{userInfo.lastName}}
            </el-form-item>
            <el-form-item :label="$t('common.personal.sex')">
              {{userInfo.userSex===1?$t('common.personal.male'):$t('common.personal.female')}}
            </el-form-item>
            <el-form-item :label="$t('common.personal.account')">
              {{userInfo.userAccount}}
            </el-form-item>
            <el-form-item :label="$t('common.personal.department')">
              {{userInfo.departmentStr}}
            </el-form-item>
          </div>
          <div class="avatar">
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="userInfo.photoPath" :src="userInfo.photoPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div style="font-size: 10px;text-align: center;color: red;padding-bottom: 5px;">{{$t('common.personal.tips')}}</div>
          </div>
        </div>
        <el-form-item :label="$t('common.personal.email')">
          <el-input v-model="userInfo.emailAddress" clearable :placeholder="$t('common.personal.emailTips')"/>
        </el-form-item>
        <el-form-item :label="$t('common.personal.telephone')">
          <el-input v-model="userInfo.mobilePhone" clearable :placeholder="$t('common.personal.phoneTips')"/>
        </el-form-item>
        <el-form-item :label="$t('common.personal.address')">
          <el-input v-model="userInfo.contactAddress" clearable placeholder="Address"/>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="small" :loading="confirmLoading" @click="saveUserInfo">{{$t('common.buttonText.save')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { uploadActionUrl } from '@/api/common'
import { updateUserInfo } from '@/api/user';

export default {
  data() {
    return {
      uploadActionUrl,
      confirmLoading: false,
      userRules: {}
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.userInfo.photoPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    saveUserInfo() {
      updateUserInfo(this.userInfo).then(res => {
        this.$message.success('Update Success');
        this.$store.state.user.userInfo = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/variables.scss';

.userInfo {
  width: 90%;
  margin: 0 auto;

  .userForm {
    width: 700px;
    margin: 0 auto;
    position: relative;
    border: 1px solid $border-light-color;
    padding: 20px;

    .user-item {
      display: flex;
      display: -webkit-flex;

      .avatar {
        /*width: 40%;*/

        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }

        .avatar {
          width: 178px;
          height: 178px;
          display: block;
        }
      }

      .user-right {
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
  }
}
</style>

