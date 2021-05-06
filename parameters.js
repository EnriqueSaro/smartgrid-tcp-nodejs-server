
function save_erase( data, action, voltage, line_frecuency, power_factor, current, active_power, apparent_power , sign_active_power ){
    if( action == 0 ){       
        data.forEach( ( element, i, a ) => a[i] = 0.0 )
    }
    else{
        // Acumulacion de muestras e incremento de contador
        data[0] += voltage
        data[1] += line_frecuency
        data[2] += power_factor
        data[3] += current
        data[4] += active_power
        data[5] += apparent_power
        data[6] += 1
        data[7] += sign_active_power
    }   
}
    
exports.save_erase = save_erase;
        