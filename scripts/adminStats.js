$( document ).ready(function() {

                $.ajax({
                    type: "GET",
                    url: "/adminStats",
                    success: function (result) {
                        // empty πίνακες //
                        $('#userStatsTable').find('tbody').empty();
                        $('#userStatsTable2').find('tbody').empty();
                        $('#userStatsTable3').find('tbody').empty();
                        $('#userStatsTable4').find('tbody').empty();
                        $('#userStatsTable5').find('tbody').empty();
                        $('#userStatsTable6').find('tbody').empty();
                                    //
                        for ( var i = 0; i < result.docs.countActivities.length ; i++) {
                            var newTr = "<tr >";
                            newTr += "<td>" + result.docs.countActivities[i]._id + "</td>";
                            newTr += "<td>" + Number((result.docs.countActivities[i].count / result.docs.sum[0].count) * 100).toFixed(2) + "%" + "</td>";
                            newTr += "</tr>";
                            $('#userStatsTable').append(newTr);
                        }
                            ////////////////////////////////////////
                        for ( i = 0; i < result.docs.userCount.length; i++) {
                            var newTr2 = "<tr>";
                            newTr2 += "<td>" + result.docs.userCount[i]._id.fname +" "+result.docs.userCount[i]._id.lname + "</td>";
                            newTr2 += "<td>" + result.docs.userCount[i].count + "</td>";
                            newTr2 += "</tr>";
                            $('#userStatsTable2').append(newTr2);
                        }
                            /////////////////////////////////////////////
                        for ( i = 0; i < result.docs.popularDay.length; i++) {
                                var newTr3 = "<tr>";
                                newTr3 += "<td>" + day(result.docs.popularDay[i]._id) + "</td>";
                                newTr3 += "<td>" + result.docs.popularDay[i].count + "</td>";
                                newTr3 += "</tr>";
                                $('#userStatsTable3').append(newTr3);
                            }
                            ////////////////////////////////////////////////////////
                        for ( i = 0; i < result.docs.popularHour.length; i++) {
                            var newTr4 = "<tr >";
                            newTr4 += "<td>" + hour(result.docs.popularHour[i]._id) + "</td>";
                            newTr4 += "<td>" +result.docs.popularHour[i].count + "</td>";
                            newTr4 += "</tr>";
                            $('#userStatsTable4').append(newTr4);
                        }
                            ////////////////////////////////////////
                        for ( i = 0; i < result.docs.popularMonth.length; i++) {
                                var newTr5 = "<tr>";
                                newTr5 += "<td>" + month(result.docs.popularMonth[i]._id) + "</td>";
                                newTr5 += "<td>" + result.docs.popularMonth[i].count + "</td>";
                                newTr5 += "</tr>";
                                $('#userStatsTable5').append(newTr5);

                        }
                            /////////////////////////////////////////////
                        for ( i = 0; i < result.docs.popularYear.length; i++) {
                            var newTr6 = "<tr>";
                            newTr6 += "<td>" + result.docs.popularYear[i]._id + "</td>";
                            newTr6 += "<td>" +result.docs.popularYear[i].count + "</td>";
                            newTr6 += "</tr>";
                            $('#userStatsTable6').append(newTr6);

                        }
                        ///////////////////////////////////////////////////////////

                    },
                    error: function (e) {

                        console.log("ERROR: ", e);
                    }
                });
});

function day(x){
    var day = new Array();
    day[1] = "Δευτέρα";
    day[2] = "Τρίτη";
    day[3] = "Τετάρτη";
    day[4] = "Πέμπτη";
    day[5] = "Παρασκευή";
    day[6] = "Σάββατο";
    day[7] = "Κυριακή";
   return day[x];
}
function hour(x) {
    var hour = new Array();
    hour[0] = "12πμ";
    hour[1] = "1πμ";
    hour[2] = "2πμ";
    hour[3] = "3πμ";
    hour[4] = "4πμ";
    hour[5] = "5πμ";
    hour[6] = "6πμ";
    hour[7] = "7πμ";
    hour[8] = "8πμ";
    hour[9] = "9πμ";
    hour[10] = "10πμ";
    hour[11] = "11πμ";
    hour[12] = "12μμ";
    hour[13] = "1μμ";
    hour[14] = "2μμ";
    hour[15] = "3μμ";
    hour[16] = "4μμ";
    hour[17] = "5μμ";
    hour[18] = "6μμ";
    hour[19] = "7μμ";
    hour[20] = "8μμ";
    hour[21] = "9μμ";
    hour[22] = "10μμ";
    hour[23] = "11μμ";
    return hour[x];
}
function month(x) {
    var month = new Array();
    month[1] = "Ιανουάριος";
    month[2] = "Φεβρουάριος";
    month[3] = "Μάρτιος";
    month[4] = "Απρίλιος";
    month[5] = "Μάιος";
    month[6] = "Ιούνιος";
    month[7] = "Ιούλιος";
    month[8] = "Αύγουστος";
    month[9] = "Σεπτέμβριος";
    month[10] = "Οκτώβριος";
    month[11] = "Νοέμβριος";
    month[12] = "Δεκέμβριος";
    return month[x];
}
