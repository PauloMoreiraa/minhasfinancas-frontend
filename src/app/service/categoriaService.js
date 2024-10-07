import ApiService from "../ApiService";

export default class CategoriaService extends ApiService {
    constructor() {
        super('/api/categorias');
    }

    salvarCategoria(categoria) {
        return this.post('/', categoria);
    }

    obterTodasCategorias() {
        return this.get('');
    }

}
