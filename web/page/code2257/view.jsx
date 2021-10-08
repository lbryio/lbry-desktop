// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';

const Code2257Page = () => {
  return (
    <Page>
      <Card
        title="18 USC 2257 Statement: odysee.com"
        body={
          <div>
            <p>
              odysee.com is not a producer (primary or secondary) of any and all of the content found on the website
              (odysee.com). With respect to the records as per 18 USC 2257 for any and all content found on this site,
              please kindly direct your request to the site for which the content was produced.
            </p>
            <p>
              odysee.com is a video sharing site in which allows for the uploading, sharing and general viewing of
              various types of adult content and while odysee.com does the best it can with verifying compliance, it may
              not be 100% accurate.
            </p>
            <p>
              odysee.com abides by the following procedures to ensure compliance:
              <ul>
                <li>Requiring all users to be 18 years of age to upload videos.</li>
                <li>
                  When uploading, user must verify the content; assure he/she is 18 years of age; certify that he/she
                  keeps records of the models in the content and that they are over 18 years of age.
                </li>
              </ul>
            </p>
            <p>
              For further assistance and/or information in finding the content's originating site, please contact
              odysee.com compliance at hello@odysee.com
            </p>
            <p>
              Users of odysee.com who come across such content are urged to flag it as inappropriate by clicking 'Report
              this video' link found below each video.
            </p>
          </div>
        }
      />
    </Page>
  );
};
export default Code2257Page;
