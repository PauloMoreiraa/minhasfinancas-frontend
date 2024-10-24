import React from "react";
import { withRouter } from "react-router-dom";

import Card from "../../components/Card";
import FormGroup from "../../components/FormGroup";
import SelectMenu from "../../components/SelectMenu";
import LancamentosTable from "./LancamentosTable";
import LancamentoService from "../../app/service/LancamentoService";
import LocalStorageService from "../../app/service/LocalstorageService";
import CategoriaService from "../../app/service/CategoriaService";
import ButtonComponent from "../../components/Button";
import ButtonModal from "../../components/ButtonModal";
import ModalCategoria from "../../components/ModalCategoria";
import ModalUpload from "../../components/ModalUpload";

import { cadastrarCategoria } from "../../app/service/actions/CategoriaActions";

import * as messages from "../../components/Toastr";

import { Dialog } from "primereact/dialog";
import InputField from "../../components/InputField";
import ModalMapa from "../../components/ModalMapa";

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
        categorias: [],
        showModal: false,
        novaCategoria: '',
        showModalUpload: false,
        selectedFile: null,
        showModalMapa: false,
        lancamentosMapa: [],
        filtroMapa: {
            ano: '',
            mes: '',
            descricao: '',
            tipo: '',
            categoriaId: 0
        }
    }

    constructor() {
        super();
        this.service = new LancamentoService();
        this.categoriaService = new CategoriaService();
    }

    componentDidMount() {
        this.buscarCategorias(); 

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
        if (usuarioLogado) {
            this.setState({ usuarioId: usuarioLogado.id });
        }
    }

    buscarCategorias = () => {
        this.categoriaService.obterTodasCategorias()
            .then(resposta => {
                this.setState({ categorias: resposta.data });
            }).catch(error => {
                messages.mensagemErro("Erro ao buscar categorias.");
            })
    }

    buscar = () => {
        if (!this.state.ano) {
            messages.mensagemErro('O preenchimento do campo Ano é obrigatório.');
            return false;
        };
    
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
    
        const lancamentoFiltro = {
            ano: this.state.ano || '',  
            mes: this.state.mes || '',
            tipo: this.state.tipo || '',
            descricao: this.state.descricao || '',
            categoriaId: this.state.categoriaId || '',
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
            })
    };
    

    editar = (id) => {
        this.props.history.push(`/CadastroLancamentos/${id}`);
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
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/CadastroLancamentos');
    }

    alterarStatus = async (lancamento, status) => {
        try {
            await this.service.alterarStatus(lancamento.id, status);
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

    openModal = () => {
        this.setState({ showModal: true });
    };
    
    closeModal = () => {
        this.setState({ showModal: false, novaCategoria: '' });
    }

    openModalUpload = () => {
        this.setState({ showModalUpload: true });
    };
    
    closeModalUpload = () => {
        this.setState({ showModalUpload: false });
    };

    handleUploadFile = (file) => {
        console.log('Arquivo selecionado para upload:', file);
        messages.mensagemSucesso("Upload realizado com sucesso!");
    };

    cadastrarCategoria = async () => {
        const { novaCategoria } = this.state;
        const response = await cadastrarCategoria(novaCategoria);
        if (response) {
            this.buscarCategorias();  
            this.closeModal();   
        }
    };

    exportarDados = async () => {
        this.setState({ isExporting: true });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const { ano, mes, tipo, descricao, categoriaId } = this.state;
            const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

            if (!ano) {
                messages.mensagemErro("O preenchimento do campo Ano é obrigatório.");
                return;
            }

            if(ano < 1000 || ano > 3000){
                messages.mensagemErro("Ano inválido.");
                return;
            }
    
            const lancamentoFiltro = {
                ano,
                mes,
                tipo,
                descricao,
                categoriaId,
                usuario: usuarioLogado.id
            };
    
            const response = await this.service.exportarDados(lancamentoFiltro);
    
            const dados = response.data;
    
            if (!dados || dados.length === 0) {
                messages.mensagemAlert("Nenhum resultado foi encontrado para sua exportação. Tente ajustar os filtros.");
                return;
            }
    
            const jsonString = JSON.stringify(dados, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
    
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lancamentos.json';
            document.body.appendChild(a);
            a.click();
    
            URL.revokeObjectURL(url);
            document.body.removeChild(a);

            messages.mensagemSucesso("Dados exportados com sucesso!");
        } catch (error) {
            messages.mensagemErro("Erro ao exportar os dados: " + error.message);
            console.log(error.message);
        } finally {
            this.setState({ isExporting: false });
        }
    };

    handleClick = () => {
        const { ano, mes, tipo, descricao, categoriaId } = this.state;
        
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
    
        const usuarioId = usuarioLogado ? usuarioLogado.id : null;
    
        this.setState({ 
            showModalMapa: true, 
            lancamentosMapa: this.state.lancamentos,
            filtroMapa: { 
                ano, 
                mes, 
                tipo, 
                descricao, 
                categoriaId, 
                usuarioId 
            } 
        });
    };
    
    
    
    closeModalMapa = () => {
        this.setState({ showModalMapa: false });
    };
    
    render() {
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div className="d-flex justify-content-end align-items-end">
                <ButtonComponent
                    onClick={this.cancelarDelecao}
                    type="button"
                    label="Cancelar"
                    icon="pi pi-times"
                    variant="dark" 
                    size="medium"
                />
                <ButtonComponent
                    onClick={this.deletar}
                    type="button"
                    label="Sim"
                    icon="pi pi-check"
                    variant="info" 
                    size="medium"
                />
            </div>
        )

        //modal footer para a categoria
        const modalFooter = (
            <div className="d-flex justify-content-end align-items-end">
                <ButtonComponent 
                    onClick={this.closeModal} 
                    label="Cancelar" 
                    icon="pi pi-times" 
                    variant="dark"
                    size="medium"
                />
                <ButtonComponent 
                    onClick={this.cadastrarCategoria} 
                    label="Confirmar" 
                    icon="pi pi-check" 
                    variant="info"
                    size="medium"
                />
            </div>
        )

        return (
            <Card title='Consulta Lançamentos'>
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="*Ano:">
                                <InputField 
                                    onChange={e => {
                                        const value = e.target.value;
                                        if (value.length <= 4 && /^\d*$/.test(value)) {
                                            this.setState({ ano: value });
                                        }
                                    }} 
                                    value={this.state.ano} 
                                    type="number" 
                                    id="inputAno" 
                                    placeholder="Digite o Ano" 
                                    disabled={this.state.isExporting}
                                />
                            </FormGroup>
                            <FormGroup htmlFor="inputMes" label="Mês: ">
                                <SelectMenu onChange={e => this.setState({ mes: e.target.value })} value={this.state.mes} id="inputMes" className="form-control" lista={meses} disabled={this.state.isExporting} />
                            </FormGroup>
                            <FormGroup htmlFor="inputDescricao" label="Descrição: ">
                                <InputField 
                                    onChange={e => this.setState({ descricao: e.target.value })} 
                                    value={this.state.descricao} 
                                    type="text" 
                                    id="inputDescricao" 
                                    placeholder="Digite a Descrição"
                                    disabled={this.state.isExporting} 
                                />
                            </FormGroup>
                            <FormGroup htmlFor="inputTipo" label="Tipo de Lançamento: ">
                                <SelectMenu onChange={e => this.setState({ tipo: e.target.value })} value={this.state.tipo} id="inputTipo" className="form-control" lista={tipos} disabled={this.state.isExporting} />
                            </FormGroup>
                            <FormGroup htmlFor="inputCategoria" label="Categoria: ">
                                <SelectMenu 
                                    onChange={e => this.setState({ categoriaId: e.target.value })} 
                                    value={this.state.categoriaId} 
                                    id="inputCategoria" 
                                    className="form-control" 
                                    lista={[
                                        { label: "Escolher...", value: "" },
                                        ...this.state.categorias
                                            .sort((a, b) => a.descricao.localeCompare(b.descricao))
                                            .map(c => ({ label: c.descricao, value: c.id }))
                                    ]} 
                                    disabled={this.state.isExporting}
                                />
                            </FormGroup>
                            <div className="d-flex gap-1">
                                <ButtonComponent
                                onClick={this.buscar}
                                type="button"
                                label="Buscar"
                                icon="pi-search"
                                variant="success"
                                size="medium"
                                disabled={this.state.isExporting}
                                />
                                <ButtonComponent
                                    onClick={this.preparaFormularioCadastro}
                                    type="button"
                                    label="Cadastrar"
                                    icon="pi-plus"
                                    variant="danger"
                                    size="medium"
                                    disabled={this.state.isExporting}
                                />
                                <ButtonComponent
                                    onClick={this.exportarDados}
                                    type="button"
                                    label={this.state.isExporting ? "Exportando..." : "Exportar Dados"}
                                    icon="pi-download"
                                    variant="info"
                                    size="medium"
                                    disabled={this.state.isExporting}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="text-center">
                            <h3>Outras opções</h3>
                            <hr />
                            <div className="d-flex justify-content-center align-items-center">
                                <ButtonModal 
                                    onClick={this.openModal} 
                                    title="Cadastrar nova categoria" 
                                    icon="pi-plus-circle" 
                                    size="large"
                                    variant="dark" disabled={this.state.isExporting}>
                                    Cadastrar nova categoria
                                </ButtonModal>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-center align-items-center">
                                <ButtonModal 
                                    onClick={this.openModalUpload} 
                                    title="Realizar upload de arquivo" 
                                    icon="pi-upload" 
                                    variant="dark"
                                    size="large"
                                    disabled={this.state.isExporting}>
                                    Realizar upload de arquivo
                                </ButtonModal>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-center align-items-center">
                                <ButtonModal 
                                    onClick={this.handleClick} 
                                    title="Visualizar lançamentos no mapa" 
                                    icon="pi-map" 
                                    variant="dark"
                                    size="large"
                                    disabled={this.state.isExporting}>
                                    Visualizar lançamentos no mapa
                                </ButtonModal>
                            </div>
                            <hr />
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
                <ModalCategoria 
                    header="Cadastrar Categoria" 
                    visible={this.state.showModal} 
                    onHide={this.closeModal} 
                    footer={modalFooter}>
                    <FormGroup htmlFor="novaCategoria" label="*Descrição:">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="novaCategoria" 
                            value={this.state.novaCategoria} 
                            onChange={e => this.setState({ novaCategoria: e.target.value })} 
                            placeholder="Digite a descrição da categoria"
                        />
                    </FormGroup>
                </ModalCategoria>
                
                <ModalUpload
                    header="Upload - Arquivo CSV"
                    visible={this.state.showModalUpload}
                    onHide={this.closeModalUpload}
                    usuarioId={this.state.usuarioId}
                    
                >
                    <FormGroup htmlFor="inputFile" label="Selecione um arquivo:">
                        <input 
                            type="file" 
                            id="inputFile" 
                            onChange={e => this.setState({ selectedFile: e.target.files[0] })} 
                            
                    />
                    </FormGroup>
                </ModalUpload>

                <Dialog 
                    visible={this.state.showModalMapa}
                    onHide={this.closeModalMapa}
                    header="Lançamentos realizados"        
                >
                        <ModalMapa filtros={this.state.filtroMapa} />
                </Dialog>
                
                
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos);
