import React from "react";
import Card from "../components/Card";
import { withRouter } from "react-router-dom";
import localStorageService from "../app/service/LocalstorageService";
import UsuarioService from "../app/service/UsuarioService";
import { mensagemErro } from "../components/Toastr";
import { AuthContext } from "../main/provedorAutenticacao";
import ButtonComponent from "../components/Button";
import InputField from "../components/InputField";
import FormGroup from "../components/FormGroup";


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
        const { email, senha } = this.state;

        if (!email) {
            mensagemErro('O campo Email é obrigatório.');
            return;
        }

        if(!email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)){
            mensagemErro('Email inválido.');
            return;
        }
    
        if (!senha) {
            mensagemErro('O campo Senha é obrigatório.');
            return;
        }

        this.service.autenticar({
            email: this.state.email,
            senha: this.state.senha
        }).then( response => {
            localStorageService.adicionarItem('_usuario_logado', response.data);
            this.context.iniciarSessao(response.data);
            this.props.history.push('/home');
        }).catch(erro => {
            mensagemErro(erro.response.data);
        })
    }

    prepareCadastrar = () => {
        this.props.history.push('/CadastroUsuario');
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
                                            <FormGroup label="*E-mail:" htmlFor="exampleInputEmail1">
                                                <InputField 
                                                    type="email" 
                                                    value={this.state.email} 
                                                    onChange={e => this.setState({email: e.target.value})} 
                                                    id="exampleInputEmail1" 
                                                    placeholder="Digite o Email" 
                                                />
                                            </FormGroup>
                                            <FormGroup label="*Senha:" htmlFor="exampleInputPassword1">
                                                <InputField 
                                                    type="password" 
                                                    value={this.state.senha} 
                                                    onChange={e => this.setState({senha: e.target.value})} 
                                                    id="exampleInputPassword1" 
                                                    placeholder="Digite a Senha" 
                                                />
                                            </FormGroup>
                                            <hr />                
                                            <div class="d-flex justify-content-between w-100">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <span style={{fontSize:"10px"}} className="text-secondary" >*Preenchimento obrigatório</span>
                                                </div>
                                                <div className="d-flex">
                                                    <ButtonComponent
                                                        onClick={this.prepareCadastrar}
                                                        type="button"
                                                        label="Cadastrar"
                                                        icon="pi-plus"
                                                        variant="dark"
                                                        size="small"
                                                    />
                                                    <ButtonComponent
                                                        onClick={this.entrar}
                                                        type="button"
                                                        label="Entrar"
                                                        icon="pi-sign-in"
                                                        variant="info"
                                                        size="small"
                                                    />
                                                </div>
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

Login.contextType = AuthContext;

export default withRouter (Login);