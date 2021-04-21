const fs = require( 'fs' );
const path = require('path');
const { flock } = require( 'fs-ext' );
const root = './Modules/';

const agrega_muestra_diaria = ( module_id, parameters ) => {
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

    let current_date = new Date();

    let data = {
        "fecha": current_date.toISOString(),
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
        
        if( day_samples.length > 0){
            let sample_date = new Date(day_samples[0].date);

            if(current_date.getFullYear() !== sample_date.getFullYear() || 
               current_date.getMonth() !== sample_date.getMonth() ||
               current_date.getDate() !== sample_date.getDate() )
               fs.writeFileSync( path.join(dir , '/day.json'), '[ ]' );
        }
        

        day_samples.push(data);
        fs.writeFileSync( jsonday_dir , JSON.stringify( day_samples, null, '\t') );
        fs.closeSync(fd);
    });    
        
}

const agrega_muestra = ( module_id, production, name_file ) => {

    const dir = path.join( root, module_id, name_file );
    const current_date = new Date().toISOString();

    

    let data = {
        "fecha": current_date,
        "produccion": production
    }

    const content_file = fs.readFileSync( dir );
    let content_file_samples = JSON.parse( content_file );

    if( name_file === 'mensual.json'){
        if( content_file_samples.length > 0){
            let sample_date = new Date(content_file_samples[0].date);

            if(current_date.getFullYear() !== sample_date.getFullYear() || 
               current_date.getMonth() !== sample_date.getMonth())
               procesa_muestras_mensuales(module_id);
        }
    }

    content_file_samples.push( data );
    fs.writeFileSync( dir , JSON.stringify( content_file_samples, null, '\t') );
}

const procesa_muestras_diarias =  cliente => {

    let sumatoria_produccion = 0;

    const dir_muestras_diarias = path.join( root, cliente, 'day.json' );
    const dir_muestras_dia_anterior = path.join( root, cliente, 'ventana.json' );
    const fd = fs.openSync( dir_muestras_diarias, 'r+' );

    flock( fd, 'ex', ( err ) => {
        if( err ) {
            return console.error( "Couldn't lock file" );
        }
        // File is locked
        let day = fs.readFileSync( dir_muestras_diarias );
        let day_samples = JSON.parse( day );

        fs.copyFile( dir_muestras_diarias, dir_muestras_dia_anterior, ( err ) => {
            if( err )
                return console.error( "Couldn't copy" );
        });
        
        fs.writeFileSync( dir_muestras_diarias, '[ ]' );
        fs.closeSync( fd );

        day_samples.forEach( data => {
            sumatoria_produccion += ( data.voltaje * data.corriente );
        });

        const muestras_tamanio = day_samples.length;
        if( muestras_tamanio != 0 )
            sumatoria_produccion = sumatoria_produccion / muestras_tamanio;


        agrega_muestra( cliente, sumatoria_produccion, 'mensual.json' );
    });    
}

const procesa_muestras_mensuales =  cliente => {

    let sumatoria_produccion = 0;

    const dir_muestras_mensuales = path.join( root, cliente, 'mensual.json' );
    const fd = fs.openSync( dir_muestras_mensuales, 'r+' );

    flock( fd, 'ex', ( err ) => {
        if( err ) {
            return console.error( "Couldn't lock file" );
        }
        // File is locked
        let month = fs.readFileSync( dir_muestras_mensuales );
        let month_samples = JSON.parse( month );
        
        fs.writeFileSync( dir_muestras_mensuales, '[ ]' );
        fs.closeSync( fd );

        month_samples.forEach( data => {
            sumatoria_produccion += data.produccion;
        });

        const muestras_tamanio = month_samples.length;
        if( muestras_tamanio != 0 )
            sumatoria_produccion = sumatoria_produccion / muestras_tamanio;

        agrega_muestra( cliente, sumatoria_produccion, 'anual.json' );
    });
}

const procesa_muestras_anuales =  cliente => {
    let sumatoria_produccion = 0;

    const dir_muestras_anuales = path.join( root, cliente, 'anual.json' );
    const fd = fs.openSync( dir_muestras_anuales, 'r+' );

    flock( fd, 'ex', ( err ) => {
        if( err ) {
            return console.error( "Couldn't lock file" );
        }
        // File is locked
        let anual = fs.readFileSync( dir_muestras_anuales );
        let anual_samples = JSON.parse( anual );
        
        fs.writeFileSync( dir_muestras_anuales, '[ ]' );
        fs.closeSync( fd );

        anual_samples.forEach( data => {
            sumatoria_produccion += data.produccion;
        });

        const muestras_tamanio = anual_samples.length;
        if( muestras_tamanio != 0 )
            sumatoria_produccion = sumatoria_produccion / muestras_tamanio;

        agrega_muestra( cliente, sumatoria_produccion, 'decada.json' );
    });
}

const procesa_muestras_decada =  cliente => {

    const dir_muestras_decada = path.join( root, cliente, 'decada.json' );
    const fd = fs.openSync( dir_muestras_decada, 'r+' );

    flock( fd, 'ex', ( err ) => {
        if( err ) {
            return console.error( "Couldn't lock file" );
        }
        
        fs.writeFileSync( dir_muestras_decada, '[ ]' );
        fs.closeSync( fd );
    });
}

exports.agrega_muestra_diaria = agrega_muestra_diaria;
exports.procesa_muestras_diarias = procesa_muestras_diarias;
exports.procesa_muestras_mensuales = procesa_muestras_mensuales;
exports.procesa_muestras_anuales = procesa_muestras_anuales;
exports.procesa_muestras_decada = procesa_muestras_decada;

