import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const noop = () => {};

const Button = ({ children, onPress, disabled, ...rest }) => (
  <ButtonBase onPress={disabled ? noop : onPress} disabled={disabled} {...rest}>
    {children}
  </ButtonBase>
);

const getBg = props => {
  if (props.disabled) return props.theme.primaryColorLighter;
  if (props.success) return props.theme.successColor;
  return props.theme.primaryColor;
};

const ButtonBase = styled.TouchableOpacity`
  flex-direction: row;
  width: ${props => props.w || '100%'};
  align-items: center;
  border-radius: 100px;
  padding-horizontal: ${props => props.sm ? 16 : 32};
  padding-vertical: ${props => props.lg ? 24 : (props.sm ? 8 : 12)};
  justify-content: ${props => props.justify || 'center'};
  background-color: ${props => getBg(props)};
`;

Button.propTypes = {
  children: PropTypes.any,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Button;