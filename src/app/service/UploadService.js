import ApiService from '../ApiService'; 

class UploadService {
    constructor(apiUrl) {
        this.apiService = new ApiService(apiUrl); 
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
            return response.data;
        } catch (error) {
            return `Erro ao importar: ${error.response ? JSON.stringify(error.response.data, null, 2) : error.message}`; 
        }
    }
    
}

const uploadService = new UploadService('http://localhost:8080');

export default uploadService;
