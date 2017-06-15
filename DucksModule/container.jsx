import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ComponentName from './component';
import * as actions from './actions';

class ComponentName extends Component {
  constructor(props, context) {
    super(props, context);
    
  }

  render() {
    return (
      <ComponentName />
    );
  }
}

ComponentName.defaultProps = {
  
};

ComponentName.propTypes = {
  
};

function mapStateToProps(state, ownProps) {
  return {
    
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentName);
