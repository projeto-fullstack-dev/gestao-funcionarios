import api from '../lib/api'

export function createCrudService(resource) {
  return {
    async list(params = {}) {
      const { data } = await api.get(`/${resource}`, { params })
      return data
    },
    async getById(id) {
      const { data } = await api.get(`/${resource}/${id}`)
      return data
    },
    async create(payload) {
      const { data } = await api.post(`/${resource}`, payload)
      return data
    },
    async update(id, payload) {
      const { data } = await api.put(`/${resource}/${id}`, payload)
      return data
    },
    async remove(id) {
      await api.delete(`/${resource}/${id}`)
    },
  }
}
