import React from 'react'
import Auth from 'component/auth'

export class AuthPage extends React.Component {
  render() {
    return <main className="main--single-column">
      <section className="card">
        <div className="card__inner">
          <div className="card__title-identity"><h1>Early Access Verification</h1></div>
        </div>
        <div className="card__content">
          <Auth />
        </div>
      </section>
    </main>
  }
}

export default AuthPage