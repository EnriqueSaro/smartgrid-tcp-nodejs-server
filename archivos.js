const fs = require( 'fs' );
const path = require('path');
const { flock } = require( 'fs-ext' )
const root = './Modules/';

const agrega_muestra_diaria = ( module_id, parameters) => {
    const dir = path.join(root, module_id );
    console.log(dir);
    // Verificacion del directorio
    if( !fs.existsSync( dir ) ){
        fs.mkdirSync( dir , {recursive: true});
        fs.writeFileSync( path.join(dir , '/day.json'), '[ ]' );       // Archivo muestras diarias
        fs.writeFileSync( path.join(dir , '/ventana.json'), '[ ]' );  // Archivo muestras dia anterior
        fs.writeFileSync( path.join(dir , '/mensual.json'), '[ ]' );   // Archivo muestras del mes
        fs.writeFileSync( path.join(dir , '/anual.json'), '[ ]' );   // Archivo muestras del mes
        fs.writeFileSync( path.join(dir , '/decada.json'), '[ ]' );   // Archivo muestras del mes
    }

    let current_date = new Date().toISOString();

    let data = {
        "fecha": current_date,
        "voltaje": parameters[0],
        "corriente": parameters[2],
        "potencia_aparente": parameters[5],
        "potencia_activa": parameters[4],
        "factor_potencia": 1.3,
        "frecuencia": parameters[1]
    }

    const jsonday_dir = path.join( dir , 'day.json') ;

    const fd = fs.openSync( jsonday_dir, 'r+');
    flock(fd, 'ex', (err) => {
        if (err) {
            return console.error("Couldn't lock file");
        }
        // file is locked
        let day = fs.readFileSync( jsonday_dir );
        let day_samples =JSON.parse(day);

        day_samples.push(data);
        fs.writeFileSync( jsonday_dir , JSON.stringify( day_samples, null, '\t') );
        fs.closeSync(fd);
    });    
        
}

exports.agrega_muestra_diaria = agrega_muestra_diaria;
