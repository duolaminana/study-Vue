import path from 'path'
export default {
  data() {
    return {
      routes: []
    }
  },
  computed: {
    roleRoutes() {
      return this.$store.state.permission.roleRoutes
    }
  },
  mounted() {
    // this.getRoutes()
  },
  methods: {
    getRoutes() {
      const routes = this.generateRoutes(this.roleRoutes)
      this.routes = routes;
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        // if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title || route.menuTitle,
          menuId: route.bid
        };

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      // const showingChildren = children.filter(item => !item.hidden)
      const showingChildren = children;

      // When there is only one child route, the child route is displayed by default
      // if (showingChildren.length === 1) {
      //   onlyOneChild = showingChildren[0]
      //   onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
      //   return onlyOneChild
      // }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
