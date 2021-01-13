$( document ).ready(function() {
    $.ajax({
        type : "GET",
        url : "/adminMap",
        success: function(result) {
            ///////////////////////// return activities for checkbox///////////////////////////////

            ///////////////////////// checkbox///////////////////////////////


            helpers.buildDropdown(
                result.docs,
                $('.js-example-basic-multiple').select2()
            );
            $(document).ready(function() {
                $('.js-example-basic-multiple').select2();

            $("#checkbox").click(function(){


                if($("#checkbox").is(':checked') ){
                    $(".js-example-basic-multiple > option").prop('checked', true).attr('selected', 'selected');
                    $(".js-example-basic-multiple").trigger("change");

                }else{
                    $(".js-example-basic-multiple > option").prop('checked', false).removeAttr('selected');
                    $(".js-example-basic-multiple").trigger("change");
                }
            });
            });
            ///////////////////////// ///////////////////////////////
            ///////////////////////// values///////////////////////////////
            $('#searchButton').click(function() {
            var year_from=$('#DOBYear option:selected').val();
            var year_to=$('#DOBYear2 option:selected').val();
                var month_from=$('#DOBMonth option:selected').val();
                var month_to=$('#DOBMonth2 option:selected').val();
                var day_from=$('#DOBDay option:selected').val();
                var day_to=$('#DOBDay2 option:selected').val();
                var hour_from=$('#DOBHour option:selected').val();
                var hour_to=$('#DOBHour2 option:selected').val();
                var actArray=$('#actVal').select2('data');
                var x=[];
                for (var i=0;i<actArray.length;i++)
                {
                    x.push(actArray[i].text)
                }
              var flag= validate(year_from,year_to,month_from,month_to,day_from,day_to,hour_from,hour_to,actArray);
                if (flag){

                    $.ajax({
                        type : "POST",
                        data :{year_from,year_to,month_from,month_to,day_from,day_to,hour_from,hour_to,x},
                        url : "/adminMap",
                        success: function(result) {

                            ///////////////////////map data////////////////////////////
                            var cords = result.docs;
                            getCords(cords);
                            ///////////////////////////////////////////////////////////

                        },
                        error : function(e) {

                            console.log("ERROR: ", e);
                        }
                        });
                    $('#div1').css("display", "none");
                        $('#div2').css("display", "flex");
                    $('#exportButton').css("display", "inline");
                    $('#dataExportLabel').css("display", "inline");
                    $('#dataExportSelect').css("display", "inline");
                    $('#exportButton').click(function() {
                        var data_type=$('#dataExportSelect option:selected').val();
                        $.ajax({
                            type : "POST",
                            data :{year_from,year_to,month_from,month_to,day_from,day_to,hour_from,hour_to,x,data_type},
                            url : "/adminMapExport",
                            success: function(result) {

                                ///////////////////////map data////////////////////////////

                                ///////////////////////////////////////////////////////////

                            },
                            error : function(e) {

                                console.log("ERROR: ", e);
                            }
                        });
                    });
                }
            });
            ///////////////////////// ///////////////////////////////
        },
        error : function(e) {

            console.log("ERROR: ", e);
        }
    });
});
var helpers =
    {
        buildDropdown: function(result, dropdown)
        {
            dropdown.html('');
            if(result != '')
            {
                for(var i=0;i<result.length;i++){
                    dropdown.append('<option value="' + i + '">' + result[i] + '</option>');
                }
            }
        }
    };
function validate(yf,yt,mf,mt,df,dt,hf,ht,array) {
    var flag=[];
    if (yf === "nullValue")
    {
        alert( "Επιλέξτε έτος <<ΑΠΟ>>");
        flag.push(false);
    }
    if (yt === "nullValue")
    {
        alert( "Επιλέξτε έτος <<ΕΩΣ>>");
        flag.push(false);
    }
    if (yf > yt)
    {
        alert( "Το έτος ΑΠΟ δεν μπορεί να είναι μεγαλύτερο απο το ΕΩΣ");
        flag.push(false);
    }
    /////////////////////////////////////////////////////////////////////////////
    if (mf === "nullValue")
    {
        alert( "Επιλέξτε  μήνα <<ΑΠΟ>>");
        flag.push(false);
    }
    if (mt === "nullValue")
    {
        alert( "Επιλέξτε  μήνα <<ΕΩΣ>>");
        flag.push(false);
    }
    if (mf > mt)
    {
        alert( "Ο μήνας ΑΠΟ δεν μπορεί να είναι μεγαλύτερος απο το ΕΩΣ");
        flag.push(false);
    }
    ///////////////////////////////////////////////////////////////////////////////
    if (df === "nullValue")
    {
        alert( "Επιλέξτε  μέρα <<ΑΠΟ>>");
        flag.push(false);
    }
    if (dt === "nullValue")
    {
        alert( "Επιλέξτε  μέρα <<ΕΩΣ>>");
        flag.push(false);
    }
    if (df > dt)
    {
        alert( "Η ημέρα ΑΠΟ δεν μπορεί να είναι μεγαλύτερη απο το ΕΩΣ");
        flag.push(false);
    }
    /////////////////////////////////////////////////////////////////////////////
    if (hf === "nullValue")
    {
        alert( "Επιλέξτε  ώρα <<ΑΠΟ>>");
        flag.push(false);
    }
    if (ht === "nullValue")
    {
        alert( "Επιλέξτε  ώρα <<ΕΩΣ>>");
        flag.push(false);
    }
    if (hf > ht)
    {
        alert( "Η ώρα ΑΠΟ δεν μπορεί να είναι μεγαλύτερη απο το ΕΩΣ");
        flag.push(false);
    }
    /////////////////////////////////////////////////////////////////////////////
    if (array.length === 0)
    {
        alert( "Επιλέξτε  Δραστηριότητες");
        flag.push(false);
    }

    return flag[0] !== false;
}

