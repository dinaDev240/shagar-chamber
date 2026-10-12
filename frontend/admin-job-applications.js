var API_BASE = window.location.origin;
/* =====================================================
   SHAGAR CHAMBER
   ADMIN JOB APPLICATIONS MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const applicationsTableBody =
        document.getElementById("applicationsTableBody");

    const refreshButton =
        document.getElementById("refreshApplications");

    const applicationModal =
        document.getElementById("applicationModal");

    const applicationDetails =
        document.getElementById("applicationDetails");

    const closeApplicationModal =
        document.getElementById("closeApplicationModal");


    /* =====================================================
       LOAD ALL APPLICATIONS
       ===================================================== */

    async function loadApplications() {

        applicationsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="message">
                    Loading applications...
                </td>
            </tr>
        `;

        try {

            const response = await fetch(
    API_BASE + "/api/job-applications",
    {
        credentials: "include"
    }
);

            const data = await response.json();

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load applications."
                );

            }

            displayApplications(data.applications);

        } catch (error) {

            console.error(
                "Failed to load applications:",
                error
            );

            applicationsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="message">
                        Unable to load applications.
                    </td>
                </tr>
            `;

        }

    }


    /* =====================================================
       DISPLAY APPLICATIONS
       ===================================================== */

    function displayApplications(applications) {

        if (!applications || applications.length === 0) {

            applicationsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="message">
                        No job applications found.
                    </td>
                </tr>
            `;

            return;
        }


        applicationsTableBody.innerHTML = "";


        applications.forEach(function (application) {

            const row =
                document.createElement("tr");


            const statusClass =
                getStatusClass(application.status);


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHtml(application.full_name)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(application.job_title)}
                </td>

                <td>
                    ${escapeHtml(application.email)}
                </td>

                <td>
                    ${escapeHtml(application.phone)}
                </td>

                <td>
                    ${escapeHtml(application.education)}
                </td>

                <td>

                    <span class="status ${statusClass}">
                        ${escapeHtml(application.status)}
                    </span>

                </td>

                <td>

                    <button
                        type="button"
                        class="view-btn view-application-btn"
                        data-id="${application.id}">

                        <i class="fas fa-eye"></i>
                        View

                    </button>

                </td>

            `;


            applicationsTableBody.appendChild(row);

        });


        /* =============================================
           VIEW BUTTONS
        ============================================= */

        const viewButtons =
            document.querySelectorAll(
                ".view-application-btn"
            );


        viewButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const applicationId =
                        this.getAttribute("data-id");

                    openApplication(
                        applicationId
                    );

                }
            );

        });

    }


    /* =====================================================
       OPEN ONE APPLICATION
       ===================================================== */

    async function openApplication(applicationId) {

        applicationModal.classList.add("active");

        applicationDetails.innerHTML = `
            <div class="message">
                Loading application details...
            </div>
        `;


        try {

           const response = await fetch(
    `${API_BASE}/api/job-applications/${applicationId}`,
    {
        credentials: "include"
    }
);


            const data = await response.json();


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load application."
                );

            }


            displayApplicationDetails(
                data.application
            );


        } catch (error) {

            console.error(
                "Failed to load application:",
                error
            );


            applicationDetails.innerHTML = `
                <div class="message">
                    Unable to load application details.
                </div>
            `;

        }

    }


   /* =====================================================
   DISPLAY APPLICATION DETAILS
   ===================================================== */

function displayApplicationDetails(application) {

    let cvButton = "";

    if (application.cv_path) {

        const filename =
            application.cv_path.split("/").pop();

        const cvUrl =
            `${API_BASE}/api/job-applications/cv/${encodeURIComponent(filename)}`;

       cvButton = `
    <div class="cv-actions">

        <button
            type="button"
            class="cv-button download-cv-button"
            data-cv-url="${cvUrl}"
            data-cv-filename="${filename}">

            <i class="fas fa-download"></i>
            Download CV

        </button>

    </div>
`;
    }


    applicationDetails.innerHTML = `

        <div class="detail-section">

            <h3>
                Applicant Information
            </h3>

            <div class="detail-grid">

                <div class="detail-item">

                    <strong>
                        Full Name
                    </strong>

                    <span>
                        ${escapeHtml(application.full_name)}
                    </span>

                </div>

                <div class="detail-item">

                    <strong>
                        Email
                    </strong>

                    <span>
                        ${escapeHtml(application.email)}
                    </span>

                </div>

                <div class="detail-item">

                    <strong>
                        Phone
                    </strong>

                    <span>
                        ${escapeHtml(application.phone)}
                    </span>

                </div>

                <div class="detail-item">

                    <strong>
                        Education
                    </strong>

                    <span>
                        ${escapeHtml(application.education)}
                    </span>

                </div>

            </div>

        </div>


        <div class="detail-section">

            <h3>
                Job Information
            </h3>

            <div class="detail-grid">

                <div class="detail-item">

                    <strong>
                        Position
                    </strong>

                    <span>
                        ${escapeHtml(application.job_title)}
                    </span>

                </div>

                <div class="detail-item">

                    <strong>
                        Application Date
                    </strong>

                    <span>
                        ${formatDate(application.created_at)}
                    </span>

                </div>

            </div>

        </div>


        <div class="detail-section">

            <h3>
                Experience
            </h3>

            <div class="cover-letter">

                ${
                    application.experience
                        ? escapeHtml(application.experience)
                        : "No experience information provided."
                }

            </div>

        </div>


        <div class="detail-section">

            <h3>
                Cover Letter
            </h3>

            <div class="cover-letter">

                ${
                    application.cover_letter
                        ? escapeHtml(application.cover_letter)
                        : "No cover letter provided."
                }

            </div>

        </div>


        <div class="detail-section">

            <h3>
                Applicant CV
            </h3>

            <div class="application-actions">

                ${
                    cvButton ||
                    "<span>No CV available.</span>"
                }

            </div>

        </div>


        <div class="detail-section">

            <h3>
                Application Status
            </h3>

            <div class="status-control">

                <select id="applicationStatus">

                    <option
                        value="Pending"
                        ${application.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option
                        value="Shortlisted"
                        ${application.status === "Shortlisted" ? "selected" : ""}>
                        Shortlisted
                    </option>

                    <option
                        value="Rejected"
                        ${application.status === "Rejected" ? "selected" : ""}>
                        Rejected
                    </option>

                    <option
                        value="Hired"
                        ${application.status === "Hired" ? "selected" : ""}>
                        Hired
                    </option>

                </select>

                <button
                    type="button"
                    class="save-status-btn"
                    id="saveApplicationStatus">

                    <i class="fas fa-save"></i>
                    Save Status

                </button>

            </div>

        </div>

    `;


    /* =====================================================
       DOWNLOAD CV BUTTON
       ===================================================== */

    const downloadCVButton =
        document.querySelector(".download-cv-button");


    if (downloadCVButton) {

        downloadCVButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const cvUrl =
                    this.getAttribute("data-cv-url");

                const filename =
                    this.getAttribute("data-cv-filename");

                downloadCV(
                    cvUrl,
                    filename
                );

            }
        );

    }


    /* =====================================================
       SAVE STATUS BUTTON
       ===================================================== */

    const saveStatusButton =
        document.getElementById(
            "saveApplicationStatus"
        );


    if (saveStatusButton) {

        saveStatusButton.addEventListener(
            "click",
            function () {

                const newStatus =
                    document.getElementById(
                        "applicationStatus"
                    ).value;

                updateApplicationStatus(
                    application.id,
                    newStatus
                );

            }
        );

    }

}


    /* =====================================================
       UPDATE APPLICATION STATUS
       ===================================================== */

    async function updateApplicationStatus(
        applicationId,
        status
    ) {

        try {

            const response = await fetch(
                `${API_BASE}/api/job-applications/${applicationId}/status`,
                {
                    method: "PATCH",
credentials: "include",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to update status."
                );

            }


            alert(
                `Application status changed to ${status}.`
            );


            await loadApplications();


            await openApplication(
                applicationId
            );


        } catch (error) {

            console.error(
                "Failed to update application status:",
                error
            );


            alert(
                error.message ||
                "Unable to update application status."
            );

        }

    }
/* =====================================================
   DOWNLOAD CV
   ===================================================== */

function downloadCV(cvUrl, filename) {

    const link =
        document.createElement("a");

    link.href = cvUrl;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

}

    /* =====================================================
       CLOSE MODAL
       ===================================================== */

    function closeModal() {

        applicationModal.classList.remove(
            "active"
        );

    }


    if (closeApplicationModal) {

        closeApplicationModal.addEventListener(
            "click",
            closeModal
        );

    }


    /* Close when clicking outside the modal */

    if (applicationModal) {

        applicationModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    applicationModal
                ) {

                    closeModal();

                }

            }
        );

    }


    /* =====================================================
       STATUS CLASS
       ===================================================== */

    function getStatusClass(status) {

        switch (status) {

            case "Pending":
                return "status-pending";

            case "Shortlisted":
                return "status-shortlisted";

            case "Rejected":
                return "status-rejected";

            case "Hired":
                return "status-hired";

            default:
                return "status-pending";

        }

    }


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "Not available";
        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {
            return dateValue;
        }


        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    }


    /* =====================================================
       HTML SECURITY
       ===================================================== */

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       REFRESH BUTTON
       ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadApplications
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadApplications();
    // =====================================================
    // LOAD TOTAL JOB APPLICATIONS
    // =====================================================

    fetch(
    API_BASE + "/api/job-applications",
    {
        credentials: "include"
    }
)
        .then(response => response.json())
        .then(data => {

            if (data.success) {

                const totalApplications =
                    document.getElementById("total-applications");

                totalApplications.textContent =
                    data.applications.length;

            }

        })
        .catch(error => {

            console.error(
                "Failed to load job applications:",
                error
            );

        });
});