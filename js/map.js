import { URLS } from './config.js';
import { loadJSON } from './loader.js';

const map = L.map('map').setView([-2.89,-78.49],12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution:'© OpenStreetMap'
}).addTo(map);

const layers = {};

function popup(props){
  return Object.entries(props).map(([k,v])=>`<b>${k}</b>: ${v}`).join('<br>');
}

async function loadLayers(){
  const limites = await loadJSON(URLS.limites);
  if(limites){
    layers['Límite urbano'] = L.geoJSON(limites,{style:{color:'#0f172a',weight:2,fill:false}}).addTo(map);
  }

  const gnss = await loadJSON(URLS.gnss);
  if(gnss){
    layers['Puntos GNSS'] = L.geoJSON(gnss,{
      pointToLayer:(f,ll)=>L.circleMarker(ll,{radius:6,color:'#2563eb',fillColor:'#93c5fd',fillOpacity:.9}),
      onEachFeature:(f,l)=>l.bindPopup(popup(f.properties))
    }).addTo(map);
  }

  const orto = await loadJSON(URLS.orto);
  if(orto){
    layers['Puntos ortométricos'] = L.geoJSON(orto,{
      pointToLayer:(f,ll)=>L.circleMarker(ll,{radius:6,color:'#16a34a',fillColor:'#86efac',fillOpacity:.9}),
      onEachFeature:(f,l)=>l.bindPopup(popup(f.properties))
    }).addTo(map);
  }

  const residuos = await loadJSON(URLS.residuos);
  if(residuos){
    layers['Residuos'] = L.geoJSON(residuos,{
      pointToLayer:(f,ll)=>L.circleMarker(ll,{
        radius:6,
        color:f.properties.residuo_cm>0?'#dc2626':'#2563eb',
        fillColor:f.properties.residuo_cm>0?'#fecaca':'#bfdbfe',
        fillOpacity:.9
      }),
      onEachFeature:(f,l)=>l.bindPopup(popup(f.properties))
    }).addTo(map);
  }

  const curvas = await loadJSON(URLS.curvas);
  if(curvas){
    layers['Curvas geoidales'] = L.geoJSON(curvas,{style:{color:'#f59e0b',weight:2}}).addTo(map);
  }

  L.control.layers(null,layers,{collapsed:false}).addTo(map);
}

async function loadMetadata(){
  const meta = await loadJSON(URLS.metadata);
  if(!meta) return;
  const div = document.getElementById('metadata');
  div.innerHTML = Object.entries(meta)
    .map(([k,v])=>`<b>${k}</b><br>${v}<br><br>`)
    .join('');
}

loadLayers();
loadMetadata();
