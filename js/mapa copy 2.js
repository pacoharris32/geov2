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
              className: 'acuifero-polygon' // Asigna la clase CSS a cada polígono
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

  var estadosLayer = L.geoJSON(null, {
    style: function(feature) {
      return {
        color: 'black', // Cambia el color del borde a negro
        fillColor: 'black', // Cambia el color de relleno a negro (si lo hubiera)
        fillOpacity: 0.02, // Ajusta la opacidad del relleno si es necesario
      };
    },

      onEachFeature: function(feature, layer) {
          layer.bindPopup('<strong>Estado:</strong> ' + feature.properties.NOMGEO +
              '<br><strong>Clave:</strong> ' + feature.properties.CVE_ENT);
      }
  });

  $.getJSON('data/acuiferos.geojson', function(data) {
      acuiferosLayer.addData(data);
  });

  // Cargar datos GeoJSON a través de AJAX
//   var estadosUrl = 'data/estados.geojson';

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
});
