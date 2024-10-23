import React, { useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import '@arcgis/core/assets/esri/themes/light/main.css';

const ModalMapa = ({ filtros }) => {
    useEffect(() => {
        // Define o símbolo azul para os pontos
        const symbol = new SimpleMarkerSymbol({
            color: [0, 122, 255], // Azul
            outline: {
                color: [255, 255, 255], // Contorno branco
                width: 2
            },
            size: 8 // Ajuste o tamanho conforme desejado
        });

        // Define o renderer para usar o símbolo azul
        const renderer = {
            type: "simple", // Renderer simples para usar o símbolo em todos os pontos
            symbol: symbol
        };

        const featureLayer = new FeatureLayer({
            url: 'https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/MinhasFinancasMapa/FeatureServer/0',
            definitionExpression: `descricao LIKE '%${filtros.descricao}%' 
                                    AND ano LIKE '%${filtros.ano}' 
                                    AND mes LIKE '%${filtros.mes}'
                                    AND tipo LIKE '%${filtros.tipo}'
                                    AND usuario_id = ${filtros.usuarioId}`,
            renderer: renderer, // Aplica o renderer personalizado
            popupTemplate: {
                title: "{descricao}",
                content: `
                    <b>Ano:</b> {ano}<br/>
                    <b>Mês:</b> {mes}<br/>
                    <b>Tipo:</b> {tipo}<br/>
                    <b>Descrição:</b> {descricao}<br/>
                    <b>Categoria:</b> {categoria_id}<br/>  
                    <b>Latitude:</b> {latitude}<br/>  
                    <b>Longitude:</b> {longitude}<br/> 
                `
            }
        });

        const map = new Map({
            basemap: "topo-vector"
        });
        map.add(featureLayer);
        
        const view = new MapView({
            container: "mapViewDiv",
            map: map,
            zoom: 10,
            center: [-46.47429255, -23.54534991]
        });

        view.when(() => {
            console.log('MapView está pronto');
        }, (error) => {
            console.error('Erro ao criar o MapView:', error);
        });

        return () => {
            if (view) {
                view.destroy();
            }
        };
    }, [filtros]); 

    return (
        <div
            header="Lançamentos no Mapa"
            style={{ width: '80vw', height: '70vh' }}
        >
            <div id="mapViewDiv" style={{ width: '100%', height: '100%' }}></div>
        </div>
    );
};

export default ModalMapa;
