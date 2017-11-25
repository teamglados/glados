import { StyleSheet } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Camera from 'react-native-camera';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { capturePhoto } from './mark.ducks';
import Button from '../common/Button';
import Text from '../common/Text';

const propTypes = {
  capturePhoto: PropTypes.func.isRequired,
};

const PHOTO_INTERVAL = 4000;

class MarkScreen extends Component {
  componentDidMount() {
    this.captureInterval = setInterval(this.takePhoto, PHOTO_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.captureInterval);
  }

  setCamRef = (cam) => {
    this.camera = cam;
  }

  takePhoto = () => {
    if (this.camera) {
      const metadata = {};
      this.camera.capture({ metadata })
        .then(this.props.capturePhoto)
        .catch(err => console.error(err));
    }
  }

  render() {
    return (
      <MarkScreenWrapper>
        <Camera
          ref={this.setCamRef}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.temp}
          captureQuality={Camera.constants.CaptureQuality['480p']}
          orientation="portrait"
          keepAwake
        >
          <Button onPress={this.takePhoto} success>
            <Text>
              Finish marking
            </Text>
          </Button>
        </Camera>
      </MarkScreenWrapper>
    );
  }
}

const MarkScreenWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 24,
  },
});

MarkScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  marks: state.marks,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  capturePhoto,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MarkScreen);
