import {render, screen} from '@testing-library/react';
import Home from './Home';
import {describe, expect, it} from 'vitest';

describe('Home component', () => {
  it('renders schema editor title', () => {
    render(<Home />);
    const linkElement = screen.getByText(/Schema Editor/i);
    expect(linkElement).toBeInTheDocument();
  });
});
