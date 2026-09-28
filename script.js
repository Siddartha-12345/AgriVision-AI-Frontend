// ==========================================
// AGRIVISION AI - COMPLETE SCRIPT.JS
// ==========================================


// ==========================================
// HTML ELEMENTS
// ==========================================

const imageInput =
    document.getElementById("imageInput");

const previewImage =
    document.getElementById("previewImage");

const fileName =
    document.getElementById("fileName");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const loading =
    document.getElementById("loading");

const resultsSection =
    document.getElementById("resultsSection");

const cropCount =
    document.getElementById("cropCount");

const weedCount =
    document.getElementById("weedCount");

const weedDensity =
    document.getElementById("weedDensity");

const severity =
    document.getElementById("severity");

const detectedImage =
    document.getElementById("detectedImage");

const highArea =
    document.getElementById("highArea");

const mediumArea =
    document.getElementById("mediumArea");

const lowArea =
    document.getElementById("lowArea");

const hotspotMessage =
    document.getElementById("hotspotMessage");


// ==========================================
// AI ASSISTANT ELEMENTS
// ==========================================

const aiQuestion =
    document.getElementById("aiQuestion");

const askAiBtn =
    document.getElementById("askAiBtn");

const aiResponse =
    document.getElementById("aiResponse");


// ==========================================
// DETECTION HISTORY ELEMENTS
// ==========================================

const refreshHistoryBtn =
    document.getElementById("refreshHistoryBtn");

const historyLoading =
    document.getElementById("historyLoading");

const historyEmpty =
    document.getElementById("historyEmpty");

const historyTableContainer =
    document.getElementById("historyTableContainer");

const historyTableBody =
    document.getElementById("historyTableBody");


// ==========================================
// BEFORE / AFTER COMPARISON ELEMENTS
// ==========================================

const beforeImageInput =
    document.getElementById("beforeImageInput");

const afterImageInput =
    document.getElementById("afterImageInput");

const beforePreview =
    document.getElementById("beforePreview");

const afterPreview =
    document.getElementById("afterPreview");

const compareImagesBtn =
    document.getElementById("compareImagesBtn");

const comparisonLoading =
    document.getElementById("comparisonLoading");

const comparisonResults =
    document.getElementById("comparisonResults");

const weedCountChange =
    document.getElementById("weedCountChange");

const weedDensityChange =
    document.getElementById("weedDensityChange");

const severityChange =
    document.getElementById("severityChange");

const comparisonMessage =
    document.getElementById("comparisonMessage");


// ==========================================
// STORE LATEST ANALYSIS
// ==========================================

let latestAnalysis = {

    cropCount: 0,

    weedCount: 0,

    weedDensity: 0,

    severity: "-",

    detections: []

};


// ==========================================
// CHART VARIABLE
// ==========================================

let fieldChart = null;


// ==========================================
// IMAGE PREVIEW
// ==========================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                fileName.textContent =
                    "No image selected";

                previewImage.style.display =
                    "none";

                return;

            }


            fileName.textContent =
                "Selected: " + file.name;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    previewImage.src =
                        event.target.result;

                    previewImage.style.display =
                        "block";

                };


            reader.readAsDataURL(file);

        }
    );

}


// ==========================================
// BEFORE IMAGE PREVIEW
// ==========================================

if (beforeImageInput) {

    beforeImageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                beforePreview.innerHTML =
                    "<span>Choose before image</span>";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    beforePreview.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="Before field image"
                        >

                    `;

                };


            reader.readAsDataURL(file);

        }
    );

}


// ==========================================
// AFTER IMAGE PREVIEW
// ==========================================

if (afterImageInput) {

    afterImageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                afterPreview.innerHTML =
                    "<span>Choose after image</span>";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    afterPreview.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="After field image"
                        >

                    `;

                };


            reader.readAsDataURL(file);

        }
    );

}


// ==========================================
// HOTSPOT CALCULATION
// ==========================================

function calculateHotspots(detections) {

    let high = 0;

    let medium = 0;

    let low = 0;


    const weeds =
        detections.filter(
            function (detection) {

                return detection.class === "Weed";

            }
        );


    weeds.forEach(
        function (weed) {

            const centerY =
                (weed.y1 + weed.y2) / 2;


            if (centerY < 250) {

                high++;

            }
            else if (centerY < 500) {

                medium++;

            }
            else {

                low++;

            }

        }
    );


    if (highArea) {

        highArea.textContent =
            high;

    }


    if (mediumArea) {

        mediumArea.textContent =
            medium;

    }


    if (lowArea) {

        lowArea.textContent =
            low;

    }


    if (!hotspotMessage) {

        return;

    }


    if (weeds.length === 0) {

        hotspotMessage.textContent =
            "No weed hotspots detected in this image.";

        return;

    }


    if (
        high >= medium &&
        high >= low
    ) {

        hotspotMessage.textContent =
            "Highest weed concentration detected in the upper area of the field.";

    }
    else if (
        medium >= high &&
        medium >= low
    ) {

        hotspotMessage.textContent =
            "Highest weed concentration detected in the middle area of the field.";

    }
    else {

        hotspotMessage.textContent =
            "Highest weed concentration detected in the lower area of the field.";

    }

}


// ==========================================
// FIELD ANALYSIS CHART
// ==========================================

function updateFieldChart() {

    const chartCanvas =
        document.getElementById("fieldChart");


    if (!chartCanvas) {

        console.error(
            "fieldChart canvas not found."
        );

        return;

    }


    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;

    }


    if (fieldChart !== null) {

        fieldChart.destroy();

    }


    fieldChart =
        new Chart(
            chartCanvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Crops",
                        "Weeds"
                    ],

                    datasets: [

                        {

                            label:
                                "Detected Objects",

                            data: [

                                latestAnalysis.cropCount,

                                latestAnalysis.weedCount

                            ],

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: true,

                    plugins: {

                        legend: {

                            display: true

                        },

                        title: {

                            display: true,

                            text:
                                "Crop vs Weed Detection"

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            title: {

                                display: true,

                                text:
                                    "Number of Detected Objects"

                            }

                        },

                        x: {

                            title: {

                                display: true,

                                text:
                                    "Category"

                            }

                        }

                    }

                }

            }
        );

}


// ==========================================
// ANALYZE IMAGE
// ==========================================

if (analyzeBtn) {

    analyzeBtn.addEventListener(
        "click",
        async function () {

            const file =
                imageInput.files[0];


            if (!file) {

                alert(
                    "Please select a crop field image first."
                );

                return;

            }


            loading.classList.remove(
                "hidden"
            );


            resultsSection.classList.add(
                "hidden"
            );


            analyzeBtn.disabled =
                true;


            const formData =
                new FormData();


            formData.append(
                "image",
                file
            );


            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/predict",
                        {

                            method: "POST",

                            body: formData

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Prediction failed."
                    );

                }


                // ==================================
                // UPDATE RESULT CARDS
                // ==================================

                cropCount.textContent =
                    data.crop_count;

                weedCount.textContent =
                    data.weed_count;

                weedDensity.textContent =
                    data.weed_density + "%";

                severity.textContent =
                    data.severity;


                // ==================================
                // SAVE LATEST ANALYSIS
                // ==================================

                latestAnalysis = {

                    cropCount:
                        Number(data.crop_count) || 0,

                    weedCount:
                        Number(data.weed_count) || 0,

                    weedDensity:
                        Number(data.weed_density) || 0,

                    severity:
                        data.severity || "-",

                    detections:
                        data.detections || []

                };


                // ==================================
                // SHOW DETECTED IMAGE
                // ==================================

                if (data.detected_image) {

                    detectedImage.src =
                        "http://127.0.0.1:5000" +
                        data.detected_image;

                }


                // ==================================
                // HOTSPOT ANALYSIS
                // ==================================

                calculateHotspots(
                    data.detections || []
                );


                // ==================================
                // UPDATE CHART
                // ==================================

                updateFieldChart();


                // ==================================
                // RESET AI RESPONSE
                // ==================================

                aiResponse.innerHTML = `

                    <strong>
                        🤖 AgriVision AI:
                    </strong>

                    <p>
                        Analysis completed successfully.
                        Ask me anything about your field results.
                    </p>

                `;


                // ==================================
                // SHOW RESULTS
                // ==================================

                resultsSection.classList.remove(
                    "hidden"
                );


                resultsSection.scrollIntoView({
                    behavior: "smooth"
                });


                // ==================================
                // REFRESH HISTORY
                // ==================================

                loadHistory();

            }
            catch (error) {

                console.error(
                    "Prediction Error:",
                    error
                );


                alert(
                    "Error: " +
                    error.message
                );

            }
            finally {

                loading.classList.add(
                    "hidden"
                );


                analyzeBtn.disabled =
                    false;

            }

        }
    );

}


// ==========================================
// ASK AI BUTTON
// ==========================================

if (askAiBtn) {

    askAiBtn.addEventListener(
        "click",
        function () {

            askAgriVision();

        }
    );

}


// ==========================================
// ENTER KEY FOR AI
// ==========================================

if (aiQuestion) {

    aiQuestion.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                askAgriVision();

            }

        }
    );

}


// ==========================================
// ASK AGRIVISION AI
// ==========================================

function askAgriVision() {

    const question =
        aiQuestion.value.trim();


    if (question.length === 0) {

        aiResponse.innerHTML = `

            <strong>
                🤖 AgriVision AI:
            </strong>

            <p>
                Please type a question first.
            </p>

        `;

        aiQuestion.focus();

        return;

    }


    if (
        latestAnalysis.severity === "-"
    ) {

        aiResponse.innerHTML = `

            <strong>
                🤖 AgriVision AI:
            </strong>

            <p>
                Please upload and analyze a crop field
                image first. Then I can answer questions
                using your field analysis.
            </p>

        `;

        return;

    }


    aiResponse.innerHTML = `

        <strong>
            🤖 AgriVision AI:
        </strong>

        <p>
            🌱 Checking your field analysis...
        </p>

    `;


    const answer =
        generateFarmerResponse(
            question
        );


    aiResponse.innerHTML = `

        <strong>
            🤖 AgriVision AI:
        </strong>

        <p>
            ${answer}
        </p>

    `;

}


// ==========================================
// FARMER RESPONSE ENGINE
// ==========================================

function generateFarmerResponse(question) {

    const q =
        question.toLowerCase();


    const density =
        latestAnalysis.weedDensity;

    const weeds =
        latestAnalysis.weedCount;

    const crops =
        latestAnalysis.cropCount;

    const level =
        latestAnalysis.severity;


    // ======================================
    // GREETING
    // ======================================

    if (
        q === "hi" ||
        q === "hello" ||
        q.includes("hi agrivision") ||
        q.includes("hello agrivision")
    ) {

        return `

            Hello! 🌱 I am AgriVision AI.

            Your current field has
            <strong>${weeds}</strong> detected weeds,
            <strong>${density}%</strong> weed density,
            and <strong>${level}</strong> severity.

            You can ask me about your field analysis.

        `;

    }


    // ======================================
    // WEED COUNT
    // ======================================

    if (
        q.includes("weed count") ||
        q.includes("weed number") ||
        q.includes("number of weed") ||
        q.includes("how many weeds") ||
        q.includes("how many weed")
    ) {

        return `

            The AI detected
            <strong>${weeds}</strong> weed objects
            in the uploaded field image.

        `;

    }


    // ======================================
    // CROP COUNT
    // ======================================

    if (
        q.includes("crop count") ||
        q.includes("crop number") ||
        q.includes("number of crop") ||
        q.includes("how many crops") ||
        q.includes("how many crop")
    ) {

        return `

            The AI detected
            <strong>${crops}</strong> crop objects
            in the uploaded field image.

        `;

    }


    // ======================================
    // WEED DENSITY
    // ======================================

    if (
        q.includes("weed density") ||
        q.includes("density") ||
        q.includes("percentage") ||
        q.includes("percent")
    ) {

        return `

            Your detected weed density is
            <strong>${density}%</strong>.

            This project calculates weed density using
            detected weed objects compared with the
            total detected crop and weed objects.

        `;

    }


    // ======================================
    // SEVERITY
    // ======================================

    if (
        q.includes("severity") ||
        q.includes("serious") ||
        q.includes("risk") ||
        q.includes("danger")
    ) {

        return `

            The current field severity is
            <strong>${level}</strong>.

            Project-defined thresholds are:

            Low: below 5%

            Medium: 5% to 20%

            High: above 20%

        `;

    }


    // ======================================
    // WHY WEED DENSITY
    // ======================================

    if (
        q.includes("why") &&
        (
            q.includes("weed") ||
            q.includes("density")
        )
    ) {

        if (density > 20) {

            return `

                The field shows a relatively high
                detected weed density of
                <strong>${density}%</strong>.

                The AI detected
                <strong>${weeds}</strong> weed objects.

                The affected areas should be inspected
                and monitored closely.

            `;

        }


        if (density >= 5) {

            return `

                The field currently has a detected
                weed density of
                <strong>${density}%</strong>.

                Regular monitoring can help identify
                whether weed growth is increasing.

            `;

        }


        return `

            The detected weed density is relatively
            low at <strong>${density}%</strong>.

            Continue regular field monitoring for
            new weed growth.

        `;

    }


    // ======================================
    // WHAT SHOULD I DO
    // ======================================

    if (
        q.includes("what should i do") ||
        q.includes("what can i do") ||
        q.includes("what to do") ||
        q.includes("solution") ||
        q.includes("control weed") ||
        q.includes("control weeds")
    ) {

        if (level === "High") {

            return `

                The analysis indicates
                <strong>High severity</strong>.

                Inspect the areas with concentrated
                weed detections and consider appropriate
                weed-management practices for your crop.

                Continue monitoring after management.

            `;

        }


        if (level === "Medium") {

            return `

                The analysis indicates
                <strong>Medium severity</strong>.

                Regularly inspect the affected areas
                and consider suitable weed-management
                practices before weed growth increases.

            `;

        }


        return `

            The field currently shows
            <strong>Low severity</strong>.

            Continue regular monitoring and check
            for new weed growth.

        `;

    }


    // ======================================
    // HOTSPOT
    // ======================================

    if (
        q.includes("hotspot") ||
        q.includes("where are weeds") ||
        q.includes("where is weed") ||
        q.includes("which area") ||
        q.includes("affected area")
    ) {

        const high =
            Number(highArea.textContent) || 0;

        const medium =
            Number(mediumArea.textContent) || 0;

        const low =
            Number(lowArea.textContent) || 0;


        if (
            high === 0 &&
            medium === 0 &&
            low === 0
        ) {

            return `

                No weed hotspot was detected
                in the current field image.

            `;

        }


        if (
            high >= medium &&
            high >= low
        ) {

            return `

                The highest detected weed concentration
                is in the <strong>upper area</strong>
                of the field image.

                Detected weeds:
                <strong>${high}</strong>.

            `;

        }


        if (
            medium >= high &&
            medium >= low
        ) {

            return `

                The highest detected weed concentration
                is in the <strong>middle area</strong>
                of the field image.

                Detected weeds:
                <strong>${medium}</strong>.

            `;

        }


        return `

            The highest detected weed concentration
            is in the <strong>lower area</strong>
            of the field image.

            Detected weeds:
            <strong>${low}</strong>.

        `;

    }


    // ======================================
    // MONITORING
    // ======================================

    if (
        q.includes("monitor") ||
        q.includes("monitoring") ||
        q.includes("check regularly") ||
        q.includes("future")
    ) {

        return `

            Capture field images regularly from similar
            viewpoints.

            Compare weed count, weed density, severity,
            and hotspot locations over time to monitor
            changes in weed growth.

        `;

    }


    // ======================================
    // FIELD SUMMARY
    // ======================================

    if (
        q.includes("summary") ||
        q.includes("report") ||
        q.includes("tell me about my field") ||
        q.includes("field status") ||
        q.includes("field analysis")
    ) {

        return `

            🌱 <strong>Field Analysis Summary</strong>

            <br><br>

            🌾 Crop detections:
            <strong>${crops}</strong>

            <br>

            🌿 Weed detections:
            <strong>${weeds}</strong>

            <br>

            📈 Weed density:
            <strong>${density}%</strong>

            <br>

            ⚠️ Severity:
            <strong>${level}</strong>

        `;

    }


    // ======================================
    // GENERAL RESPONSE
    // ======================================

    return `

        Based on the current analysis:

        <br><br>

        🌾 Crops detected:
        <strong>${crops}</strong>

        <br>

        🌿 Weeds detected:
        <strong>${weeds}</strong>

        <br>

        📈 Weed density:
        <strong>${density}%</strong>

        <br>

        ⚠️ Severity:
        <strong>${level}</strong>

        <br><br>

        You can ask:

        <br>
        • What is my weed count?

        <br>
        • What is my crop count?

        <br>
        • What is the weed density?

        <br>
        • What is the severity?

        <br>
        • Where is the weed hotspot?

        <br>
        • Why is my weed density high?

        <br>
        • What should I do?

        <br>
        • Give me a field summary.

    `;

}


// ==========================================
// BEFORE / AFTER COMPARISON
// ==========================================


// ==========================================
// PREVIEW HELPER
// ==========================================

function showComparisonPreview(
    inputElement,
    previewElement,
    label
) {

    if (
        !inputElement ||
        !previewElement
    ) {

        return;

    }


    const file =
        inputElement.files[0];


    if (!file) {

        previewElement.innerHTML = `
            <span>
                Choose ${label} image
            </span>
        `;

        return;

    }


    if (
        !file.type.startsWith("image/")
    ) {

        alert(
            "Please select a valid image file."
        );

        inputElement.value = "";

        previewElement.innerHTML = `
            <span>
                Choose ${label} image
            </span>
        `;

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            previewElement.innerHTML = `

                <img
                    src="${event.target.result}"
                    alt="${label} field image"
                >

            `;

        };


    reader.readAsDataURL(file);

}


// ==========================================
// BEFORE IMAGE CHANGE
// ==========================================

if (beforeImageInput) {

    beforeImageInput.addEventListener(
        "change",
        function () {

            showComparisonPreview(
                beforeImageInput,
                beforePreview,
                "before"
            );

        }
    );

}


// ==========================================
// AFTER IMAGE CHANGE
// ==========================================

if (afterImageInput) {

    afterImageInput.addEventListener(
        "change",
        function () {

            showComparisonPreview(
                afterImageInput,
                afterPreview,
                "after"
            );

        }
    );

}


// ==========================================
// ANALYZE COMPARISON IMAGE
// ==========================================

async function analyzeComparisonImage(file) {

    const formData =
        new FormData();


    formData.append(
        "image",
        file
    );


    const response =
        await fetch(
            "http://127.0.0.1:5000/predict",
            {

                method: "POST",

                body: formData

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.error ||
            "Comparison image analysis failed."
        );

    }


    return data;

}


// ==========================================
// SEVERITY VALUE
// ==========================================

function getSeverityValue(level) {

    const value =
        String(level || "")
            .toLowerCase();


    if (value === "high") {

        return 3;

    }


    if (value === "medium") {

        return 2;

    }


    if (value === "low") {

        return 1;

    }


    return 0;

}


// ==========================================
// COMPARE IMAGES
// ==========================================

if (compareImagesBtn) {

    compareImagesBtn.addEventListener(
        "click",
        async function () {

            const beforeFile =
                beforeImageInput
                    ? beforeImageInput.files[0]
                    : null;


            const afterFile =
                afterImageInput
                    ? afterImageInput.files[0]
                    : null;


            // ==================================
            // VALIDATION
            // ==================================

            if (!beforeFile) {

                alert(
                    "Please select the Before image first."
                );

                return;

            }


            if (!afterFile) {

                alert(
                    "Please select the After image."
                );

                return;

            }


            // ==================================
            // SHOW LOADING
            // ==================================

            comparisonLoading.classList.remove(
                "hidden"
            );


            comparisonResults.classList.add(
                "hidden"
            );


            compareImagesBtn.disabled =
                true;


            try {

                // ==================================
                // ANALYZE BEFORE IMAGE
                // ==================================

                const beforeData =
                    await analyzeComparisonImage(
                        beforeFile
                    );


                // ==================================
                // ANALYZE AFTER IMAGE
                // ==================================

                const afterData =
                    await analyzeComparisonImage(
                        afterFile
                    );


                // ==================================
                // GET VALUES
                // ==================================

                const beforeWeeds =
                    Number(
                        beforeData.weed_count
                    ) || 0;


                const afterWeeds =
                    Number(
                        afterData.weed_count
                    ) || 0;


                const beforeDensity =
                    Number(
                        beforeData.weed_density
                    ) || 0;


                const afterDensity =
                    Number(
                        afterData.weed_density
                    ) || 0;


                const beforeSeverity =
                    beforeData.severity ||
                    "-";


                const afterSeverity =
                    afterData.severity ||
                    "-";


                // ==================================
                // CALCULATE CHANGES
                // ==================================

                const weedDifference =
                    afterWeeds -
                    beforeWeeds;


                const densityDifference =
                    afterDensity -
                    beforeDensity;


                const severityDifference =
                    getSeverityValue(
                        afterSeverity
                    ) -
                    getSeverityValue(
                        beforeSeverity
                    );


                // ==================================
                // DISPLAY WEED COUNT
                // ==================================

                if (weedCountChange) {

                    if (
                        weedDifference < 0
                    ) {

                        weedCountChange.textContent =
                            `${beforeWeeds} → ${afterWeeds} ↓ ${Math.abs(weedDifference)}`;

                    }
                    else if (
                        weedDifference > 0
                    ) {

                        weedCountChange.textContent =
                            `${beforeWeeds} → ${afterWeeds} ↑ ${weedDifference}`;

                    }
                    else {

                        weedCountChange.textContent =
                            `${beforeWeeds} → ${afterWeeds} → No change`;

                    }

                }


                // ==================================
                // DISPLAY WEED DENSITY
                // ==================================

                if (weedDensityChange) {

                    if (
                        densityDifference < 0
                    ) {

                        weedDensityChange.textContent =
                            `${beforeDensity}% → ${afterDensity}% ↓ ${Math.abs(densityDifference).toFixed(2)}%`;

                    }
                    else if (
                        densityDifference > 0
                    ) {

                        weedDensityChange.textContent =
                            `${beforeDensity}% → ${afterDensity}% ↑ ${densityDifference.toFixed(2)}%`;

                    }
                    else {

                        weedDensityChange.textContent =
                            `${beforeDensity}% → ${afterDensity}% → No change`;

                    }

                }


                // ==================================
                // DISPLAY SEVERITY
                // ==================================

                if (severityChange) {

                    severityChange.textContent =
                        `${beforeSeverity} → ${afterSeverity}`;

                }


                // ==================================
                // COMPARISON MESSAGE
                // ==================================

                if (comparisonMessage) {

                    if (
                        weedDifference < 0 &&
                        densityDifference < 0
                    ) {

                        comparisonMessage.innerHTML = `

                            <strong>
                                📉 Weed growth decreased.
                            </strong>

                            <br><br>

                            Weed count decreased from
                            <strong>${beforeWeeds}</strong>
                            to
                            <strong>${afterWeeds}</strong>.

                            <br>

                            Weed density changed from
                            <strong>${beforeDensity}%</strong>
                            to
                            <strong>${afterDensity}%</strong>.

                            <br><br>

                            Continue monitoring the field
                            using similar image conditions.

                        `;

                    }
                    else if (
                        weedDifference > 0 &&
                        densityDifference > 0
                    ) {

                        comparisonMessage.innerHTML = `

                            <strong>
                                📈 Weed growth increased.
                            </strong>

                            <br><br>

                            Weed count increased from
                            <strong>${beforeWeeds}</strong>
                            to
                            <strong>${afterWeeds}</strong>.

                            <br>

                            Weed density changed from
                            <strong>${beforeDensity}%</strong>
                            to
                            <strong>${afterDensity}%</strong>.

                            <br><br>

                            Inspect the affected areas and
                            continue regular field monitoring.

                        `;

                    }
                    else if (
                        weedDifference === 0 &&
                        densityDifference === 0
                    ) {

                        comparisonMessage.innerHTML = `

                            <strong>
                                📊 No major change detected.
                            </strong>

                            <br><br>

                            The detected weed count and
                            weed density remained the same
                            between the two analyses.

                        `;

                    }
                    else {

                        comparisonMessage.innerHTML = `

                            <strong>
                                📊 Field conditions changed.
                            </strong>

                            <br><br>

                            Weed count:
                            <strong>
                                ${beforeWeeds} → ${afterWeeds}
                            </strong>

                            <br>

                            Weed density:
                            <strong>
                                ${beforeDensity}% → ${afterDensity}%
                            </strong>

                            <br>

                            Severity:
                            <strong>
                                ${beforeSeverity} → ${afterSeverity}
                            </strong>

                            <br><br>

                            Continue monitoring the field
                            using images captured under
                            similar conditions.

                        `;

                    }

                }


                // ==================================
                // SHOW RESULTS
                // ==================================

                comparisonResults.classList.remove(
                    "hidden"
                );


                comparisonResults.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                // ==================================
                // REFRESH HISTORY
                // ==================================

                loadHistory();

            }
            catch (error) {

                console.error(
                    "Comparison Error:",
                    error
                );


                alert(
                    "Comparison Error: " +
                    error.message
                );

            }
            finally {

                comparisonLoading.classList.add(
                    "hidden"
                );


                compareImagesBtn.disabled =
                    false;

            }

        }
    );

}


// ==========================================
// DETECTION HISTORY
// ==========================================

async function loadHistory() {

    if (
        !historyLoading ||
        !historyEmpty ||
        !historyTableContainer ||
        !historyTableBody
    ) {

        console.error(
            "Detection History HTML elements not found."
        );

        return;

    }


    historyLoading.classList.remove(
        "hidden"
    );


    historyEmpty.classList.add(
        "hidden"
    );


    historyTableContainer.classList.add(
        "hidden"
    );


    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/history"
            );


        const history =
            await response.json();


        if (!response.ok) {

            throw new Error(
                history.error ||
                "Failed to load detection history."
            );

        }


        historyLoading.classList.add(
            "hidden"
        );


        if (
            !history ||
            history.length === 0
        ) {

            historyEmpty.textContent =
                "No detection history available yet.";


            historyEmpty.classList.remove(
                "hidden"
            );


            return;

        }


        historyTableBody.innerHTML = "";


        history.forEach(
            function (item, index) {

                const row =
                    document.createElement("tr");


                const severityClass =
                    String(
                        item.severity || ""
                    ).toLowerCase();


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${item.image_name}
                    </td>

                    <td>
                        ${item.created_at}
                    </td>

                    <td>
                        ${item.crop_count}
                    </td>

                    <td>
                        ${item.weed_count}
                    </td>

                    <td>
                        ${item.weed_density}%
                    </td>

                    <td>

                        <span
                            class="severity-badge severity-${severityClass}"
                        >
                            ${item.severity}
                        </span>

                    </td>

                    <td>

                        <button
                            class="delete-history-btn"
                            onclick="deleteHistory(${item.id})"
                        >
                            🗑️ Delete
                        </button>

                    </td>

                `;


                historyTableBody.appendChild(
                    row
                );

            }
        );


        historyTableContainer.classList.remove(
            "hidden"
        );

    }
    catch (error) {

        console.error(
            "History Error:",
            error
        );


        historyLoading.classList.add(
            "hidden"
        );


        historyEmpty.textContent =
            "Unable to load detection history. Please make sure the Flask backend is running.";


        historyEmpty.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// DELETE ONE HISTORY RECORD
// ==========================================

async function deleteHistory(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this detection history?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/history/" +
                id,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Failed to delete history."
            );

        }


        alert(
            "Detection history deleted successfully."
        );


        loadHistory();

    }
    catch (error) {

        console.error(
            "Delete History Error:",
            error
        );


        alert(
            "Error: " +
            error.message
        );

    }

}


// ==========================================
// REFRESH HISTORY BUTTON
// ==========================================

if (refreshHistoryBtn) {

    refreshHistoryBtn.addEventListener(
        "click",
        function () {

            loadHistory();

        }
    );

}


// ==========================================
// LOAD HISTORY WHEN PAGE OPENS
// ==========================================

loadHistory();