var bleno = require ('bleno');
var name = 'SergioPino';
var serviceUuids = ['b7b77e6e-aece-11ed-afa1-0242ac120002']
var BlenoPrimaryService = bleno.PrimaryService;


//accensione del ble
bleno.on('stateChange', function(state)
{
	console.log("stato del nostro BLE: " + state);
	if (state === "poweredOn")
	{
		bleno.startAdvertising(name,serviceUuids,);
		isAdverting= true;
	}else
	{ bleno.stopAdvertising();
		isadverting= false;}
});

//importazione delle nostre caratteristiche 
var CustomCharacteristic = require('./characteristic');
bleno.on('advertisingStart', function(error){ //adverting delle caratteristicghe 
    console.log('stato adverting caratteristiche: ' + (error ? 'error ' + error : 'success'));
     if (!error) {
        bleno.setServices([
            new BlenoPrimaryService({
                uuid: '9f5d8d6c-b6d6-4632-af1a-99ec094980ed',
                characteristics: [
                    new CustomCharacteristic()
                ]
            })
        ]);
    }
});




//funzione di connesione 
bleno.on ('accept', function (clientAddress)
{
    console.log ("Connessione accettata dal'indirizzo:" + clientAddress);
    //fine advertising
    bleno.stopAdvertising ();
    isAdvertising = false;
    console.log ( 'Adverting in pausa...');
});
//funzione di disconnesione
bleno.on ('disconnect', function (clientAddress)
{
    console.log ( "l'indirizzo:" + clientAddress+ "si è disconnesso");
    // restart advertising …
    bleno.startAdvertising ();
    isAdvertising = true;
    console.log ( 'Advertingg ripartito...');
});


