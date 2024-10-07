import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import ButtonComponent from './Button';
import uploadService from '../app/service/UploadService';
import * as messages from '../components/Toastr';
import ModalErros from './ModalErros'; 

const ModalUpload = ({ header, visible, onHide, footer, width = '50vw', usuarioId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errosDetalhados, setErrosDetalhados] = useState([]);
    const [showErrosModal, setShowErrosModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); 

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        validateFile(file); 
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        validateFile(file);
    };

    const validateFile = (file) => {
        if (!file) {
            setErrorMessage('Por favor, selecione um arquivo.');
        } else if (file.type !== 'text/csv') {
            setErrorMessage('Formato inválido! Por favor, selecione um arquivo CSV.');
        } else if (file.size === 0) {
            setErrorMessage('O arquivo está vazio.'); 
        } else {
            setErrorMessage(''); 
            setSelectedFile(file); 
        }
    };

    const handleUpload = async () => {
        if (!usuarioId) {
            messages.mensagemAlert('ID de usuário não encontrado.');
            return;
        }
    
        if (selectedFile) {
            setUploading(true);
            const result = await uploadService.uploadFile(usuarioId, selectedFile);
    
            if (result) {
                if (typeof result === 'string') { 
                    setErrorMessage(result);
                    setUploading(false);
                    return; 
                }
    
                const totalImportadas = result.lancamentosImportados;
                const totalErros = result.erros;
                const totalLinhas = totalImportadas + totalErros; 
    
                onHide(); 
    
                if (totalErros === 0) {
                    messages.mensagemSucesso('Importação concluída com sucesso!');
                } else {
                    const mensagem = `Importação concluída: ${totalImportadas} de ${totalLinhas} lançamentos importados. ${totalErros} erro(s) encontrado(s).`;
                    messages.mensagemAlert(mensagem);
                    setErrosDetalhados(result.mensagensErros);
                    setShowErrosModal(true); 
                }
    
                setSelectedFile(null);
            }
            setUploading(false);
        } else {
            setErrorMessage('Por favor, selecione um arquivo.'); 
        }
    };
    

    const handleCancel = () => {
        setSelectedFile(null); 
        setErrosDetalhados([]); 
        setErrorMessage(''); 
        onHide();
    };

    const renderButton = (type) => {
        switch (type) {
            case 'select':
                return (
                    <ButtonComponent
                        icon="pi pi-file"
                        variant="info-3"
                        onClick={() => document.getElementById('fileInput').click()}
                        label="Selecione o arquivo"
                        size="large"
                    />
                );
            case 'upload':
                return (
                    <ButtonComponent
                        icon="pi pi-cloud-upload"
                        variant="success"
                        onClick={handleUpload}
                        label={uploading ? 'Fazendo Upload...' : 'Upload'}
                        disabled={uploading || !selectedFile}
                        size="small"
                    />
                );
            case 'cancel':
                return (
                    <ButtonComponent
                        icon="pi pi-times"
                        variant="danger"
                        onClick={handleCancel}
                        label="Cancelar"
                        size="small"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Dialog
                header={header}
                visible={visible}
                style={{ width }}
                modal={true}
                onHide={onHide}
                footer={footer}
            >
                <div className="card">
                    <div className="card-header d-flex justify-content-start">
                        {renderButton('select')}
                        {renderButton('upload')}
                        {renderButton('cancel')}
                    </div>
                    <div
                        className={`card-body ${dragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {errorMessage && (
                            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                                <span>{errorMessage}</span>
                                <ButtonComponent
                                    icon="pi pi-times"
                                    variant="danger"
                                    onClick={() => setErrorMessage('')} 
                                    size="small"
                                />
                            </div>
                        )}
                        {selectedFile ? (
                            <p>Arquivo selecionado: {selectedFile.name}</p>
                        ) : (
                            <p>Arraste e solte o arquivo aqui ou clique para selecionar</p>
                        )}
                        <input
                            type="file"
                            id="fileInput"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
            </Dialog>

            <ModalErros
                visible={showErrosModal}
                onHide={() => setShowErrosModal(false)}
                erros={errosDetalhados}
            />
        </>
    );
};

export default ModalUpload;
