function saveIP() {
    localStorage.setItem("PrinterIP", document.getElementById("printerIp").value);
    document.getElementById("barcode").focus();
}

function getIP() {
    document.getElementById("printerIp").value = localStorage.getItem("PrinterIP"); 
    document.getElementById("barcode").focus();
}

function clear() {
    JsBarcode(".barcode").init();
    document.getElementById("headline").value = "";
    document.getElementById("headlineText").innerHTML = "Barcode";
    document.getElementById("precode").value = "";
    document.getElementById("barcode").value = "";
    document.getElementById("multiplicator").value = "";
    document.getElementById("barcode").focus();
}

function printBarcode() {
    const prefix = document.getElementById("precode").value;
    const toPrint = document.getElementById("barcode").value;
    print(prefix + toPrint);
}

function print(toPrint) {
    const ip = document.getElementById("printerIp").value;
    const output = document.getElementById("output");
    const url = "http://" + ip + "/pstprnt";
    const method = "POST";
    const async = true;
    const request = new XMLHttpRequest();
    const headline = document.getElementById("headline").value;
    const prefix = headline ? "^CFD,20,20^FO70,15^FD" + document.getElementById("headline").value + "^FS" : "";
    let zpl = "^XA^LS0^PW900^FO140,20^BY4^BCN,200,N,N^FD" + toPrint + "^FS^CFD,80,40^FO140,300^FD" + toPrint.slice(0,8) + "^FS^CFD,120,60^FO540,260^FD" + toPrint.slice(-3) + "^FS^XZ"; 
    
    if (toPrint.slice(0,2)=="00") {
        if (toPrint.length==11) {
            zpl = "^XA^LS0^PW750^FO50,60^BY4^BCN,160,N,N^FD" + toPrint + "^FS^CFD,80,40^FO60,300^FD" + toPrint.slice(0,8) + "^FS" + prefix + "^CFD,120,60^FO460,260^FD" + toPrint.slice(-3) + "^FS^XZ"; 
        } else {
            zpl = "^XA^LS0^PW750^FO90,50,50^BY2.6^BCN,220,Y,N^AAN,40,30^FD" + toPrint + "^FS" + prefix + "^XZ"; 
        }
    } else if (toPrint.length>15) {
        zpl = "^XA^LS0^PW750^FO70,50,50^BY3^BCN,220,Y,N^AAN,40,30^FD" + toPrint + "^FS" + prefix + "^XZ"; 
    } else {
        zpl = "^XA^LS0^PW750^CFD,80,40^FO110,50,50^BY3^BCN,220,Y,N^AAN,40,35^FD" + toPrint + "^FS" + prefix + "^XZ"; 
    }

    request.onload = function () {
        const status = request.status; 
        const data = request.responseText; 
        output.innerHTML = "Status: " + status + "<br>" + data;
    }

    try {
        request.open(method, url, async);
        request.setRequestHeader("Content-Length", zpl.length);

        const amount = document.getElementById("multiplicator")?.value || 1; 

        for (let i = 0; i < +amount; i++) {
            request.send(zpl);
        }
    } catch (error) {
        alert('Verbindung zum Drucker fehlgeschlagen.')
    }
    JsBarcode(".barcode", toPrint);
    document.getElementById("headlineText").innerHTML = headline;
    document.getElementById("barcode").value = "";
    document.getElementById("barcode").focus();
}