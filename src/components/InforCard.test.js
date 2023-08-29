import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import InfoCard from './InfoCard';

describe('InfoCard', () => {
  it('renders with title and data', () => {
    const title = 'Test Title';
    const data = 'Test Data';

    render(<InfoCard title={title} data={data} />);

    // Assert that the title and data are in the rendered component
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(data)).toBeInTheDocument();
  });

  it('renders without title and data', () => {
    render(<InfoCard />);

    // Assert that the title and data are not present
    expect(screen.queryByTestId('info-card-title')).toBeNull();
    expect(screen.queryByTestId('info-card-data')).toBeNull();
  });
});
