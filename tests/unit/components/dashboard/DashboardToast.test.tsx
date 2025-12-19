import { render, screen } from '@testing-library/react';
import DashboardToast from '../../../components/dashboard/DashboardToast';

describe('DashboardToast Component', () => {
  it('renders the toast message', () => {
    render(<DashboardToast message="Test message" />);
    expect(screen.getByText(/Test message/i)).toBeInTheDocument();
  });
});
