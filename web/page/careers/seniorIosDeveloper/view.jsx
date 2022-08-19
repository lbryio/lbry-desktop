// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';

const SeniorIosDeveloperPage = () => {
  return (
    <Page>
      <Card
        body={
          <>
            <section className="section card--section">
              <h1 className="card__title" style={{ fontSize: '28px', marginBottom: '10px' }}>
                Senior iOS Developer @ Odysee
              </h1>
              <p>
                We are looking for an ambitious and self-driven iOS Developer to join our team. As a Senior iOS
                Developer, you will be responsible for designing and delivering the Odysee iOS app. Your role will be
                critical in creating an intuitive and user friendly user experience for all of the creators and viewers
                that use Odysee on iOS. At Odysee, you will be welcomed into a supportive and friendly (virtual) team
                and you will have the chance to lead many critical projects as they pertain to mobile. Odysee.com is the
                largest blockchain media platform in the world; after launching in December 2020, Odysee has been
                scaling significantly and is now looking to add a Senior iOS Developer with modern design aesthetics and
                who is an avid media junkie to its ranks.
              </p>
            </section>

            <section className="section card--section">
              <h1 className="card__title">You will be a pro at:</h1>
              <ul>
                <li>Having a keen eye for performance issues and performant design.</li>
                <li>
                  Creating amazing user experiences for all iOS enabled devices from a minimal set of requirements
                  because it’s just in your blood.
                </li>
                <li>Picking up and executing tasks that are completely unrelated without missing a beat.</li>
                <li>
                  Managing your time well while working with the demands of a worldwide team from the comfort of home.
                </li>
                <li>
                  Working well with the back end teams to provide the right requirements to support the user experience
                  as envisioned.
                </li>
                <li>Fixing bugs as they arise.</li>
                <li>Deploying hotfixes.</li>
                <li>Taking the lead. We want owners not participants.</li>
                <li>Ensuring resiliency in the codebase because you too hate 1AM emergencies.</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">In terms of skills & experience:</h1>
              <ul>
                <li>5+ years of recent experience as an iOS Developer</li>
                <li>Excellent knowledge of mobile troubleshooting and debugging practices and techniques</li>
                <li>You have published at least one or more iOS apps in the Play store</li>
                <li>
                  Deep understanding of the general mobile landscape, architectures, trends, and emerging technologies.
                </li>
                <li>Efficient Knowledge of graphics software(not a pro, but not reliant on others).</li>
                <li>Critical thinker and problem-solving skills</li>
                <li>Team player</li>
                <li>Good time-management skills</li>
                <li>Great interpersonal and communication skills</li>
                <li>BA in Computer Science or similar relevant field(or additional 4 years experience)</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">Bonus skills & experience:</h1>
              <ul>
                <li>Led a team of developers in the past</li>
                <li>Implemented at the enterprise scale (50 million users)</li>
                <li>Familiarity with App Store procedures and policies.</li>
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

export default SeniorIosDeveloperPage;
