import { createCrudService } from './createCrudService'
import { maskCpf } from '../utils/cpf'

const crud = createCrudService('funcionarios')

export const funcionarioService = {
  ...crud,
  toPayload(funcionario) {
    return {
      nome: funcionario.nome,
      cpf: maskCpf(funcionario.cpf),
      vinculos: funcionario.vinculos.map((vinculo) => ({
        empresa: { id: vinculo.empresa.id },
        matricula: vinculo.matricula,
        cargo: { id: vinculo.cargo.id },
        departamento: { id: vinculo.departamento.id },
      })),
    }
  },
}
