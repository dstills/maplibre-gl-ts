import './css/main.css'
import maplibre from 'maplibre-gl/dist/maplibre-gl'

const map = new maplibre.Map({
    container: 'view',
    center: [-121.500, 38.500],
    zoom: 5,
    style: {
        version: 8,
        sources: {
            osm: {
                type: 'raster',
                tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '&copy; OpenStreetmap Contributors',
                maxzoom: 19
            },
            terrainSource: {
                type: 'raster-dem',
                url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                tileSize: 256
            },
            hillshadeSource: {
                type: 'raster-dem',
                url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                tileSize: 256
            }
        },
        layers: [{
            id: 'osm',
            type: 'raster',
            source: 'osm'
        }, {
            id: 'hills',
            type: 'hillshade',
            source: 'hillshadeSource',
            layout: { visibility: 'visible' },
            paint: { 'hillshade-shadow-color': '#473B24' }
        }],
        terrain: {
            source: 'terrainSource',
            exaggeration: 1
        }
    },
    maxZoom: 18,
    maxPitch: 85
})

map.on('load', () => {

    map.addSource('locations', {
        type: 'geojson',
        data: 'http://localhost:3000/features/locations'
    })

    map.addLayer({
        'id': 'locations-symbols',
        'type': 'circle',
        'source': 'locations',
        'paint': {
            'circle-radius': 5,
            'circle-color': '#f39527',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000000'
        }
    })
})

map.on('click', 'locations-symbols', e => {
    const { locationid } = e.features[0].properties
    let html = '<h3>' + locationid + '</h3>'
    for (let property in e.features[0].properties) {
        if (property === 'locationid') continue
        html += `<p>${property}: ${e.features[0].properties[property]}</p>`
    }
    let popup = new maplibre.Popup({ offset: 25, className: 'locations-popup' })
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map)
})