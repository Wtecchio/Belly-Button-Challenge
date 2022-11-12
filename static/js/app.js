let data = d3.json("samples.json");
console.log(data);

//metadata populate function
function demoInfo(sample){
    //console.log(sample);

    //use d3.json to get the data
    d3.json("samples.json").then((data) => {

        //grab all the data
        let metaData = data.metadata;
        //console.log(metaData);


        //filter on the value 
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        //access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);

        //clear the meatdata out
        d3.select("#sample-metadata").html(""); //clears the HTML out

        //use Object.entries to get the value key pairs
        Object.entries(resultData).forEach(([key, value]) => {

            //add to the sample data/ demographic section
            d3.select("#sample-metadata")
                .append("h5").text(`${key} : ${value}`);
        });

    });
}


//graph function
function buildBarChart(sample){
    //use d3.json to get the data
    d3.json("samples.json").then((data) => {

        //grab all the samples
        let sampleData = data.samples;
        //console.log(sampleData);
    
    
        //filter on the value 
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);
    
        //access index 0 from the array
        let resultData = result[0];
        //console.log(resultData);
    

        //get the otu_ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        //build the bar chart
        //get the yTicks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);


        let barChart = {
            y: yticks.reverse(), 
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation : "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar",[barChart], layout);
    
    });

}

//function that builds the Bubble chart
function buildBBChart(sample){
     d3.json("samples.json").then((data) => {
        let sampleData = data.samples;
        //console.log(sampleData);

        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        let resultData = result[0];

        //get the otu_ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        // Build bubble chart

        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                sizes: (sample_values * 5), //tried making the bubbles bigger but couldn't make it
                color: otu_ids,
                colorscale: "Picnic"
            }
        };

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        // Plot bubble chart
        Plotly.newPlot("bubble", [bubbleChart], layout);
    });
}



//function that starts dashboard
function initialize()
{

    //let data = d3.json("samples.json");
    //console.log(data);


    //access the dropdown selector from the dropdown profile
    var select = d3.select("#selDataset");

    //use d3.json inorder to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names; //made an array of just the names
        console.log(sampleNames);
    
        //use a foreach in order to create options for each sample in the selector
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)     
                .property("value", sample);       
        });    
    
        //when initialized, pass in the information for the first sample
    let sample1 = sampleNames[0];

    //call the function to build the metadata
    demoInfo(sample1);

    //call function to build the bar chart
    buildBarChart(sample1);

    //calls bubble chart function

    buildBBChart(sample1);
    
    });


}

//function that populates dashboard
function optionChanged(item) {
    // call the update to the metadata
    demoInfo(item);
    //call function to build the bar chart
    buildBarChart(item);
    //call function to build the Bubble chart
    buildBBChart(item);

}

//call the initialize function
initialize();