import api from '../lib/api'

const configs = {
  CARGOS: { titulo: 'Relatório de Cargos', arquivo: 'relatorio-cargos.pdf', colunas: [['Código', 'Descrição']], linha: (item) => [item.codigo, item.descricao] },
  DEPARTAMENTOS: { titulo: 'Relatório de Departamentos', arquivo: 'relatorio-departamentos.pdf', colunas: [['Código', 'Descrição']], linha: (item) => [item.codigo, item.descricao] },
  EMPRESAS: { titulo: 'Relatório de Empresas', arquivo: 'relatorio-empresas.pdf', colunas: [['Nome', 'Razão Social', 'CNPJ']], linha: (item) => [item.nome, item.razaoSocial, item.cnpj] },
  FUNCIONARIOS: {
    titulo: 'Relatório de Funcionários', arquivo: 'relatorio-funcionarios.pdf', orientacao: 'landscape',
    colunas: [['Nome', 'CPF', 'Empresa', 'CNPJ', 'Matrícula', 'Status', 'Cargo', 'Departamento']],
    linha: (item) => [item.nome, item.cpf, item.empresa, item.cnpj, item.matricula, item.ativo ? 'Ativo' : 'Inativo', item.cargo, item.departamento],
  },
}

async function criarPdf(tela, dados) {
  const config = configs[tela]
  if (!config) throw new Error(`Tela de relatório não suportada: ${tela}`)
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const pdf = new jsPDF({ orientation: config.orientacao || 'portrait' })
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(16); pdf.text(config.titulo, 14, 18)
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(100)
  pdf.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 14, 25)
  autoTable(pdf, {
    startY: 31, head: config.colunas, body: dados.map(config.linha), theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [52, 127, 192], textColor: 255 }, alternateRowStyles: { fillColor: [245, 248, 251] },
    didDrawPage: ({ pageNumber }) => { pdf.setFontSize(8); pdf.setTextColor(120); pdf.text(`Página ${pageNumber}`, pdf.internal.pageSize.getWidth() - 28, pdf.internal.pageSize.getHeight() - 8) },
  })
  pdf.save(config.arquivo)
}

export async function baixarRelatorio(tela) {
  const { data } = await api.get(`/relatorios/${tela}`)
  await criarPdf(data.tela, data.dados || [])
}
