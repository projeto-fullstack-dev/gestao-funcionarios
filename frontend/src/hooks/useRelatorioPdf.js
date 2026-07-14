import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { getApiError } from '../lib/api'
import { baixarRelatorio } from '../services/relatorioService'

export function useRelatorioPdf(tela) {
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false)
  const gerarRelatorio = useCallback(async () => {
    try { setGerandoRelatorio(true); await baixarRelatorio(tela); toast.success('Relatório gerado com sucesso.') }
    catch (error) { toast.error(getApiError(error, 'Não foi possível gerar o relatório.')) }
    finally { setGerandoRelatorio(false) }
  }, [tela])
  return { gerarRelatorio, gerandoRelatorio }
}
