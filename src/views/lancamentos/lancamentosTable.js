import React from "react";
import currencyFormatter from 'currency-formatter';
import ButtonIcon from "../../components/buttonIcon";
import 'primeicons/primeicons.css';



export default props => {

    //meses
    const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const rows = props.lancamentos.map(lancamento => {
        return(
            <tr key={lancamento.id}>
                <td>{lancamento.descricao}</td>
                <td>{currencyFormatter.format(lancamento.valor, {locale: 'pt-BR'})}</td>
                <td>{lancamento.tipo}</td>
                <td>{nomesMeses[lancamento.mes - 1]}</td>
                <td>{lancamento.status}</td>
                <td>{lancamento.categoria ? lancamento.categoria.descricao : 'Sem Categoria'}</td>
                <td className="d-flex gap-1">
                     {/* Botão "Efetivar" */}
                    <ButtonIcon
                        title="Efetivar"
                        disabled={lancamento.status !== 'PENDENTE'}
                        onClick={() => props.alterarStatus(lancamento, 'EFETIVADO')}
                        variant="success"
                        icon="pi-check"
                    />

                    {/* Botão "Cancelar" */}
                    <ButtonIcon
                        title="Cancelar"
                        disabled={lancamento.status !== 'PENDENTE'}
                        onClick={() => props.alterarStatus(lancamento, 'CANCELADO')}
                        variant="warning"
                        icon="pi-times"
                    />

                    {/* Botão "Editar" */}
                    <ButtonIcon
                        title="Editar"
                        disabled={lancamento.status === 'EFETIVADO' || lancamento.status === 'CANCELADO'}
                        onClick={() => props.editAction(lancamento.id)}
                        variant="primary"
                        icon="pi-pencil"
                    />

                    {/* Botão "Excluir" */}
                    <ButtonIcon
                        title="Excluir"
                        disabled={lancamento.status === 'EFETIVADO' || lancamento.status === 'CANCELADO'}
                        onClick={() => props.deleteAction(lancamento)}
                        variant="danger"
                        icon="pi-trash"
                    />
                </td>
            </tr>
        )
    })

    return(
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}