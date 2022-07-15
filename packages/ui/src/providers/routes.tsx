import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { modules } from '~/providers/modules'
import Home from '~/modules/home/Home'

/**
 * Creates a set of routes for exposed modules.
 */
export const createRoutes = () => [
  {
    path: '*',
    element: Home,
    routes: [],
  },
  ...modules.map(({ route: { path, element, routes = [] } }) => ({
    path,
    element,
    routes,
  })),
]

/**
 * Application Router.
 */
export function Router() {
  const location = useLocation()
  const routes = createRoutes()

  return (
    <Routes location={location}>
      {routes.map(({ path, element: Component, routes }) => (
        <Route path={path} key={path} element={<Component />}>
          {routes.map(({ index, path: subpath, element: SubComponent }) => (
            <Route
              index={index}
              path={subpath}
              key={`${path}/${subpath}`}
              element={<SubComponent />}
            />
          ))}
        </Route>
      ))}
    </Routes>
  )
}
