import ApiService from "../ApiService";
import ErroValidacao from "./exception/ErroValidacao";
import { obterListaMeses, obterListaTipos } from "../utils";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';

export default class LancamentoService extends ApiService {
    constructor() {
        super('/api/lancamentos');
        this.featureLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/MinhasFinancasMapa/FeatureServer/0"
        });
    }

    obterPorId(id) {
        return this.get(`/${id}`);
    }

    alterarStatus = async (id, status) => {
        try {
            const updatedLancamento = await this.put(`/${id}/atualiza-status`, { status });
    
            const OBJECTID = await this.obterObjectIdDaFeatureLayer(id);
            if (!OBJECTID) {
                throw new Error("Não foi possível encontrar o OBJECTID para o lançamento na Feature Layer.");
            }
    
            const graphic = new Graphic({
                attributes: {
                    OBJECTID: OBJECTID,
                    status: updatedLancamento.data.status 
                }
            });
    
            const result = await this.featureLayer.applyEdits({
                updateFeatures: [graphic], 
            });
    
            if (result.updateFeatureResults.length > 0) {
                console.log("Status atualizado na Feature Layer com sucesso!", result);
            } else {
                console.error("Erro ao atualizar status na Feature Layer:", result);
            }
    
            return updatedLancamento;
        } catch (error) {
            console.error("Erro ao alterar o status do lançamento:", error);
            throw error;
        }
    };
    

    async obterObjectIdDaFeatureLayer(id_lancamento) {
        const query = this.featureLayer.createQuery();
        query.where = `id_lancamento = ${id_lancamento}`; 
        query.outFields = ["OBJECTID"];
        query.returnGeometry = false;

        const result = await this.featureLayer.queryFeatures(query);
        if (result.features.length > 0) {
            return result.features[0].attributes.OBJECTID; 
        }
        return null; 
    }


    async atualizar(lancamento) {
        try {
            const updatedLancamento = await this.put(`/${lancamento.id}`, lancamento);
            
            const OBJECTID = await this.obterObjectIdDaFeatureLayer(lancamento.id);
            if (!OBJECTID) {
                throw new Error("Não foi possível encontrar o OBJECTID para o lançamento na Feature Layer.");
            }

            const graphic = new Graphic({
                geometry: {
                    type: "point", 
                    longitude: lancamento.longitude,
                    latitude: lancamento.latitude
                },
                attributes: {
                    OBJECTID: OBJECTID, 
                    id_lancamento: updatedLancamento.data.id,
                    descricao: lancamento.descricao,
                    mes: lancamento.mes,
                    ano: lancamento.ano,
                    valor: lancamento.valor,
                    tipo: lancamento.tipo,
                    status: updatedLancamento.data.status,
                    latitude: lancamento.latitude,
                    longitude: lancamento.longitude,
                    categoria_id: updatedLancamento.data.categoria.id,
                    usuario_id: updatedLancamento.data.usuario.id
                }
            });
        
            const result = await this.featureLayer.applyEdits({
                updateFeatures: [graphic], 
            });

            if (result.updateFeatureResults.length > 0) {
                console.log("Lançamento atualizado na Feature Layer com sucesso!", result);
            } else {
                console.error("Erro ao atualizar na Feature Layer:", result);
            }
            
            return updatedLancamento;
        } catch (error) {
            console.error("Erro ao atualizar o lançamento na Feature Layer:", error);
            throw error;
        }
    }
    
    obterListaMeses() {
        return obterListaMeses();
    }

    obterListaTipos() {
        return obterListaTipos();
    }

    async salvar(lancamento) {
        const savedLancamento = await this.post('/', lancamento);
        
        const graphic = new Graphic({
            geometry: {
                type: "point", 
                longitude: lancamento.longitude,
                latitude: lancamento.latitude
            },
            attributes: {
                id_lancamento: savedLancamento.data.id,
                descricao: lancamento.descricao,
                mes: lancamento.mes,
                ano: lancamento.ano,
                valor: lancamento.valor,
                tipo: lancamento.tipo,
                status: savedLancamento.data.status,
                latitude: lancamento.latitude,
                longitude: lancamento.longitude,
                categoria_id: savedLancamento.data.categoria.id,
                usuario_id: savedLancamento.data.usuario.id
            }
        });
        debugger
        return this.featureLayer.applyEdits({
            addFeatures: [graphic],
        }).then((result) => {
            if (result.addFeatureResults.length > 0) {
                console.log("Lançamento salvo na Feature Layer com sucesso!", result);
            } else {
                console.error("Erro ao salvar na Feature Layer:", result);
            }
            return savedLancamento;
        }).catch((error) => {
            console.error("Erro ao adicionar o lançamento na Feature Layer:", error);
            throw error; 
        });
    }

    consultar(lancamentoFiltro) {
        let params = `?ano=${lancamentoFiltro.ano}`;

        if (lancamentoFiltro.mes) {
            params = `${params}&mes=${lancamentoFiltro.mes}`;
        }
        if (lancamentoFiltro.tipo) {
            params = `${params}&tipo=${lancamentoFiltro.tipo}`;
        }
        if (lancamentoFiltro.status) {
            params = `${params}&status=${lancamentoFiltro.status}`;
        }
        if (lancamentoFiltro.usuario) {
            params = `${params}&usuario=${lancamentoFiltro.usuario}`;
        }
        if (lancamentoFiltro.descricao) {
            params = `${params}&descricao=${lancamentoFiltro.descricao}`;
        }
        if (lancamentoFiltro.categoriaId) {
            params = `${params}&categoriaId=${lancamentoFiltro.categoriaId}`;
        }

        return this.get(params);
    }

    async deletar(id) {
        try {
            await this.delete(`${id}`);

            const OBJECTID = await this.obterObjectIdDaFeatureLayer(id);
            if (!OBJECTID) {
                throw new Error("Não foi possível encontrar o OBJECTID para o lançamento na Feature Layer.");
            }

            const result = await this.featureLayer.applyEdits({
                deleteFeatures: [{ objectId: OBJECTID }] 
            });

            if (result.deleteFeatureResults.length > 0) {
                console.log("Lançamento deletado da Feature Layer com sucesso!", result);
            } else {
                console.error("Erro ao deletar na Feature Layer:", result);
            }

        } catch (error) {
            console.error("Erro ao deletar o lançamento:", error);
            throw error;
        }
    }

    validar(lancamento) {
        const erros = [];

        if (!lancamento.ano) {
            erros.push("Informe o Ano.");
        }
        if (!lancamento.mes) {
            erros.push("Informe o Mês.");
        }
        if (!lancamento.descricao) {
            erros.push("Informe a Descrição.");
        }
        if (!lancamento.valor) {
            erros.push("Informe o Valor.");
        }
        if (!lancamento.tipo) {
            erros.push("Informe o Tipo.");
        }
        if (erros && erros.length > 0) {
            throw new ErroValidacao(erros);
        }
    }

    exportarDados(lancamentoFiltro) {
        let params = `?ano=${lancamentoFiltro.ano}`;

        if (lancamentoFiltro.mes) {
            params = `${params}&mes=${lancamentoFiltro.mes}`;
        }
        if (lancamentoFiltro.tipo) {
            params = `${params}&tipo=${lancamentoFiltro.tipo}`;
        }
        if (lancamentoFiltro.status) {
            params = `${params}&status=${lancamentoFiltro.status}`;
        }
        if (lancamentoFiltro.usuario) {
            params = `${params}&usuario=${lancamentoFiltro.usuario}`;
        }
        if (lancamentoFiltro.descricao) {
            params = `${params}&descricao=${lancamentoFiltro.descricao}`;
        }
        if (lancamentoFiltro.categoriaId) {
            params = `${params}&categoriaId=${lancamentoFiltro.categoriaId}`;
        }

        return this.get(`/download${params}`, { responseType: 'blob' });
    }
}
