import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Redirect } from "react-router-dom";

import { logout } from "../../actions/authActions";

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
  }
  render() {
    return <Redirect to={{ pathname: "/" }} />;
  }
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { logout })(Logout);
