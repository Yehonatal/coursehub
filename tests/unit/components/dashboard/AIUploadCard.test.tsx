import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIUploadCard from '../../../components/dashboard/AIUploadCard';

describe('AIUploadCard Component', () => {
  it('renders the upload card title', () => {
    render(<AIUploadCard />);
    expect(screen.getByText(/Upload/i)).toBeInTheDocument();
  });

  it('handles button click', async () => {
    const user = userEvent.setup();
    render(<AIUploadCard />);
    const button = screen.getByRole('button');
    await user.click(button);
    // Add your assertion if clicking triggers text change or modal
  });
});
