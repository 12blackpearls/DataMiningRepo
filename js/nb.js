//THIS IS FOR NB - SPLIT TRAINING SET AND TESTING SET 
//ASSOCIATED WITH NB.HTML
//REMEMBER : 1. change the 'cat'

var alldata;
var dimension = 0;
var alldata2;
var dimension2 = 0; 
var dummy;

//load data for training set
$(document).ready(function() {
    if(isAPIAvailable()) {
    $('#files').bind('change', handleFileSelect);
    }
});

function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    return true;
    } else {
    // source: File API availability - http://caniuse.com/#feat=fileapi
    // source: <output> availability - http://html5doctor.com/the-output-element/
    document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
    // 6.0 File API & 13.0 <output>
    document.writeln(' - Google Chrome: 13.0 or later<br />');
    // 3.6 File API & 6.0 <output>
    document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
    // 10.0 File API & 10.0 <output>
    document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
    // ? File API & 5.1 <output>
    document.writeln(' - Safari: Not supported<br />');
    // ? File API & 9.2 <output>
    document.writeln(' - Opera: Not supported');
    return false;
    }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    // read the file metadata
    var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';
    // read the file contents
    printTable(file);
    // post the results
    $('#list').append(output);
}

function printTable(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    alldata = data;
    var html = '';
    
    for(var row in data) {
        html += '<tr>\r\n';
        for(var item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n';
                    dimension = item;
        }
        html += '</tr>\r\n';
    }
    dimension++;
    $('#contents').html(html);
    //checking();
    //cleantrain();
    };
    
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}

//load data for testing set
$(document).ready(function() {
    if(isAPIAvailable()) {
    $('#files2').bind('change', handleFileSelect2);
    }
});

function handleFileSelect2(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    // read the file metadata
    var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';
    // read the file contents
    printTable2(file);
    // post the results
    $('#list2').append(output);
}

function printTable2(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    alldata2 = data;
    var html = '';
    for(var row in data) {
        html += '<tr>\r\n';
        for(var item in data[row]) {
        html += '<td>' + data[row][item] + '</td>\r\n';
                    dimension2 = item;
        }
        html += '</tr>\r\n';
    }
    
    $('#contents2').html(html);
    //checking();
    countNB();
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}



function countNB() {
    var cat = [[0,'EWS'],[0,'BL']];       //define possible class and counter
    //var counter = [0,0,0];      //counter for k 
    var correct = 0;    //for count the accuracy 
    console.log(dimension);
    for(var i = 0; i < alldata2.length; i++) {

        //initialize 
        // for(var x = 0; x < cat.length; x++) {
        //     cat[x][0] = 0;
        // }
        //console.log(i);

        var catval = [];
        var helpcount = 0; 

        for(var xxx = 0; xxx < cat.length; xxx++) {
            //initialize 
            // for(var x = 0; x < cat.length; x++) {
                cat[xxx][0] = 0;
            // }

            var curmean = []; 

            for(var x = 0; x < dimension-1; x++) {
                //console.log(x);
                curmean[x] = 0; 
                helpcount = 0;
                for(var y = 0; y < alldata.length; y++) {
                    //console.log(alldata[y][dimension-1]);
                    if(alldata[y][dimension-1] == cat[xxx][1]) {
                        curmean[x] = parseFloat(curmean[x]) + parseFloat(alldata[y][x]);
                        //console.log(curmean[x]);
                        helpcount++;
                    }
                }
                curmean[x] = parseFloat(curmean[x]) / parseFloat(helpcount);
                //console.log(curmean[x]);
            }

            var curvar = [];

            for(var x = 0; x < dimension-1; x++) {
                curvar[x] = 0;
                for(var y = 0; y < alldata.length; y++) {
                    if(alldata[y][dimension-1] == cat[xxx][1]) {
                        curvar[x] = parseFloat(curvar[x]) + Math.pow(parseFloat(alldata[y][x] - curmean[x]),2);
                    }
                }
                curvar[x] = parseFloat(curvar[x]) / parseFloat(helpcount - 1);
                //console.log(curvar[x]);
            }

            cat[xxx][0] = parseFloat(helpcount) / parseFloat(alldata.length);
            //console.log(cat[xxx][0]);

            console.log("---");

            for(var x = 0; x < dimension-1; x++) {
                
                // cat[xxx][0] = parseFloat(cat[xxx][0]) * parseFloat(curvar[x]);
                // console.log(cat[xxx][0]);

                //console.log(Math.exp(100));
                //console.log((1 / Math.sqrt(parseFloat(2 * Math.PI * parseFloat(curvar[x])))) * Math.exp(parseFloat((-1 * Math.pow(parseFloat(parseFloat(alldata2[i][x]) - parseFloat(curmean[x])),2))) / parseFloat(2 * parseFloat(curvar[x]))));

                cat[xxx][0] = parseFloat(cat[xxx][0]) * parseFloat(1 / Math.sqrt(parseFloat(2 * Math.PI * parseFloat(curvar[x])))) * Math.exp(parseFloat((-1 * Math.pow(parseFloat(parseFloat(alldata2[i][x]) - parseFloat(curmean[x])),2))) / parseFloat(2 * parseFloat(curvar[x])));
                
            }

            console.log("YEY");

            console.log(cat[xxx][0]);
            //check if prediction = actual condition
            // if(alldata2[i][dimension-1] == cat[0][1]) {
            //     correct++;
            // }
        }
        cat.sort(function(a,b) {
            return b[0] - a[0];
        });

        console.log("result");
        console.log(cat[0][1]);
        	
        $( "#result" ).append( "<p>"+ i + " = " + cat[0][1] + "</p>" );

        //check if prediction = actual condition
        // if(alldata2[i][dimension-1] == cat[0][1]) {
        //     correct++;
        // }
    }

    //count the accuracy
    // var accuracy = correct / alldata2.length * 100; 
    // console.log(accuracy);
}