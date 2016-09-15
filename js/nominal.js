// //identify the data w/ nominal type
// var nominall = [0]; //which array has nominal type data
// var dist = 0; 
// var distarr = [];

// //assign the nominal type data
// function cleantrain() {
//     console.log(dimension);
//     for(var x = 0; x < nominall.length; x++) {
//         var temp = 1; 
//         dist = 0; 
//         distarr[x] = [];
//         for(var y = 0; y < alldata.length; y++) {
//             if(dist == 0) {
//                 distarr[x][dist] = alldata[y][nominall[x]]; 
//                 console.log(distarr[x][dist]);
//                 dist++;
                
//             } else {
//                 for(var z = 0; z < dist; z++) {
//                     if(alldata[y][nominall[x]] === distarr[x][z]) {
//                         temp = 0; 
//                     } else {
//                         if(temp == 0) {
//                             temp = 0;
//                         } else {
//                             temp = 1;
//                         }
//                     }
//                     //temp = alldata[y][nominall[x]].localeCompare(distarr[x][z]);
//                 }
//                 if(temp == 1) {
//                     distarr[x][dist] = alldata[y][nominall[x]]; 
//                     console.log(distarr[x][dist]);
//                     dist++;
                    
//                 }
//             }
//         }
//         console.log(dist);
//         distarr[x][dist] = dist;
//         var tempo;
//         for(var a = 0; a < dist; a++) {
//             distarr[x][a] = [];
//             for(var b = 0; b < dist; b++) {
//                 if(b == a) {
//                     distarr[x][a][b] = 1;
//                 } else {
//                     distarr[x][a][b] = 0;
//                 }
//                 tempo = distarr[x][a][b];
//                 console.log(tempo);
//             }
//         }
//     }
// }