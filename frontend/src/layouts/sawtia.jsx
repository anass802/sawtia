import React, { createContext, useContext, useState } from 'react'
import Sidebar from '../components/sidebar';
import Header from '../components/Header';
import {Outlet} from 'react-router-dom';
export const LayoutContext=createContext()
export const useLayout=()=>useContext(LayoutContext)

const Sawtia = () => {
    const [pageTitle, setPageTitle] = useState('Dashboard')
  return (
    <LayoutContext.Provider value={{ pageTitle, setPageTitle }}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header title={pageTitle} />
          <div style={{ flex: 1, overflow: 'auto',padding:'24px' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  )
}
export default Sawtia
