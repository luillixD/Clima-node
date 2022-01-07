const fs = require('fs');
require('dotenv').config()
const axios = require('axios');
class Busquedas {
    historial = [];
    dbPath = './db/database.json';
    constructor() {
        this.leerBD();
    }
    get historialCapitalizado() {
        const historialCapitalizado = [];
        this.historial.forEach(lugar => {
            historialCapitalizado.push(lugar.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))));

        })
        return historialCapitalizado;
    }
    async ciudad(lugar = '') {
        try {
            // peticion http
            const instance = axios.default.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?language=es&access_token=pk.eyJ1IjoibHVpbGxpMTYiLCJhIjoiY2t5MzZ0d3A3MDhjbDJ4cDh3MzE0bXg5dCJ9.9p-WBBh6tow4UVWqwzh2pg&limit=5`,
            });
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                long: lugar.center[0],
                lat: lugar.center[1],
            })); //retorne los lugarees que conisiden con este nombre
        } catch (error) {
            return [];
        }
    }
    async climaLugar(lat, long) {
        try {
            const instance = axios.default.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=fad3f9ec416da00e3375d468375b6c91&units=metric&lang=es`,
            });
            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);
        }
    }
    agregarHistorial(lugar = '') {
        // prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0, 5);
        this.historial.unshift(lugar.toLocaleLowerCase());
        // grabar en DB
        this.guardarDB();
    }
    guardarDB() {
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    leerBD() {
        if (!fs.existsSync(this.dbPath)) {
            return;
        }
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        this.historial = data.historial;
    }
}
module.exports = Busquedas;