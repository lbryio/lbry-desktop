// @flow
import React from 'react';
import querystring from 'querystring';
import Page from 'component/page';
import { Form, FormField, FormRow, Submit } from 'component/common/form';

type Props = {
  doNotify: ({ message: string }) => void,
  navigate: (string, ?{}) => void,
  params: { uri: string },
};

type State = {
  email: string,
  identifier: string,
  name: string,
  rightsholder: string,
};

class ReportContentPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      identifier: this.props.params.uri !== undefined ? this.props.params.uri : '',
      name: '',
      rightsholder: '',
    };

    (this: any).handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (property: any, value: string) => {
    this.setState({
      [property]: value,
    });
  };

  handleSubmit() {
    const { doNotify, navigate } = this.props;

    if (
      this.state.email.length > 0 &&
      this.state.identifier.length > 0 &&
      this.state.name.length > 0 &&
      this.state.rightsholder.length > 0
    ) {
      const report = {
        email: this.state.email,
        identifier: this.state.identifier,
        name: this.state.name,
        rightsholder: this.state.rightsholder,
      };

      const qs = querystring.stringify(report);
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: qs,
      };

      fetch('https://lbry.io/dcma', options).then(response => {
        console.log(response); // todo: parse response
        doNotify({
          displayType: ['snackbar'],
          message: 'Report submitted',
          isError: false,
        });
        navigate(`/show`, { uri: this.props.params.uri });
      });
    }
  }

  render() {
    return (
      <Page>
        <section className="card card--section">
          <div className="card__title">{__('Report Infringing Content')}</div>

          <Form onSubmit={this.handleSubmit}>
            <FormRow padded>
              <FormField
                label={__('Your name')}
                name="name"
                onChange={event => this.handleChange('name', event.target.value)}
                stretch
                type="text"
              />
            </FormRow>
            <FormRow padded>
              <FormField
                helper={__(
                  'The name of the entity that owns the rights to the infringing content.'
                )}
                label={__('Rightsholder Name')}
                name="rightsholder"
                onChange={event => this.handleChange('rightsholder', event.target.value)}
                stretch
                type="text"
              />
            </FormRow>
            <FormRow padded>
              <FormField
                helper={__('All communication regarding this claim will be sent to this address.')}
                label={__('Email Address')}
                name="email"
                onChange={event => this.handleChange('email', event.target.value)}
                stretch
                type="text"
              />
            </FormRow>
            <FormRow padded>
              <FormField
                helper={__(
                  'Name, claim ID, or another way for us to identify the infringing content.'
                )}
                label={__('Infringing Content Identifier')}
                onChange={event => this.handleChange('identifier', event.target.value)}
                stretch
                name="identifier"
                type="text"
                value={this.state.identifier}
              />
            </FormRow>
            <div className="card__actions">
              <Submit label={__('Submit Report')} />
            </div>
          </Form>
        </section>
      </Page>
    );
  }
}

export default ReportContentPage;
