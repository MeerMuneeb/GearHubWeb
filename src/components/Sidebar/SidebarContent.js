import React from 'react'
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
import SidebarSubmenu from './SidebarSubmenu'
import { Button } from '@windmill/react-ui'
import { useHistory } from 'react-router-dom';

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

function SidebarContent() {  
  const history = useHistory(); 
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    history.push('/login');
  };

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400 h-full">
      <div className='flex flex-col justify-between h-full'>
        <div className="flex-grow">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="/app/dashboard">
            <div className="flex justify-center items-center">
              <img src="/Logo2.png" alt="Logo" className="h-8 w-auto" />
            </div>
          </a>
          <ul className="mt-6">
            {routes.map((route) =>
              route.routes ? (
                <SidebarSubmenu route={route} key={route.name} />
              ) : (
                <li className="relative px-6 py-3" key={route.name}>
                  <NavLink
                    exact
                    to={route.path}
                    className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                    activeClassName="text-gray-800 dark:text-gray-100"
                  >
                    <Route path={route.path} exact={route.exact}>
                      <span
                        className="absolute inset-y-0 left-0 w-1 bg-gray-600 rounded-tr-lg rounded-br-lg"
                        aria-hidden="true"
                      ></span>
                    </Route>
                    <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
                    <span className="ml-4">{route.name}</span>
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="px-6 my-6">
           <Button onClick={handleLogout} size='small' layout="outline" className="flex border-red-600 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:text-white hover:text-white justify-center items-center"><p className='text-sm font-semibold'>LOG OUT </p><Icons.LogoutIcon className='ml-1 h-6 w-6'/></Button>
        </div>
      </div>
    </div>

  )
}

export default SidebarContent
