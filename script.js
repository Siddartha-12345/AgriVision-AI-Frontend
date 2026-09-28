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
                        "🌾 Crop",
                        "🌿 Weed"
                    ],

                    datasets: [

                        {

                            label:
                                "Detected Objects",

                            data: [

                                latestAnalysis.cropCount,

                                latestAnalysis.weedCount

                            ],

                            backgroundColor: [

                                "#22a447",

                                "#e34b4b"

                            ],

                            borderColor: [

                                "#176b34",

                                "#b52b2b"

                            ],

                            borderWidth: 2,

                            borderRadius: 8,

                            hoverBackgroundColor: [

                                "#2fbd59",

                                "#ef6262"

                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: true,

                    plugins: {

                        legend: {

                            display: true,

                            labels: {

                                usePointStyle: true,

                                padding: 18,

                                font: {

                                    size: 13,

                                    weight: "600"

                                }

                            }

                        },

                        title: {

                            display: true,

                            text:
                                "🌱 Crop vs Weed Detection",

                            font: {

                                size: 17,

                                weight: "700"

                            },

                            padding: {

                                top: 10,

                                bottom: 20

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            },

                            title: {

                                display: true,

                                text:
                                    "Number of Detected Objects"

                            },

                            grid: {

                                color:
                                    "rgba(0,0,0,0.08)"

                            }

                        },

                        x: {

                            title: {

                                display: true,

                                text:
                                    "Category"

                            },

                            grid: {

                                display: false

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
                        "https://agrivision-ai-backend-couz.onrender.com/predict",
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
                        "https://agrivision-ai-backend-couz.onrender.com/" +
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
        q.includes("percentage of weed") ||
        q.includes("weed percentage")
    ) {

        return `

            The detected weed density is
            <strong>${density}%</strong>.

            This value represents the percentage
            of detected weed objects relative to
            the total detected crop and weed objects.

        `;

    }


    // ======================================
    // SEVERITY
    // ======================================

    if (
        q.includes("severity") ||
        q.includes("serious") ||
        q.includes("seriousness") ||
        q.includes("level")
    ) {

        return `

            The current weed infestation severity
            is classified as
            <strong>${level}</strong>.

            In this project:

            <br><br>

            🟢 <strong>Low</strong>:
            weed density below 5%.

            <br>

            🟡 <strong>Medium</strong>:
            weed density from 5% to 20%.

            <br>

            🔴 <strong>High</strong>:
            weed density above 20%.

        `;

    }


    // ======================================
    // RECOMMENDATION
    // ======================================

    if (
        q.includes("recommend") ||
        q.includes("what should i do") ||
        q.includes("what can i do") ||
        q.includes("solution") ||
        q.includes("control weeds") ||
        q.includes("manage weeds")
    ) {

        if (level === "High") {

            return `

                🔴 The field currently has
                <strong>High</strong> weed severity.

                It is recommended to inspect the
                high-concentration areas first and
                consider appropriate weed-management
                practices.

                Continue monitoring the field with
                regular images.

            `;

        }


        if (level === "Medium") {

            return `

                🟡 The field currently has
                <strong>Medium</strong> weed severity.

                Monitor the affected areas regularly
                and use suitable weed-management
                practices based on the crop and
                local agricultural guidance.

            `;

        }


        return `

            🟢 The field currently has
            <strong>Low</strong> weed severity.

            Continue regular field monitoring so
            weed growth can be detected early.

        `;

    }


    // ======================================
    // FIELD STATUS
    // ======================================

    if (
        q.includes("field status") ||
        q.includes("condition") ||
        q.includes("field condition") ||
        q.includes("how is my field")
    ) {

        return `

            🌱 <strong>Current Field Status</strong>

            <br><br>

            Crop detections:
            <strong>${crops}</strong>

            <br>

            Weed detections:
            <strong>${weeds}</strong>

            <br>

            Weed density:
            <strong>${density}%</strong>

            <br>

            Severity:
            <strong>${level}</strong>

        `;

    }


    // ======================================
    // HOTSPOT
    // ======================================

    if (
        q.includes("hotspot") ||
        q.includes("where are weeds") ||
        q.includes("weed location") ||
        q.includes("weed area")
    ) {

        const high =
            Number(
                highArea?.textContent || 0
            );

        const medium =
            Number(
                mediumArea?.textContent || 0
            );

        const low =
            Number(
                lowArea?.textContent || 0
            );


        if (
            high === 0 &&
            medium === 0 &&
            low === 0
        ) {

            return `

                No weed hotspots were detected
                in the analyzed field image.

            `;

        }


        if (
            high >= medium &&
            high >= low
        ) {

            return `

                🌿 The highest concentration of
                detected weeds is in the
                <strong>upper area</strong> of the field.

                Detected weed objects there:
                <strong>${high}</strong>.

            `;

        }


        if (
            medium >= high &&
            medium >= low
        ) {

            return `

                🌿 The highest concentration of
                detected weeds is in the
                <strong>middle area</strong> of the field.

                Detected weed objects there:
                <strong>${medium}</strong>.

            `;

        }


        return `

            🌿 The highest concentration of
            detected weeds is in the
            <strong>lower area</strong> of the field.

            Detected weed objects there:
            <strong>${low}</strong>.

        `;

    }


    // ======================================
    // AI / MODEL
    // ======================================

    if (
        q.includes("model") ||
        q.includes("yolo") ||
        q.includes("ai") ||
        q.includes("how detection")
    ) {

        return `

            AgriVision AI uses a YOLO-based object
            detection model trained to identify
            <strong>Crop</strong> and
            <strong>Weed</strong> objects from
            agricultural field images.

            The model provides bounding boxes,
            confidence scores and object counts.

        `;

    }


    // ======================================
    // CONFIDENCE
    // ======================================

    if (
        q.includes("confidence") ||
        q.includes("accurate") ||
        q.includes("accuracy")
    ) {

        return `

            The model produces a confidence score
            for each detected object.

            A higher confidence means the model
            is more confident about that particular
            detection.

            Overall model performance should be
            evaluated using metrics such as
            Precision, Recall and mAP.

        `;

    }


    // ======================================
    // HELP
    // ======================================

    if (
        q.includes("help") ||
        q.includes("what can you do") ||
        q.includes("what can i ask")
    ) {

        return `

            You can ask me questions such as:

            <br><br>

            • How many weeds are detected?

            <br>

            • What is the weed density?

            <br>

            • What is the severity?

            <br>

            • Where are the weed hotspots?

            <br>

            • What should I do?

            <br>

            • How many crops are detected?

        `;

    }


    // ======================================
    // DEFAULT RESPONSE
    // ======================================

    return `

        I can help you understand your current
        field analysis.

        <br><br>

        Try asking about
        <strong>weed count, crop count,
        weed density, severity, hotspots,
        recommendations, or field status.</strong>

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
            "https://agrivision-ai-backend-couz.onrender.com/predict",
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
                "https://agrivision-ai-backend-couz.onrender.com/history"
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
                "https://agrivision-ai-backend-couz.onrender.com/history/" +
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