var API_BASE = (window.location.port === "5000") ? window.location.origin : ("http://" + (window.location.hostname || "localhost") + ":5000");
/* =====================================================
   SHAGAR CHAMBER
   ADMIN PARTNERSHIPS MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const partnershipForm =
        document.getElementById("partnershipForm");

    const partnershipsList =
        document.getElementById(
            "admin-partnerships-list"
        );

    const refreshButton =
        document.getElementById(
            "refreshPartnerships"
        );


    /* =====================================================
       LOAD PARTNERSHIPS
       ===================================================== */

    function loadPartnerships() {

        if (!partnershipsList) return;


        partnershipsList.innerHTML = `
            <div class="admin-empty-state">

                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>
                    Loading partnerships...
                </p>

            </div>
        `;


        fetch(
            API_BASE + "/api/partnerships"
        )

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load partnerships"
                    );

                }

                return response.json();

            })

            .then(function (result) {

                const partnerships =
                    result.partnerships || [];


                if (!partnerships.length) {

                    partnershipsList.innerHTML = `
                        <div class="admin-empty-state">

                            <i class="fa-solid fa-handshake-slash"></i>

                            <p>
                                No partnerships available.
                            </p>

                        </div>
                    `;

                    return;
                }


                partnershipsList.innerHTML =
                    partnerships.map(
                        function (partnership) {

                            return `
                                <article
                                    class="admin-list-card"
                                    data-partnership-id="${partnership.id}"
                                >

                                    <div class="admin-list-card-content">


                                        <div class="admin-list-card-header">

                                            <div>

                                                <span class="admin-status-badge">
                                                    ${partnership.status}
                                                </span>

                                                <span class="admin-category-badge">
                                                    ${partnership.partner_type}
                                                </span>

                                            </div>

                                        </div>


                                        <h3>
                                            ${partnership.partner_name}
                                        </h3>


                                        ${
                                            partnership.description
                                                ? `
                                                    <p>
                                                        ${partnership.description}
                                                    </p>
                                                `
                                                : ""
                                        }


                                        <div class="admin-list-card-meta">


                                            ${
                                                partnership.contact_email
                                                    ? `
                                                        <span>

                                                            <i class="fa-regular fa-envelope"></i>

                                                            ${partnership.contact_email}

                                                        </span>
                                                    `
                                                    : ""
                                            }


                                            ${
                                                partnership.contact_phone
                                                    ? `
                                                        <span>

                                                            <i class="fa-solid fa-phone"></i>

                                                            ${partnership.contact_phone}

                                                        </span>
                                                    `
                                                    : ""
                                            }


                                            ${
                                                partnership.website_url
                                                    ? `
                                                        <span>

                                                            <i class="fa-solid fa-globe"></i>

                                                            ${partnership.website_url}

                                                        </span>
                                                    `
                                                    : ""
                                            }

                                        </div>


                                        <div class="admin-action-buttons">


                                            <button
                                                type="button"
                                                class="admin-edit-button"
                                                data-edit-partnership="${partnership.id}"
                                            >

                                                <i class="fa-solid fa-pen-to-square"></i>

                                                Edit

                                            </button>


                                            <button
                                                type="button"
                                                class="admin-delete-button"
                                                data-delete-partnership="${partnership.id}"
                                            >

                                                <i class="fa-solid fa-trash"></i>

                                                Delete

                                            </button>


                                        </div>


                                    </div>

                                </article>
                            `;

                        }
                    ).join("");


                attachEditButtons();

                attachDeleteButtons();

            })

            .catch(function (error) {

                console.error(
                    "Partnership loading error:",
                    error
                );


                partnershipsList.innerHTML = `
                    <div class="admin-empty-state">

                        <i class="fa-solid fa-circle-exclamation"></i>

                        <p>
                            Unable to load partnerships.
                        </p>

                    </div>
                `;

            });

    }


    /* =====================================================
       CREATE / UPDATE PARTNERSHIP
       ===================================================== */

    if (partnershipForm) {

        partnershipForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const partnershipData = {

                    partner_name:
                        document.getElementById(
                            "partnerName"
                        ).value.trim(),

                    partner_type:
                        document.getElementById(
                            "partnerType"
                        ).value,

                    description:
                        document.getElementById(
                            "partnerDescription"
                        ).value.trim(),

                    logo_url:
                        document.getElementById(
                            "partnerLogo"
                        ).value.trim(),

                    website_url:
                        document.getElementById(
                            "partnerWebsite"
                        ).value.trim(),

                    contact_email:
                        document.getElementById(
                            "partnerEmail"
                        ).value.trim(),

                    contact_phone:
                        document.getElementById(
                            "partnerPhone"
                        ).value.trim(),

                    status:
                        document.getElementById(
                            "partnershipStatus"
                        ).value

                };


                const editingId =
                    partnershipForm.dataset.editingId;


                const requestUrl =
                    editingId
                        ? `${API_BASE}/api/partnerships/${editingId}`
                        : API_BASE + "/api/partnerships";


                const requestMethod =
                    editingId
                        ? "PUT"
                        : "POST";


                fetch(
                    requestUrl,
                    {
                        method: requestMethod,

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                partnershipData
                            )
                    }
                )

                    .then(function (response) {

                        if (!response.ok) {

                            throw new Error(
                                "Failed to save partnership"
                            );

                        }

                        return response.json();

                    })

                    .then(function (result) {

                        alert(
                            result.message ||
                            "Partnership saved successfully."
                        );


                        partnershipForm.reset();

                        delete partnershipForm.dataset.editingId;


                        const submitButton =
                            partnershipForm.querySelector(
                                'button[type="submit"]'
                            );


                        if (submitButton) {

                            submitButton.innerHTML = `
                                <i class="fa-solid fa-plus"></i>
                                Create Partnership
                            `;

                        }


                        loadPartnerships();

                    })

                    .catch(function (error) {

                        console.error(
                            "Partnership save error:",
                            error
                        );


                        alert(
                            "Unable to save partnership."
                        );

                    });

            }
        );

    }


    /* =====================================================
       EDIT PARTNERSHIP
       ===================================================== */

    function attachEditButtons() {

        const editButtons =
            document.querySelectorAll(
                "[data-edit-partnership]"
            );


        editButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const partnershipId =
                        button.getAttribute(
                            "data-edit-partnership"
                        );


                    if (!partnershipId) return;


                    fetch(
                        `${API_BASE}/api/partnerships/${partnershipId}`
                    )

                        .then(function (response) {

                            if (!response.ok) {

                                throw new Error(
                                    "Failed to load partnership"
                                );

                            }

                            return response.json();

                        })

                        .then(function (result) {

                            const partnership =
                                result.partnership;


                            if (!partnership) {

                                throw new Error(
                                    "Partnership not found"
                                );

                            }


                            document.getElementById(
                                "partnerName"
                            ).value =
                                partnership.partner_name || "";


                            document.getElementById(
                                "partnerType"
                            ).value =
                                partnership.partner_type || "";


                            document.getElementById(
                                "partnershipStatus"
                            ).value =
                                partnership.status || "Active";


                            document.getElementById(
                                "partnerLogo"
                            ).value =
                                partnership.logo_url || "";


                            document.getElementById(
                                "partnerWebsite"
                            ).value =
                                partnership.website_url || "";


                            document.getElementById(
                                "partnerEmail"
                            ).value =
                                partnership.contact_email || "";


                            document.getElementById(
                                "partnerPhone"
                            ).value =
                                partnership.contact_phone || "";


                            document.getElementById(
                                "partnerDescription"
                            ).value =
                                partnership.description || "";


                            partnershipForm.dataset.editingId =
                                partnership.id;


                            const submitButton =
                                partnershipForm.querySelector(
                                    'button[type="submit"]'
                                );


                            if (submitButton) {

                                submitButton.innerHTML = `
                                    <i class="fa-solid fa-save"></i>
                                    Update Partnership
                                `;

                            }


                            partnershipForm.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        })

                        .catch(function (error) {

                            console.error(
                                "Partnership editing error:",
                                error
                            );


                            alert(
                                "Unable to load partnership for editing."
                            );

                        });

                }
            );

        });

    }


    /* =====================================================
       DELETE PARTNERSHIP
       ===================================================== */

    function attachDeleteButtons() {

        const deleteButtons =
            document.querySelectorAll(
                "[data-delete-partnership]"
            );


        deleteButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const partnershipId =
                        button.getAttribute(
                            "data-delete-partnership"
                        );


                    if (!partnershipId) return;


                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this partnership?"
                        );


                    if (!confirmed) return;


                    fetch(
                        `${API_BASE}/api/partnerships/${partnershipId}`,
                        {
                            method: "DELETE"
                        }
                    )

                        .then(function (response) {

                            if (!response.ok) {

                                throw new Error(
                                    "Failed to delete partnership"
                                );

                            }

                            return response.json();

                        })

                        .then(function (result) {

                            alert(
                                result.message ||
                                "Partnership deleted successfully."
                            );


                            loadPartnerships();

                        })

                        .catch(function (error) {

                            console.error(
                                "Partnership deletion error:",
                                error
                            );


                            alert(
                                "Unable to delete partnership."
                            );

                        });

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
            loadPartnerships
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadPartnerships();

});