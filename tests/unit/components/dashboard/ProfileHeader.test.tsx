import { render, screen } from '@testing-library/react';
import ProfileHeader from '../../../components/dashboard/ProfileHeader';

describe('ProfileHeader Component', () => {
  it('renders the header title', () => {
    render(<ProfileHeader title="My Profile" />);
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });
});
