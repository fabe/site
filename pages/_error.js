import React, { Component } from 'react';
import Page from '~/layouts/page';

export default class Error extends Component {
  static getInitialProps({ res, jsonPageRes }) {
    const statusCode = res
      ? res.statusCode
      : jsonPageRes ? jsonPageRes.status : null;
    return { statusCode };
  }

  renderErrorMessage(statusCode) {
    switch (statusCode) {
      case 404:
        return "The page you requested wasn't found!";
        break;
      default:
        return 'There was an error processing your request. Try reloading!';
        break;
    }
  }

  render() {
    const { statusCode } = this.props;

    return (
      <Page title={this.renderErrorMessage(statusCode)}>
        <video src="/static/404.mp4" loop autoPlay />
      </Page>
    );
  }
}
