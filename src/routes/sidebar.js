/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
  },
  {
    icon: 'PeopleIcon',
    name: 'Manage Accounts',
    routes: [
      // submenu
      {
        path: '/app/admins',
        name: 'Admins',
      },
      {
        path: '/app/mechanics',
        name: 'Mechanics',
      },
      {
        path: '/app/users',
        name: 'Users (Vehicle Owners)',
      }
    ],
  },
  {
    icon: 'GearsIcon',
    name: 'Spare Parts Library',
    routes: [
      // submenu
      {
        path: '/app/spare-parts',
        name: 'Manage Items',
      },
      {
        path: '/app/approve-parts',
        name: 'Approve Items',
      }
    ]
  },
  {
    icon: 'FormsIcon',
    name: 'Generate Reports',
    routes: [
      // submenu
      {
        path: '/app/service-reports',
        name: 'Services Reports',
      },
      {
        path: '',
        name: 'Mechanic Reports',
      },
      {
        path: '',
        name: 'User Reports',
      }
    ]
  },
  {
    path: '/app/forms',
    icon: 'FormsIcon',
    name: 'Forms',
  },
  {
    path: '/app/cards',
    icon: 'CardsIcon',
    name: 'Cards',
  },
  {
    path: '/app/charts',
    icon: 'ChartsIcon',
    name: 'Charts',
  },
  {
    path: '/app/buttons',
    icon: 'ButtonsIcon',
    name: 'Buttons',
  },
  {
    path: '/app/modals',
    icon: 'ModalsIcon',
    name: 'Modals',
  },
  {
    path: '/app/tables',
    icon: 'TablesIcon',
    name: 'Tables',
  },
]

export default routes
