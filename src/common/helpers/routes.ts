import { AppRoute } from 'src/routes'

export const findRoute = (routes: AppRoute[], name: string): AppRoute | undefined => {
  for (const route of routes) {
    if (route.name === name) {
      return route
    }

    if (route.routes?.length) {
      const child = findRoute(route.routes, name)
      if (child) {
        return child
      }
    }
  }
}
