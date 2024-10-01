import ApiService from "../apiservice";

export default class CategoriaService extends ApiService {
    constructor() {
        super('/api/categorias'); // Base URL para categorias
    }

    obterTodasCategorias() {
        return this.get(''); // Método para obter todas as categorias
    }

}
