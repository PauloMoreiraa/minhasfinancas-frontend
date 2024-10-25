import ApiService from "../ApiService";
import Graphic from '@arcgis/core/Graphic'; 
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'; 

class UploadService {
    constructor(apiUrl) {
        this.apiService = new ApiService(apiUrl);
        this.featureLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/MinhasFinancasMapa/FeatureServer/0"
        });
    }

    async uploadFile(usuarioId, file) {
        const validTypes = ['text/csv', 'application/vnd.ms-excel'];
        const maxFileSize = 10 * 1024 * 1024; // 10MB
    
        if (!validTypes.includes(file.type)) {
            return 'Por favor, selecione um arquivo CSV válido.';
        }
    
        if (file.size > maxFileSize) {
            return 'O arquivo é muito grande. O tamanho máximo permitido é 10MB.'; 
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await this.apiService.post(`/api/lancamentos/${usuarioId}/importar`, formData);
            
            if (response.data.lancamentosJson) {
                await this.saveToArcGIS(response.data.lancamentosJson);
            }

            return response.data;
        } catch (error) {
            return `Erro ao importar: ${error.response ? JSON.stringify(error.response.data, null, 2) : error.message}`; 
        }
    }
    
    async saveToArcGIS(lancamentosJson) {
        const requests = lancamentosJson.map(async (lancamentoJson) => {
            const lancamento = typeof lancamentoJson === 'string' ? JSON.parse(lancamentoJson) : lancamentoJson;
            
            const graphic = new Graphic({
                geometry: {
                    type: "point", 
                    longitude: lancamento.longitude,
                    latitude: lancamento.latitude
                },
                attributes: {
                    id_lancamento: lancamento.id,
                    descricao: lancamento.descricao,
                    mes: lancamento.mes,
                    ano: lancamento.ano,
                    valor: lancamento.valor,
                    tipo: lancamento.tipo,
                    status: lancamento.status,
                    categoria_id: lancamento.categoria ? lancamento.categoria.id_categoria : null,
                    latitude: lancamento.latitude,
                    longitude: lancamento.longitude,
                    usuario_id: lancamento.usuario.id, 
                }
            });
    
            try {
                const result = await this.featureLayer.applyEdits({
                    addFeatures: [graphic]
                });
                if (result.addFeatureResults.length > 0) {
                    console.log('Lançamento salvo na Feature Layer com sucesso!', result);
                } else {
                    console.error('Erro ao salvar na Feature Layer:', result);
                }
            } catch (error) {
                console.error('Erro ao adicionar feature:', error);
            }
        });
    
        await Promise.all(requests);
    }
}    

const uploadService = new UploadService('http://localhost:8080');

export default uploadService;
