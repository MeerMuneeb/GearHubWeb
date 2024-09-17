import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Forms = lazy(() => import('../pages/Forms'))
const Cards = lazy(() => import('../pages/Cards'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const Modals = lazy(() => import('../pages/Modals'))
const Tables = lazy(() => import('../pages/Tables'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))
const Admins = lazy(() => import('../pages/Admins'))
const Mechanics = lazy(() => import('../pages/Mechanics'))
const Users = lazy(() => import('../pages/Users'))
const SpareParts = lazy(() => import('../pages/SpareParts'))
const ApproveParts = lazy(() => import('../pages/ApproveParts'))
const VerifyMechanic = lazy(() => import('../pages/VerifyMechanic'))
const ServiceReports = lazy(() => import('../pages/ServiceReports'))
const ServiceDetails = lazy(() => import('../pages/ServiceDetails'))
const UserDetails = lazy(() => import('../pages/UserDetails'))
const Support = lazy(() => import('../pages/Support'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/service-reports', // the url
    component: ServiceReports, // view rendered
  },
  {
    path: '/admins', // the url
    component: Admins, // view rendered
  },
  {
    path: '/users', // the url
    component: Users, // view rendered
  },
  {
    path: '/mechanics', // the url
    component: Mechanics, // view rendered
  },
  {
    path: '/support', // the url
    component: Support, // view rendered
  },
  {
    path: '/forms',
    component: Forms,
  },
  {
    path: '/spare-parts',
    component: SpareParts,
  },
  {
    path: '/approve-parts',
    component: ApproveParts,
  },
  {
    path: '/cards',
    component: Cards,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/modals',
    component: Modals,
  },
  {
    path: '/tables',
    component: Tables,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/mechanic/:mechanicID',
    component: VerifyMechanic,
  },
  {
    path: '/service/:serviceID',
    component: ServiceDetails,
  },
  {
    path: '/user/:userID',
    component: UserDetails,
  }
]

export default routes
