function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")  // add an option
        .text(sample)  // with text sample, i.e "940"
        .property("value", sample);  // add a property (value) = "940"
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Deliverable 1: Bar Chart
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.
    var topIDs = otuIDs.slice(0, 10).reverse();
    var yticks = topIDs.map(id => "OTU " + id);
    var topSamples = sampleValues.slice(0, 10).reverse();
    var topLabels = otuLabels.slice(0, 10).reverse();

    // // 8. Create the trace for the bar chart.
    var barData = [{
      x: topSamples,
      y: yticks,
      text: topLabels,
      type: "bar",
      orientation: "h"
    }];
    // // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: Bubble Chart
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      hovertemplate: '(%{x},%{y})<br>%{text}' +
                     '<extra></extra>',
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIDs,
        size: sampleValues,
        colorscale: "Earth"
      },
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3: Gauge Chart
    // 1. Create the trace for the gauge chart.
    var metadata = data.metadata;
    var metadataResultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metadataResult = metadataResultArray[0];
    var wfreq = parseFloat(metadataResult.wfreq);
    var gaugeData = [{
      value: wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "yellowgreen"},
          {range: [8, 10], color: "green"}
        ]
      },
    }];
    
    // 2. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 600,
     height: 500,
     margin: {t: 0, b:0}
    };

    // 3. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
