/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.99195818254925, "KoPercent": 0.008041817450743867};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.998431845597105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "StayMate Homepage"], "isController": false}, {"data": [0.9910025706940874, 500, 1500, "Get Hotels"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.9994301994301994, 500, 1500, "View Hotel"], "isController": false}, {"data": [1.0, 500, 1500, "Check Available Rooms"], "isController": false}, {"data": [1.0, 500, 1500, "StayMate Homepage-0"], "isController": false}, {"data": [1.0, 500, 1500, "Get Rooms"], "isController": false}, {"data": [0.9952380952380953, 500, 1500, "Book Room"], "isController": false}, {"data": [1.0, 500, 1500, "Get Notifications"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "StayMate Homepage-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12435, 1, 0.008041817450743867, 57.81519903498175, 0, 780, 20.0, 155.0, 252.0, 410.27999999999884, 5.24772113436867, 711.9380232291315, 1.522669718122257], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["StayMate Homepage", 1980, 0, 0.0, 22.80404040404038, 13, 405, 19.0, 25.0, 29.0, 252.57000000000016, 0.8370135862523477, 1.4792206324218904, 0.407566896091527], "isController": false}, {"data": ["Get Hotels", 1945, 0, 0.0, 176.32133676092542, 39, 780, 129.0, 363.4000000000001, 421.6999999999998, 526.54, 0.8278610793776187, 621.5746387425205, 0.20066594733377657], "isController": false}, {"data": ["Debug Sampler", 920, 0, 0.0, 0.15978260869565208, 0, 2, 0.0, 1.0, 1.0, 1.0, 0.396651570912678, 0.19071678495793767, 0.0], "isController": false}, {"data": ["View Hotel", 1755, 0, 0.0, 59.610256410256355, 17, 527, 32.0, 140.0, 202.19999999999982, 334.7600000000002, 0.7566439156128623, 92.77862250145832, 0.1763978336163742], "isController": false}, {"data": ["Check Available Rooms", 220, 0, 0.0, 16.07272727272727, 8, 92, 12.0, 23.50000000000003, 55.799999999999955, 81.0, 0.09661394472979715, 0.043212096373288184, 0.0404759592666826], "isController": false}, {"data": ["StayMate Homepage-0", 1980, 0, 0.0, 16.289898989899005, 10, 400, 14.0, 19.0, 22.0, 44.0, 0.8370150015915967, 0.5798254311155677, 0.2033750938999784], "isController": false}, {"data": ["Get Rooms", 220, 0, 0.0, 33.345454545454565, 21, 241, 25.0, 70.70000000000002, 85.94999999999999, 96.78999999999999, 0.09660291459775425, 1.3238124139904732, 0.03386762337948611], "isController": false}, {"data": ["Book Room", 210, 1, 0.47619047619047616, 94.95714285714286, 38, 491, 68.0, 163.70000000000002, 292.39999999999986, 385.89999999999986, 0.09625865525741857, 0.04010911591811047, 0.046168702117048696], "isController": false}, {"data": ["Get Notifications", 185, 0, 0.0, 31.351351351351365, 20, 117, 24.0, 61.400000000000006, 76.69999999999999, 103.23999999999978, 0.08282366930344398, 0.05034344751173074, 0.030102713801467635], "isController": false}, {"data": ["Login", 1040, 0, 0.0, 138.88461538461524, 110, 470, 117.0, 198.89999999999998, 231.0, 373.76999999999975, 0.4426673431531706, 0.3038952711050169, 0.1966551833419597], "isController": false}, {"data": ["StayMate Homepage-1", 1980, 0, 0.0, 6.446969696969693, 2, 351, 4.0, 5.0, 7.0, 53.190000000000055, 0.8371002846140967, 0.8994893417421748, 0.20421329642904856], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400", 1, 100.0, 0.008041817450743867], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12435, 1, "400", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Book Room", 210, 1, "400", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
