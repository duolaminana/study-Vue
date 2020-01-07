const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  size: state => state.app.size,
  token: state => state.user.token,
  errorLogs: state => state.errorLog.logs,
  userInfo: state => state.user.userInfo,
  language: state => state.app.language,
  permission_routes: state => state.permission.routes
}
export default getters
