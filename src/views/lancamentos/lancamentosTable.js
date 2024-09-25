import React from "react";
import currencyFormatter from 'currency-formatter';
import "../../css/login.css"


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
                <td>
                    <button title="Efetivar" 
                            disabled={lancamento.status !== 'PENDENTE'}
                            className="btn btn-success"
                            onClick={e => props.alterarStatus(lancamento, 'EFETIVADO')}
                            type="button">
                            <i className="pi pi-check"></i>
                    </button>
                    <button title="Cancelar" 
                            disabled={lancamento.status !== 'PENDENTE'}
                            className="btn btn-warning"
                            onClick={e => props.alterarStatus(lancamento, 'CANCELADO')}
                            type="button">
                            <i className="pi pi-times"></i>
                    </button>
                    <button title="Editar" type="button" className="btn btn-primary" onClick={e => props.editAction(lancamento.id)}><i className="pi pi-pencil"></i></button>
                    <button title="Excluir" type="button" className="btn btn-danger" onClick={e => props.deleteAction(lancamento)}><i className="pi pi-trash"></i></button>
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
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}