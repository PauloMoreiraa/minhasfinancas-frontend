import React from "react";
import { Dialog } from "primereact/dialog";
import ButtonComponent from "./Button";

const ModalErros = ({ visible, onHide, erros }) => {
    return (
        <Dialog
            header="Alguns lançamentos não foram importados"
            visible={visible}
            modal={true}
            onHide={onHide}
        >
            <div className="card">
                <div className="card-body">
                    <h5>Erros encontrados:</h5>
                    <ul>
                        {erros.map((erro, index) => (
                            <li key={index}>Erro {index + 1}: {erro}</li>
                        ))}
                    </ul>
                </div>
                <div className="card-footer d-flex justify-content-end">
                    <ButtonComponent
                        icon="pi pi-times"
                        variant="danger"
                        onClick={onHide}
                        label="Fechar"
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default ModalErros;
