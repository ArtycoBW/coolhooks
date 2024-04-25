import { useRoutes } from 'react-router-dom'
import React from 'react'
import HomeView from './views/Home'
import ScrapView from './views/Scrap'
import { findRoute } from './common/helpers/routes'

interface AppRouteParams {
  [key: string]: string | number | boolean | null | undefined
}

export interface AppRoute {
  name: string
  path: string
  component: (props: unknown) => JSX.Element | null
  routes?: AppRoute[]
  params?: AppRouteParams
}

const ROUTE_NAMES = {
  HOME: 'home',
  SCRAP: 'scrap',
}

export const routes: AppRoute[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomeView,
  },
  {
    path: '/scrap',
    name: ROUTE_NAMES.SCRAP,
    component: ScrapView,
  },
]

export const HOME = findRoute(routes, ROUTE_NAMES.HOME) as AppRoute
export const SCRAP = findRoute(routes, ROUTE_NAMES.SCRAP) as AppRoute

const Routes = () => {
  const routes = useRoutes([
    { path: '*', element: <div>Тут ничего нет</div> },
    { path: HOME.path, element: <HomeView /> },
    {
      path: SCRAP.path,
      element: <ScrapView />,
    },
  ])

  return <div>{routes}</div>
}

export default Routes
