import request from '@/utils/request'
// -----------------------------------------------系统管理-角色管理----------------------------------------------------------

// 获取角色列表
export function getRoleList(option) {
  return request.get(`/backend-admin/role/selectRoleList`, { params: option })
}

// 新增角色接口
export function addRole(option) {
  return request.post(`/backend-admin/role/add`, option)
}

// 删除角色接口
export function deleteRole(option) {
  return request.get(`/backend-admin/role/delete`, { params: option })
}

// 禁用启用角色接口
export function enableRole(option) {
  return request.get(`/backend-admin/role/enable`, { params: option })
}

// 查看角色成员接口
export function getRoleUserList(option) {
  return request.get(`/backend-admin/role/selectRoleMember`, { params: option })
}

// 查询角色拥有的菜单
export function getRoleTree(option) {
  return request.get(`/backend-admin/role/getFrontMenuByRoleId`, { params: option })
}

// 查询角色勾选的菜单，带全部菜单
export function getRoleAllTree(option) {
  return request.get(`/backend-admin/role/getMenuAllByRoleId`, { params: option })
}

// 获取角色列表
export function getSysRoleList(option) {
  return request.get(`/backend-admin/role/getRoleInfoList`, { params: option })
}

// 设置角色菜单
export function setRoleMenu(option) {
  return request.post(`/backend-admin/role/addMenu`, option)
}

// 给角色新增成员
export function addRoleMember(option) {
  return request.post(`/backend-admin/role/addRoleMember`, option)
}

// 删除角色成员
export function deleteRoleMember(option) {
  return request.post(`/backend-admin/role/deleteRoleMember`, option)
}

// 菜单列表
export function getMenuList(option) {
  return request.get(`/backend-admin/sysAuthorityMenu/selectMemuList`, { params: option })
}

// 菜单列表
export function addMenu(option) {
  return request.post(`/backend-admin/sysAuthorityMenu/add`, option)
}

// 菜单禁用启用
export function changeMenuStatus(option) {
  return request.post(`/backend-admin/sysAuthorityMenu/enable`, option)
}

// 菜单删除
export function deleteMenu(option) {
  return request.get(`/backend-admin/sysAuthorityMenu/delete`, { params: option })
}

// 菜单编辑
export function editMenu(option) {
  return request.post(`/backend-admin/sysAuthorityMenu/update`, option)
}

// 菜单涉及角色查询
export function getMenuRole(options) {
  return request.get(`/backend-admin/sysAuthorityMenu/getRoleByMenuId`, { params: options })
}

// 前台菜单列表
export function getClientMenuList(option) {
  return request.get(`/backend-admin/frontendMenu/selectMemuList`, { params: option })
}

// 前台新增菜单列表
export function addClientMenu(option) {
  return request.post(`/backend-admin/frontendMenu/add`, option)
}

// 前台菜单禁用启用
export function changeClientMenuStatus(option) {
  return request.post(`/backend-admin/frontendMenu/enable`, option)
}

// 前台菜单删除
export function deleteClientMenu(option) {
  return request.get(`/backend-admin/frontendMenu/delete`, { params: option })
}

// 前台菜单编辑
export function editClientMenu(option) {
  return request.post(`/backend-admin/frontendMenu/update`, option)
}

// 前台菜单涉及角色查询
export function getMenuClientRole(options) {
  return request.get(`/backend-admin/frontendMenu/getRoleByMenuId`, { params: options })
}

// 菜单排序上下移动一格
export function menuMoveOne(option) {
  return request.get(`/backend-admin/sysAuthorityMenu/move`, { params: option })
}

// 菜单排序上下移动最前最后
export function menuMoveMast(option) {
  return request.get(`/backend-admin/sysAuthorityMenu/moveBest`, { params: option })
}

// 前台菜单排序上下移动一格
export function clientMenuMoveOne(option) {
  return request.get(`/backend-admin/frontendMenu/move`, { params: option })
}

// 前台菜单排序上下移动最前最后
export function clientMenuMoveMast(option) {
  return request.get(`/backend-admin/frontendMenu/moveBest`, { params: option })
}

// -----------------------------------------------系统管理-参数管理----------------------------------------------------------

// 获取系统配置参数
export function getPwdSetApi(option) {
  return request.get(`/backend-admin/parameter/getPwdSet`, { params: option })
}

// 对外提供服务--系统配置参数
export function getRestSystemConfigApi(option) {
  return request.get(`/backend-admin/restPwdSetController/getRestSystemConfig`, { params: option })
}

// 更新系统配置参数
export function updateByIdApi(option) {
  return request.post(`/backend-admin/parameter/updateById`, option)
}

// 新增一个主体企业账号
export function saveCompanyAccountApi(option) {
  return request.post(`/backend-admin/parameter/saveCompanyAccount`, option)
}

// 更新一个主体企业账号
export function updateCompanyAccountApi(option) {
  return request.post(`/backend-admin/parameter/updateCompanyAccount`, option)
}

// 批量删除主体企业账号
export function delectByCompanyIdApi(option) {
  return request.post(`/backend-admin/parameter/delectByCompanyId`, option)
}

// 设置默认主体企业账号
export function updateCompanyIsDefaultApi(option) {
  return request.get(`/backend-admin/parameter/updateCompanyIsDefault`, { params: option })
}

// 查看所有主体企业账号列表
export function selectCompanyListApi(option) {
  return request.get(`/backend-admin/parameter/selectCompanyList`, { params: option })
}

// 查看主体企业账号详情
export function selectByCompanyIdApi(option) {
  return request.get(`/backend-admin/parameter/selectByCompanyId`, { params: option })
}

// 获取默认主体账号
export function getIsDefaultSysCompanyInfoApi(option) {
  return request.get(`/backend-admin/rest/sysCompanyInfo/getIsDefaultSysCompanyInfo`, { params: option })
}

// 提供对外接口-企业列表
export function getSupplyCompanyList(option) {
  return request.get(`/backend-admin/rest/sysCompanyInfo/getSupplyCompanyList`, { params: option })
}

// 后台服务-模糊搜索-查询国家列表
export function selectCountryListApi(option) {
  return request.get('/backend-admin/country/selectCountryList', { params: { key: option }});
}

// 后台服务-模糊搜索-查询币种列表
export function selectCurrencyCodeListApi(option) {
  return request.get('backend-admin/currencyCode/selectCurrencyCodeList', { params: { key: option }});
}

// 获取系统报价及订单默认参数设置
export function selectSysQuotesOrderApi(option) {
  return request.get(`backend-admin/sysQuotesOrderDefParameter/selectSysQuotesOrder`, { params: option })
}

// 对外提供服务--系统报价及订单默认参数设置
export function getSysQuotesOrderApi(option) {
  return request.get(`backend-admin/sysQuotesOrderDefParameter/getSysQuotesOrder`, { params: option })
}

// 保存系统报价及订单默认参数设置
export function updateSysQuotesOrderApi(option) {
  return request.post(`backend-admin/sysQuotesOrderDefParameter/updateSysQuotesOrder`, option)
}

// 根据交易订单类型---查看所有系统报价及订单默认币种汇率记录
export function selectTradeCurrencyListApi(option) {
  return request.get(`backend-admin/sysQuotesOrderTradeCurrency/selectTradeCurrencyList`, { params: option })
}

// 删除一个系统报价及订单默认币种汇率记录
export function delectTradeCurrencyByIdApi(option) {
  return request.post(`backend-admin/sysQuotesOrderTradeCurrency/delectTradeCurrencyById`, option)
}

// 新增&更新校验币种是否存在
export function selectCurrencyCodeApi(option) {
  return request.get(`backend-admin/sysQuotesOrderTradeCurrency/selectCurrencyCode`, { params: option })
}

// 保存&更新系统订单参数配置参数
export function updateSysOrderParameterApi(option) {
  return request.post(`backend-admin/sysOrderParameter/updateSysOrderParameter`, option)
}

// 获取系统订单参数配置参数
export function selectSysOrderParameterApi(option) {
  return request.get(`backend-admin/sysOrderParameter/selectSysOrderParameter`, { params: option })
}

// 系统订单参数配置参数-对外提供服务
export function getSysOrderParameterApi(option) {
  return request.get(`backend-admin/sysOrderParameter/getSysOrderParameter`, { params: option })
}

// 校验币种是否存在
export function selectsysOrderTradeCurrencyApi(option) {
  return request.get(`backend-admin/sysOrderTradeCurrency/selectsysOrderTradeCurrency`, { params: option })
}

// 流程控制塔---根据类型查询流程控制列表
export function selectControlTowerListApi(option) {
  return request.get(`backend-admin/rest/workflowNode/selectNodeTypeList`, { params: option })
}

// -----------------------------------------------系统管理-主体企业银行账号管理----------------------------------------------------------
// 新增-主体企业银行账号
export function saveCompanyBankAccountApi(option) {
  return request.post('/backend-admin/sysCompanyBankAccount/saveCompanyBankAccount', option);
}

// 更新-主体企业银行账号
export function updateCompanyBankAccountApi(option) {
  return request.post('/backend-admin/sysCompanyBankAccount/updateCompanyBankAccount', option);
}

// 删除操作-批量删除主体企业银行账号
export function deleteCompanyBankAccountApi(option) {
  return request.post('/backend-admin/sysCompanyBankAccount/deleteCompanyBankAccount', option);
}

// 根据bid分页查询银行账号
export function selectCompanyBankAccountListApi(option) {
  return request.get('/backend-admin/sysCompanyBankAccount/selectCompanyBankAccountList', { params: option });
}

// 企业银行账号设置是否默认
export function updateCompanyBankAccountIsDefaultApi(option) {
  return request.get('/backend-admin/sysCompanyBankAccount/updateCompanyBankAccountIsDefault', { params: option });
}

// -----------------------------------------------系统管理-部门管理----------------------------------------------------------

// 查看部门详情
export function selectDepartmentByIdApi(option) {
  return request.get(`/backend-admin/department/selectDepartmentById`, { params: option })
}

// 查看部门分页列表
export function selectDepartmentListAllApi(option) {
  return request.get(`/backend-admin/department/selectDepartmentListAll`, { params: option })
}

// 查看不分层级的所有部门列表
export function selectAllApi(option) {
  return request.get(`/backend-admin/department/selectAll`, { params: option })
}

// 禁用一个部门
export function updateStatusApi(option) {
  return request.post(`/backend-admin/department/updateStatus`, option)
}

// 新增一个部门
export function saveDepartmentApi(option) {
  return request.post(`/backend-admin/department/saveDepartment`, option)
}

// 更新一个部门
export function updateDepartmentApi(option) {
  return request.post(`/backend-admin/department/updateDepartment`, option)
}

// 批量删除部门
export function deleteAllApi(option) {
  return request.post(`/backend-admin/department/deleteByIds`, option)
}

// 单删除部门
export function deleteByIdApi(option) {
  return request.post(`/backend-admin/department/deleteById`, option)
}

// 统计部门现有人数
export function selectSysUserDepartmentCountApi(option) {
  return request.get(`/backend-admin/sysUserDepartment/selectSysUserDepartmentCount`, { params: option })
}

// 查看部门现有成员人数列表
export function selectUserDepartmentListApi(option) {
  return request.get(`/backend-admin/sysUserDepartment/selectUserDepartmentListAll`, { params: option })
}

// 无层级部门列表
export function getDepartmentList(option) {
  return request.get(`/backend-admin/rest/department/getDepartmentList`, { params: option })
}

// -----------------------------------------------系统管理-广告管理----------------------------------------------------------

// 新增一个广告位置
export function saveAdvertPositionApi(option) {
  return request.post(`/backend-admin/advertPosition/saveAdvertPosition`, option)
}

// 更新一个广告位置
export function updateAdvertPositionApi(option) {
  return request.post(`/backend-admin/advertPosition/updateAdvertPosition`, option)
}

// 批量删除广告位置
export function delectPositionByIdApi(option) {
  return request.post(`/backend-admin/advertPosition/delectPositionById`, option)
}

// 禁用一个广告位置
export function updatePositionStatusApi(option) {
  return request.get(`/backend-admin/advertPosition/updatePositionStatus`, { params: option })
}

// 查看广告位置详情
export function selectAdvertPositionByIdApi(option) {
  return request.get(`/backend-admin/advertPosition/selectAdvertPositionById`, { params: option })
}

// 查看广告位置分页列表
export function selectAdvertPositionListApi(option) {
  return request.get(`/backend-admin/advertPosition/selectAdvertPositionList`, { params: option })
}
// 通过广告位置bid获取广告内容集合
export function getAdPositionApi(option) {
  return request.get(`/backend-admin/advertPosition/getAdPosition`, { params: option })
}

// 批量删除广告内容
export function delectByAdvertIdApi(option) {
  return request.post(`/backend-admin/advert/delectByAdvertId`, option)
}

// 更新一个广告内容
export function updateAdvertApi(option) {
  return request.post(`/backend-admin/advert/updateAdvert`, option)
}

// 新增一个广告内容
export function saveAdvertApi(option) {
  return request.post(`/backend-admin/advert/saveAdvert`, option)
}

// 查看广告内容分页列表
export function selectAdvertListApi(option) {
  return request.get(`/backend-admin/advert/selectAdvertList`, { params: option })
}

// 查看广告内容详情
export function selectAdvertByIdApi(option) {
  return request.get(`/backend-admin/advert/selectAdvertById`, { params: option })
}

// 禁用一个广告内容
export function updateAdvertStatusApi(option) {
  return request.get(`/backend-admin/advert/updateAdvertStatus`, { params: option })
}

// 通过广告位置bid获取广告内容集合
export function getListApi(option) {
  return request.get(`/backend-admin/advert/getList`, { params: option })
}

// 查看广告排版分页列表
export function selectAdSchedulingListApi(option) {
  return request.post(`/backend-admin/sysAdScheduling/selectAdSchedulingList`, option)
}

// 新增一个广告排班
export function saveAdSchedulingApi(option) {
  return request.post(`/backend-admin/sysAdScheduling/saveAdScheduling`, option)
}

// 更新一个广告排班
export function updateAdSchedulingApi(option) {
  return request.post(`/backend-admin/sysAdScheduling/updateAdScheduling`, option)
}

// 禁用一个广告排班
export function updateSchedulingStatusApi(option) {
  return request.get(`/backend-admin/sysAdScheduling/updateSchedulingStatus`, { params: option })
}

// 通过ids进行广告排班数据批量删除
export function delectAdSchedulingApi(option) {
  return request.post(`/backend-admin/sysAdScheduling/delectAdScheduling`, option)
}

// 定时任务，到期时间的广告内容置为禁用
export function updateAdSchedulingTimedTaskApi(option) {
  return request.get(`/backend-admin/sysAdScheduling/updateAdSchedulingTimedTask`, { params: option })
}

// -----------------------------------------------系统管理-流程控制塔管理----------------------------------------------------------
// 无分页-流程节点列表数据
export function selectWorkflowNodeListApi(option) {
  return request.get(`/backend-admin/workflowNode/selectWorkflowNodeList`, { params: option })
}

// 新增一条节点信息
export function saveWorkflowNodeApi(option) {
  return request.post(`/backend-admin/workflowNode/saveWorkflowNode`, option)
}

// 更新一条节点信息
export function updateWorkflowNodeApi(option) {
  return request.post(`/backend-admin/workflowNode/updateWorkflowNode`, option)
}

// 更新节点状态
export function updateNodeStatusApi(option) {
  return request.get(`/backend-admin/workflowNode/updateNodeStatus`, { params: option })
}

// 分页查询-订单节点信息列表数据
export function selectWorkflowProcessListApi(option) {
  return request.post(`/backend-admin/workflowProcess/selectWorkflowProcessList`, option)
}

// 更新-调整当前触发节点
export function updateCurrentNodeApi(option) {
  return request.post(`/backend-admin/workflowProcess/updateCurrentNode`, option)
}

// -----------------------------------------------系统管理-后台用户管理----------------------------------------------------------
// 新增用户
export function addSysUser(option) {
  return request.post(`/backend-user/sysUser/add`, option)
}

// 查询用户
export function selectUserAccountList(option) {
  return request.get(`/backend-user/sysUser/selectUserAccountList`, { params: option })
}

// 查询用户--无搜索条件
export function selectUserAccountListAllApi(option) {
  return request.get(`backend-user/sysUser/selectList`, { params: option })
}

// 查询用户--有搜索条件
export function selectUserListAllApi(option) {
  return request.get(`backend-user/sysUser/selectUserListAll`, { params: { key: option }})
}

// 删除用户
export function deleteSysUser(option) {
  return request.get(`/backend-user/sysUser/delete`, { params: option })
}

// 批量删除用户
export function deleteBatchSysUser(option) {
  return request.post(`/backend-user/sysUser/deleteBatch`, option)
}

// 查看用户详情
export function selectSysUserDetail(option) {
  return request.get(`/backend-user/sysUser/detail`, { params: option })
}

// 查看用户详情
export function editSysUser(option) {
  return request.post(`/backend-user/sysUser/edit`, option)
}

// 禁用或者启用用户
export function enableSysUser(option) {
  return request.get(`/backend-user/sysUser/enable`, { params: option })
}

// 重置用户密码
export function resetPwdSyssUser(option) {
  return request.get(`/backend-user/sysUser/resetPwd`, { params: option })
}

// 重置用户密码
export function selectUserBackdetail(option) {
  return request.get(`/backend-user/sysUser/detail`, { params: option })
}

// -----------------------------------------------系统管理-前台用户管理----------------------------------------------------------
// 查询用户
export function selectUserFrontAccountList(option) {
  return request.post(`/backend-user/user/list`, option)
}
// 查询用户
export function selectUserList(option) {
  return request.post(`/backend-user/user/searchList`, option)
}
// 查看用户详情
export function selectUserFrontDetail(option) {
  return request.get(`/backend-user/user/detail`, { params: option })
}

// 禁用或者启用用户
export function enableUserFront(option) {
  return request.get(`/backend-user/user/enable`, { params: option })
}
// 新增用户
export function addUser(option) {
  return request.post(`/backend-user/user/addUserFrontend`, option)
}
// 编辑用户
export function editUser(option) {
  return request.post(`/backend-user/user/edit`, option)
}
// 删除用户
export function deleteUser(option) {
  return request.post(`/backend-user/user/deleteBatch`, option)
}
// -----------------------------------------------系统管理-系统协议管理----------------------------------------------------------
// 查询协议列表
export function sysProtocolList(option) {
  return request.post(`/backend-admin/basicProtocolInfo/pageph`, option)
}

// 新增协议
export function sysProtocolSave(option) {
  return request.post(`/backend-admin/basicProtocolInfo/save`, option)
}

// 修改方法
export function sysProtocolEdit(option) {
  return request.post(`/backend-admin/basicProtocolInfo/update`, option)
}

// 删除方法
export function sysProtocolDelete(option) {
  return request.post(`/backend-admin/basicProtocolInfo/delete`, option)
}

// 批量删除方法
export function sysProtocolDeletes(option) {
  return request.get(`/backend-admin/basicProtocolInfo/deleteBatch`, { params: option })
}
// 禁用启用方法
export function agreementEnable(option) {
  return request.get(`/backend-admin/basicProtocolInfo/enable`, { params: option })
}
// -----------------------------------------------系统管理-系统协议一览----------------------------------------------------------
// 查询协议列表
export function sysSigningList(option) {
  return request.get(`/backend-admin/userProtocolSigningRecord/pageph`, { params: option })
}

// -----------------------------------------------系统管理-字典管理----------------------------------------------------------
// 字典新增
export function sysDictionaryAdd(option) {
  return request.post(`/backend-admin/sysDictionary/save`, option)
}

// 字典单个删除
export function sysDictionaryDeleteById(option) {
  return request.post(`/backend-admin/sysDictionary/deleteById`, option)
}

// 字典批量删除
export function sysDictionaryDeleteByIds(option) {
  return request.post(`/backend-admin/sysDictionary/deleteByIds`, option)
}

// 字典更新
export function sysDictionaryUpdateById(option) {
  return request.post(`/backend-admin/sysDictionary/updateById`, option)
}

// 字典查询接口
export function sysDictionaryPageph(option) {
  return request.post(`/backend-admin/sysDictionary/pageph`, option)
}

// -----------------------------------------------系统管理-字典值管理----------------------------------------------------------
// 字典新增
export function sysDictionaryValueAdd(option) {
  return request.post(`/backend-admin/sysDictionaryValue/save`, option)
}

// 字典单个删除
export function sysDictionaryValueDeleteById(option) {
  return request.post(`/backend-admin/sysDictionaryValue/deleteById`, option)
}

// 字典批量删除
export function sysDictionaryValueDeleteByIds(option) {
  return request.post(`/backend-admin/sysDictionaryValue/deleteByIds`, option)
}

// 字典更新
export function sysDictionaryValueUpdateById(option) {
  return request.post(`/backend-admin/sysDictionaryValue/updateById`, option)
}

// 字典查询接口
export function sysDictionaryValuePageph(option) {
  return request.post(`/backend-admin/sysDictionaryValue/pageph`, option)
}

// 字典查询 接口 -- 对外接口
export function selectgetDictionaryBykeyApi(option) {
  return request.get(`/backend-admin/sysDictionary/getDictionaryBykey`, { params: option })
}

// -----------------------------------------------系统管理-流程管理----------------------------------------------------------
// 主流程新增
export function approvalFlowAdd(option) {
  return request.post(`/backend-admin/approvalFlow/save`, option)
}

// 主流程单个删除
export function approvalFlowDeleteById(option) {
  return request.post(`/backend-admin/approvalFlow/deleteById`, option)
}

// 主流程批量删除
export function approvalFlowDeleteByIds(option) {
  return request.post(`/backend-admin/approvalFlow/deleteByIds`, option)
}

// 主流程更新
export function approvalFlowUpdateById(option) {
  return request.post(`/backend-admin/approvalFlow/updateById`, option)
}

// 主流程查询接口
export function approvalFlowPageph(option) {
  return request.post(`/backend-admin/approvalFlow/pageph`, option)
}

// -----------------------------------------------系统管理-流程节点管理----------------------------------------------------------
// 主流程新增
export function approvalFlowNodeAdd(option) {
  return request.post(`/backend-admin/approvalFlowNode/save`, option)
}

// 主流程单个删除
export function approvalFlowNodeDeleteById(option) {
  return request.post(`/backend-admin/approvalFlowNode/deleteById`, option)
}

// 主流程批量删除
export function approvalFlowNodeDeleteByIds(option) {
  return request.post(`/backend-admin/approvalFlowNode/deleteByIds`, option)
}

// 主流程更新
export function approvalFlowNodeUpdateById(option) {
  return request.post(`/backend-admin/approvalFlowNode/updateById`, option)
}

// 主流程查询接口
export function approvalFlowNodePageph(option) {
  return request.post(`/backend-admin/approvalFlowNode/pageph`, option)
}

// 审批流程选择
export function approvalSelectList(option) {
  return request.post(`/backend-admin/approvalFlow/selectList`, option)
}

// 审批流程选择
export function getApprovalWaitList(option) {
  return request.get(`/backend-admin/approvalProcess/selectDone`, { params: option })
}

// 审批流程选择(新)
export function getAgendaItemList(option) {
  return request.get(`/backend-admin/agendaItem/pageph`, { params: option })
}

// 审批历史列表
export function getApprovalHistoryList(option) {
  return request.post(`/backend-admin/approvalFlowNodeRecording/selectList`, option)
}

// 审批接口
export function approvalFlow(option) {
  return request.post(`/backend-admin/approvalFlowNodeRecording/save`, option)
}

// 审批接口
export function departmentSort(option) {
  return request.post(`/backend-admin/department/updateDepSequenceListAll`, option)
}

// -------------------------------备忘提醒功能------------------------------------

// 新增-备忘提醒数据
export function saveMemoRemindApi(option) {
  return request.post(`/backend-admin/sysMemoRemind/saveMemoRemind`, option)
}

// 通过ids进行备忘提醒主表批量删除
export function deleteMemoRemindByIdsApi(option) {
  return request.post(`/backend-admin/sysMemoRemind/deleteMemoRemindByIds`, option)
}

// 分页查询-我的发送列表数据
export function selectMemoRemindListApi(option) {
  return request.post(`/backend-admin/sysMemoRemind/selectMemoRemindList`, option)
}

// 分页查询-我的提醒列表数据
export function selectMemoRemindUserListApi(option) {
  return request.post(`/backend-admin/sysMemoRemindUser/selectMemoRemindUserList`, option)
}

// 更改处理状态
export function updateDisposeStatusApi(option) {
  return request.get(`/backend-admin/sysMemoRemindUser/updateDisposeStatus`, { params: option })
}

// ---------------------------------通知任务--------------------------------------

// 新增通知任务
export function saveNoticeTimingTask(option) {
  return request.post(`/backend-notification/sysNoticeTimingTask/saveNoticeTimingTask`, option)
}

// 查看通知任务详情
export function detailNoticeTimingTask(option) {
  return request.get(`/backend-notification/sysNoticeTimingTask/detailNoticeTimingTask`, { params: option })
}

// 删除通知任务
export function deleteNoticeTimingTask(option) {
  return request.post(`/backend-notification/sysNoticeTimingTask/deleteNoticeTimingTask`, option)
}

// 删除通知任务(批量)
export function deleteNoticeTimingTaskByIds(option) {
  return request.post(`/backend-notification/sysNoticeTimingTask/deleteNoticeTimingTaskByIds`, option)
}

// 编辑通知任务
export function updateNoticeTimingTask(option) {
  return request.post(`/backend-notification/sysNoticeTimingTask/updateNoticeTimingTask`, option)
}

// 查看通知任务列表(分页)
export function pagephNoticeTimingTask(option) {
  return request.post(`/backend-notification/sysNoticeTimingTask/pagephNoticeTimingTask`, option)
}

// 查看通知任务接受方(分页)
export function pagephNoticeTaskRecipient(option) {
  return request.get(`/backend-notification/sysNoticeTaskRecipient/pagephNoticeTaskRecipient`, { params: option })
}

// ---------------------------------通知任务模版--------------------------------------
// 新增通知模版
export function saveNoticeTemplate(option) {
  return request.post(`/backend-notification/sysNoticeTemplate/saveNoticeTemplate`, option)
}

// 通过id单个删除模版
export function deleteNoticeTemplate(option) {
  return request.post(`/backend-notification/sysNoticeTemplate/deleteNoticeTemplate`, option)
}

// 批量删除模版
export function deleteBatchNoticeTemplate(option) {
  return request.post(`/backend-notification/sysNoticeTemplate/deleteBatchNoticeTemplate`, option)
}

// 修改模版
export function updateNoticeTemplate(option) {
  return request.post(`/backend-notification/sysNoticeTemplate/updateNoticeTemplate`, option)
}

// 查询模版列表
export function pagephNoticeTemplate(option) {
  return request.post(`/backend-notification/sysNoticeTemplate/pagephNoticeTemplate`, option)
}

// 查询模版列表
export function selectControlTowerByTypeList(option) {
  return request.get(`/backend-admin/workflowNode/selectWorkflowNodeList`, { params: option })
}

// 启用或者禁用模版
export function enableNoticeTemplate(option) {
  return request.get(`/backend-notification/sysNoticeTemplate/enable`, { params: option })
}

// 查询模版列表
export function listNoticeTemplate(option) {
  return request.post(`/backend-notification/sysNoticeTemplate/listNoticeTemplate`, option)
}

// 获取邮件配置
export function getOneSysNoticeEmailConfig(option) {
  return request.post(`/backend-admin/sysNoticeEmailConfig/getOne`, option)
}

// 新增或更新邮件配置
export function saveOrUpdateSysNoticeEmailConfig(option) {
  return request.post(`/backend-admin/sysNoticeEmailConfig/saveOrUpdate`, option)
}

// 测试发送邮件
export function testSysNoticeEmailConfig(option) {
  return request.post(`/backend-admin/sysNoticeEmailConfig/testSysNoticeEmailConfig`, option)
}

// 查收系统通知记录
export function pagephNoticeRecording(option) {
  return request.post(`/backend-admin/sysNoticeRecording/pagephNoticeRecording`, option)
}

// 更新待办事项状态
export function updateAgendaItem(option) {
  return request.post(`/backend-admin/agendaItem/updateAgendaItem`, option);
}
