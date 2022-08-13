// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';

const SeniorBackendEngineerPage = () => {
  return (
    <Page>
      <Card
        body={
          <>
            <section className="section card--section">
              <h1 className="card__title" style={{ fontSize: '28px', marginBottom: '10px' }}>
                Senior Backend Engineer @ Odysee
              </h1>
              <p>
                We are looking for an ambitious and self-driven Backend Engineer to join our team. As a Senior Backend
                Engineer, you will be responsible for creating and managing backend systems for Odysee. At Odysee, you
                will be welcomed into a supportive and friendly (virtual) team and you will have the chance to explore
                and learn new skills. Odysee.com is the largest blockchain media platform in the world; after launching
                in December 2020, Odysee has been scaling significantly and is now looking to add a Senior Backend
                Engineer who will be helping the Scalability/Architecture in line with the ever growing needs of the
                platform. Backend systems will include but not limited to; blockchain intermediate, commenting, user
                management, internal company APIs, marketing integrations, live streaming, VOD streaming, SSO and much
                more fun and exciting services with Go as the bedrock.
              </p>
            </section>

            <section className="section card--section">
              <h1 className="card__title">You will be a pro at:</h1>
              <ul>
                <li>Building and maintaining Odysee backend systems</li>
                <li>Using and leveraging the Go programming language</li>
                <li>Creating technical documentation for the team</li>
                <li>Being responsive and well organized</li>
                <li>
                  Managing your time well while working with the demands of a worldwide team from the comfort of home.
                </li>
                <li>Owning a project from concept to production, including proposal, discussion, and execution.</li>
                <li>
                  Participating in key technical and architectural decisions as a member of the core development team.
                </li>
                <li>Taking the lead. We want owners not participants.</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">In terms of skills & experience:</h1>
              <ul>
                <li>3+ years writing/maintaining Golang based backend services</li>
                <li>Excellent experience in integrating with MySQL databases</li>
                <li>Excellent experience with scripting and automation tools</li>
                <li>Experience with CI/CD technologies (especially working with GH Actions and Docker)</li>
                <li>BA in Computer Science or similar relevant field (or additional 2 years experience)</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">Bonus skills & experience:</h1>
              <ul>
                <li>Experience with Linux/Unix and scripting languages like Python, shell scripting, etc.</li>
                <li>Kubernetes knowledge</li>
                <li>Familiarity of Web Server technologies including NGINX, Apache and or Caddy</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">What we offer:</h1>
              <ul>
                <li>Work from home</li>
                <li>{'A small (<100) team of passionate individuals'}</li>
                <li>The opportunity to build something truly great with great people</li>
                <li>Competitive salary</li>
                <li>Flexible work hours</li>
              </ul>
            </section>

            <h1 style={{ marginTop: '30px', fontSize: '18px' }}>
              To apply, please send your credentials to
              <a className="careers-mail-link" href="mailto:careers@odysee.com">
                {' '}
                careers@odysee.com
              </a>
            </h1>
          </>
        }
      />
    </Page>
  );
};

export default SeniorBackendEngineerPage;
