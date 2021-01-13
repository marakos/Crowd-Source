$( document ).ready(function() {
    $.ajax({
        type : "GET",
        url : "/ecoActivity",
        success: function(result) {
            var testDate = new Date(Date.now());
            ///////////////////////// user activity///////////////////////////////
            var display = $('.countPercentage > span');
            var currentValue = parseFloat(display.text());
            if (result.docs.ecoActivityUser[0]._id.year === testDate.getFullYear() && result.docs.ecoActivityUser[0]._id.month === testDate.getMonth() + 1) {
                var nextValue = result.docs.ecoActivityUser[0]._id.perc;
            } else {
                var nextValue = 0;
            }
            var diff = nextValue - currentValue;
            var step = (0 < diff ? 1 : -1);
            var float = nextValue % 1;
            if (float === 0) {
                for (var i = 0; i < Math.abs(diff); ++i) {
                    setTimeout(function () {
                        currentValue += step;
                        display.text(Number(currentValue + float).toFixed(1));
                    }, 20 * i)
                }
            } else {
                for (var i = 0; i < Math.abs(diff) - 1; ++i) {
                    setTimeout(function () {
                        currentValue += step;
                        display.text(Number(currentValue + float).toFixed(1));
                    }, 20 * i)
                }
            }
            //////////////////////////////////////////////////////////////////////////////
            ////////////////////////// Month Activity/////////////////////////////////////
            var rotation = new Date().getMonth() + 1;
            var month = new Array();
            month[0] = "Ιαν";
            month[1] = "Φεβ";
            month[2] = "Μαρ";
            month[3] = "Απρ";
            month[4] = "Μαι";
            month[5] = "Ιουν";
            month[6] = "Ιουλ";
            month[7] = "Αυγ";
            month[8] = "Σεπ";
            month[9] = "Οκτ";
            month[10] = "Νοε";
            month[11] = "Δεκ";
            month = rotLeft(month, rotation);
            var valus = [];
            for (var i = 0; i < result.docs.ecoActivityUser.length; i++) {
                valus[result.docs.ecoActivityUser[i]._id.month - 1] = result.docs.ecoActivityUser[i]._id.perc;
            }
            valus = rotLeft(valus, rotation).reverse();
            var chart_data = {
                labels: [month[0], month[1], month[2], month[3], month[4], month[5], month[6], month[7], month[8], month[9], month[10], month[11]],
                series: [
                    [valus[11], valus[10], valus[9], valus[8], valus[7], valus[6], valus[5], valus[4], valus[3], valus[2], valus[1], valus[0]],
                ]
            };
            var options = {
                seriesBarDistance: 10,
                axisX: {
                    showGrid: false
                },
                height: "245px"
            };
            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    seriesBarDistance: 5,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    }
                }]
            ];
            Chartist.Bar('#chartActivity', chart_data, options, responsiveOptions);
            // //////////////////////////////////////////////////////////////////////////////
            // ////////////////////////// user ranking  /////////////////////////////////////
            if(result.docs.ranking[0]!==undefined) {
                for (var i = 0; i < result.docs.ranking[0].arr.length; i++) {
                    var newTr = "<tr>";
                    newTr += "<td>" + (i + 1) + "</td>";
                    newTr += "<td>" + result.docs.ranking[0].arr[i].fname + " " + JSON.stringify (result.docs.ranking[0].arr[i].lname).charAt (2) + "." + "</td>";
                    newTr += "<td>" + Number (result.docs.ranking[0].arr[i].perc).toFixed (2) + "%" + "</td>";
                    newTr += "</tr>";

                    $ ('#userTable').append (newTr);
                }
                if (result.docs.ranking[0].index >= 0) {
                    newTr = "<tr style='background-color: #fc727a'>";
                    newTr += "<td>" + [(result.docs.ranking[0].index) + 1] + "</td>";
                    newTr += "<td>" + result.docs.ranking[0].matched.fname + " " + JSON.stringify (result.docs.ranking[0].matched.lname).charAt (2) + "." + "</td>";
                    newTr += "<td>" + Number (result.docs.ranking[0].matched.perc).toFixed (2) + "%" + "</td>";
                    newTr += "</tr>";
                    $ ('#userTable').append (newTr);
                }
            }
            ////////////////////////// Dates /////////////////////////////////////
            $("#getResultDiv").html(result.docs.firstLastDate_dateCreated[0].lastDate);
            $("#getResultDiv2").html(period(result.docs.firstLastDate_dateCreated[0].first));
            $("#getResultDiv3").html(period(result.docs.firstLastDate_dateCreated[0].last));
            $("#getResultDiv4").html(dif(result.docs.firstLastDate_dateCreated[0].first,result.docs.firstLastDate_dateCreated[0].last));
            //////////////////////////////////////////////////////////////////////////////
        },
        error : function(e) {
            $(".countPercentage > span").html("<strong>Error</strong>");
            console.log("ERROR: ", e);
        }
    });
 });

function period(a) {
    const date1 = new Date(a);
    return "Περίοδος: " + months(date1.getMonth()+1)+" "+ date1.getFullYear();
}
function dif(a, d) {
    const date1 = new Date(a);
    const date2 = new Date(d);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays+" ημέρες";
}
function months(a) {
    var month = new Array();
    month[1] = "Ιανουαρίου";
    month[2] = "Φεβρουαρίου";
    month[3] = "Μαρτίου";
    month[4] = "Απριλίου";
    month[5] = "Μαίου";
    month[6] = "Ιουνίου";
    month[7] = "Ιουλίου";
    month[8] = "Αυγούστου";
    month[9] = "Σεπτεμβρίου";
    month[10] = "Οκτωβρίου";
    month[11] = "Νοεμβρίου";
    month[12] = "Δεκεμβρίου";
    return month[a];
}
function rotLeft(a, d) {
    var arr = [];
    for (var i = 0; i < a.length; i++) {
        arr.push(a[i]);
    }
    for (var j = 1; j <= d; j++) {
        arr.shift(arr.push(arr[0]));
    }
    return arr;
}
