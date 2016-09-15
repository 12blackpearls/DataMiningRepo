//THIS IS FOR KNN - SPLIT TRAINING SET AND TESTING SET 
//ASSOCIATED WITH KNN.HTML
//REMEMBER : 1. change the 'k', 2. change the 'cat', 3. change array w/ nominal data type

var alldata;
var dimension = 0;
var alldata2;
var dimension2 = 0; 

//don't forget to initialize the attribute!
var attibute = 4;

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
    countKNN();
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}


//REMEMBER : 1. change the 'k', 2. change the 'cat', 3. change nominal data type
function countKNN() {
    var cat = [[0,'Iris-setosa'],[0,'Iris-versicolor'],[0,'Iris-virginica']];       //define possible class and counter
    //var counter = [0,0,0];      //counter for k 
    var k = 5;      //define nearest neighbor 
    var correct = 0;    //for count the accuracy 
    for(var i = 0; i < alldata2.length; i++) {

        //initialize 
        for(var x = 0; x < cat.length; x++) {
            cat[x][0] = 0;
        }

        console.log(i);
        for(var j = 0; j < alldata.length; j++) {
            var totalEuc = 0; 
                    
            for(var x = 0; x < dimension-1; x++) {
                if(x == 99) {          //data w/ nominal type ! 
                    if(alldata2[i][x] == alldata[j][x]) {
                        totalEuc = totalEuc + 0; 
                        //console.log("yey sama");
                    } else {
                        totalEuc = totalEuc + 2;
                        //console.log("yey beda");
                    }
                    
                } else {
                    totalEuc = totalEuc + Math.pow(alldata2[i][x]-alldata[j][x],2);
                }
            }

            var fixEuc = Math.sqrt(totalEuc);
            alldata[j][dimension] = fixEuc;
            //console.log(fixEuc);
        }

        console.log("AFTER SORT");
        //sort ascending by euclidean distance value 
        alldata.sort(function(a,b) {
            return a[dimension] - b[dimension];
        });

        // for(var x = 0; x < alldata.length; x++) {
        //     console.log(alldata[x][dimension]);
        // }
        
        //count detected class
        for(var x = 0; x < k; x++) {
            for(var y = 0; y < cat.length; y++) {
                console.log(alldata[x][dimension-1]);
                if(alldata[x][dimension-1] == cat[y][1]) {
                    cat[y][0]++;
                } 
            }
        }

        //sort detected class descending
        cat.sort(function(a,b) {
            return b[0] - a[0];
        });

        //check if prediction = actual condition
        if(alldata2[i][dimension-1] == cat[0][1]) {
            correct++;
        }
    }

    //count the accuracy
    var accuracy = correct / alldata2.length * 100; 
    console.log(accuracy);
}