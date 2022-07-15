// @flow
import React from 'react';
import Page from 'component/page';
import Card from 'component/common/card';

const TOSPage = () => {
  return (
    <Page>
      <Card
        title="Terms of Service"
        body={
          <div>
            <p>
              <strong>Last Updated: October 2021</strong>
            </p>

            <p>
              <strong>
                PLEASE READ THESE TERMS OF SERVICE CAREFULLY. NOTE THAT SECTION 16 CONTAINS A BINDING ARBITRATION CLAUSE
                AND CLASS ACTION WAIVER, WHICH AFFECT YOUR LEGAL RIGHTS. IF YOU DO NOT AGREE TO THESE TERMS OF SERVICE,
                DO NOT ACCESS OR USE THE SERVICES.
              </strong>
            </p>

            <p>
              By clicking to agree to these Terms of Service (<strong>“Terms"</strong>) when running/installing our
              software, publishing content to Odysee, or by otherwise accessing or using the network [via proxy or
              direct], mobile applications and online services (collectively, our <strong>“Services"</strong>) of Odysee
              Inc. (<strong>“Company," “we," or “us"</strong>), you agree to be bound by these Terms. If you do not
              agree to these Terms, you may not access or use the Services for any purpose. Please refer to our Privacy
              Policy https://odysee.com/$/privacypolicy for information about how we collect, use and disclose
              information about you.
            </p>

            <p>You and the Company agree as follows:</p>

            <h3 id="toc_0">1. Overview of Odysee and the Services</h3>
            <p>
              <strong>“Odysee"</strong> is a decentralized, consensus-driven protocol that enables the publication and
              viewing of information, videos, music, data and other materials (<strong>“Content"</strong>). Content is
              distributed to Odysee by publishers and is stored in fragmented shards via a distributed network of
              third-party devices (<strong>“Hosts"</strong>) that utilize Odysee. Odysee also allows publishers to bid
              on and reserve names (<strong>“Names"</strong>), which can be used as a unique identifier for Content.
              Please consult Odysee.tech to learn more about the technical architecture of Odysee.{' '}
            </p>

            <p>
              The Services provide an interface for you to interact with Odysee, including to publish, access, or host
              Content through Odysee. The Odysee protocol is not owned, operated, or maintained by us. We have no
              responsibility or liability for Odysee, and the Company has no ability to control third parties’ use of
              Odysee. We are not able to delete or remove Content that has been published through Odysee and that may be
              accessible via the Services.{' '}
            </p>

            <h3 id="toc_1">2. Eligibility</h3>

            <p>
              You must be at least 13 years of age to access or use our Services. If you are under 18 years of age (or
              the age of legal majority where you live), you may only access or use our Services under the supervision
              of a parent or legal guardian who agrees to be bound by these Terms. If you are a parent or legal guardian
              of a user under the age of 18 (or the age of legal majority), you will be fully responsible for the acts
              or omissions of such user in connection with our Services. If you are accessing or using our Services on
              behalf of another person or entity, you represent that you are authorized to accept these Terms on that
              person or entity’s behalf and that the person or entity agrees to be responsible to us if you or the other
              person or entity violates these Terms.
            </p>
            <h3 id="toc_2">3. Publishing Content</h3>

            <p>This section applies if you use the Services to publish Content through Odysee. </p>

            <p>
              a) You will make available via the Services a clear and accurate description of Content you publish, and
              provide the Content in accordance with any descriptions or representations you make available about the
              Content. You are solely responsible for resolving any disputes with users of your Content, including any
              chargebacks or refunds, and for any and all injuries, illnesses, damages, claims, liabilities and costs
              that are caused in whole or in part by you or your Content. Publishing to a blockchain is permanent. We
              cannot remove published content from the blockchain itself, although we can block content accessed via our
              app or other services on top of the blockchain.
            </p>

            <p>
              b) Odysee enables publishers to offer Content for sale to other users by setting contract terms within the
              metadata of the Content. Company, in its sole discretion, may from time to time impose limits on the
              ability to sell Content via the Services. Upon the purchase of Content, you and the purchaser of your
              Content will enter into a separate agreement, pursuant to which that purchaser agrees to pay the specified
              fees for the Content and you agree to enable access to your Content. You are solely responsible for
              providing refunds as required to comply with applicable law. You are responsible for determining what, if
              any, taxes apply to your sale of Content, including, for example, sales, use, value added, and similar
              taxes. It is also your responsibility to withhold, collect, report and remit the correct taxes to the
              appropriate tax authorities. The Company is not responsible for withholding, collecting, reporting, or
              remitting any sales, use, value added, or similar tax arising from any transaction completed via the
              Services.
            </p>

            <p>
              c) The Company is not a party to and has no responsibility or liability with respect to any
              communications, transactions, interactions, disputes or any relations whatsoever between you and any users
              of the Content. We will not be responsible for any loss, misuse, or deletion of Content or any failure of
              any Content to be encrypted, stored or distributed.. You are solely responsible for your use of the
              Services, including for configurations that you deem appropriate to determine access to your Content by
              other users in a manner that meets your expectations. You are solely responsible for backing up any
              Content. We are not responsible for any user’s access to your Content or any user’s misuse or
              redistribution of Content.{' '}
            </p>

            <p>
              d) You will not use the Services to reserve a Name that infringes any patent, trademark, trade secret,
              copyright or other intellectual or proprietary right of any party.
            </p>

            <p>
              e) We make no representations or warranties regarding the suitability of the Services for the distribution
              and publishing of any particular types of data. By posting any Content or reserving a Name, you represent
              and warrant that you have the lawful right, including all necessary intellectual property rights, to
              distribute and reproduce such Content or use such Name for any purpose, commercial or otherwise. You will
              provide all notices to, and obtain any consents from third parties as required by applicable law in
              connection with the distribution and publishing of Content via the Services.{' '}
            </p>

            <p>f) You will not use the Services to distribute or publish Content that:</p>
            <ul>
              <li>
                is unlawful, for example, copyrighted works, underage sexual content, revenge pornography, or any other
                content illegal under US or state law.
              </li>
              <li>
                would constitute, encourage or provide instructions for a criminal offense, violate the rights of any
                party, or that would otherwise create liability or violate any applicable local, state, national or
                international law;
              </li>
              <li>
                infringes any patent, trademark, trade secret, copyright or other intellectual or proprietary right of
                any party;
              </li>
              <li>
                impersonates any person or entity or otherwise misrepresents your affiliation with a person or entity;
              </li>
              <li>
                contains sensitive personal information, including "protected health information," as defined under
                HIPAA and its implementing rules; “cardholder data," as defined by the PCI DSS; “personal information"
                of a “child" as such terms are defined under the Children’s Online Privacy Protection Act and its
                implementing rules; or personal data revealing racial or ethnic origin, political opinions, religious or
                philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data for
                the purpose of uniquely identifying a natural person, data concerning health or data concerning a
                natural person's sex life or sexual orientation;
              </li>
              <li>
                contains viruses, corrupted data or other harmful, disruptive or destructive files; UNLESS CLEARLY
                LABELED AS SUCH
              </li>
              <li>
                in the sole judgment of the Company, is objectionable or which restricts or inhibits any other person
                from using or enjoying Odysee or the Services, or which may expose the Company or its users to any harm
                or liability of any type.
              </li>
              <li>
                USD equivalent of Odysee Credits [LBC] is determined by 3rd party markets such as Bittrex and Poloniex,
                not Odysee INC.
              </li>
            </ul>

            <h3 id="toc_3">4. Accessing Content</h3>

            <p>This section applies if you use the Services to access Content that has been stored through Odysee.</p>

            <p>
              a) In using our Services, you may view or otherwise interact with Content provided by publishers. Your
              dealings or correspondence with any publisher of Content are solely between you and that publisher. The
              Company is not responsible or liable for any damage or loss of any sort caused, or alleged to be caused,
              by or in connection with any such dealings, including the delivery, quality, safety, legality or any other
              aspect of any Content that you may access using our Services.
            </p>

            <p>
              b) In certain instances, your access to Content may be subject to sale terms set forth in the metadata of
              the Content. Company, in its sole discretion, may from time to time impose limits on the ability to
              purchase Content via the Services. Upon your access of any purchased Content, you and the publisher will
              enter into a separate agreement, pursuant to which you agree to pay the specified fees for the Content and
              the publisher agrees to make such Content available to you. THE COMPANY DOES NOT HAVE THE POWER OR
              RESPONSIBILITY TO PROVIDE ANY REFUNDS. You agree to look solely to the publisher to resolve any disputes
              regarding Content, and that publishers are solely responsible for providing any refunds.
            </p>

            <p>
              c) All payments for content will be made using LBC and occur on the Odysee blockchain. Purchaser is buying
              the right to access content for personal non-commercial use unless content creator provides a license for
              commercial use or remixing.
            </p>

            <h3 id="toc_4">5. General Conduct Restrictions</h3>

            <p>
              You are solely responsible for your conduct while using the Services. You will comply with all applicable
              laws and third-party agreements to which you are bound. Further, you will not do any of the following in
              connection with the Services or any other users:{' '}
            </p>

            <p>
              a) Use the Services in any manner that could interfere with, disrupt, negatively affect or inhibit other
              users from fully enjoying the Services or that could damage, disable, overburden or impair the functioning
              of the Services in any manner;
            </p>

            <p>
              b) Impersonate or distribute Content on behalf or any person or entity or otherwise misrepresent your
              affiliation with a person or entity;
            </p>

            <p>c) Cheat or utilize unauthorized exploits in connection with the Services; </p>

            <p>d) Stalk, intimidate, threaten, or otherwise harass or cause discomfort to other users; </p>

            <p>
              e) Send, distribute or post spam, unsolicited or bulk commercial electronic communications, chain letters,
              or pyramid schemes;
            </p>

            <p>
              f) Harvest or otherwise collect information about users, including email addresses, without their consent;
            </p>

            <p>
              g) Use the Services for any illegal or unauthorized purpose or engage in, encourage, or promote any
              illegal activity, or any activity that violates these Terms;{' '}
            </p>

            <p>
              h) Use the Services to distribute Content that you do not have the lawful right to distribute or
              reproduce; or
            </p>

            <p>
              i) Circumvent or attempt to circumvent any filtering, security measures or other features we may from time
              to time adopt to protect the Company, the Services, its users or third parties.
            </p>

            <p>
              The Company does not endorse or adopt any Content and you acknowledge and agree that the Company will have
              no responsibility for any Content, including without limitation, material that may be misleading,
              incomplete, erroneous, offensive, indecent or otherwise objectionable. Enforcement of the Content rules
              set forth in these Terms is solely at our discretion, and subject to our technical capabilities. Failure
              to enforce such rules in some instances does not constitute a waiver of our right to enforce such rules in
              other instances. In addition, these rules do not create any private right of action on the part of any
              third party or any reasonable expectation that the Services will not link to any Content that is
              prohibited by such rules.{' '}
            </p>

            <h3 id="toc_5">6. Limited License; Copyright and Trademark</h3>

            <p>
              Our Services and the text, graphics, images, photographs, illustrations, trademarks, trade names, service
              marks, logos, slogans and other content contained therein (collectively, the{' '}
              <strong>“Company Marks"</strong>) are owned by Company and its licensors and are protected under both
              United States and foreign laws, and may not be copied, imitated or used, in whole or in part, without our
              or the applicable licensor’s prior written permission. You may not use any metatags or other “hidden text"
              utilizing any Company Marks without our prior written permission. Further, you may not use, frame or
              utilize framing techniques to enclose any Company Mark, the content of any text or the layout or design of
              any page or form contained on a page, on the Services without the Company’s express written consent.
            </p>

            <h3 id="toc_6">7. Open Source Software</h3>

            <p>
              a) We may, from time to time, release the source code for certain of the software that supports our
              Services. You agree to be bound by, and comply with, any license agreement that applies to this open
              source software. You will not indicate that you are associated with Company in connection with any of your
              modifications or distributions of this open source software.{' '}
            </p>

            <p>
              b) The source code we release in connection with open source software is not part of the Services, and
              your use of that source code without interacting with our Services is not subject to these Terms. For
              clarity, though, when we host any software and enable you to access and use such software as a service
              through our Services, then these Terms will apply to such access and use.{' '}
            </p>

            <h3 id="toc_7">8. YouTube Sync Program Terms</h3>

            <p>
              a) If you participate in the YouTube Sync Program, you also agree to{' '}
              <a href="https://www.youtube.com/t/terms" rel="noopener">
                YouTube's Terms of Service (https://www.youtube.com/t/terms)
              </a>{' '}
              and{' '}
              <a href="https://www.google.com/policies/privacy" rel="noopener">
                Google's Privacy Policy (https://www.google.com/policies/privacy).
              </a>{' '}
            </p>

            <p>
              b) To revoke Odysee's access to your YouTube account or manage your security preferences, please{' '}
              <a href="https://security.google.com/settings/security/permissions" rel="noopener">
                refer to your Google Security and Permissions Page
                (https://security.google.com/settings/security/permissions).
              </a>
            </p>

            <h3 id="toc_8">9. Feedback</h3>

            <p>
              Any questions, comments, suggestions, ideas, original or creative materials or other information you
              submit about the Company or our products or Services (collectively, <strong>“Feedback"</strong>), is
              non-confidential and will become the sole property of the Company. We will own exclusive rights,
              including, without limitation, all intellectual property rights, in and to Feedback and will be entitled
              to the unrestricted use and dissemination of Feedback for any purpose, commercial or otherwise, without
              acknowledgment or compensation to you.
            </p>

            <h3 id="toc_9">10. Copyright Complaints</h3>

            <p>
              We have a policy of limiting access to our Services and terminating the accounts of users who infringe the
              intellectual property rights of others. If you believe that anything on our Services infringes any
              copyright that you own or control, you may notify the Company’s Designated Agent as follows:
            </p>

            <p>
              Designated Agent: Odysee, Inc 2540 S Maryland Pkwy Unit #5021 Las Vegas, NV 89109 Telephone Number:
              907-318-5956 Fax Number: 801-327-6808
            </p>

            <p>E-Mail Address: hello@odysee.com</p>

            <p>
              Please see 17 U.S.C. §512(c)(3) for the requirements of a proper notification. Also, please note that if
              you knowingly misrepresent that any activity or material on our Services is infringing, you may be liable
              to the Company for certain costs and damages.
            </p>

            <h3 id="toc_10">11. Indemnification</h3>

            <p>
              To the fullest extent permitted by applicable law, you will indemnify, defend, and hold harmless the
              Company and our officers, directors, agents, partners and employees (individually and collectively, the{' '}
              <strong>“Company Parties"</strong>) from and against any loss, liability, claim, demand, damages, expenses
              or costs (including attorney’s fees) (<strong>“Claims"</strong>) arising out of or related to (a) your
              access to or use of our Services; (b) your Content or any Name that you have reserved; (c) your violation
              of these Terms; or (d) your violation, misappropriation or infringement of any rights of another
              (including intellectual property rights or privacy rights). You agree to promptly notify Company Parties
              of any third party Claims, cooperate with Company Parties in defending such Claims and pay all fees, costs
              and expenses associated with defending such Claims (including, but not limited to, attorneys' fees). You
              also agree that the Company Parties will have control of the defense or settlement of any third party
              Claims. This indemnity is in addition to, and not in lieu of, any other indemnities set forth in a written
              agreement between you and the Company or the other Company Parties.
            </p>

            <h3 id="toc_11">12. Disclaimers</h3>

            <p>
              <strong>
                Your use of our Services is at your sole risk. Our Services are provided “as is" and “as available"
                without warranties of any kind, either express or implied, including, but not limited to, implied
                warranties of merchantability, fitness for a particular purpose, title, and non-infringement. In
                addition, the Company does not represent or warrant that our Services are accurate, complete, reliable,
                current or error-free. While the Company attempts to make your access to and use of our Services safe,
                we cannot and do not represent or warrant that our Services or servers are free of viruses or other
                harmful components. You assume the entire risk as to the quality and performance of the Services.
              </strong>
            </p>

            <h3 id="toc_12">13. Limitation of Liability</h3>

            <p>
              <strong>
                The Company and the other Company Parties will not be liable to you under any theory of
                liability—whether based in contract, tort, negligence, strict liability, warranty, or otherwise—for any
                indirect, consequential, exemplary, incidental, special or punitive damages or lost profits, even if the
                Company or the other Company Parties have been advised of the possibility of such damages.
              </strong>
            </p>

            <p>
              <strong>
                The total liability of the Company and the other Company Parties, for any claim arising out of or
                relating to these Terms or our Services, regardless of the form of the action, is limited to the greater
                of any amount paid, if any, by you to access or use our Services or $100 USD.
              </strong>
            </p>

            <p>
              <strong>
                The limitations set forth in this section will not limit or exclude liability for the gross negligence,
                fraud or intentional misconduct of the Company or other Company Parties or for any other matters in
                which liability cannot be excluded or limited under applicable law. Additionally, some jurisdictions do
                not allow the exclusion or limitation of incidental or consequential damages, so the above limitations
                or exclusions may not apply to you.
              </strong>
            </p>

            <h3 id="toc_13">14. Release</h3>

            <p>
              To the fullest extent permitted by applicable law, you release the Company and the other Company Parties
              from responsibility, liability, claims, demands and damages (actual and consequential) of every kind and
              nature, known and unknown (including, but not limited to, claims of negligence), arising out of or related
              to disputes between users and the acts or omissions of third parties.{' '}
              <strong>
                You expressly waive any rights you may have under California Civil Code § 1542 as well as any other
                statute or common law principles that would otherwise limit the coverage of this release to include only
                those claims which you may know or suspect to exist in your favor at the time of agreeing to this
                release.
              </strong>
            </p>

            <h3 id="toc_14">15. Dispute Resolution; Arbitration</h3>

            <p>
              <strong>
                Please read the following section carefully because it requires you to arbitrate certain disputes and
                claims with the Company and limits the manner in which you can seek relief from us.
              </strong>
            </p>

            <h3 id="toc_15">15.1. Binding Arbitration</h3>

            <p>
              Except for any disputes, claims, suits, actions, causes of action, demands or proceedings (collectively,{' '}
              <strong>“Disputes"</strong>) in which either party seeks to bring an individual action in small claims
              court or seeks injunctive or other equitable relief for the alleged unlawful use of intellectual property,
              including, without limitation, copyrights, trademarks, trade names, logos, trade secrets or patents, you
              and the Company (a) waive your and the Company’s respective rights to have any and all Disputes arising
              from or related to these Terms or the Services resolved in a court, and (b) waive your and the Company’s
              respective rights to a jury trial. Instead, you and the Company will arbitrate Disputes through binding
              arbitration (which is the referral of a Dispute to one or more persons charged with reviewing the Dispute
              and making a final and binding determination to resolve it instead of having the Dispute decided by a
              judge or jury in court).
            </p>

            <h3 id="toc_16">15.2. No Class Arbitrations, Class Actions or Representative Actions</h3>

            <p>
              Any Dispute arising out of or related to these Terms or the Services is personal to you and the Company
              and will be resolved solely through individual arbitration and will not be brought as a class arbitration,
              class action or any other type of representative proceeding. There will be no class arbitration or
              arbitration in which an individual attempts to resolve a Dispute as a representative of another individual
              or group of individuals. Further, a Dispute cannot be brought as a class or other type of representative
              action, whether within or outside of arbitration, or on behalf of any other individual or group of
              individuals.
            </p>

            <h3 id="toc_17">15.3. Federal Arbitration Act</h3>

            <p>
              These Terms affect interstate commerce and the enforceability of this Section 16 will be both
              substantively and procedurally governed by and construed and enforced in accordance with the Federal
              Arbitration Act, 9 U.S.C. § 1 et seq. (the <strong>“FAA"</strong>), to the maximum extent permitted by
              applicable law.
            </p>

            <h3 id="toc_18">15.4. Notice; Informal Dispute Resolution</h3>

            <p>
              Each party will notify the other party in writing of any arbitrable or small claims Dispute within thirty
              (30) days of the date it arises, so that the parties can attempt in good faith to resolve the Dispute
              informally. Notice to the Company will be sent by e-mail to the Company at hello@odysee.com. Notice to you
              will be by email to the then-current email address in your Account. Your notice must include (a) your
              name, postal address, email address and telephone number, (b) a description in reasonable detail of the
              nature or basis of the Dispute, and (c) the specific relief that you are seeking. If you and the Company
              cannot agree how to resolve the Dispute within thirty (30) days after the date notice is received by the
              applicable party, then either you or the Company may, as appropriate and in accordance with this Section
              16, commence an arbitration proceeding or, to the extent specifically provided for in Section 17.1, file a
              claim in court.{' '}
            </p>

            <h3 id="toc_19">15.5. Process</h3>

            <p>
              Any arbitration will occur in New Castle County, Delaware. Arbitration will be conducted confidentially by
              a single arbitrator in accordance with the rules of the Judicial Arbitration and Mediation Services (
              <strong>“JAMS"</strong>), which are hereby incorporated by reference. The state and federal courts located
              in New Castle County, Delaware will have exclusive jurisdiction over any appeals and the enforcement of an
              arbitration award. You may also litigate a Dispute in the small claims court located in the county where
              you reside if the Dispute meets the requirements to be heard in small claims court.{' '}
            </p>

            <h3 id="toc_20">15.6. Authority of Arbitrator</h3>

            <p>
              As limited by the FAA, these Terms and the applicable JAMS rules, the arbitrator will have (a) the
              exclusive authority and jurisdiction to make all procedural and substantive decisions regarding a Dispute,
              including the determination of whether a Dispute is arbitrable, and (b) the authority to grant any remedy
              that would otherwise be available in court; provided, however, that the arbitrator does not have the
              authority to conduct a class arbitration or a representative action, which is prohibited by these Terms.
              The arbitrator may only conduct an individual arbitration and may not consolidate more than one
              individual’s claims, preside over any type of class or representative proceeding or preside over any
              proceeding involving more than one individual.
            </p>

            <h3 id="toc_21">15.7. Rules of JAMS</h3>

            <p>
              The rules of JAMS and additional information about JAMS are available on the{' '}
              <a href="http://www.jamsadr.com/" rel="noopener">
                JAMS website.
              </a>{' '}
              By agreeing to be bound by these Terms, you either (a) acknowledge and agree that you have read and
              understand the rules of JAMS, or (b) waive your opportunity to read the rules of JAMS and any claim that
              the rules of JAMS are unfair or should not apply for any reason.
            </p>

            <h3 id="toc_22">16. Governing Law and Venue</h3>

            <p>
              These Terms and your access to and use of the Services will be governed by and construed and enforced in
              accordance with the laws of the State of Delaware, without regard to conflict of law rules or principles
              (whether of the State of Delaware or any other jurisdiction) that would cause the application of the laws
              of any other jurisdiction. Any Dispute between the parties arising out of or relating to these Terms that
              is not subject to arbitration or cannot be heard in small claims court will be resolved in the state or
              federal courts of the State of Delaware and the United States, respectively, sitting in New Castle County,
              Delaware.{' '}
            </p>

            <h3 id="toc_23">17. Severability</h3>

            <p>
              If any term, clause or provision of these Terms is held invalid or unenforceable, then that term, clause
              or provision will be severable from these Terms and will not affect the validity or enforceability of any
              remaining part of that term, clause or provision, or any other term, clause or provision of these Terms.
            </p>

            <h3 id="toc_24">18. Termination or Suspension</h3>

            <p>
              Notwithstanding anything contained in these Terms, we reserve the right, without notice and in our sole
              discretion, to terminate this agreement or suspend your right to access the Services. You may terminate
              this agreement without notice by discontinuing use of the Services. All rights and licenses granted to you
              under these Terms will immediately be revoked upon our termination of the agreement or our suspension of
              your access to the Services. We make no representations that termination or suspension of the Services
              will prevent the spread or distribution of published Content through Odysee.
            </p>

            <h3 id="toc_25">19. Amendment</h3>

            <p>
              We reserve the right to change these Terms from time to time upon notice to you. If we make changes to
              these Terms, we will provide notice of such changes by posting the revised Terms to the Services and
              updating the “Last Updated" date at the top of these Terms. In some cases, we may provide additional
              notice to you, such as via our Services or to an email address associated with your Account. Your
              continued use of the Services following our provision of any such notice will confirm your acceptance of
              the revised Terms. If you do not agree to the modified Terms, you must stop using the Services.{' '}
            </p>

            <h3 id="toc_26">20. Survival</h3>

            <p>
              The following sections will survive the expiration or termination of these Terms: all defined terms and
              Sections 12 - 18, 21 and 22.
            </p>

            <h3 id="toc_27">21. Miscellaneous</h3>

            <p>
              These Terms constitutes the entire agreement between you and the Company relating to your access to and
              use of the Services. We may assign our rights and obligations under these Terms. Under no circumstances
              may you assign your rights and obligations under these Terms, including in the event of change of control
              or by operation of law, without our prior written consent. The failure of the Company to exercise or
              enforce any right or provision of these Terms will not operate as a waiver of such right or provision. We
              will not be liable for any delay or failure to perform any obligation under these Terms where the delay or
              failure results from any cause beyond our reasonable control. Except as otherwise provided in herein, the
              agreement is intended solely for the benefit of the parties and are not intended to confer third-party
              beneficiary rights upon any other person or entity.
            </p>

            <h3 id="toc_28">22. Export Control and Prohibited Use</h3>

            <p>
              Use of the Service and Software, including transferring, posting, or uploading data, software or other
              Content via the Service, may be subject to the export and import laws of the United States and other
              countries. You agree to comply with all applicable export and import laws and regulations. In particular,
              but without limitation, the Software may not be exported or re-exported (a) into any U.S. embargoed
              countries or (b) to anyone on the U.S. Treasury Department’s list of Specially Designated Nationals or the
              U.S. Department of Commerce Denied Person’s List or Entity List. By using the Software or Service, you
              represent and warrant that you are not located in any such country or on any such list. You also agree
              that you will not use the Software or Service for any purposes prohibited by United States law, including,
              without limitation, the development, design, manufacture or production of missiles, nuclear, chemical or
              biological weapons. You further agree not to upload to your Account any data or software that is: (a)
              subject to International Traffic in Arms Regulations; or (b) that cannot be exported without prior written
              government authorization, including, but not limited to, certain types of encryption software and source
              code, without first obtaining that authorization. This assurance and commitment shall survive termination
              of this Agreement.
            </p>
          </div>
        }
      />
    </Page>
  );
};
export default TOSPage;
