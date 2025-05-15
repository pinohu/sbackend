import { suiteDashApi } from './suiteDashApi';
import axios from 'axios';

jest.mock('axios');

const mockContacts = { contacts: [{ id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' }] };
const mockContact = { contact: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' } };

describe('suiteDashApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches contacts successfully', async () => {
    axios.create.mockReturnThis();
    axios.get.mockResolvedValueOnce({ data: mockContacts });
    const data = await suiteDashApi.getContacts({ page: 1, per_page: 20 }, false);
    expect(data).toEqual(mockContacts);
    expect(axios.get).toHaveBeenCalledWith('/contacts?page=1&per_page=20');
  });

  it('fetches contact by id successfully', async () => {
    axios.create.mockReturnThis();
    axios.get.mockResolvedValueOnce({ data: mockContact });
    const data = await suiteDashApi.getContactById(1, false);
    expect(data).toEqual(mockContact);
    expect(axios.get).toHaveBeenCalledWith('/contact/1');
  });

  it('handles error when fetching contacts', async () => {
    axios.create.mockReturnThis();
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    await expect(suiteDashApi.getContacts({ page: 1, per_page: 20 }, false)).rejects.toThrow('Network error');
  });
}); 