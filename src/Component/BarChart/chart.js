// Chart for CNS equipment
const xValuesAlat = ["Communication", "Navigation", "Surveillance", "Data Processing"];
const yValuesAlat = [100, 84.61538461538461, 100, 100]; // Data for each category
const barColorsAlat = ["#4e73df", "#4e73df", "#4e73df", "#4e73df"];

new Chart("myChartAlat", {
  type: "bar",
  data: {
    labels: xValuesAlat,
    datasets: [{
      backgroundColor: barColorsAlat,
      data: yValuesAlat
    }]
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    legend: { display: false },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          max: 100
        }
      }],
      xAxes: [{
        barPercentage: 0.5,
        categoryPercentage: 1,
        gridLines: { display: false }
      }]
    }
  }
});

// Chart for Support equipment
const xValuesAlatSupport = ["Elektrikal", "Mekanikal"];
const yValuesAlatSupport = [94.44, 96.88]; // Data for each category
const barColorsAlatSupport = ["#4e73df", "#4e73df"];

new Chart("myChartAlatSupport", {
  type: "bar",
  data: {
    labels: xValuesAlatSupport,
    datasets: [{
      backgroundColor: barColorsAlatSupport,
      data: yValuesAlatSupport
    }]
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    legend: { display: false },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          max: 100
        }
      }],
      xAxes: [{
        barPercentage: 0.5,
        categoryPercentage: 0.5,
        gridLines: { display: false }
      }]
    }
  }
});
