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

const mapStateToProps = (state, ownProps) => ({
    
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(ComponentName);
