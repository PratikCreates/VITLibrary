import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../../utils/constants';

export const handlers = [
    // Mock Profile GET (since backend might be missing it)
    http.get(`${API_BASE_URL}/profile`, () => {
        return HttpResponse.json({
            name: 'Mock User',
            email: 'mock@vitstudent.ac.in',
            dob: '2000-01-01',
            address: '123 VIT Road, Vellore'
        })
    }),

    // Mock Profile PUT
    http.put(`${API_BASE_URL}/profile`, async ({ request }) => {
        const data = await request.json();
        return HttpResponse.json(data);
    }),
];
