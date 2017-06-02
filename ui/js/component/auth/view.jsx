import React from 'react'
import {BusyMessage} from 'component/common'
import UserEmailNew from 'component/userEmailNew'
import UserEmailVerify from 'component/userEmailVerify'

export class Auth extends React.Component {
  render() {
    const {
      isPending,
      existingEmail,
      user,
    } = this.props

    console.log('auth render')
    console.log(this.props)

    if (isPending) {
      return <BusyMessage message="Authenticating" />
    } else if (!existingEmail && !user.has_email) {
      return <UserEmailNew />
    } else if (!user.has_verified_email) {
      return <UserEmailVerify />
    } else {
      return <span className="empty">Auth is done fix this yo</span>
    }
  }
}

export default Auth
