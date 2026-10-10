var API_BASE = (window.location.port === "5000") ? window.location.origin : ("http://" + (window.location.hostname || "localhost") + ":5000");
/* =====================================================
   SHAGAR CHAMBER
   ADMIN OPPORTUNITIES MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const opportunityForm =
        document.getElementById("opportunityForm");

    const opportunitiesList =
        document.getElementById("admin-opportunities-list");

    const refreshButton =
        document.getElementById("refreshOpportunities");


    /* =====================================================
       LOAD OPPORTUNITIES
       ===================================================== */

    async function loadOpportunities() {

        if (!opportunitiesList) {
            return;
        }

        opportunitiesList.innerHTML = `
            <div class="admin-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Loading opportunities...
            </div>
        `;

        try {

            const response = await fetch(
                API_BASE + "/api/opportunities"
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "Unable to load opportunities."
                );
            }

            const opportunities =
                result.opportunities;


            if (!opportunities.length) {

                opportunitiesList.innerHTML = `
                    <div class="admin-empty">
                        <i class="fas fa-briefcase"></i>

                        <h3>
                            No Opportunities
                        </h3>

                        <p>
                            No opportunities have been
                            published yet.
                        </p>
                    </div>
                `;

                return;
            }


            opportunitiesList.innerHTML =
                opportunities.map(function (opportunity) {

                    const deadline =
                        opportunity.application_deadline
                            ? new Date(
                                opportunity.application_deadline
                            ).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            )
                            : "No deadline";


                    return `
                        <article class="admin-opportunity-card">

                            <div class="admin-opportunity-main">

                                <span class="admin-opportunity-category">
                                    ${opportunity.category}
                                </span>

                                <h4>
                                    ${opportunity.title}
                                </h4>

                                ${
                                    opportunity.organization
                                        ? `
                                            <p>
                                                <i class="fas fa-building"></i>
                                                ${opportunity.organization}
                                            </p>
                                        `
                                        : ""
                                }

                                ${
                                    opportunity.location
                                        ? `
                                            <p>
                                                <i class="fas fa-location-dot"></i>
                                                ${opportunity.location}
                                            </p>
                                        `
                                        : ""
                                }

                                <p class="admin-opportunity-description">
                                    ${opportunity.description}
                                </p>

                                <div class="admin-opportunity-meta">

                                    <span>
                                        <i class="fas fa-calendar"></i>
                                        ${deadline}
                                    </span>

                                    <span class="admin-status ${opportunity.status === "Open" ? "open" : "closed"}">
                                        <i class="fas fa-circle"></i>
                                        ${opportunity.status}
                                    </span>

                                </div>

                            </div>


                           <div class="admin-action-buttons">

    ${
        opportunity.status === "Open"
            ? `
                <button
                    type="button"
                    class="admin-close-button"
                    data-id="${opportunity.id}"
                >
                    <i class="fas fa-lock"></i>
                    Close
                </button>
            `
            : `
                <span class="admin-closed-label">
                    <i class="fas fa-lock"></i>
                    Closed
                </span>
            `
    }

     <button
        type="button"
        class="admin-delete-button"
        data-id="${opportunity.id}"
    >
        <i class="fas fa-trash"></i>
        Delete
    </button>

</div>
                        </article>
                    `;

                }).join("");


            attachCloseButtons();
            attachDeleteButtons();
        } catch (error) {

            console.error(
                "Failed to load opportunities:",
                error
            );

            opportunitiesList.innerHTML = `
                <div class="admin-error">

                    <i class="fas fa-triangle-exclamation"></i>

                    <h3>
                        Unable to Load Opportunities
                    </h3>

                    <p>
                        Make sure the backend server
                        is running.
                    </p>

                </div>
            `;
        }
    }
/* =====================================================
   DELETE OPPORTUNITY
   ===================================================== */

function attachDeleteButtons() {

    const deleteButtons =
        document.querySelectorAll(
            ".admin-delete-button"
        );

    deleteButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            async function () {

                const opportunityId =
                    button.dataset.id;

                const confirmed =
                    confirm(
                        "Are you sure you want to permanently delete this opportunity?"
                    );

                if (!confirmed) {
                    return;
                }

                button.disabled = true;

                button.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    Deleting...
                `;

                try {

                    const response =
                        await fetch(
                            `${API_BASE}/api/opportunities/${opportunityId}`,
                            {
                                method: "DELETE"
                            }
                        );

                    const result =
                        await response.json();

                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Unable to delete opportunity."
                        );

                    }

                    alert(
                        "Opportunity deleted successfully."
                    );

                    await loadOpportunities();

                } catch (error) {

                    console.error(
                        "Delete opportunity error:",
                        error
                    );

                    alert(
                        error.message ||
                        "Unable to delete opportunity."
                    );

                    button.disabled = false;

                    button.innerHTML = `
                        <i class="fas fa-trash"></i>
                        Delete
                    `;
                }

            }
        );

    });

}

    /* =====================================================
       CREATE OPPORTUNITY
       ===================================================== */

    if (opportunityForm) {

        opportunityForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const submitButton =
                    opportunityForm.querySelector(
                        ".admin-primary-button"
                    );


                const opportunityData = {

                    title:
                        document
                            .getElementById("title")
                            .value
                            .trim(),

                    category:
                        document
                            .getElementById("category")
                            .value,

                    organization:
                        document
                            .getElementById("organization")
                            .value
                            .trim(),

                    location:
                        document
                            .getElementById("location")
                            .value
                            .trim(),

                    description:
                        document
                            .getElementById("description")
                            .value
                            .trim(),

                    requirements:
                        document
                            .getElementById("requirements")
                            .value
                            .trim(),

                    contactEmail:
                        document
                            .getElementById("contactEmail")
                            .value
                            .trim(),

                    contactPhone:
                        document
                            .getElementById("contactPhone")
                            .value
                            .trim(),

                    applicationDeadline:
                        document
                            .getElementById("applicationDeadline")
                            .value

                };


                if (
                    !opportunityData.title ||
                    !opportunityData.category ||
                    !opportunityData.description
                ) {

                    alert(
                        "Please complete all required fields."
                    );

                    return;
                }


                const originalHTML =
                    submitButton.innerHTML;


                submitButton.disabled = true;

                submitButton.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    Publishing...
                `;


                try {

                    const response =
                        await fetch(
                            API_BASE + "/api/opportunities",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        opportunityData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Unable to create opportunity."
                        );

                    }


                    alert(
                        "Opportunity published successfully."
                    );


                    opportunityForm.reset();


                    await loadOpportunities();


                } catch (error) {

                    console.error(
                        "Create opportunity error:",
                        error
                    );

                    alert(
                        error.message ||
                        "Unable to publish opportunity."
                    );

                } finally {

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        originalHTML;

                }

            }
        );

    }


    /* =====================================================
       CLOSE OPPORTUNITY
       ===================================================== */

    function attachCloseButtons() {

        const closeButtons =
            document.querySelectorAll(
                ".admin-close-button"
            );


        closeButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                async function () {

                    const opportunityId =
                        button.dataset.id;


                    const confirmed =
                        confirm(
                            "Are you sure you want to close this opportunity?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    button.disabled = true;

                    button.innerHTML = `
                        <i class="fas fa-spinner fa-spin"></i>
                        Closing...
                    `;


                    try {

                        const response =
                            await fetch(
                                `${API_BASE}/api/opportunities/${opportunityId}/close`,
                                {
                                    method: "PATCH"
                                }
                            );


                        const result =
                            await response.json();


                        if (!response.ok) {

                            throw new Error(
                                result.message ||
                                "Unable to close opportunity."
                            );

                        }


                        alert(
                            "Opportunity closed successfully."
                        );


                        await loadOpportunities();


                    } catch (error) {

                        console.error(
                            "Close opportunity error:",
                            error
                        );

                        alert(
                            error.message ||
                            "Unable to close opportunity."
                        );


                        button.disabled = false;

                        button.innerHTML = `
                            <i class="fas fa-lock"></i>
                            Close
                        `;

                    }

                }
            );

        });

    }


    /* =====================================================
       REFRESH BUTTON
       ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadOpportunities
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadOpportunities();

});