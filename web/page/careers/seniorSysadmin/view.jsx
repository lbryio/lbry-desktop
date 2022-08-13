// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';

const SeniorSysadminPage = () => {
  return (
    <Page>
      <Card
        body={
          <>
            <section className="section card--section">
              <h1 className="card__title" style={{ fontSize: '28px', marginBottom: '10px' }}>
                Senior Sysadmin @ Odysee
              </h1>
              <p>
                We are looking for an ambitious and self-driven Sysadmin to join our team. As a Senior Sysadmin, you
                will be responsible for deploying and maintaining the server infrastructure that Odysee uses. Your role
                will be critical in ensuring the needs of the team as well as maintaining order and stability so that
                the team can count on the infrastructure to run their software. At Odysee, you will be welcomed into a
                supportive and friendly (virtual) team and you will have the chance to explore and learn new skills.
                Odysee.com is the largest blockchain media platform in the world; after launching in December 2020,
                Odysee has been scaling significantly and is now looking to add a Senior Sysadmin who will be helping
                with the ever growing needs of maintenance on the infrastructure.
              </p>
            </section>

            <section className="section card--section">
              <h1 className="card__title">You will be a pro at:</h1>
              <ul>
                <li>Maintaining, installing, configuring, operating Linux servers (mostly Ubuntu)</li>
                <li>Installing, configuring software</li>
                <li>Using ansible to setup new servers</li>
                <li>Troubleshooting hardware and software errors</li>
                <li>Following and providing technical documentation for the team</li>
                <li>Planning hardware requirements for new servers</li>
                <li>Minimizing wastes (unnecessary servers, resources)</li>
                <li>Being responsive and well organized</li>
                <li>
                  Managing your time well while working with the demands of a worldwide team from the comfort of home.
                </li>
                <li>Working well with the other teams to provide the right equipment as fast as possible.</li>
                <li>Fixing bugs as they arise.</li>
                <li>Taking the lead. We want owners not participants.</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">In terms of skills & experience:</h1>
              <ul>
                <li>5+ years of recent experience as a Sysadmin</li>
                <li>Excellent knowledge of Ubuntu (or Debian based) systems (18.04+)</li>
                <li>Excellent knowledge of ansible</li>
                <li>
                  You have installed and managed several baremetal production servers for an extended period of time
                </li>
                <li>You have worked with OVHCloud, Datapacket or similar providers</li>
                <li>Good knowledge of the AWS stack (EC2, S3, RDS mostly)</li>
                <li>Experience with virtualization (i.e. in the use of Proxmox, vSphere, Hyper-V)</li>
                <li>Excellent experience with scripting and automation tools</li>
                <li>Experience with managing domain names (Cloudflare)</li>
                <li>Experience with either Nginx, Caddy or Apache</li>
                <li>Knowledge of Git</li>
                <li>BA in Computer Science or similar relevant field (or additional 2 years experience)</li>
              </ul>
            </section>

            <section className="section card--section">
              <h1 className="card__title">Bonus skills & experience:</h1>
              <ul>
                <li>Programming knowledge (Go,C,C++,Python,NodeJS)</li>
                <li>MySQL Language knowledge</li>
                <li>You have managed servers with high network throughput (10+Gbps)</li>
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

export default SeniorSysadminPage;
