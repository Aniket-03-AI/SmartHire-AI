let atsChart = null;

function updateChart(score) {

    const remaining = 100 - score;

    const ctx = document
        .getElementById("atsChart")
        .getContext("2d");

    // Destroy old chart before creating new one
    if (atsChart) {
        atsChart.destroy();
    }

    atsChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "ATS Score",
                "Remaining"
            ],

            datasets: [{
                data: [
                    score,
                    remaining
                ],

                backgroundColor: [
                    "#18bdf2",
                    "#1d3157"
                ],

                borderColor: "#ffffff",

                borderWidth: 3
            }]
        },

        options: {

            responsive: true,

            cutout: "50%",

            plugins: {

                legend: {

                    labels: {
                        color: "white",
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });
}