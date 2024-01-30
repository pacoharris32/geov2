$(document).ready(function() {
    var map = L.map('map').setView([20.0, -102.0], 5);

    // Mapas base
    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'CONAGUA-SGT-GAS; Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Agregar el mapa base por defecto
    openStreetMap.addTo(map);

    // Capas de información GeoJSON
    var acuiferosLayer = L.geoJSON(null, {
        style: function(feature) {
            return {
                className: 'acuifero-polygon'
            };
        },
        onEachFeature: function(feature, layer) {
            var popupContent = "<strong>Nombre del acuífero:</strong> " + feature.properties.NOM_ACUI +
                "<br><strong>Clave:</strong> " + feature.properties.CLV_ACUI +
                "<br><strong>Disponibilidad[hm3]=</strong> " + feature.properties.DMA_POSI +
                "<br><strong>Déficit[hm3]=</strong> " + feature.properties.DMA_NEGA +
                "<br><strong>Documento:</strong> <a href='" + feature.properties.DOC + "' target='_blank'>Clic aquí</a>";

            layer.bindPopup(popupContent);
        }
    });

    // Cargar datos GeoJSON de acuíferos a través de AJAX
    var acuiferosUrl = 'data/acuiferos.geojson';
    $.getJSON(acuiferosUrl, function(data) {
        acuiferosLayer.addData(data);

        // Inicializa Awesomplete después de cargar los datos
        initializeAwesomplete();
    });

    // Agregar capa de estados
    var estadosLayer = L.geoJSON(null, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup('<strong>Estado:</strong> ' + feature.properties.NOMGEO +
                '<br><strong>Clave:</strong> ' + feature.properties.CVE_ENT);
        }
    });

    var estadosUrl = 'data/estados.geojson';
    $.getJSON(estadosUrl, function(data) {
        estadosLayer.addData(data);

        var stateSelect = document.getElementById("state-select");
        var estados = [];

        data.features.forEach(function(feature) {
            var estado = feature.properties.NOMGEO;
            if (!estados.includes(estado)) {
                estados.push(estado);
                var option = document.createElement("option");
                option.value = estado;
                option.textContent = estado;
                stateSelect.appendChild(option);
            }
        });
    });

    // Función para llenar la lista de sugerencias de Awesomplete
    function getAwesompleteSuggestions(layer) {
        var suggestions = [];
        layer.eachLayer(function(layer) {
            var nomAcui = layer.feature.properties.NOM_ACUI;
            var clvAcui = layer.feature.properties.CLV_ACUI;
            suggestions.push(nomAcui + " (" + clvAcui + ")");
        });
        return suggestions;
    }

    // Función para buscar y mostrar un acuífero en el mapa
    function searchAcuifero(selectedValue, layer) {
        var acuiferoClave = selectedValue.match(/\((\d+)\)/)[1]; // Extraer la clave del valor de la sugerencia

        var foundLayer = null;

        layer.eachLayer(function(layer) {
            var clvAcui = layer.feature.properties.CLV_ACUI;
            var nomAcui = layer.feature.properties.NOM_ACUI;

            if (clvAcui === acuiferoClave || nomAcui === selectedValue) {
                foundLayer = layer;
                return;
            }
        });

        if (foundLayer) {
            map.fitBounds(foundLayer.getBounds());
            foundLayer.openPopup();
        } else {
            alert("No se encontró el acuífero con la clave o nombre: " + selectedValue);
        }
    }

    // Cargar datos GeoJSON de acuíferos a través de AJAX
    var acuiferosUrl = 'data/acuiferos.geojson';
    $.getJSON(acuiferosUrl, function(data) {
        acuiferosLayer.addData(data);

        // Inicializa Awesomplete después de cargar los datos
        var awesomplete = initializeAwesomplete(acuiferosLayer);

        // Llena la lista de sugerencias inicialmente
        updateAwesompleteList(getAwesompleteSuggestions(acuiferosLayer));
    });

    // Función para inicializar Awesomplete
    function initializeAwesomplete(layer) {
        var searchInput = document.getElementById("search-input");

        var awesomplete = new Awesomplete(searchInput, {
            minChars: 1,
            list: [],
            item: function(text, input) {
                return Awesomplete.ITEM(text, input);
            }
        });

        // Agrega evento de selección de sugerencia
        awesomplete.input.addEventListener("awesomplete-selectcomplete", function(event) {
            var selectedValue = event.text.value;
            searchAcuifero(selectedValue, layer);
        });

        return awesomplete; // Devolver el objeto Awesomplete
    }

    // Función para buscar y mostrar un acuífero en el mapa
    function searchAcuifero(selectedValue, layer) {
        var acuiferoClave = selectedValue.match(/\((\d+)\)/)[1]; // Extraer la clave del valor de la sugerencia

        var foundLayer = null;

        layer.eachLayer(function(layer) {
            var clvAcui = layer.feature.properties.CLV_ACUI;

            if (clvAcui === acuiferoClave) {
                foundLayer = layer;
                return;
            }
        });

        if (foundLayer) {
            map.fitBounds(foundLayer.getBounds());
            foundLayer.openPopup();
        } else {
            alert("No se encontró el acuífero con la clave: " + acuiferoClave);
        }
    }

    // Función para buscar y mostrar un acuífero en el mapa
    function searchAcuifero(selectedValue) {
        var acuiferoClave = selectedValue.match(/\((\d+)\)/)[1]; // Extraer la clave del valor de la sugerencia

        var foundLayer = null;

        acuiferosLayer.eachLayer(function(layer) {
            var clvAcui = layer.feature.properties.CLV_ACUI;

            if (clvAcui === acuiferoClave) {
                foundLayer = layer;
                return;
            }
        });

        if (foundLayer) {
            map.fitBounds(foundLayer.getBounds());
            foundLayer.openPopup();
        } else {
            alert("No se encontró el acuífero con la clave: " + acuiferoClave);
        }
    }

    // Agrupar capas
    var overlayMaps = {
        "Acuíferos": acuiferosLayer,
        "Estados": estadosLayer
    };

    // Agregar control de capas
    L.control.layers(null, overlayMaps).addTo(map);

    // Agregar control de mapas base
    var baseMaps = {
        "OpenStreetMap": openStreetMap,
        "Esri Satellite": esriSatellite
    };

    L.control.layers(baseMaps).addTo(map);

    // Agregar leyenda
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend');

        div.innerHTML = '<p><strong>Leyenda</strong></p>' +
            '<div class="legend-item">' +
            '<div class="legend-symbol" style="background-color: #3398FF;"></div>' +
            '<div class="legend-label">Acuíferos</div>' +
            '</div>' +
            '<div class="legend-item">' +
            '<div class="legend-symbol" style="border: 2px solid #000;"></div>' +
            '<div class="legend-label">Estados</div>' +
            '</div>';

        return div;
    };

    legend.addTo(map);
});
