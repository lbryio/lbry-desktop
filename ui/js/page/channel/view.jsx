import React from 'react';

const ChannelPage = (props) => {
  const {
    title
  } = props

  return <main className="main--single-column">
    <section className="card">
      <div className="card__inner">
        <div className="card__title-identity"><h1>{title}</h1></div>
      </div>
      <div className="card__content">
        <p>
          This channel page is a stub.
        </p>
      </div>
    </section>
  </main>
}

export default ChannelPage;
