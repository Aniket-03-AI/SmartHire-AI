console.log("Script Loaded");

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("resume");
const selectBtn = document.getElementById("selectBtn");
const fileName = document.getElementById("fileName");


// =========================
// Select Resume Button
// =========================

selectBtn.addEventListener("click", () => {
    fileInput.click();
});


// =========================
// File Selection
// =========================

fileInput.addEventListener("change", () => {

    if (fileInput.files.length > 0) {

        fileName.innerText =
            fileInput.files[0].name;
    }
});


// =========================
// Drag Over
// =========================

dropZone.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropZone.style.borderColor = "#00ffcc";
});


// =========================
// Drag Leave
// =========================

dropZone.addEventListener("dragleave", () => {

    dropZone.style.borderColor = "#00bfff";
});


// =========================
// Drop Resume
// =========================

dropZone.addEventListener("drop", (e) => {

    e.preventDefault();

    fileInput.files = e.dataTransfer.files;

    if (e.dataTransfer.files.length > 0) {

        fileName.innerText =
            e.dataTransfer.files[0].name;
    }

    dropZone.style.borderColor = "#00bfff";
});


// =========================
// Analyze Resume
// =========================

async function analyzeResume() {

    console.log("Analyze Button Clicked");

    const jobDescription =
        document.getElementById("jobDescription").value;

    const result =
        document.getElementById("result");


    // Check resume selected
    if (!fileInput.files[0]) {

        alert("Please select a resume file");

        return;
    }


    // Check job description entered
    if (jobDescription.trim() === "") {

        alert("Please enter job description");

        return;
    }


    // Create form data
    const formData = new FormData();

    formData.append(
        "resume",
        fileInput.files[0]
    );

    formData.append(
        "job_description",
        jobDescription
    );


    // Loading message
    result.innerHTML = `
        <h2>Analyzing Resume...</h2>
    `;


    try {

        const response = await fetch(
            "/analyze_resume",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        console.log(data);


        // Backend Error
        if (data.error) {

            result.innerHTML = `
                <h2>Something went wrong</h2>
                <p>${data.error}</p>
            `;

            return;
        }


        // Update Progress Bar
        document.getElementById(
            "progressBar"
        ).style.width = `${data.score}%`;


        // Resume Strength
        let strength = "";

        if (data.score >= 75) {

            strength = "Excellent Resume";
        }
        else if (data.score >= 50) {

            strength = "Good Resume";
        }
        else {

            strength = "Needs Improvement";
        }


        // Candidate Rank
        let rank = "";

        if (data.score >= 90) {

            rank = "🏆 Top Candidate";
        }
        else if (data.score >= 75) {

            rank = "⭐ Strong Candidate";
        }
        else if (data.score >= 50) {

            rank = "👍 Average Candidate";
        }
        else {

            rank = "⚠ Needs Improvement";
        }


        // Suggestions List
        const suggestionsHTML =
            data.suggestions
                .map(item => `<li>${item}</li>`)
                .join("");


        // Update Pie Chart
        updateChart(data.score);


        // Final Result UI
        result.innerHTML = `

            <div class="result-card">

                <h2>
                    ATS Score: ${data.score}%
                </h2>

                <h3>
                    Resume Strength: ${strength}
                </h3>

                <h3>
                    ${rank}
                </h3>

                <h3>
                    AI Recommendation
                </h3>

                <p>
                    ${data.ai_recommendation}
                </p>

                <h3>
                    Suggestions
                </h3>

                <ul>
                    ${suggestionsHTML}
                </ul>

                <h3>
                    Matched Skills
                </h3>

                <div class="skills-container">

                    ${data.matched_skills.map(skill =>

                        `<span class="skill-tag">${skill}</span>`

                    ).join("")}

                </div>

                <button onclick="downloadReport()" class="download-btn">
                   Download Report
                </button>

                <h3>
                    Resume Preview
                </h3>

                <p>
                    ${data.resume_text}
                </p>

            </div>
        `;

    }

    catch (error) {

        console.log(error);

        result.innerHTML = `
            <h2>Something went wrong</h2>

            <p>
                ${error}
            </p>
        `;
    }
}

function downloadReport() {

    window.location.href =
        "/download_report";
}

function toggleTheme() {

    document.body.classList.toggle(
        "light-mode"
    );
}