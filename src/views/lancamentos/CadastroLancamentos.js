import React from "react";
import { withRouter } from "react-router-dom";
import * as messages from "../../components/Toastr";
import { obterListaMeses } from "../../app/utils";
import Card from "../../components/Card";
import FormGroup from "../../components/FormGroup";
import SelectMenu from "../../components/SelectMenu";
import CategoriaService from "../../app/service/CategoriaService";
import ButtonComponent from "../../components/Button";
import InputField from "../../components/InputField";
import LancamentoService from "../../app/service/LancamentoService";
import LocalStorageService from "../../app/service/LocalstorageService";
import ButtonModal from "../../components/ButtonModal";
import MapaCadastro from "../../components/MapaCadastro";
import { Dialog } from "primereact/dialog"; 

class CadastroLancamentos extends React.Component {
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
        categorias: [],
        mesSelecionado: '',
        valorFormatado: '',
        latitude: '',
        longitude: '',
        showModalMapa: false,
    }

    constructor() {
        super();
        this.service = new LancamentoService();
        this.categoriaService = new CategoriaService();
    }

    componentDidMount() {
        const params = this.props.match.params;
        this.buscarCategorias();
        if (params.id) {
            this.service
                .obterPorId(params.id)
                .then(response => {
                    this.setState({ ...response.data, atualizando: true });
                    this.setState({ valorFormatado: this.formatarValor(response.data.valor * 100) });
                }).catch(erros => {
                    messages.mensagemErro(erros.response.data);
                });
        }
    }

    buscarCategorias = () => {
        this.categoriaService.obterTodasCategorias()
            .then(response => {
                this.setState({ categorias: response.data });
            }).catch(error => {
                messages.mensagemErro("Erro ao buscar categorias.");
            });
    }

    handleValorChange = (event) => {
        const { value } = event.target;

        const apenasNumeros = value.replace(/\D/g, '');

        const valor = this.formatarValor(apenasNumeros);

        this.setState({ valor: apenasNumeros, valorFormatado: valor });
    }

    formatarValor = (valor) => {
        if (!valor) return '';
    
        const valorFloat = parseFloat(valor) / 100;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
            .format(valorFloat);
    }

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
        
        const { descricao, mes, ano, tipo, categoriaId, valor, latitude, longitude } = this.state;

        const lancamento = {
            descricao,
            valor: parseFloat(valor) / 100, 
            mes,
            ano,
            tipo,
            usuario: usuarioLogado.id,
            categoriaId,
            latitude,
            longitude
        };

        try {
            this.service.validar(lancamento);
        } catch (erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg));
            return false;
        }

        this.service
            .salvar(lancamento)
            .then(response => {
                this.props.history.push('/ConsultaLancamentos');
                messages.mensagemSucesso('Lançamento cadastrado com sucesso!');
            }).catch(error => {
                messages.mensagemErro(error.response.data);
            });
    };

    atualizar = () => {
        const { descricao, valorFormatado, mes, ano, tipo, status, id, usuario, categoriaId, latitude, longitude } = this.state;
    
        const apenasNumeros = valorFormatado.replace(/\D/g, '');
        const valorEmCentavos = parseFloat(apenasNumeros);
    
        const lancamento = { 
            descricao, 
            valor: valorEmCentavos / 100, 
            mes, 
            ano, 
            tipo, 
            id, 
            usuario, 
            status, 
            categoriaId, 
            latitude, 
            longitude 
        };
    
        this.service
            .atualizar(lancamento)
            .then(response => {
                this.props.history.push('/ConsultaLancamentos');
                messages.mensagemSucesso('Lançamento atualizado com sucesso!');
            }).catch(error => {
                messages.mensagemErro(error.response.data);
            });
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value });
    }

    toggleMapa = () => {
        this.setState((prevState) => ({ showModalMapa: !prevState.showModalMapa }));
    }

    handleSelectLocation = (latitude, longitude) => {
        const latitudeFormatada = parseFloat(latitude).toFixed(6);
        const longitudeFormatada = parseFloat(longitude).toFixed(6);
        this.setState({ latitude: latitudeFormatada, longitude: longitudeFormatada });
    }
    

    render() {
        const tipos = this.service.obterListaTipos();
        const meses = obterListaMeses("Escolher...");

        return (
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="*Descrição:">
                            <InputField
                                id="inputDescricao"
                                type="text"
                                name="descricao"
                                value={this.state.descricao}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputAno" label="*Ano:">
                            <InputField
                                id="inputAno"
                                type="number"
                                name="ano"
                                value={this.state.ano}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputMes" label="*Mês:">
                            <SelectMenu
                                onChange={e => this.setState({ mes: e.target.value })}
                                value={this.state.mes}
                                id="inputMes"
                                className="form-control"
                                lista={meses}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputCategoria" label="Categoria:">
                            <SelectMenu
                                className="form-control"
                                id="inputCategoria"
                                lista={[ 
                                    { label: "Escolher...", value: "" }, 
                                    ...this.state.categorias
                                        .sort((a, b) => a.descricao.localeCompare(b.descricao))
                                        .map(c => ({ label: c.descricao, value: c.id }))
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
                        <FormGroup id="inputValor" label="*Valor:">
                            <InputField
                                id="inputValor"
                                type="text"
                                name="valorFormatado"
                                value={this.state.valorFormatado}
                                onChange={this.handleValorChange} 
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="*Tipo:">
                            <SelectMenu
                                className="form-control"
                                id="inputTipo"
                                lista={tipos}
                                name="tipo"
                                value={this.state.tipo}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status: ">
                            <input
                                type="text"
                                className="form-control"
                                name="status"
                                value={this.state.status}
                                onChange={this.handleChange}
                                disabled
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputLatitude" label="Latitude:">
                            <InputField
                                id="inputLatitude"
                                type="text"
                                name="latitude"
                                disabled={true}
                                value={this.state.latitude}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputLongitude" label="Longitude:">
                            <InputField
                                id="inputLongitude"
                                type="text"
                                name="longitude"
                                disabled={true}
                                value={this.state.longitude}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="btnAbrirNoMapa" label="Selecione um ponto no mapa:">
                            <ButtonModal
                                onClick={this.toggleMapa}
                                icon="pi-map"
                                variant="dark"
                                size="max-w"
                            >Abrir no mapa</ButtonModal>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="d-flex">
                            <ButtonComponent
                                onClick={() => this.props.history.push('../ConsultaLancamentos')}
                                label="Cancelar"
                                icon="pi pi-times"
                                variant="danger"
                            />
                            <ButtonComponent
                                onClick={this.state.atualizando ? this.atualizar : this.submit}
                                label={this.state.atualizando ? 'Atualizar' : 'Salvar'}
                                icon="pi pi-save"
                                variant="success"
                            />
                        </div>
                    </div>
                </div>

                <Dialog
                    visible={this.state.showModalMapa}
                    onHide={this.toggleMapa}
                    header="Selecione um ponto no mapa"
                    modal
                >
                    <MapaCadastro 
                        onSelectLocation={this.handleSelectLocation} 
                    />
                </Dialog>
            </Card>
        );
    }
}

export default withRouter(CadastroLancamentos);
