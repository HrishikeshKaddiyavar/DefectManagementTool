
// Load saved data from browser
let features = JSON.parse(localStorage.getItem("features")) || [];
let bugReports = JSON.parse(localStorage.getItem("bugReports")) || [];

let currentUser = "";
let currentRole = "";

// Login Function
function login() {

    currentUser = document.getElementById("username").value.trim();
    currentRole = document.getElementById("role").value;

    if (currentUser === "") {
        alert("Please enter your name");
        return;
    }

    document.getElementById("loginSection").classList.add("hidden");

    if (currentRole === "developer") {
        document.getElementById("developerDashboard").classList.remove("hidden");
        renderDeveloperFeatures();
        renderDeveloperReports();
    } else {
        document.getElementById("testerDashboard").classList.remove("hidden");
        renderTesterFeatures();
        renderTesterReports();
    }
}

// Create Feature Function
function createFeature() {

    let name = document.getElementById("featureName").value.trim();
    let description = document.getElementById("featureDescription").value.trim();
    let bug = document.getElementById("bugDescription").value.trim();

    if (name === "" || description === "" || bug === "") {
        alert("Please fill all feature details");
        return;
    }

    let feature = {
        id: Date.now(),
        name: name,
        description: description,
        intentionalBug: bug,
        developer: currentUser,
        status: "Pending Testing"
    };

    features.push(feature);

    // Save feature in browser
    localStorage.setItem("features", JSON.stringify(features));

    alert("Feature submitted successfully!");

    document.getElementById("featureName").value = "";
    document.getElementById("featureDescription").value = "";
    document.getElementById("bugDescription").value = "";

    renderDeveloperFeatures();
}

// Display Features to Developer
function renderDeveloperFeatures() {

    let container = document.getElementById("developerFeatures");

    container.innerHTML = "";

    features.forEach(function(feature) {

        if (feature.developer === currentUser) {

            container.innerHTML += `
                <div class="feature-card">
                    <h4>${escapeHTML(feature.name)}</h4>
                    <p>${escapeHTML(feature.description)}</p>
                    <p class="status">Status: ${escapeHTML(feature.status)}</p>
                </div>
            `;
        }
    });
}

// Display Features to Tester
function renderTesterFeatures() {

    let container = document.getElementById("testerFeatures");
    let select = document.getElementById("featureSelect");

    container.innerHTML = "";
    select.innerHTML = '<option value="">Select Feature</option>';

    features.forEach(function(feature) {

        container.innerHTML += `
            <div class="feature-card">
                <h4>${escapeHTML(feature.name)}</h4>
                <p>${escapeHTML(feature.description)}</p>
                <p>Developer: ${escapeHTML(feature.developer)}</p>
                <p class="status">Status: ${escapeHTML(feature.status)}</p>
            </div>
        `;

        let option = document.createElement("option");
        option.value = feature.id;
        option.textContent = feature.name;

        select.appendChild(option);
    });
}

// Report Detected Bug
function reportBug() {

    let featureId = Number(document.getElementById("featureSelect").value);
    let title = document.getElementById("detectedBug").value.trim();
    let expected = document.getElementById("expectedResult").value.trim();
    let actual = document.getElementById("actualResult").value.trim();
    let severity = document.getElementById("severity").value;

    if (!featureId || title === "" || expected === "" || actual === "") {
        alert("Please fill all bug report details");
        return;
    }

    let feature = features.find(function(item) {
        return item.id === featureId;
    });

    if (!feature) {
        alert("Feature not found");
        return;
    }

    let report = {
        id: Date.now(),
        featureId: featureId,
        featureName: feature.name,
        title: title,
        expected: expected,
        actual: actual,
        severity: severity,
        tester: currentUser,
        status: "Detected"
    };

    bugReports.push(report);

    // Update feature status
    feature.status = "Bug Detected";

    // Save reports and updated features
    localStorage.setItem("bugReports", JSON.stringify(bugReports));
    localStorage.setItem("features", JSON.stringify(features));

    alert("Bug reported successfully!");

    document.getElementById("detectedBug").value = "";
    document.getElementById("expectedResult").value = "";
    document.getElementById("actualResult").value = "";
    document.getElementById("featureSelect").value = "";

    renderTesterFeatures();
    renderTesterReports();
}

// Display Bug Reports to Developer
function renderDeveloperReports() {

    let container = document.getElementById("developerBugReports");

    container.innerHTML = "";

    let myFeatures = features.filter(function(feature) {
        return feature.developer === currentUser;
    });

    myFeatures.forEach(function(feature) {

        let reports = bugReports.filter(function(report) {
            return report.featureId === feature.id;
        });

        reports.forEach(function(report) {

            container.innerHTML += `
                <div class="bug-card">
                    <h4>${escapeHTML(report.title)}</h4>
                    <p>Feature: ${escapeHTML(report.featureName)}</p>
                    <p>Tester: ${escapeHTML(report.tester)}</p>
                    <p>Expected: ${escapeHTML(report.expected)}</p>
                    <p>Actual: ${escapeHTML(report.actual)}</p>
                    <p>Severity: ${escapeHTML(report.severity)}</p>
                    <p class="status">Status: ${escapeHTML(report.status)}</p>
                </div>
            `;
        });
    });
}

// Display Bug Reports to Tester
function renderTesterReports() {

    let container = document.getElementById("testerBugReports");

    container.innerHTML = "";

    bugReports.forEach(function(report) {

        if (report.tester === currentUser) {

            container.innerHTML += `
                <div class="bug-card">
                    <h4>${escapeHTML(report.title)}</h4>
                    <p>Feature: ${escapeHTML(report.featureName)}</p>
                    <p>Severity: ${escapeHTML(report.severity)}</p>
                    <p class="status">Status: ${escapeHTML(report.status)}</p>
                </div>
            `;
        }
    });
}

// Escape user input before displaying it as HTML
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// Logout Function
function logout() {

    currentUser = "";
    currentRole = "";

    document.getElementById("developerDashboard").classList.add("hidden");
    document.getElementById("testerDashboard").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");

    document.getElementById("username").value = "";
}
