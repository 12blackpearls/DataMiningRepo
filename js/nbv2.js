//UNCHECKED
//THIS IS FOR NAIVE BAYES - FOLD CROSS VALIDATION
//ASSOCIATED WITH NBV2.HTML
//REMEMBER : 1. change the 'cat', 2. change fold


var alldata;
var dimension = 0;

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
    countNB();
    };
    
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}

function countNB() {
    var fold = 10;      //data will be splitted into how many folds ?
    var dperfold = alldata.length / fold;       //how many data per folds ?

    var counter = 0;    //helper to count the data
    //assign each data with its correspondent fold
    for(var x = 0; x < fold; x++) {
        for(var y = 0; y < dperfold; y++) {
            alldata[counter][dimension+1] = x; 
            counter++;
        }
    }

    var cat = [[0,'Iris-setosa'],[0,'Iris-versicolor'],[0,'Iris-virginica']];       //define possible class and counter
    var correct = 0;    //for count the accuracy 
    var alldata2 = [];      //container for testing set
    var alldata3 = [];      //container for training set
    var counterdata2 = 0; 
    var counterdata3 = 0; 
    var totacc = 0;         //counter for total accuracy

    for(var xx = 0; xx < fold; xx++) {
        //alldata2[xx] = [];
        //alldata3[xx] = [];
        counterdata2 = 0; 
        counterdata3 = 0; 
        correct = 0;

        //prepare training and testing set
        for(var yy = 0; yy < alldata.length; yy++) {
            if(alldata[yy][dimension+1] == xx) {
                alldata2[counterdata2] = [];
                for(var zz = 0; zz < dimension; zz++) {
                    alldata2[counterdata2][zz] = alldata[yy][zz];
                }
                counterdata2++;
            } else {
                alldata3[counterdata3] = [];
                for(var zz = 0; zz < dimension; zz++) {
                    alldata3[counterdata3][zz] = alldata[yy][zz];
                }
                counterdata3++;
            }
        }

        
        //start count Naive Bayes
        for(var i = 0; i < alldata2.length; i++) {
            var catval = [];
            var helpcount = 0; 
            for(var xxx = 0; xxx < cat.length; xxx++) {
                //initialize 
                // for(var x = 0; x < cat.length; x++) {
                //     cat[x][0] = 0;
                // }

                var curmean = []; 

                for(var x = 0; x < dimension; x++) {
                    curmean[x] = 0; 
                    for(var y = 0; y < alldata3.length; y++) {
                        if(alldata3[y][dimension-1] == cat[xxx][1]) {
                            curmean[x] = curmean[x] + alldata3[y][x];
                            helpcount++;
                        }
                    }
                    curmean[x] = curmean[x] / alldata3.length;
                }

                var curvar = [];

                for(var x = 0; x < dimension; x++) {
                    curvar[x] = 0;
                    for(var y = 0; y < alldata3.length; y++) {
                        if(alldata3[y][dimension-1] == cat[xxx][1]) {
                            curvar[x] = curvar[x] + Math.pow(alldata3[y][x] - curmean[x],2);
                        }
                    }
                    curvar[x] = curvar[x] / (alldata3.length - 1);
                }

                catval[xxx] = helpcount / alldata3.length;

                for(var x = 0; x < dimension; x++) {
                    catval[xxx] = catval[xxx] * 1 / Math.sqrt(2 * Math.PI * curvar[x]) * Math.exp((-1 * Math.pow(alldata2[i][x] * curmean[x],2)) / 2 * curvar[x]);
                }


                //check if prediction = actual condition
                // if(alldata2[i][dimension-1] == cat[0][1]) {
                //     correct++;
                // }
            }
            catval.sort(function(a,b) {
                return b - a;
            });

            if(alldata[i][dimension - 1] == catval[0]) {
                correct++;
            }
        }
        var accuracy = correct / alldata2.length * 100; 
        totacc = totacc + accuracy; 
    }
    
    totacc = totacc / fold ;
    console.log(totacc);
}