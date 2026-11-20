import { render, screen } from '@testing-library/react'
import { EstadoConsulta } from '@/components/EstadoConsulta'

describe('EstadoConsulta', () => {
  it('anuncia o carregamento como status', () => {
    render(<EstadoConsulta estado="carregando" />)
    expect(screen.getByRole('status')).toHaveTextContent('Carregando dados…')
  })

  it('exibe a mensagem de erro', () => {
    render(<EstadoConsulta estado="erro" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar os dados.')
  })

  it('informa que a consulta concluída não encontrou itens', () => {
    render(<EstadoConsulta estado="vazio" />)
    expect(screen.getByText('Nenhum item encontrado.')).toBeInTheDocument()
  })
})
