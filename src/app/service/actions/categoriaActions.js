import * as messages from "../../../components/Toastr";
import CategoriaService from "../CategoriaService";

const categoriaService = new CategoriaService();

export const cadastrarCategoria = async (novaCategoria) => {
    if (!novaCategoria || novaCategoria.trim() === '') {
        messages.mensagemErro('O campo Descrição é obrigatório.');
        return;
    }

    try {
        const response = await categoriaService.salvarCategoria({ descricao: novaCategoria });
        messages.mensagemSucesso('Categoria cadastrada com sucesso!'); 
        return response;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            messages.mensagemAlert('A categoria já existe.'); 
        } else {
            messages.mensagemErro('Erro ao cadastrar categoria.');
        }
    }
};
