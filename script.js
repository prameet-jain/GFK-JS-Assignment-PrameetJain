//=========== Answer -1 =================
function compute() {
    'use strict';
    var res, i, j, maxLength=100;
    for (i=1; j=maxLength+1, i < j; i++) {
        res = (i % 3) ? "" : "Bizz";
        res += (i % 5) ? "" : "Appz";
        if (!res) { res = i; }
        console.log(res);
        printResult(res);
    }
}
function printResult(res) {
    'use strict';
    var para = document.createElement("div");
    para.className = "kwd";
    para.innerHTML = res;
    document.getElementById("q1Output").classList.remove("hidden");
    document.getElementById("q1Output").appendChild(para);
}


//=========== Answer -2 =================
    // constructor for Parent Class Mammal
function Mammal(){
}
    // add breathe function to the prototype of Mammal
Mammal.prototype.breathe = function(){
    // do some breathing
    console.log("Meauwww!!");
};

    // constructor for Child Class Cat
function Cat(){
}

// set Cat.prototype to a new instance of Mammal
Cat.prototype = new Mammal();

// to ensure that cats know that they are cats
Cat.prototype.constructor = Cat;

var sal = new Mammal();
sal.breathe();          // Meauwww

var gary = new Cat();
gary.breathe();         // Meauwww

console.log(gary instanceof Cat);   //true
console.log(gary instanceof Mammal);    //true




//=========== Answer -3 =================
$(document).ready(function() {
    var chartOptions = {
        title:{
            text:""
        },
        chart: {
            renderTo: 'chartContainer1'
        },
        xAxis: {
            categories: ['Date1', 'Date2', 'Date3', 'Date4', 'Date5', 'Date6',
                'Date7', 'Date8', 'Date9', 'Date10', 'Date11', 'Date12'
            ],
            labels: {
                staggerLines: 2
            }
        },
        yAxis: {
            title: {
                text: 'Percentage %',
                style: {color: '#6D70EC', fontWeight : 'bold'}
            }
        },
        tooltip: {
            valueSuffix: "%"
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        }
    };

    // JQuery function to process the csv data, I have hosted the given csv data file on free hosted api server.
    // Here's below is the jQuery way to make htpp call and then prepare the chart with parsed data points.
    $.get('https://api.myjson.com/bins/3yetz', function(data) {
        var parsedData=[],keyData=[];

        // parsing the data to generate the required data points foor chart
        $.each(data, function(key, item) {
            if(data[key][2]==="yes") {
                parsedData[data[key][0]] = (parsedData[data[key][0]] != undefined) ? parsedData[data[key][0]] + 1 : 1;
            }
        });

        for(var key in parsedData) {
            keyData.push(parsedData[key]);
        }

        // preparing arguments for Highchart
        chartOptions.title.text = "By fetching data points using AJAX";
        chartOptions.series = [{name: 'Yes', data: keyData}];
        chartOptions.xAxis.categories = Object.keys(parsedData);

        //putting all together and create the chart
        var chart = new Highcharts.Chart(chartOptions);
    });


    // http request cannot be used on local file system because of security (CORS) protection on browser vendor's
    // So, here below I am using fileUploader so the file can be accessed via file upload dialog and then using FileReader
    // to parse the file contents.
    function Upload() {
        var fileUpload = document.getElementById("fileUpload");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof(FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var rows = e.target.result.split("\n");
                    rows.splice(0,1);
                    var parsedData=[],keyData=[];

                    for(var i= 0, j=rows.length; i<j; i++) {
                        rows[i] = rows[i].split(";");
                        if(rows[i][2]=="yes\r") {
                            parsedData[rows[i][0]] = (parsedData[rows[i][0]] != undefined) ? parsedData[rows[i][0]] + 1 : 1;
                        }
                    };

                    for(var key in parsedData) {
                        keyData.push(parsedData[key]);
                    };

                    chartOptions.title.text = "By local file read using FileUploader";
                    chartOptions.chart.renderTo = "chartContainer2";
                    chartOptions.series = [{name: 'Yes', data: keyData}];
                    chartOptions.xAxis.categories = Object.keys(parsedData);

                    //putting all together and create the chart
                    var chart = new Highcharts.Chart(chartOptions);
                }
                reader.readAsText(fileUpload.files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    }

    $("#fileUpload").on("change", Upload);
});



//=========== Answer -4 =================
$(function() {

    // -------------------- Approach 1 - pure JS Style ---------------------
    // Javascript xmlHttpRequest object based ajax implementation (basic), there can be possibly many area of improvements here.
    // Please check the implementation in the script file named 'ajax.js'
    document.getElementById("ques4JS").addEventListener("click", function(e){
        document.getElementById("q4OutputJS").children[0].className = "loader show";

        var toPrint;
        ajax.get('https://cdn.gfkdaphne.com/tests/async.php?a=1').success(function (data, xhr) {
            console.log("First request success.", data);
            toPrint = data;

            ajax.get("https://cdn.gfkdaphne.com/tests/async.php?a=2").success(function(data, xhr){
                console.log("Second request success.", data);
                toPrint += " "+data;

                document.getElementById("q4OutputJS").innerHTML = toPrint;
            }).error(function(error, xhr){
                console.log("Second request failed.", error)
                document.getElementById("q4OutputJS").children[0].className = "loader hide";
            });
        }).error(function (error, xhr) {
            console.log("First request failed.", error)
            document.getElementById("q4OutputJS").children[0].className = "loader hide";
        }).always(function(data, xhr){
            // code which executes in case of both success and error
        });

    });




    // -------------------- Approach 2 - jQuery Style ---------------------
    // Using jQuery ajax method here with chaining :: jQuery's ajax method is an abstraction of a cross browser ajax
    // implementation, in background it uses 'deferred' to maintain asynchronous callbacks.
    // We can also use 'promise' to achieve the same.
    $("#ques4jQuery").on("click", function(e){
        $(this).find(".loader").show();

        var toPrint;
        $.ajax("https://cdn.gfkdaphne.com/tests/async.php?a=1").done(function(data){
            toPrint = data;
        }).fail( function(error){
            console.log("first request failed", error);
            $("#q4OutputjQuery .loader").hide();
        }).then(function(){
            $.ajax("https://cdn.gfkdaphne.com/tests/async.php?a=2").done(function(data){
                toPrint += " "+data;
                $("#q4OutputjQuery").html(toPrint);
            }).fail(function(error){
                console.log("second request failed", error);
                $("#q4OutputjQuery .loader").hide();
            });
        });
    });

});
