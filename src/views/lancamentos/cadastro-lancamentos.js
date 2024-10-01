import React from "react";
import { withRouter } from "react-router-dom";
import * as messages from "../../components/toastr"

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import CategoriaService from "../../app/service/categoriaService";

import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";

class CadastroLancamentos extends React.Component{

    state = {
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        categoriaId: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false,
        categorias: []
    }

    constructor(){
        super();
        this.service = new LancamentoService();
        this.categoriaService = new CategoriaService();
    }

    componentDidMount(){
        const params = this.props.match.params
        this.buscarCategorias();
        if(params.id){
            this.service
                    .obterPorId(params.id)
                    .then(response => {
                            this.setState({...response.data, atualizando: true})
                    }).catch(erros => {
                        messages.mensagemErro(erros.response.data)
                    })
        }
    }

    buscarCategorias = () => {
        this.categoriaService.obterTodasCategorias()
            .then(response => {
                this.setState({ categorias: response.data }); 
            }).catch(error => {
                messages.mensagemErro("Erro ao buscar categorias.");
            });
    };

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const {descricao, valor, mes, ano, tipo} = this.state;

        const lancamento = {descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id}

        try {
            this.service.validar(lancamento)
        } catch (erro) {
            const mensagens = erro.mensagens
            mensagens.forEach(msg => messages.mensagemErro(msg));
            return false;
        }

        this.service
            .salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento cadastrado com sucesso!')
            }).catch(error =>{
                messages.mensagemErro(error.response.data)
            })
    }

    atualizar = () => {
        const {descricao, valor, mes, ano, tipo, status, id, usuario, categoriaId } = this.state;
        const lancamento = {descricao, valor, mes, ano, tipo, id, usuario, status, categoriaId }

        this.service
            .atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lançamento atualizado com sucesso!')
            }).catch(error =>{
                messages.mensagemErro(error.response.data)
            })
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name] : value })
    }

    render(){
        const tipos = this.service.obterListaTipos();
        const meses = this.service.obterListaMeses();

        return(
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição: *">
                            <input id="inputDescricao" type="text" className="form-control" name="descricao" value={this.state.descricao} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input id="inputAno" type="number" className="form-control" name="ano" value={this.state.ano} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputMes" label="Mês: *">
                            <SelectMenu className="form-control" id="inputMes" lista={meses} name="mes" value={this.state.mes} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputCategoria" label="Categoria: *">
                            <SelectMenu
                                className="form-control"
                                id="inputCategoria"
                                lista={[
                                    { label: "Selecione...", value: "" },
                                    ...this.state.categorias.map(c => ({ label: c.descricao, value: c.id }))
                                ]}
                                name="categoriaId"
                                value={this.state.categoriaId}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input id="inputValor" type="number" className="form-control" name="valor" value={this.state.valor} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo: *">
                           <SelectMenu className="form-control" id="inputTipo" lista={tipos} name="tipo" value={this.state.tipo} onChange={this.handleChange} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status: ">
                           <input type="text" className="form-control" name="status" value={this.state.status} onChange={this.handleChange} disabled/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="d-flex">
                            <button onClick={e =>
                        this.props.history.push('/consulta-lancamentos')} style={{minWidth:"100px"}} className="btn gap-1 mx-1 btn-dark d-flex justify-content-center align-items-center"><i className="pi pi-times"></i>Cancelar</button>
                            {this.state.atualizando ? (
                                <button onClick={this.atualizar} style={{minWidth:"100px"}} className="btn gap-1 d-flex justify-content-center align-items-center btn-info"><i className="pi pi-refresh"></i>Atualizar</button>
                            ) : (
                                <button onClick={this.submit} style={{minWidth:"100px"}} className="btn gap-1 d-flex justify-content-center align-items-center btn-info"><i className="pi pi-save"></i>Salvar</button>
                            )}
                        </div>
                    </div>
                        
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos);