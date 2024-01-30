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


// También puedes usar HTML y diseñar tu contenido personalizado en la barra lateral
// sidebar.setContent('<h2>Acerca de...</h2><p>Información sobre el mapa.</p><a href="#">Descargar mapa</a>');


// Capas de información GeoJSON
var acuiferosLayer = L.geoJSON(null, {
    style: function(feature) {
        return {
          className: 'acuifero-polygon' // Asigna la clase CSS a cada polígono
        };
      },
    /* style: function(feature) {
        return {
          fill: false, // Desactiva el relleno
          color: '#3398FF', // Cambia el color de borde si deseas
          weight: 2 // Ancho del borde
        };
      },   */
  onEachFeature: function(feature, layer) {
    var popupContent = "<strong>Nombre del acuífero:</strong> " + feature.properties.NOM_ACUI +
                       "<br><strong>Clave:</strong> " + feature.properties.CLV_ACUI +
                       "<br><strong>Disponibilidad[hm3]=</strong> " + feature.properties.DMA_POSI +
                       "<br><strong>Déficit[hm3]=</strong> " + feature.properties.DMA_NEGA +
                       "<br><strong>Documento:</strong> <a href='" + feature.properties.DOC + "' target='_blank'>Clic aquí</a>" ;

    // Agregar más atributos como se muestra arriba
    layer.bindPopup(popupContent);
   
  }
});
var estadosLayer = L.geoJSON(null, {
  onEachFeature: function(feature, layer) {
    layer.bindPopup('<strong>Estado:</strong> ' + feature.properties.NOMGEO +
                    '<br><strong>Clave:</strong> ' + feature.properties.CVE_ENT);
  }
});

$.getJSON('data/acuiferos.geojson', function(data) {
    acuiferosLayer.addData(data);
  });

// Cargar datos GeoJSON a través de AJAX
var acuiferosUrl = 'data/acuiferos.geojson';
var estadosUrl = 'data/estados.geojson';

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

// Agregar evento de búsqueda
$("#search-button").click(function() {
    var searchValue = $("#search-input").val();
    searchAcuifero(searchValue);
});

// Función para buscar y mostrar un acuífero en el mapa, 1A versión *******
/* function searchAcuifero(acuiferoNombre) {
    acuiferosLayer.eachLayer(function(layer) {
        if (layer.feature.properties.NOM_ACUI.toLowerCase() === acuiferoNombre.toLowerCase()) {
            map.fitBounds(layer.getBounds()); // Ajusta la vista del mapa al polígono del acuífero
            layer.openPopup(); // Abre el popup del acuífero
        }
    });
} */

// Función para buscar y mostrar un acuífero en el mapa, 2A versión *******

 /* function searchAcuifero(acuiferoNombre) {
    acuiferosLayer.eachLayer(function(layer) {
        var nomAcui = layer.feature.properties.NOM_ACUI.toLowerCase();
        var clvAcui = layer.feature.properties.CLV_ACUI.toLowerCase();
        acuiferoNombre = acuiferoNombre.toLowerCase();
        
        if (nomAcui.includes(acuiferoNombre) || clvAcui.includes(acuiferoNombre)) {
            map.fitBounds(layer.getBounds()); // Ajusta la vista del mapa al polígono del acuífero
            layer.openPopup(); // Abre el popup del acuífero
        }
    });
}  */

function searchAcuifero(acuiferoNombre) {
    acuiferosLayer.eachLayer(function(layer) {
        var nomAcui = layer.feature.properties.NOM_ACUI.toLowerCase();
        var clvAcui = layer.feature.properties.CLV_ACUI.toLowerCase();
        acuiferoNombre = acuiferoNombre.toLowerCase();
        
        if (nomAcui.includes(acuiferoNombre) || clvAcui.includes(acuiferoNombre)) {
            map.addLayer(acuiferosLayer); // Asegura que la capa de acuíferos esté activada
            map.fitBounds(layer.getBounds()); // Ajusta la vista del mapa al polígono del acuífero
            layer.openPopup(); // Abre el popup del acuífero
        }
    });
}


// Función para buscar y mostrar un acuífero en el mapa, 3A versión con AUTOCOMPLETADO *******

// Agregar evento de búsqueda
/* $("#search-input").autocomplete({
    source: function(request, response) {
        var matches = [];
        var searchText = request.term.toLowerCase();
        
        acuiferosLayer.eachLayer(function(layer) {
            var nomAcui = layer.feature.properties.NOM_ACUI.toLowerCase();
            var clvAcui = layer.feature.properties.CLV_ACUI.toLowerCase();

            if (nomAcui.includes(searchText) || clvAcui.includes(searchText)) {
                matches.push(nomAcui + " (" + clvAcui + ")");
            }
        });

        response(matches);
    },
    select: function(event, ui) {
        // Al seleccionar un resultado, buscar y mostrar el acuífero en el mapa
        var selectedValue = ui.item.value.split(" ")[1]; // Obtener la clave del acuífero
        searchAcuifero(selectedValue);
    // Agrega estas líneas para actualizar el mapa y mostrar el acuífero
    map.invalidateSize(); // Actualiza el mapa para mostrar el acuífero
    acuiferosLayer.addTo(map); // Asegura que la capa de acuíferos esté activada
    }
}); */

// Obtén una referencia al input de búsqueda
   /*  var searchInput = document.getElementById("search-input");

    // Inicializa Awesomplete en el input de búsqueda
    var awesomplete = new Awesomplete(searchInput, {
        minChars: 1, // Mínimo de caracteres para mostrar sugerencias
        list: [], // La lista de sugerencias se llenará más adelante
        item: function(text, input) {
            return Awesomplete.ITEM(text, input); // Muestra el texto completo como opción
        }
    });

    // Agrega evento de cambio en el input para actualizar la lista de sugerencias
    $("#search-input").on("input", function() {
        var searchText = this.value.toLowerCase();
        var matches = [];

        acuiferosLayer.eachLayer(function(layer) {
            var nomAcui = layer.feature.properties.NOM_ACUI.toLowerCase();
            var clvAcui = layer.feature.properties.CLV_ACUI.toLowerCase();

            if (nomAcui.includes(searchText) || clvAcui.includes(searchText)) {
                matches.push(nomAcui + " (" + clvAcui + ")");
            }
        });

        // Actualiza la lista de sugerencias en Awesomplete
        awesomplete.list = matches;
    });

    // Agrega evento de selección de sugerencia
    awesomplete.input.addEventListener("awesomplete-selectcomplete", function(event) {
        var selectedValue = event.text.value.split(" ")[1]; // Obtener la clave del acuífero
        searchAcuifero(selectedValue);
        map.invalidateSize(); // Actualiza el mapa para mostrar el acuífero
        acuiferosLayer.addTo(map); // Asegura que la capa de acuíferos esté activada
    }); */


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

    // Agrega el contenido de la leyenda aquí
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
