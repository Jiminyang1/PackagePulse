import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InsepctorControl from './InspectorControl';

describe('InsepctorControl', () => {
  it('renders the control button with the correct icon when isOpen is true', () => {
    render(<InsepctorControl isOpen={true} />);

    // Assert that the control button displays the open icon
    expect(screen.getByTestId('control')).toHaveTextContent('\u25b6');
  });

  it('renders the control button with the correct icon when isOpen is false', () => {
    render(<InsepctorControl isOpen={false} />);

    // Assert that the control button displays the closed icon
    expect(screen.getByTestId('control')).toHaveTextContent('\u25c0');
  });

  it('calls the onClick function when the control button is clicked', () => {
    const onClickMock = jest.fn();
    render(<InsepctorControl isOpen={true} onClick={onClickMock} />);

    // Click the control button
    fireEvent.click(screen.getByTestId('control'));

    // Assert that the onClick function was called
    expect(onClickMock).toHaveBeenCalled();
  });
});
