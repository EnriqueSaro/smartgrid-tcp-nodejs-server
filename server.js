const { Server } = require("net");
const  parameters = require( "./parameters" );
const archivos = require( "./archivos" );
const host = "0.0.0.0";

const error = ( message ) => {
    console.error( message );
    process.exit( 1 );
};


const listen = (port) => {
    const server = new Server();

    server.on( "connection", ( socket ) => {

        let promedios = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        let module_id;

        let interval = setInterval( () => { 
            const cantidad_muestras = promedios[6]
            let promedios_minuto = [...promedios]

            parameters.save_erase( promedios, 0 ) 

            for( let i = 0; i < promedios_minuto.length - 1; i++ ){
                let sumatoria = promedios_minuto[i]
                if( sumatoria != 0 )
                    promedios_minuto[i] = sumatoria / cantidad_muestras
            }
            archivos.agrega_muestra_diaria(module_id , promedios_minuto);
        }, 10000);
          
        socket.setKeepAlive( true, 5000 );

        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
        console.log( `New connection from ${remoteSocket}` );

        socket.on( 'readable', function() {

            // There is some data to read now.
            let data;

            while( data = this.read(21) ) {

                // Codigo del modulo
                module_id =  String.fromCharCode( data[0] ) + String.fromCharCode( data[1] );

                // Voltage
                let voltage = ((data[4] << 8) | data[3]) / 10.0;

                // Line Frecuency
                let line_frecuency = ((data[6] << 8) | data[5]) / 1000.0;

                // Current RMS
                let current_RMS = ((data[12] << 24) | (data[11] << 16) | (data[10] << 8) | data[9]) / 10000.0;

                // Sing Active Power
                let sign_active_power = data[2] & 0x10;

                // Active Power
                let active_power = ((data[16] << 24) | (data[15] << 16) | (data[14] << 8) | data[13]) / 100.0;

                // Apparent Power
                let apparent_power = ((data[20] << 24) | (data[19] << 16) | (data[18] << 8) | data[17]) / 100.0;
                
                parameters.save_erase( promedios, 1, voltage, line_frecuency, current_RMS, sign_active_power, active_power, apparent_power )
            }
          });

        socket.on( "error", ( err ) => console.error( err ) );

        socket.on( "close", () => {
            console.log( `Connection with ${remoteSocket} closed` );
        });
    });

    server.listen({ port, host }, () => {
        console.log( "Listening on port 5000" );
    });

    server.on( "error", ( err ) => error( err.message ) );
};

const main = () => {
    port = 5000;
    listen( port );
};

if ( require.main === module ) {
    main();
}