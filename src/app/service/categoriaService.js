import ApiService from "../ApiService";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';

export default class CategoriaService extends ApiService {
    constructor() {
        super('/api/categorias');
        this.categoriaTable = new FeatureLayer({
            url: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/MinhasFinancasMapa/FeatureServer/2",  
            geometryType: null 
        });
    }

    async salvarCategoria(categoria) {
        const savedCategoria = await this.post('/', categoria);

        const graphic = new Graphic({
            attributes: {
                id_categoria: savedCategoria.data.id,
                descricao: savedCategoria.data.descricao,
            }
        });

        return this.categoriaTable.applyEdits({
            addFeatures: [graphic],  
        }).then((result) => {
            if (result.addFeatureResults.length > 0) {
                console.log("Categoria salva na tabela do ArcGIS com sucesso!", result);
            } else {
                console.error("Erro ao salvar na tabela do ArcGIS:", result);
            }
            return savedCategoria;
        }).catch((error) => {
            console.error("Erro ao salvar a categoria na tabela do ArcGIS:", error);
            throw error; 
        });
    }

    obterTodasCategorias() {
        return this.get('');
    }
}
