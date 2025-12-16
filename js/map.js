import { URLS } from "./config.js";
import { loadGeoJSON } from "./loader.js";

const map = L.map("map").setView([-2.89, -78.49], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const layers = {};

function popup(props){
  return Object.entries(props)
    .map(([k,v])=>`<b>${k}:</b> ${v}`)
    .join("<br>");
}

(async()=>{
  const limites = await loadGeoJSON(URLS.limites);
  if(limites){
    layers["Límites de Cuenca"] =
      L.geoJSON(limites,{style:{color:"#000",weight:2,fill:false}}).addTo(map);
  }

  const gnss = await loadGeoJSON(URLS.gnss);
  if(gnss){
    layers["Puntos GNSS"] =
      L.geoJSON(gnss,{
        pointToLayer:(f,ll)=>L.circleMarker(ll,{radius:6,color:"#1f78b4",fillColor:"#a6cee3",fillOpacity:.9}),
        onEachFeature:(f,l)=>l.bindPopup(popup(f.properties))
      }).addTo(map);
  }

  const orto = await loadGeoJSON(URLS.orto);
  if(orto){
    layers["Puntos Ortométricos"] =
      L.geoJSON(orto,{
        pointToLayer:(f,ll)=>L.circleMarker(ll,{radius:6,color:"#33a02c",fillColor:"#b2df8a",fillOpacity:.9}),
        onEachFeature:(f,l)=>l.bindPopup(popup(f.properties))
      }).addTo(map);
  }

  const residuos = await loadGeoJSON(URLS.residuos);
  if(residuos){
    layers["Residuos Verticales"] =
      L.geoJSON(residuos,{
        pointToLayer:(f,ll)=>L.circleMarker(ll,{
          radius:6,
          color:f.properties.residuo_cm>0?"#e31a1c":"#1f78b4",
          fillColor:f.properties.residuo_cm>0?"#fb9a99":"#a6cee3",
          fillOpacity:.9
        }),
        onEachFeature:(f,l)=>l.bindPopup(popup(f.properties))
      }).addTo(map);
  }

  const curvas = await loadGeoJSON(URLS.curvas);
  if(curvas){
    layers["Curvas Geoidales"] =
      L.geoJSON(curvas,{style:{color:"#ff7f00",weight:2}}).addTo(map);
  }

  L.control.layers(null,layers,{collapsed:false}).addTo(map);
})();
