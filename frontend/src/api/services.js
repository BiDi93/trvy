import api from './axios'

export const servicesApi = {
  categories:       ()       => api.get('/categories'),
  list:             (params) => api.get('/services', { params }),
  show:             (id)     => api.get(`/services/${id}`),
  freelancer:       (id)     => api.get(`/freelancers/${id}`),
}
