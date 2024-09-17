import React from "react";
import Card from '../components/card';
import FormGroup from "../components/form-group";
import { withRouter } from 'react-router-dom'
import localStorageService from "../app/service/localstorageService";
import UsuarioService from "../app/service/usuarioService";
import { mensagemErro } from '../components/toastr'
import { AuthContext } from "../main/provedorAutenticacao";
import "../css/login.css"

class Login extends React.Component{
    
state = {
    email: '',
    senha: ''
}

constructor(){
    super();
    this.service = new UsuarioService();
}

entrar = () => {
    this.service.autenticar({
        email: this.state.email,
        senha: this.state.senha
    }).then( response => {
        localStorageService.adicionarItem('_usuario_logado', response.data)
        this.context.iniciarSessao(response.data)
        this.props.history.push('/home')
    }).catch(erro => {
        mensagemErro(erro.response.data)
    })
}
prepareCadastrar = () => {
    this.props.history.push('/cadastro-usuarios')
}

    render(){
        return(
            <div className="row">
                <div className="col-md-5 offset-md-4">
                    <div className="bs-docs-section">
                        <Card title="Login">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bs-component">
                                        <fieldset>
                                            <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                                <input type="email" value={this.state.email} onChange={e => this.setState({email: e.target.value})} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Digite o Email"/>
                                            </FormGroup>
                                            <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                                <input type="password" value={this.state.senha} onChange={e => this.setState({senha: e.target.value})} className="form-control" id="exampleInputPassword1" placeholder="Digite a Senha" />
                                            </FormGroup>
                                            <div className="btns">
                                                <button onClick={this.entrar} type="button" className="btn btn-primeiro btn-tamanho btn-success">Entrar &nbsp;<i className="pi pi-sign-in"></i> </button>
                                                <button onClick={this.prepareCadastrar} type="button" className="btn btn-segundo btn-tamanho btn-danger">Cadastrar &nbsp;<i className="pi pi-plus"></i> </button>
                                            </div>                                            
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}

Login.contextType = AuthContext

export default withRouter (Login)