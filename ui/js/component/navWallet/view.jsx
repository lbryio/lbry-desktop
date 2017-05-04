import React from 'react';
import NavMain from 'component/navMain'

export const NavWallet = () => {
  return <NavMain links={{
   'wallet': 'Overview',
   'send': 'Send',
   'receive': 'Receive',
   'rewards': 'Rewards'
 }} />
}

export default NavWallet