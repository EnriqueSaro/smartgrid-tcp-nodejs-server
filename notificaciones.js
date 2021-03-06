const axios = require('axios');
const path = require('path');
const fs = require('fs');
const root = './Modules/';

const envia_notificacion = async ( module_id, tipo, titulo, mensaje ) => {
    const path_dispositivos = path.join( root, "devices.json" );
    const path_nodes = path.join( root, "nodes-description.json" );

    const nodes = JSON.parse( fs.readFileSync( path_nodes ) );
    let module = nodes.find(node => node.module_id === module_id);

    //verify if notification is enabled and not in ranges
    if ( !module.enable_notifications ){
        return false;
    }else if ( module.ranges.length !== 0 ){
        let now_hour = new Date().getHours();
        let is_in_range =  true;
        for (let range of module.ranges) {
            is_in_range &= (range.init < range.final) ?
                ( range.init <= now_hour && now_hour <= range.final - 1) :
                ( range.init <= now_hour || now_hour <= range.final - 1)
        }
        if ( is_in_range )
            return false
    }
        
    const devices = JSON.parse( fs.readFileSync( path_dispositivos ) );
    let filter_devices = devices.filter( device => device.module_id === module_id );
    console.log( filter_devices );

    if ( tipo === 'danger')
        titulo = "🆘 ERROR: " + titulo;
    else if( tipo === 'warning')
        titulo = "☢ ADVERTENCIA: " + titulo;
        
    filter_devices.forEach( (device) => {
        axios.post('https://exp.host/--/api/v2/push/send',{
            to: device.token,
            sound: 'default',
            title: titulo,
            body: mensaje,
            data: { someData: 'goes here' },
        })
        .then(function (response) {
            console.log(response.body);
        })
        .catch(function (error) {
            console.log(error);
        });
    });

    return true;
}

const guardar_notificacion = async ( module_id, tipo, mensaje ) => {
    
    let dir = path.join( root, module_id, 'notifications.json' );
    if( fs.existsSync( dir ) ){
        let notifications = JSON.parse( fs.readFileSync( dir ) );
        let date = new Date();
        let new_id;

        if ( notifications.length === 0 )
            new_id = 0;
        else
            new_id = notifications[notifications.length - 1].id + 1;

        let new_notification = {
            "id": new_id,
            "type": tipo,
            "date": date.toISOString(),
            "description": mensaje
        }

        notifications.push( new_notification );

        fs.writeFile( dir, JSON.stringify( notifications, null, '\t' ), function ( err ) {
            if( err ){
                console.log( 'Something went wrong in adding notification' );
            }else{
                console.log( 'Notification added' );
            }
        });
    }
}

exports.envia_notificacion = envia_notificacion;
exports.guardar_notificacion = guardar_notificacion;


