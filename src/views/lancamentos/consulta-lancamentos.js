import React from "react";
import { withRouter } from 'react-router-dom';

import Card from '../../components/card';
import FormGroup from '../../components/form-group';
import SelectMenu from "../../components/selectMenu";
import LancamentosTable from "./lancamentosTable";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";
import CategoriaService from "../../app/service/categoriaService";
import ButtonComponent from "../../components/button";

import * as messages from '../../components/toastr';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

class ConsultaLancamentos extends React.Component {
    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        categoriaId: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: [],
        categorias: []
    };

    constructor() {
        super();
        this.service = new LancamentoService();
        this.categoriaService = new CategoriaService();
    }

    componentDidMount() {
        this.buscarCategorias(); // Chamando o método para buscar categorias ao montar o componente
    }

    buscarCategorias = () => {
        this.categoriaService.obterTodasCategorias()
            .then(resposta => {
                this.setState({ categorias: resposta.data }); // Armazenando as categorias no estado
            }).catch(error => {
                messages.mensagemErro("Erro ao buscar categorias.");
            });
    };

    buscar = () => {
        if (!this.state.ano) {
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório.');
            return false;
        }

    
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
    
        // objeto de filtro para lançamentos
        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            categoriaId: this.state.categoriaId,
            usuario: usuarioLogado.id
        };
    
       
        this.service
        .consultar(lancamentoFiltro)
        .then(resposta => {
            const lista = resposta.data;
            if (lista.length < 1) {
                messages.mensagemAlert("Nenhum resultado encontrado.");
            }
            this.setState({ lancamentos: lista });
        }).catch(error => {
            console.log(error);
        });
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`);
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento });
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, lancamentoDeletar: {} });
    }

    deletar = (lancamento) => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index, 1);
                this.setState({ lancamentos: lancamentos, showConfirmDialog: false });

                messages.mensagemSucesso('Lançamento excluído com sucesso!');
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar excluir o lançamento.');
            });
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos');
    }

    alterarStatus = async (lancamento, status) => {
        try {
            const response = await this.service.alterarStatus(lancamento.id, status);
            const lancamentos = this.state.lancamentos;
            const index = lancamentos.indexOf(lancamento);
            
            if (index !== -1) {
                lancamento['status'] = status;
                lancamentos[index] = lancamento;
                this.setState({ lancamentos });
            }
            
            messages.mensagemSucesso("Status atualizado com sucesso!");
        } catch (error) {
            messages.mensagemErro("Não é possível efetivar um lançamento com data futura.");
        }
    };
    
    render() {
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Sim" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} className="p-button-secondary" />
            </div>
        );

        return (
            <Card title='Consulta Lançamentos'>
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="*Ano:">
                                <input onChange={e => this.setState({ ano: e.target.value })} value={this.state.ano} type="number" className="form-control" id="inputAno" placeholder="Digite o Ano" />
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" label="Mês: ">
                                <SelectMenu onChange={e => this.setState({ mes: e.target.value })} value={this.state.mes} id="inputMes" className="form-control" lista={meses} />
                            </FormGroup>
                            <FormGroup htmlFor="inputDescricao" label="Descrição: ">
                                <input onChange={e => this.setState({ descricao: e.target.value })} value={this.state.descricao} type="text" className="form-control" id="inputDescricao" placeholder="Digite a Descrição" />
                            </FormGroup>
                            <FormGroup htmlFor="inputTipo" label="Tipo de Lançamento: ">
                                <SelectMenu onChange={e => this.setState({ tipo: e.target.value })} value={this.state.tipo} id="inputTipo" className="form-control" lista={tipos} />
                            </FormGroup>
                            <FormGroup htmlFor="inputCategoria" label="Categoria: ">
                                <SelectMenu 
                                    onChange={e => this.setState({ categoriaId: e.target.value })} 
                                    value={this.state.categoriaId} 
                                    id="inputCategoria" 
                                    className="form-control" 
                                    lista={[
                                        { label: "Selecione...", value: "" },
                                        ...this.state.categorias.map(c => ({ label: c.descricao, value: c.id }))
                                    ]} 
                                />
                            </FormGroup>
                            <div className="d-flex gap-1">
                                 {/* Botão "Buscar" */}
                                <ButtonComponent
                                onClick={this.buscar}
                                type="button"
                                label="Buscar"
                                icon="pi-search"
                                variant="success"
                                />

                                {/* Botão "Cadastrar" */}
                                <ButtonComponent
                                onClick={this.preparaFormularioCadastro}
                                type="button"
                                label="Cadastrar"
                                icon="pi-plus"
                                variant="danger"
                                />

                                {/* Botão "Exportar Dados" */}
                                <ButtonComponent
                                onClick={this.exportarDados}
                                type="button"
                                label="Exportar Dados"
                                icon="pi-download"
                                variant="info-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos} deleteAction={this.abrirConfirmacao} editAction={this.editar} alterarStatus={this.alterarStatus} />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmação" visible={this.state.showConfirmDialog} style={{ width: '50vw' }} modal={true} onHide={() => this.setState({ showConfirmDialog: false })} footer={confirmDialogFooter}>
                        <p className="m-0">
                            Deseja excluir esse lançamento?
                        </p>
                    </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos);
