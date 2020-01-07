import system from "./en_modules/system";
import product from "./en_modules/product";
import finance from "./en_modules/finance";
import query from "./en_modules/query";
import member from "./en_modules/member"
import newProduct from "./en_modules/newProduct";
import supplier from "./en_modules/supplier";
import logistics from "./en_modules/logistics";
import inquiry from "./en_modules/inquiry";
import customer from "./en_modules/customer";
import consult from "./en_modules/consult";
const common = {
  add: 'Add',
  addTo: 'Add to',
  delete: 'Delete',
  sort: 'Sort',
  search: 'Search',
  status: 'Status',
  export: 'Export to Excel',
  remark: 'Remark',
  addNode: 'Add Node',
  adjNode: 'Node ADJ',
  noData: 'No Data',
  more: 'More',
  dashboard: {
    title: 'Title'
  },
  table: {
    id: 'index',
    add: 'Add',
    delete: 'Delete',
    view: 'View',
    edit: 'Edit',
    status: 'Status',
    remark: 'Remark',
    actions: 'Operation',
    createdBy: 'Creator',
    updateBy: 'Modifier',
    updateTime: 'UpdateTime',
    createdTime: 'CreatedTime',
    enable: 'Enable',
    disable: 'Disable',
    inUse: 'Active',
    disabled: 'Disabled',
    beginTime: 'Begin Time',
    upload: 'Upload',
    downLoad: 'Download',
    endTime: 'End Time',
    dictionaryValue: 'Value',
    open: 'ON',
    close: 'OFF',
    maintenance: 'Maintenance'
  },
  buttonText: {
    save: 'Save',
    confirm: 'Confirm',
    submit: 'Submit',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Return',
    send: 'Send',
    test: 'Test',
    defaultAccount: 'Default',
    defaultSetting: 'Set Default',
    applyQuantity: 'Apply Quantity'
  },
  route: {
    dashboard: 'Dashboard'
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    theme: 'Theme',
    size: 'Global Size',
    userInfo: 'Profile',
    password: 'Change Password',
    language: 'Language Select'
  },
  login: {
    title: 'SGI B2B Management System',
    logIn: 'Login',
    username: 'Username',
    password: 'Password'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  personal: {
    firstName: 'First Name',
    lastName: 'Last Name',
    name: 'Name',
    sex: 'Sex',
    account: 'Account',
    telephone: 'Telephone',
    email: 'Email',
    position: 'Position',
    address: 'Address',
    department: 'Department',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    checkPassword: 'Confirm Password',
    tips: 'Click to replace',
    male: 'Male',
    female: 'Female',
    phoneTips: 'You can enter multiple mailboxes separated by semicolons',
    emailTips: 'Multiple phones can be entered, separated by semicolons',
    productSamples: 'Product samples'
  }
}

export default {
  common,
  system,
  product,
  query,
  finance,
  supplier,
  member,
  newProduct,
  logistics,
  inquiry,
  customer,
  consult
}
