import * as messages from '../../../components/toastr'
import CategoriaService from '../categoriaService';

const categoriaService = new CategoriaService();

export const cadastrarCategoria = async (novaCategoria) => {
    // Verifica se a descrição da categoria está vazia
    if (!novaCategoria || novaCategoria.trim() === '') {
        messages.mensagemErro('O campo Descrição é obrigatório.'); // Mensagem de erro se a descrição for vazia
        return;
    }

    try {
        // Lógica para cadastrar a nova categoria
        const response = await categoriaService.salvarCategoria({ descricao: novaCategoria });
        messages.mensagemSucesso('Categoria cadastrada com sucesso!'); 
        return response;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            // Verifique se o erro é devido a categoria já existente
            messages.mensagemAlert('A categoria já existe.'); // Mensagem específica para categoria existente
        } else {
            messages.mensagemErro('Erro ao cadastrar categoria.'); // Mensagem genérica para outros erros
        }
    }
};
