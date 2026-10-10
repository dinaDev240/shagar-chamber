var API_BASE = (window.location.port === "5000") ? window.location.origin : ("http://" + (window.location.hostname || "localhost") + ":5000");
/* =====================================================
   SHAGAR CHAMBER
   ADMIN EXPO MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const expoForm =
        document.getElementById("expoForm");

    const exposList =
        document.getElementById("admin-expos-list");

    const refreshButton =
        document.getElementById("refreshExpos");


    /* =====================================================
       LOAD EXPOS
       ===================================================== */

    function loadExpos() {

        if (!exposList) return;

        exposList.innerHTML = `
            <div class="admin-empty-state">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <p>Loading expos...</p>
            </div>
        `;


        fetch(API_BASE + "/api/expos")

            .then(function (response) {

                if (!response.ok) {
                    throw new Error("Failed to load expos");
                }

                return response.json();

            })

            .then(function (result) {

                const expos =
                    result.expos || [];


                if (!expos.length) {

                    exposList.innerHTML = `
                        <div class="admin-empty-state">

                            <i class="fa-solid fa-calendar-xmark"></i>

                            <p>
                                No expos available.
                            </p>

                        </div>
                    `;

                    return;
                }


                exposList.innerHTML =
                    expos.map(function (expo) {

                        const startDate =
                            expo.start_date
                                ? new Date(expo.start_date)
                                    .toLocaleDateString()
                                : "Not set";


                        const endDate =
                            expo.end_date
                                ? new Date(expo.end_date)
                                    .toLocaleDateString()
                                : "Not set";


                        return `
                            <article
                                class="admin-list-card"
                                data-expo-id="${expo.id}"
                            >

                                <div class="admin-list-card-content">

                                    <div class="admin-list-card-header">

                                        <div>

                                            <span class="admin-status-badge">
                                                ${expo.status}
                                            </span>

                                            <span class="admin-category-badge">
                                                ${expo.type}
                                            </span>

                                        </div>

                                    </div>


                                    <h3>
                                        ${expo.title}
                                    </h3>


                                    <p>
                                        ${expo.description}
                                    </p>


                                    <div class="admin-list-card-meta">

                                        ${
                                            expo.location
                                                ? `
                                                    <span>
                                                        <i class="fa-solid fa-location-dot"></i>
                                                        ${expo.location}
                                                    </span>
                                                `
                                                : ""
                                        }


                                        <span>
                                            <i class="fa-regular fa-calendar"></i>
                                            ${startDate}
                                            ${
                                                expo.end_date
                                                    ? ` - ${endDate}`
                                                    : ""
                                            }
                                        </span>


                                        ${
                                            expo.contact_email
                                                ? `
                                                    <span>
                                                        <i class="fa-regular fa-envelope"></i>
                                                        ${expo.contact_email}
                                                    </span>
                                                `
                                                : ""
                                        }

                                    </div>


                                  <div class="admin-action-buttons">

    <button
        type="button"
        class="admin-edit-button"
        data-edit-expo="${expo.id}"
    >
        <i class="fa-solid fa-pen-to-square"></i>
        Edit
    </button>

    <button
        type="button"
        class="admin-delete-button"
        data-delete-expo="${expo.id}"
    >
        <i class="fa-solid fa-trash"></i>
        Delete
    </button>

</div>
                                </div>

                            </article>
                        `;

                    }).join("");


                                attachDeleteButtons();
                                attachEditButtons();

            })

            .catch(function (error) {

                console.error(
                    "Expo loading error:",
                    error
                );


                exposList.innerHTML = `
                    <div class="admin-empty-state">

                        <i class="fa-solid fa-circle-exclamation"></i>

                        <p>
                            Unable to load expos.
                        </p>

                    </div>
                `;

            });

    }


    /* =====================================================
       CREATE EXPO
       ===================================================== */

    if (expoForm) {

        expoForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const expoData = {

                    title:
                        document.getElementById("expoTitle").value.trim(),

                    type:
                        document.getElementById("expoType").value,

                    description:
                        document.getElementById("expoDescription").value.trim(),

                    image_url:
                        document.getElementById("expoImage").value.trim(),

                    location:
                        document.getElementById("expoLocation").value.trim(),

                    start_date:
                        document.getElementById("expoStartDate").value,

                    end_date:
                        document.getElementById("expoEndDate").value,

                    contact_email:
                        document.getElementById("expoEmail").value.trim(),

                    contact_phone:
                        document.getElementById("expoPhone").value.trim(),

                    status:
                        document.getElementById("expoStatus").value

                };


                const editingId =
    expoForm.dataset.editingId;

const requestUrl =
    editingId
        ? `${API_BASE}/api/expos/${editingId}`
        : API_BASE + "/api/expos";

const requestMethod =
    editingId
        ? "PUT"
        : "POST";


fetch(
    requestUrl,
    {
        method: requestMethod,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(expoData)
    }
)

                    .then(function (response) {

                        if (!response.ok) {
                            throw new Error(
                                "Failed to create expo"
                            );
                        }

                        return response.json();

                    })

                    .then(function (result) {

                       const wasEditing =
    expoForm.dataset.editingId;


alert(
    result.message ||
    (
        wasEditing
            ? "Expo updated successfully."
            : "Expo created successfully."
    )
);


expoForm.reset();

delete expoForm.dataset.editingId;


const submitButton =
    expoForm.querySelector(
        'button[type="submit"]'
    );


if (submitButton) {

    submitButton.innerHTML = `
        <i class="fa-solid fa-plus"></i>
        Create Expo
    `;

}


loadExpos();

                    })

                    .catch(function (error) {

                        console.error(
                            "Expo creation error:",
                            error
                        );

                        alert(
                            "Unable to create expo."
                        );

                    });

            }
        );

    }


    /* =====================================================
       DELETE EXPO
       ===================================================== */

    function attachDeleteButtons() {

        const deleteButtons =
            document.querySelectorAll(
                "[data-delete-expo]"
            );


        deleteButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const expoId =
                        button.getAttribute(
                            "data-delete-expo"
                        );


                    if (!expoId) return;


                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this expo?"
                        );


                    if (!confirmed) return;


                    fetch(
                        `${API_BASE}/api/expos/${expoId}`,
                        {
                            method: "DELETE"
                        }
                    )

                        .then(function (response) {

                            if (!response.ok) {
                                throw new Error(
                                    "Failed to delete expo"
                                );
                            }

                            return response.json();

                        })

                        .then(function (result) {

                            alert(
                                result.message ||
                                "Expo deleted successfully."
                            );

                            loadExpos();

                        })

                        .catch(function (error) {

                            console.error(
                                "Expo deletion error:",
                                error
                            );

                            alert(
                                "Unable to delete expo."
                            );

                        });

                }
            );

        });

    }
    /* =====================================================
       EDIT EXPO
       ===================================================== */

    function attachEditButtons() {

        const editButtons =
            document.querySelectorAll(
                "[data-edit-expo]"
            );


        editButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const expoId =
                        button.getAttribute(
                            "data-edit-expo"
                        );


                    if (!expoId) return;


                    fetch(
                        `${API_BASE}/api/expos/${expoId}`
                    )

                        .then(function (response) {

                            if (!response.ok) {
                                throw new Error(
                                    "Failed to load expo"
                                );
                            }

                            return response.json();

                        })

                        .then(function (result) {

                            const expo =
                                result.expo;


                            if (!expo) {
                                throw new Error(
                                    "Expo not found"
                                );
                            }


                            document.getElementById(
                                "expoTitle"
                            ).value =
                                expo.title || "";


                            document.getElementById(
                                "expoType"
                            ).value =
                                expo.type || "";


                            document.getElementById(
                                "expoLocation"
                            ).value =
                                expo.location || "";


                            document.getElementById(
                                "expoStatus"
                            ).value =
                                expo.status || "Upcoming";


                            document.getElementById(
                                "expoStartDate"
                            ).value =
                                expo.start_date
                                    ? expo.start_date.substring(0, 10)
                                    : "";


                            document.getElementById(
                                "expoEndDate"
                            ).value =
                                expo.end_date
                                    ? expo.end_date.substring(0, 10)
                                    : "";


                            document.getElementById(
                                "expoEmail"
                            ).value =
                                expo.contact_email || "";


                            document.getElementById(
                                "expoPhone"
                            ).value =
                                expo.contact_phone || "";


                            document.getElementById(
                                "expoImage"
                            ).value =
                                expo.image_url || "";


                            document.getElementById(
                                "expoDescription"
                            ).value =
                                expo.description || "";


                            expoForm.dataset.editingId =
                                expo.id;


                            const submitButton =
                                expoForm.querySelector(
                                    'button[type="submit"]'
                                );


                            if (submitButton) {

                                submitButton.innerHTML = `
                                    <i class="fa-solid fa-save"></i>
                                    Update Expo
                                `;

                            }


                            expoForm.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                        })

                        .catch(function (error) {

                            console.error(
                                "Expo editing error:",
                                error
                            );

                            alert(
                                "Unable to load expo for editing."
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
            loadExpos
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadExpos();

});