import React from "react";
import { Dialog } from "primereact/dialog";
import ButtonComponent from "./Button";

const ModalErros = ({ visible, onHide, erros }) => {
    return (
        <Dialog
            header="Erros encontrados"
            visible={visible}
            modal={true}
            onHide={onHide}
            style={{ maxWidth: '60vw' }}
        >
            <div className="card">
                <div className="card-body">
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {erros.map((erro, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                {erro.split("\n").map((linha, i) => (
                                    <p key={i} style={{ margin: '0' }}>
                                        {linha}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
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
