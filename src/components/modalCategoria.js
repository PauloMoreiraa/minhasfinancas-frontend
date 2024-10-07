import React from "react";
import { Dialog } from "primereact/dialog";

const ModalCategoria = ({ header, visible, onHide, footer, children }) => {
    return (
        <Dialog header={header} visible={visible} style={{ width: '50vw' }} modal={true} onHide={onHide} footer={footer}>
            {children}
        </Dialog>
    );
};

export default ModalCategoria;
