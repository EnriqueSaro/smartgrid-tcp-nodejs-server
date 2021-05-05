const axios = require('axios');
const path = require('path');
const fs = require('fs');
const root = './Modules/';

const envia_notificacion = async (tipo,titulo,mensaje) => {

    let devices = JSON.parse(fs.readFileSync( path.join(root,"dispositivos.json")));

    devices.forEach( (device) => {
        axios.post('https://exp.host/--/api/v2/push/send',{
            to: device.token,
            sound: 'default',
            title: titulo,
            body: mensaje,
            data: { someData: 'goes here' },
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

exports.envia_notificacion = envia_notificacion;


