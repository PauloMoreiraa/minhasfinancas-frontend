import React from "react";
import Card from "../components/Card";
import FormGroup from "../components/FormGroup";
import {withRouter} from "react-router-dom";
import UsuarioService from "../app/service/UsuarioService";
import {mensagemSucesso, mensagemErro } from "../components/Toastr";
import ButtonComponent from "../components/Button";
import InputField from "../components/InputField";

class CadastroUsuario extends React.Component{

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor(){
        super();
        this.service = new UsuarioService();
    }


    cadastrar = () => {

        const {nome, email, senha, senhaRepeticao} = this.state;
    
        const usuario = {nome, email, senha, senhaRepeticao};

        try{
            this.service.validar(usuario);
        }catch(error){
            const msgs = error.mensagens;
            msgs.forEach(msg => mensagemErro(msg));
            return false;
        }

        this.service.salvar(usuario)
            .then(response =>{
                mensagemSucesso('Usuário cadastrado com sucesso! Faça o login para acessar o sistema.');
                this.props.history.push('/login');
            }).catch(error => {
                mensagemErro(error.response.data);
            })
    }

    cancelar = () => {
        this.props.history.push('/Home');
    }

    render(){
        return(
            <div className="row justify-content-center">  
                <div className="col-md-6">
                    <Card title="Cadastro de Usuário">
                        <div className="bs-component">
                            <FormGroup label="*Nome:" htmlFor="inputNome">
                                <InputField 
                                    type="text" 
                                    id="inputNome" 
                                    name="nome" 
                                    onChange={e => this.setState({nome: e.target.value})} 
                                />
                            </FormGroup>
                            <FormGroup label="*Email:" htmlFor="inputEmail">
                                <InputField 
                                    type="email" 
                                    id="inputEmail" 
                                    name="email" 
                                    onChange={e => this.setState({email: e.target.value})} 
                                />
                            </FormGroup>
                            <FormGroup label="*Senha:" htmlFor="inputSenha">
                                <InputField 
                                    type="password" 
                                    id="inputSenha" 
                                    name="senha" 
                                    onChange={e => this.setState({senha: e.target.value})} 
                                />
                            </FormGroup>
                            <FormGroup label="*Repita a Senha:" htmlFor="inputRepitaSenha">
                                <InputField 
                                    type="password" 
                                    id="inputRepitaSenha" 
                                    name="senha" 
                                    onChange={e => this.setState({senhaRepeticao: e.target.value})} 
                                />
                            </FormGroup>
                            <div className="d-flex justify-content-between mt-3">
                                <span className="text-secondary" style={{ fontSize: "12px" }}>
                                    *Preenchimento obrigatório
                                </span>
                                <div className="d-flex">
                                    <ButtonComponent
                                    onClick={this.cancelar}
                                    label="Cancelar"
                                    icon="pi-times"
                                    variant="dark"
                                    />
                                    <ButtonComponent
                                    onClick={this.cadastrar}
                                    label="Salvar"
                                    icon="pi-save"
                                    variant="info"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

export default withRouter(CadastroUsuario);