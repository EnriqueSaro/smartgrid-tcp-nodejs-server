const fs = require( 'fs' );

const mensuales = ( ) => {
    const mensual = fs.readFileSync( 'day.json' );
    const yesterday = fs.readFileSync( 'yesterday.json' );

    const day_samples = JSON.parse( mensual );
    const yesterday_samples = JSON.parse( yesterday );

    let now = new Date();
    now.setDate( now.getDate() - 1 );
    now.setHours( 0, 0, 0, 0 );

    for( let i = 0; i < 1440; i++ ){
        let data_yesterday = [];

        if( i < 159 ){
            data_yesterday = {
                "fecha": now.toISOString(),
                "voltaje": day_samples[i].voltaje,
                "corriente": day_samples[i].corriente,
                "potencia_aparente": day_samples[i].potencia_aparente,
                "potencia_activa": day_samples[i].potencia_activa,
                "factor_potencia": day_samples[i].factor_potencia,
                "frecuencia": day_samples[i].frecuencia,
                "cuadrante" : day_samples[i].cuadrante
            }
        }

        else{
            let data = day_samples[ Math.floor( Math.random() * 159 ) ];
            data_yesterday = {
                "fecha": now.toISOString(),
                "voltaje": data.voltaje,
                "corriente": data.corriente,
                "potencia_aparente": data.potencia_aparente,
                "potencia_activa": data.potencia_activa,
                "factor_potencia": data.factor_potencia,
                "frecuencia": data.frecuencia,
                "cuadrante" : data.cuadrante
            }
        }

        now.setMinutes( now.getMinutes() + 1 );
        yesterday_samples.push( data_yesterday );
    }
    
    fs.writeFileSync( 'yesterday.json' , JSON.stringify( yesterday_samples, null, '\t') );
}

const length_yesterday = () => {
    const yesterday = fs.readFileSync( 'yesterday.json' );
    const yesterday_samples = JSON.parse( yesterday );

    console.log( yesterday_samples.length );
    console.log( yesterday_samples[132] );
}

const anuales = ( ) => {
    const mensual = fs.readFileSync( 'yesterday.json' );
    const anual = fs.readFileSync( 'year.json' );

    const mensual_samples = JSON.parse( mensual );
    const year_samples = JSON.parse( anual );

    let now = new Date();
    now.setDate( now.getDate() - 31 );
    now.setHours( 0, 0, 0, 0 );

    for( let i = 0; i < 31; i++ ){

        let sumatoria_produccion = 0;

        if( i == 0 )
            mensual_samples.forEach( data => {
                sumatoria_produccion += ( ( data.potencia_aparente / 1000 ) * 60 );
            });

        else{
            let inicio = Math.floor( Math.random() * 1440 );
            let final = Math.floor( Math.random() * ( 1440 - inicio ) + inicio );

            for( let j = inicio; j <= final; j++ ){
                sumatoria_produccion += ( ( mensual_samples[j].potencia_aparente / 1000 ) * 60 );
            }
        }

        let data = {
            "fecha": now.toISOString(),
            "produccion": sumatoria_produccion
        }

        now.setDate( now.getDate() + 1 );
        year_samples.push( data );
    }
    
    fs.writeFileSync( 'year.json' , JSON.stringify( year_samples, null, '\t') );
}

const length_anuales = () => {
    const yesterday = fs.readFileSync( 'year.json' );
    const yesterday_samples = JSON.parse( yesterday );

    console.log( yesterday_samples.length );
}

const anual = ( ) => {
    const mensual = fs.readFileSync( 'month.json' );
    const anual = fs.readFileSync( 'year.json' );

    const mensual_samples = JSON.parse( mensual );
    const year_samples = JSON.parse( anual );

    let now = new Date();
    now.setMonth( now.getMonth() - 11 );
    now.setHours( 0, 0, 0, 0 );
    now.setDate( now.getDate() - 9 )

    for( let i = 0; i < 12; i++ ){

        let sumatoria_produccion = 0;

        if( i == 0 )
            mensual_samples.forEach( data => {
                sumatoria_produccion += data.produccion;
            });

        else{
            let inicio = Math.floor( Math.random() * 31 );
            let final = Math.floor( Math.random() * ( 31 - inicio ) + inicio );

            for( let j = inicio; j <= final; j++ ){
                sumatoria_produccion += mensual_samples[j].produccion;
            }
        }

        let data = {
            "fecha": now.toISOString(),
            "produccion": sumatoria_produccion
        }

        now.setMonth( now.getMonth() + 1 );
        year_samples.push( data );
    }
    
    fs.writeFileSync( 'year.json' , JSON.stringify( year_samples, null, '\t') );
}

const decada = () => {
    const mensual = fs.readFileSync( 'year.json' );
    const anual = fs.readFileSync( 'decada.json' );

    const mensual_samples = JSON.parse( mensual );
    const year_samples = JSON.parse( anual );

    let now = new Date();
    now.setFullYear( now.getFullYear() - 9 );
    now.setHours( 0, 0, 0, 0 );
    now.setDate( now.getDate() - 9 );
    now.setMonth( now.getMonth() - 4 );

    for( let i = 0; i < 10; i++ ){

        let sumatoria_produccion = 0;

        if( i == 0 )
            mensual_samples.forEach( data => {
                sumatoria_produccion += data.produccion;
            });

        else{
            let inicio = Math.floor( Math.random() * 12 );
            let final = Math.floor( Math.random() * ( 12 - inicio ) + inicio );

            for( let j = inicio; j <= final; j++ ){
                sumatoria_produccion += mensual_samples[j].produccion;
            }
        }

        let data = {
            "fecha": now.toISOString(),
            "produccion": sumatoria_produccion
        }

        now.setFullYear( now.getFullYear() + 1 );
        year_samples.push( data );
    }
    
    fs.writeFileSync( 'decada.json' , JSON.stringify( year_samples, null, '\t') );
}

//mensuales();
//length_yesterday();
//anuales();
//length_anuales();
//anual();
decada();
