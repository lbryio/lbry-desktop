// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';

const Code2257Page = () => {
  return (
    <Page>
      <Card
        title="18 USC 2257 Statement: lbry.tv"
        body={
          <div>
            <p>
              lbry.tv is not a producer (primary or secondary) of any and all of the content found on the website
              (lbry.tv). With respect to the records as per 18 USC 2257 for any and all content found on this site,
              please kindly direct your request to the site for which the content was produced.
            </p>
            <p>
              lbry.tv is a video sharing site in which allows for the uploading, sharing and general viewing of various
              types of adult content and while lbry.tv does the best it can with verifying compliance, it may not be
              100% accurate.
            </p>
            <p>
              lbry.tv abides by the following procedures to ensure compliance:
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
              lbry.tv compliance at copyright@lbry.com
            </p>
            <p>
              Users of lbry.tv who come across such content are urged to flag it as inappropriate by clicking 'Report
              this video' link found below each video.
            </p>
          </div>
        }
      />
    </Page>
  );
};
export default Code2257Page;
