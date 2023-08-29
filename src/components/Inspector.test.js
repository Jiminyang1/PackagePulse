import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Inspector from './Inspector';

describe('Inspector', () => {
  it('renders with default tab and switches tabs', () => {
    render(<Inspector />);
    // Assert that the default tab is active
    expect(screen.getByTestId("tab-graph")).toHaveClass('active');
    expect(screen.getByTestId("tab-package")).not.toHaveClass('active');
    fireEvent.click(screen.getByTestId("tab-package"));
    expect(screen.getByTestId("tab-package")).toHaveClass('active');
    expect(screen.getByTestId("tab-graph")).not.toHaveClass('active');
  });

  it('renders the correct tab content', () => {
    render(<Inspector />);


    // By default, the "图信息" tab should be active
    expect(screen.getByTestId("tab-graph")).toHaveClass('active');

    // Assert that the GraphInfo component is rendered
    expect(screen.getByTestId('graph-info')).toBeInTheDocument();

    // Click on the "包信息" tab
    fireEvent.click(screen.getByTestId("tab-package"));

    // Assert that the PackageInfo component is rendered
    expect(screen.getByTestId('package-info')).toBeInTheDocument();
  });
});
