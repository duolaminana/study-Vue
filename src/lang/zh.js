import system from './zh_modules/system'
import product from './zh_modules/product'
import finance from "./zh_modules/finance";
import query from "./zh_modules/query";
import member from "./zh_modules/member"
import newProduct from './zh_modules/newProduct'
import supplier from "./zh_modules/supplier";
import logistics from "./zh_modules/logistics";
import inquiry from "./zh_modules/inquiry";
import customer from "./zh_modules/customer";
import consult from "./zh_modules/consult"
const common = {
  add: '新增',
  addTo: '添加',
  delete: '删除',
  sort: '排序',
  search: '搜索',
  status: '状态',
  export: '导出',
  remark: '备注',
  addNode: '添加节点',
  adjNode: '节点调整',
  noData: '暂无数据',
  more: '更多',
  dashboard: {
    title: '标题',
    tips: '提醒事项'
  },
  table: {
    id: '序号',
    add: '新增',
    delete: '删除',
    view: '查看',
    edit: '编辑',
    status: '状态',
    createdBy: '创建人',
    updateBy: '修改人',
    updateTime: '修改时间',
    createdTime: '创建时间',
    actions: '操作',
    enable: '启用',
    disable: '禁用',
    inUse: '使用中',
    disabled: '已禁用',
    remark: '备注',
    beginTime: '开始时间',
    endTime: '结束时间',
    upload: '上传',
    download: '下载',
    dictionaryValue: '字典值',
    open: 'ON',
    close: 'OFF',
    maintenance: '状态维护'
  },
  buttonText: {
    save: '保存',
    confirm: '确定',
    submit: '提交',
    cancel: '取消',
    close: '关闭',
    back: '返回',
    send: '发送',
    test: '测试',
    defaultAccount: '默认账号',
    defaultSetting: '设置默认',
    applyQuantity: '申请数量'
  },
  route: {
    dashboard: '首页'
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    theme: '换肤',
    size: '布局大小',
    userInfo: '个人资料',
    password: '修改密码',
    language: '语言选择'
  },
  login: {
    title: 'SGI后台管理系统',
    logIn: '登录',
    username: '账号',
    password: '密码'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  personal: {
    firstName: '名字',
    lastName: '姓氏',
    name: '姓名',
    sex: '性别',
    account: '账号',
    telephone: '联系电话',
    email: '邮箱',
    position: '职务',
    address: '联系地址',
    department: '部门',
    oldPassword: '旧密码',
    newPassword: '新密码',
    checkPassword: '确认密码',
    tips: '点击进行更换',
    male: '男',
    female: '女',
    phoneTips: '可以输入多个电话，用分号隔开',
    emailTips: '可以输入多个邮箱，用分号隔开'
  }
}

export default {
  common,
  system,
  product,
  query,
  finance,
  supplier,
  newProduct,
  member,
  logistics,
  inquiry,
  customer,
  consult
}
