import React from 'react';
import NavMain from 'component/navMain'

export const NavSettings = () => {
  return <NavMain links={{
    'settings': 'Settings',
    'help' : 'Help'
  }} />;
}

export default NavSettings