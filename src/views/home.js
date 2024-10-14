import React from "react";
import UsuarioService from "../app/service/UsuarioService";
import { AuthContext } from "../main/provedorAutenticacao";


class Home extends React.Component{

    state = {
        saldo:0
    }

    formatarSaldo(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    constructor(){
        super();
        this.UsuarioService = new UsuarioService();
    }

    componentDidMount(){
        const usuarioLogado = this.context.usuarioAutenticado;
        console.log("Usuário logado:", usuarioLogado); 
    
        this.UsuarioService
            .obterSaldoPorUsuario(usuarioLogado.id)
            .then(response => {
                console.log("Saldo retornado:", response.data); 
                this.setState({saldo: response.data});
            }).catch(error => {
                console.error("Erro ao obter saldo:", error.response);
            });
    }

    render(){
        return(
            <div className="jumbotron">
                <h2>Bem Vindo(a)!</h2>
                <p className="lead">Esse é o seu sistema de finanças.</p>
                <p className="lead">Seu saldo para o mês atual é de {this.formatarSaldo(this.state.saldo)}</p>
                <hr className="my-4" />
                <p>Essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema.</p>
                <div className="lead d-flex">
                    <a className="btn btn-dark mx-1 btn-lg" href="#/Cadastrousuario" role="button"><i className="pi pi-users"></i> Cadastrar Usuário</a>
                    <a className="btn btn-info btn-lg" href="#/CadastroLancamentos" role="button"><i className="pi pi-money-bill"></i> Cadastrar Lançamento</a>
                </div>
            </div>
        )
    }
}

Home.contextType = AuthContext;

export default Home;