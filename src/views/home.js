import React from "react";
import UsuarioService from "../app/service/usuarioService";
import { AuthContext } from "../main/provedorAutenticacao";


class Home extends React.Component{

    state = {
        saldo:0
    }

    formatarSaldo(valor) {
        // Formata o saldo para o formato BRL (R$)
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    constructor(){
        super();
        this.UsuarioService = new UsuarioService();
    }

    componentDidMount(){
        const usuarioLogado = this.context.usuarioAutenticado

        this.UsuarioService
            .obterSaldoPorUsuario(usuarioLogado.id)
            .then(response => {
                this.setState({saldo: response.data})
            }).catch(error => {
                console.error(error.response)
            })
    }

    render(){
        return(
            <div className="jumbotron">
                <h1 className="bem-vindo">Bem Vindo(a)!</h1>
                <p className="lead">Esse é o seu sistema de finanças.</p>
                <p className="lead">Seu saldo para o mês atual é de {this.formatarSaldo(this.state.saldo)}</p>
                <hr className="my-4" />
                <p>Essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema.</p>
                <p className="lead">
                <a className="btn-home btn-home-primeiro" href="#/cadastro-usuarios" role="button"><i className="pi pi-users"></i> Cadastrar Usuário</a>
                <a className="btn-home btn-home-segundo" href="#/cadastro-lancamentos" role="button"><i className="pi pi-money-bill"></i> Cadastrar Lançamento</a>
                </p>
            </div>
        )
    }
}

Home.contextType = AuthContext

export default Home