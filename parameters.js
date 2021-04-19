
function save_erase( data, action, voltage, line_frecuency, current, sign_active_power, active_power, apparent_power ){
    if( action == 0 ){       
        data.forEach( ( element, i, a ) => a[i] = 0.0 )
    }
    else{
        //Acumulacion de muestras e incremento de contador
        data[0] += voltage
        data[1] += line_frecuency
        data[2] += current
        data[3] += sign_active_power
        data[4] += active_power
        data[5] += apparent_power
        data[6] += 1
    }   
}
    
exports.save_erase = save_erase;
        