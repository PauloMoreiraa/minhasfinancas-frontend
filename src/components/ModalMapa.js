import React, { useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import '@arcgis/core/assets/esri/themes/light/main.css';

const ModalMapa = ({ filtros }) => {
    useEffect(() => {
        const pinSymbol = new PictureMarkerSymbol({
            url: `${process.env.PUBLIC_URL}/location.png`,
            width: "25px",
            height: "25px",
            yoffset: "12px" 
        });
        

        const renderer = {
            type: "simple",
            symbol: pinSymbol
        };

        let definitionExpression = `usuario_id = ${filtros.usuarioId}`; 

        if (filtros.descricao) {
            definitionExpression += ` AND descricao LIKE '%${filtros.descricao}%'`;
        }
        if (filtros.ano) {
            definitionExpression += ` AND ano = '${filtros.ano}'`; 
        }
        if (filtros.mes) {
            definitionExpression += ` AND mes = '${filtros.mes}'`; 
        }
        if (filtros.tipo) {
            definitionExpression += ` AND tipo LIKE '%${filtros.tipo}%'`;
        }
        if (filtros.categoriaId) {
            definitionExpression += ` AND categoria_id = ${parseInt(filtros.categoriaId)}`;
        }


        const featureLayer = new FeatureLayer({
            url: 'https://services3.arcgis.com/cS4GcXNpyMgMVA4J/arcgis/rest/services/MinhasFinancasMapa/FeatureServer/0',
            definitionExpression: definitionExpression,
            renderer: renderer,
            popupTemplate: {
                title: "{descricao}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "ano",
                                label: "Ano",
                                format: { digitSeparator: false }
                            },
                            {
                                fieldName: "mes",
                                label: "Mês",
                                format: { digitSeparator: false }
                            },
                            {
                                fieldName: "categoria_id",
                                label: "Categoria",
                                format: { digitSeparator: false }
                            },
                            {
                                fieldName: "valor",
                                label: "Valor",
                                format: {
                                    currency: "BRL",
                                    digitSeparator: true,
                                    places: 2,
                                }
                            },
                            {
                                fieldName: "tipo",
                                label: "Tipo",
                                format: { digitSeparator: false }
                            },
                            {
                                fieldName: "status",
                                label: "Status",
                                format: { digitSeparator: false }
                            },
                            {
                                fieldName: "latitude",
                                label: "Latitude",
                                format: { digitSeparator: false, places: 6 }
                            },
                            {
                                fieldName: "longitude",
                                label: "Longitude",
                                format: { digitSeparator: false, places: 6 }
                            }
                        ]
                    }
                ]
            }
            
        });
        

        const map = new Map({
            basemap: "topo-vector"
        });
        map.add(featureLayer);

        const view = new MapView({
            container: "mapViewDiv",
            map: map,
            zoom: 8,
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
