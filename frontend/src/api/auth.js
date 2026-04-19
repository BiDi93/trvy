import api from './axios'

export const authApi = {
  register: (data)       => api.post('/auth/register', data),
  login:    (data)       => api.post('/auth/login', data),
  logout:   ()           => api.post('/auth/logout'),
  me:       ()           => api.get('/auth/me'),
  update:   (data)       => api.post('/auth/me', data),   // multipart
  sendOtp:  (phone)      => api.post('/auth/otp/send', { phone }),
  verifyOtp:(phone, otp) => api.post('/auth/otp/verify', { phone, otp }),
}
