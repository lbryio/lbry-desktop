// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';

const SoftwareSecurityEngineerPage = () => {
  return (
    <Page>
      <Card
        body={
          <>
            <section className="section card--section">
              <h1 className="card__title" style={{ fontSize: '28px', marginBottom: '10px' }}>
                Software Security Engineer @ Odysee
              </h1>
              <p>
                We are looking for a risk averse and committed Software Security Engineer to analyse software designs
                and implementations from a security perspective, and identify and resolve security issues. At Odysee,
                you will be welcomed into a supportive and friendly (virtual) team and you will have the chance to lead
                many critical projects as they pertain to security. Odysee.com is the largest blockchain media platform
                in the world; after launching in December 2020, Odysee has been scaling significantly and is now looking
                to add a Software Security Engineer to the team who wants to help us change the media paradigm for the
                better.
              </p>
            </section>

            <section className="section card--section">
              <h1 className="card__title">You will be a pro at:</h1>
              <ul>
                <li>
                  Implementing, testing and operating advanced software security techniques in compliance with technical
                  reference architecture.
                </li>
                <li>
                  Performing on-going security testing and code review to improve software security troubleshooting and
                  debugging issues that arise.
                </li>
                <li>
                  Providing engineering designs for new software solutions to help mitigate security vulnerabilities.
                </li>
                <li>Contributing to all levels of the architecture.</li>
                <li>Developing detailed project plans to track progress.</li>
                <li>Maintaining technical documentation.</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">In terms of skills & experience:</h1>
              <ul>
                <li>Proven work experience as a software security engineer.</li>
                <li>
                  Detailed technical knowledge of techniques, standards and state-of-the art capabilities for
                  authentication and authorization, applied cryptography, security vulnerabilities and remediation.
                </li>
                <li>
                  Software development experience in one of the following core languages: Javascript, Golang, Python.
                </li>
                <li>
                  Adequate knowledge of web related technologies (Web applications, Web Services and Service Oriented
                  Architectures) and of network/web related protocols.
                </li>
                <li>Interest in all aspects of security research and development.</li>
                <li>Degree in Computer Science or related field.</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">Bonus skills & experience:</h1>
              <ul>
                <li>Deeper programming knowledge (Go,C,C++,Python,NodeJS).</li>
                <li>Experience with Docker and Kubernetes.</li>
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

export default SoftwareSecurityEngineerPage;
