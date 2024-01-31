$(document).ready(function() {
    var map = L.map('map').setView([20.0, -102.0], 5);
  
    // Mapas base
   // var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   // });
  
    var esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'CONAGUA-SGT-GAS; Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
    
    // Mapa base ESRI Satellite con etiquetas de lugares
    //var esriSatelliteLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?text=Streets%2CStreets%20Night', {
    //    attribution: 'CONAGUA-SGT-GAS; Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    //});

    // Mapa base TopoMap de OpenStreetMap
    var openStreetMapTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Mapa &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contribuyentes, SRTM | Estilo: &copy; <a href="https://opentopomap.org/about#style">OpenTopoMap</a>'
    });

    // Mapa base de satélite con etiquetas de Mapbox
   // var mapboxSatelliteLabels = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_ACCESS_TOKEN', {
   //     attribution: 'Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors'
   // });

    // Mapa base de satélite con etiquetas de NASA Worldview
    //var nasaWorldview = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg', {
    //    attribution: 'NASA Worldview, Earthdata Search'
    //});

    // Mapa base TopoMap de ESRI
    var esriTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
    });
    var CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
        attribution: 'Tiles &copy; CYCLOSM &mdash; OSM'
    });

// ...

    // Agregar el mapa base por defecto (por ejemplo, OpenStreetMap)
    CyclOSM.addTo(map);

// Agregar control de capas con los mapas base disponibles


  
    // Agregar el mapa base por defecto
    // Por restricciones de la Red CONAGUA, se cambió al mapa base de ESRI. No cargaba el de OpenStreet Maps
    // openStreetMap.addTo(map);
    //esriSatellite.addTo(map);

  
    // Capas de información GeoJSON
    var acuiferosLayer = L.geoJSON(null, {
        style: function(feature) {
            return {
                className: 'acuifero-polygon' // Asigna la clase CSS a cada polígono
            };
        },
        onEachFeature: function(feature, layer) {
            console.log("Procesando la característica:", feature.properties);

            // Concatenamos los campos CLV_ACUI y NOM_ACUI
            var popupContent = 
            //"<strong>Nombre del acuífero:</strong> " + feature.properties.NOM_ACUI +
            //"<br><strong></strong> " + feature.properties.CLV_ACUI +
            "<strong>" + feature.properties.CLV_ACUI + " " + feature.properties.NOM_ACUI + "</strong>" +
            "<br>DISPONIBILIDAD(hm3)= " + feature.properties.DMA_POSITI +
            "<br>DÉFICIT(hm3)= " + feature.properties.DMA_NEGATI +
            // "<br><strong>Condición=</strong> " + feature.properties.CONDICION +
            "<br><strong></strong> <a href='" + feature.properties.DOC + "' target='_blank'>Ver Documento</a>";



         //   var popupContent = 
            //"<strong>Nombre del acuífero:</strong> " + feature.properties.NOM_ACUI +
         //   "<br><strong></strong> "  + feature.properties.CLV_ACUI +
         //   "  " + feature.properties.NOM_ACUI  + // Concatenar las dos etiquetas aquí
         //   "<br><strong>Disponibilidad[hm3]=</strong> " + feature.properties.DMA_POSITI +
         //   "<br><strong>Déficit[hm3]=</strong> " + feature.properties.DMA_NEGATI +
            // "<br><strong>Condición=</strong> " + feature.properties.CONDICION +
         //   "<br><strong>Documento:</strong> <a href='" + feature.properties.DOC + "' target='_blank'>Clic aquí</a>";

    //        var popupContent = "<strong>Nombre del acuífero:</strong> " + feature.properties.NOM_ACUI +
    //            "<br><strong>Clave:</strong> " + feature.properties.CLV_ACUI +
    //            "<br><strong>Disponibilidad[hm3]=</strong> " + feature.properties.DMA_POSITI +
    //            "<br><strong>Déficit[hm3]=</strong> " + feature.properties.DMA_NEGATI +
                // "<br><strong>Condición=</strong> " + feature.properties.CONDICION +
    //            "<br><strong>Documento:</strong> <a href='" + feature.properties.DOC + "' target='_blank'>Clic aquí</a>";
  
            layer.bindPopup(popupContent);
        }
     });
  

    
 


    // var estadosLayer = L.geoJSON(null, {
    //  style: function(feature) {
    //    return {
    //      color: 'black', // Cambia el color del borde a negro
    //      fillColor: 'black', // Cambia el color de relleno a negro (si lo hubiera)
    //      fillOpacity: 0.02, // Ajusta la opacidad del relleno si es necesario
    //    };
    //  },
  
    //    onEachFeature: function(feature, layer) {
    //        layer.bindPopup('<strong>Estado:</strong> ' + feature.properties.NOMGEO +
    //            '<br><strong>Clave:</strong> ' + feature.properties.CVE_ENT);
    //    }
    //});
  
    // Se modificó esta caopa de Estados para mostrar las etiquetas de sus nombres:
    
    var estadosLayer = L.geoJSON(null, {
        style: function(feature) {
            return {
                color: 'black', // Cambia el color del borde a negro
                fillColor: 'black', // Cambia el color de relleno a negro (si lo hubiera)
                fillOpacity: 0.1, // Ajusta la opacidad del relleno si es necesario
            };
        },
    
        onEachFeature: function(feature, layer) {
            // Muestra solo el texto sin recuadro
            layer.bindTooltip(feature.properties.NOMGEO, {
                permanent: true,
                direction: 'center',
                className: 'tooltip-label',
                opacity: 0.7,  // Establece la opacidad del tooltip
                interactive: false  // Desactiva la interactividad del tooltip
            }).openTooltip();
        }
    });
    

    //console.log("Antes de cargar el archivo GeoJSON de acuiferos");



    // $.getJSON('data/acuiferos.geojson', function(data) {
        $.getJSON('data/c_acuiferos_2023_doc.geojson', function(data) {
            

        acuiferosLayer.addData(data);
    });
  
    // Cargar datos GeoJSON a través de AJAX
  //   var estadosUrl = 'data/estados.geojson';
  
    // var acuiferosUrl = 'data/acuiferos.geojson';
    //var acuiferosUrl = 'data/c_acuiferos2023.geojson';
    //Se agregó nueva capa de la DMA 09/11/2023
    // var acuiferosUrl = 'data/c_acuiferos_2023_wgs84.geojson';
    // Se procesó la capa con el campo DOC (29/01/2024). Se cambió el nombre a: c_acuiferos_2023_doc.geojson
    var acuiferosUrl = 'data/c_acuiferos_2023_doc.geojson';

    var estadosUrl = 'data/estados2.geojson';
  
    // Agregar capas de información
    $.getJSON(acuiferosUrl, function(data) {
        acuiferosLayer.addData(data);
    });
  
    $.getJSON(estadosUrl, function(data) {
        estadosLayer.addData(data);
    });
  
    // Agrupar capas
    var overlayMaps = {
        "Acuíferos": acuiferosLayer,
        "Estados": estadosLayer
    };
  
    // Agregar escala gráfica al mapa
    L.control.scale().addTo(map);
  
    // Agregar control de capas
    L.control.layers(null, overlayMaps).addTo(map);

   // Agregar control de mapas base

    var baseMaps = {
        "CyclOSM": CyclOSM,
        "ESRI TopoMap": esriTopoMap,
        "OSM TopoMap": openStreetMapTopoMap,
        "Esri Satellite": esriSatellite
        //"OpenStreetMap": openStreetMap,
        //"Esri Satellite Labels": esriSatelliteLabels,
        //"MapboxSatelliteLabels": mapboxSatelliteLabels,
        //"NASAWorldView": nasaWorldview



        //"OpenStreetMap": openStreetMap,
        //"Esri Satellite": esriSatellite,
        //"Esri Satellite Labels": esriSatelliteLabels,
        //"OpenStreetMap TopoMap": openStreetMapTopoMap,
        //"MapboxSatelliteLabels": mapboxSatelliteLabels,
        //"NASAWorldView": nasaWorldview
        //"ESRI TopoMap": esriTopoMap,
        //"CyclOSM": CyclOSM
    
    
    
    };
    
    L.control.layers(baseMaps).addTo(map);
  
    // Agregar control de mapas base
   //var baseMaps = {
   //     "OpenStreetMap": openStreetMap,
   //     "Esri Satellite": esriSatellite
   // };
   // L.control.layers(baseMaps).addTo(map);
  
    // Agregar leyenda
    var legend = L.control({ position: 'bottomright' });
  
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend');
  
        // Agrega el contenido de la leyenda aquí
        div.innerHTML = '<CENTER><p><h6><strong>Simbología</strong></h6></p></CENTER>' +
            '<div class="legend-item">' +
          //   '<div class="legend-symbol" style="background-color: #FFFFFF;"></div>' +
            '<div class="legend-symbol" style="border: 2px solid #3398FF;"></div>' +
            '<div class="legend-label">Acuíferos</div>' +
            '</div>' +
            '<div class="legend-item">' +
            '<div class="legend-symbol" style="border: 2px solid #000;"></div>' +
            '<div class="legend-label">Estados</div>' +
            '</div>';
  
        return div;
    };
  
    legend.addTo(map);
  
    // Función para buscar y mostrar un acuífero en el mapa
    // function searchAcuifero(acuiferoNombre) {
    //   acuiferosLayer.eachLayer(function(layer) {
    //       var nomAcui = layer.feature.properties.NOM_ACUI.toLowerCase();
    //       var clvAcui = layer.feature.properties.CLV_ACUI.toLowerCase();
    //       acuiferoNombre = acuiferoNombre.toLowerCase();
  
    //       if (nomAcui.includes(acuiferoNombre) || clvAcui.includes(acuiferoNombre)) {
    //           map.addLayer(acuiferosLayer); // Asegura que la capa de acuíferos esté activada
    //           map.fitBounds(layer.getBounds()); // Ajusta la vista del mapa al polígono del acuífero
    //           layer.openPopup(); // Abre el popup del acuífero
    //       }
    //   });
    // }
    var highlightedLayer = null;

function searchAcuifero(acuiferoNombre) {
    acuiferosLayer.eachLayer(function(layer) {
        var nomAcui = layer.feature.properties.NOM_ACUI.toLowerCase();
        var clvAcui = layer.feature.properties.CLV_ACUI.toLowerCase();
        acuiferoNombre = acuiferoNombre.toLowerCase();

        if (nomAcui.includes(acuiferoNombre) || clvAcui.includes(acuiferoNombre)) {
            map.addLayer(acuiferosLayer); // Asegura que la capa de acuíferos esté activada

            if (highlightedLayer) {
                // Restaura el estilo de la capa previamente resaltada
                highlightedLayer.setStyle({
                    className: 'acuifero-polygon' // Restaura la clase CSS
                });
            }

            // Resalta el polígono actual
            layer.setStyle({
                className: 'acuifero-highlighted' // Asigna una nueva clase CSS para resaltar
            });

            // Guarda la capa resaltada
            highlightedLayer = layer;

            map.fitBounds(layer.getBounds()); // Ajusta la vista del mapa al polígono del acuífero
            layer.openPopup(); // Abre el popup del acuífero
        }
    });
}

    


    // Agregar evento de búsqueda
    $("#search-button").click(function() {
        var searchValue = $("#search-input").val();
        searchAcuifero(searchValue);
    });
  });
  