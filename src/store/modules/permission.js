import { asyncRoutes, constantRoutes } from '@/router'
import { getRoleMenu } from '@/api/user'
import Layout from '@/layout'

/**
 * 通过meta.perms判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 通过path判断是否显示在菜单栏上
 * @param path
 * @param path
 */
function hasShow(path) {
  let pathShow = ['addCategoryModal', 'detailCategoryModal', 'addProduct', 'editProduct', 'detailProduct',
    'communicationRecord', 'communication', 'dictionaryValue', 'approvalFlowNode', 'editModifyPrice', 'detailModifyPrice',
    'editSupplierModifyPrice', 'detailSupplierModifyPrice', 'editInquiry', 'editQuoted', 'detailQuoted', 'approvalSalePrice',
    'approvalSupplierPrice', 'quoteApproval', 'editOrder', 'saleOrderDetail', 'saleOrderApproval', 'buyOrderApproval', 'relevantFiles',
    'editPayRecord', 'editPurchaseOrder', 'detailPurchaseOrder', 'addPurchaseOrder', 'saleOrderStock', 'saleOrderDelivery', 'saleOrderCheck',
    'saleOrderSignFor', 'carriage', 'arrival', 'purchaseOrderStock', 'purchaseOrderDelivery', 'purchaseOrderCheck', 'purchaseOrderSignFor'];
  return pathShow.includes(path)
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  });

  return res
}

function transformPath(component) {
  return {
    component: () => import(`@/views/${component}`)
  }
}

/**
 * 获取的动态数据转换为可用的路由
 * @param route
 */
function trueRouters(routes = []) {
  routes.map(e => {
    e.hidden66 = hasShow(e.path);
    if (e.root) {
      e.component = Layout;
      e.path = '/' + e.path;
    } else {
      let component = transformPath(e.component);
      e.component = component.component
    }
    e.name = e.path + (new Date().getTime() + +(Math.random() * 1000).toFixed(0));
    if (e.children && e.children.length) {
      trueRouters(e.children)
    } else {
      e.children = []
    }
  });
  return routes
}

const state = {
  routes: [],
  addRoutes: [],
  roleRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROLEROUTES: (state, routes) => {
    state.roleRoutes = trueRouters(routes);
  },
  REMOVE_ROLEROUTES: (state) => {
    state.roleRoutes = [];
  }
};

const actions = {
  getAsyncRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getRoleMenu().then(res => {
        let trueRoutes = trueRouters(res.data);
        commit('SET_ROUTES', trueRoutes);
        resolve(trueRoutes)
      }).catch(error => {
        reject(error)
      })
      // commit('SET_ROUTES', []);
    })
  },
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes;
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes)
    })
  }
}

export default {
  // namespaced: true,
  state,
  mutations,
  actions
}
