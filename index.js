const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
const main = async() => {
    let opt = null;
    const busquedas = new Busquedas();
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                // mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                // buscar lugares
                const lugares = await busquedas.ciudad(termino);
                // seleccionar lugares
                const id = await listarLugares(lugares);
                if (id === '0') continue;
                const lugarSel = lugares.find(l => l.id === id);
                busquedas.agregarHistorial(lugarSel.nombre)
                    // clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.long);
                // mostrar resul
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Long:', lugarSel.long);
                console.log('Temperatura:', clima.temp);
                console.log('Min:', clima.min);
                console.log('Max:', clima.max);
                console.log('Como esta el clima:', clima.desc);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const id = `${i+1}.`.green;
                    console.log(`${id} ${lugar}`)
                })
                break;
        }
        if (opt !== 0) await pausa();
    } while (opt !== 0)
}
main();