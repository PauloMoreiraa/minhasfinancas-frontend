import ApiService from "../apiservice";
import ErroValidacao from "./exception/ErroValidacao";
import { obterListaMeses, obterListaTipos } from "../utils/GlobalUtils";
 

export default class LancamentoService extends ApiService{
    constructor(){
        super('/api/lancamentos');
    }

    obterPorId(id){
        return this.get(`/${id}`);
    }

    alterarStatus(id, status){
        return this.put(`/${id}/atualiza-status`, {status});
    }


    atualizar(lancamento){
        return this.put(`/${lancamento.id}`, lancamento);
    }

    obterListaMeses(){
        return obterListaMeses();
    }

    obterListaTipos(){
        return obterListaTipos();
    }

    salvar(lancamento){
        return this.post('/', lancamento);
    }

    consultar(lancamentoFiltro){
        let params = `?ano=${lancamentoFiltro.ano}`;

        if(lancamentoFiltro.mes){
            params = `${params}&mes=${lancamentoFiltro.mes}`;
        }
        if(lancamentoFiltro.tipo){
            params = `${params}&tipo=${lancamentoFiltro.tipo}`;
        }
        if(lancamentoFiltro.status){
            params = `${params}&status=${lancamentoFiltro.status}`;
        }
        if(lancamentoFiltro.usuario){
            params = `${params}&usuario=${lancamentoFiltro.usuario}`;
        }
        if(lancamentoFiltro.descricao){
            params = `${params}&descricao=${lancamentoFiltro.descricao}`;
        }
        if (lancamentoFiltro.categoriaId) {
            params = `${params}&categoriaId=${lancamentoFiltro.categoriaId}`;
        }
        
        return this.get(params);
    }

    deletar(id){
        return this.delete(id);
    }

    validar(lancamento){
        const erros = [];

        if(!lancamento.ano){
            erros.push("Informe o Ano.");
        }
        if(!lancamento.mes){
            erros.push("Informe o Mês.");
        }
        if(!lancamento.descricao){
            erros.push("Informe a Descrição.");
        }
        if(!lancamento.valor){
            erros.push("Informe o Valor.");
        }
        if(!lancamento.tipo){
            erros.push("Informe o Tipo.");
        }
        if(erros && erros.length>0){
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