var util = require("util");
var bleno = require("bleno");
var BlenoCharacteristic = bleno.Characteristic;


var img=fetch(
  "https://preview.redd.it/1feqtexceaja1.jpg?width=960&crop=smart&auto=webp&v=enabled&s=be4a700110550bc6d02979a52d058e319df7233a"
)
  .then((res) => res.blob())
  .then((blob) => {
    console.log(blob);
   // const file = File([blob], "image", { type: blob.type });
    //console.log(file);
	return(blob);

  });
	

//creazione caratteristiche

//definiamo la caratteristica con un suo id e le propietà
var CustomCharacteristic = function() {
    CustomCharacteristic.super_.call(this, {
        uuid: 'fd758b93-0bfa-4c52-8af0-85845a74a606',
        properties: ['read', 'write', 'notify'],
	value: null
    });
    this._value = new Buffer.allocUnsafe(0); //creazione nuvo buffer vuoto
    this._updateValueCallback = null
};
util.inherits(CustomCharacteristic, BlenoCharacteristic); //inserimento nostre charat.. in blenocharact

//configurazione caratteristica di lettura
CustomCharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log('CustomCharacteristic onReadRequest ');
    console.log(img)
this.value=img
    callback(this.RESULT_SUCCESS, new Buffer.allocUnsafe("Echo: " + this.value));
};




//caratteristica di write
CustomCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    this._value = data;
    console.log('CustomCharacteristic - onWriteRequest: valore = ' +       this._value.toString('utf8'));
    callback(this.RESULT_SUCCESS);
};


// caratteistica di  notifica
var isSubscribed = false
var notifyInterval = 5 //seconds

function delayedNotification(callback) {
    setTimeout(function() { 
        if (isSubscribed) {
            var data = Buffer(3); //lunghezza in byte del buffer
            var now = new Date();
            data.writeUInt8(now.getHours(), 0);
            data.writeUInt8(now.getMinutes(), 1);
            data.writeUInt8(now.getSeconds(), 2);
            callback(data);
            delayedNotification(callback);
        }
    }, notifyInterval * 1000);
}

//gestione iscrizione a notifica
CustomCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('CustomCharacteristic - onSubscribe');
    isSubscribed = true;
    delayedNotification(updateValueCallback);
    this._updateValueCallback = updateValueCallback;
};


//gestione disinscrizione
CustomCharacteristic.prototype.onUnsubscribe = function() {
    console.log('CustomCharacteristic - onUnsubscribe');
    isSubscribed = false;
    this._updateValueCallback = null;
};

module.exports = CustomCharacteristic; //esportazione della funzione come modulo
