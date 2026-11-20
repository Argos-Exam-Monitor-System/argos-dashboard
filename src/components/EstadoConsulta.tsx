const messages = {
  carregando: 'Carregando dados…',
  erro: 'Não foi possível carregar os dados.',
  vazio: 'Nenhum item encontrado.',
}

type EstadoConsultaProps = {
  estado: keyof typeof messages
  mensagem?: string
}

export function EstadoConsulta({ estado, mensagem = messages[estado] }: EstadoConsultaProps) {
  const role = { carregando: 'status', erro: 'alert', vazio: undefined }[estado]

  return (
    <p className="panel" role={role}>
      {mensagem}
    </p>
  )
}
