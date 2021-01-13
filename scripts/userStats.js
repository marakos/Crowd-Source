$( document ).ready(function() {
var dates=[];
    $(function() {
        var start = moment().subtract(30, 'days');
        var end = moment();
        function cb(start, end) {
             dates=[start.format('MMMM D, YYYY'),end.format('MMMM D, YYYY')];
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }
        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
            }
        }, cb);
        cb(start, end);
        $('#button3').click (function(e) {
                e.preventDefault();
                $.ajax({
                    type: "POST",
                    url: "/SingleUserStats",
                    data:{dates},
                    success: function (result) {
                        ///////////////////////map data////////////////////////////
                        var cords = result.data;
                        getCords(cords.cords);
                        ///////////////////////////////////////////////////////////
                        ///////////////////////tables//////////////////////////////
                        for (var i = 0; i < result.countActivities.length; i++) {

                            var newTr = "<tr>";
                            newTr += "<td>" + result.countActivities[i]._id + "</td>";
                            newTr += "<td>" +Number((result.countActivities[i].count/ result.sum[0].count) * 100).toFixed(2) + "%"+ "</td>";
                            newTr += "</tr>";
                            $('#userStatsTable').append(newTr);
                            ////////////////////////////////////////
                            var newTr2 = "<tr>";
                            newTr2 += "<td>" + result.popularDay[i]._id + "</td>";
                            newTr2 += "<td>" +day(result.popularDay[i].day) +"</td>";
                            newTr2 += "</tr>";
                            $('#userStatsTable2').append(newTr2);
                            /////////////////////////////////////////////
                            var newTr3 = "<tr>";
                            newTr3 += "<td>" + result.popularHour[i]._id  + "</td>";
                            newTr3 += "<td>" + hour(result.popularHour[i].hour)+"</td>";
                            newTr3 += "</tr>";
                            $('#userStatsTable3').append(newTr3);
                        }
                        ///////////////////////////////////////////////////////////
                    },
                    error: function (e) {
                        console.log("ERROR: ", e);
                    }
                });
                $('#div1').css("display", "flex"),
                $('#div2').css("display", "flex")
            }
        );
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
