// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';

const ITManagersPage = () => {
  return (
    <Page>
      <Card
        body={
          <>
            <section className="section card--section">
              <h1 className="card__title" style={{ fontSize: '28px', marginBottom: '10px' }}>
                IT Project Manager @ Odysee
              </h1>
              <p>
                We are looking for an ambitious and self-driven IT Project Manager to join our team. As an IT PM, you
                will be responsible for coordinating people and processes to ensure that our software projects are
                delivered on time. At Odysee, you will be welcomed into a supportive and friendly (virtual) team and you
                will have the chance to explore and learn new skills. Odysee.com is the largest blockchain media
                platform in the world; after launching in December 2020, Odysee has been scaling significantly and is
                now looking to add an IT PM who will be the go-to person for everything involving the organization and
                delivery of our various software projects.
              </p>
            </section>

            <section className="section card--section">
              <h1 className="card__title">You will be a pro at:</h1>
              <ul>
                <li>Communicating with team members from different technical teams and of different backgrounds.</li>
                <li>
                  Coordinating people, teams, and third parties/vendors for the flawless execution and delivery of
                  projects.
                </li>
                <li>Ensuring that all projects are delivered on-time and within scope.</li>
                <li>
                  Developing project scopes and objectives, involving all relevant stakeholders and ensuring technical
                  feasibility.
                </li>
                <li>Developing detailed project plans to track progress.</li>
                <li>
                  Providing hands-on project management during analysis, design, development, testing, implementation,
                  and post-implementation/delivery phases.
                </li>
                <li>Measuring project performance using appropriate systems, tools and techniques.</li>
                <li>Creating and maintaining comprehensive project documentation.</li>
                <li>Performing risk management to minimize project risks.</li>
                <li>Reporting and escalating to management as needed.</li>
                <li>Being responsive and well organized.</li>
                <li>
                  Managing your time well while working with the demands of a worldwide team from the comfort of home.
                </li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">In terms of skills & experience:</h1>
              <ul>
                <li>3+ years of recent experience as a Technical Project Manager.</li>
                <li>
                  Proven working experience as a Technical PM or Project Administrator within the wider Tech industry.
                </li>
                <li>
                  3+ years of software engineering, systems engineering, program/product management, or similar
                  experience.
                </li>
                <li>Experience operating autonomously across multiple teams.</li>
                <li>You have some kind of PM qualification (e.g. Agile, Scrum, Kanban, etc).</li>
                <li>Solid experience working with various task and project management tools, e.g. Monday.</li>
                <li>Knowledge of Git.</li>
                <li>BA in Computer Science or similar relevant field (or additional 2 years experience).</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">Bonus skills & experience:</h1>
              <ul>
                <li>Programming knowledge (Go,C,C++,Python,NodeJS)</li>
                <li>You’ve worked in the entertainment industry in a technical role</li>
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
                <li>Work from home</li>
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

export default ITManagersPage;
