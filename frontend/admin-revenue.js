var API_BASE = (window.location.port === "5000") ? window.location.origin : ("http://" + (window.location.hostname || "localhost") + ":5000");
/* =====================================================
   SHAGAR CHAMBER
   ADMIN REVENUE MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const revenueForm =
        document.getElementById("revenueForm");

    const revenueList =
        document.getElementById("admin-revenue-list");

    const refreshButton =
        document.getElementById("refreshRevenue");


    /* =====================================================
       LOAD REVENUE
       ===================================================== */

    async function loadRevenue() {

        revenueList.innerHTML = `
            <div class="admin-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Loading revenue records...
            </div>
        `;

        try {

            const response =
                await fetch(
                    API_BASE + "/api/revenue"
                );

            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load revenue."
                );

            }


            displayRevenue(data.revenue);

        } catch (error) {

            console.error(
                "Revenue loading error:",
                error
            );

            revenueList.innerHTML = `
                <div class="admin-empty-state">

                    <i class="fas fa-circle-exclamation"></i>

                    <h3>
                        Unable to Load Revenue
                    </h3>

                    <p>
                        Please make sure the backend
                        server is running.
                    </p>

                </div>
            `;

        }

    }


    /* =====================================================
       DISPLAY REVENUE
       ===================================================== */

    function displayRevenue(revenue) {

        if (!revenue || revenue.length === 0) {

            revenueList.innerHTML = `
                <div class="admin-empty-state">

                    <i class="fas fa-money-bill-wave"></i>

                    <h3>
                        No Revenue Records
                    </h3>

                    <p>
                        No revenue transactions have
                        been recorded yet.
                    </p>

                </div>
            `;

            return;

        }


        revenueList.innerHTML = revenue.map(function (item) {

            return `
                <div class="admin-revenue-card">

                    <div class="admin-revenue-card-header">

                        <div>

                            <span class="admin-revenue-type">
                                ${item.revenue_type}
                            </span>

                            <h3>
                                ${item.description}
                            </h3>

                        </div>

                        <strong class="admin-revenue-amount">
                            ${Number(item.amount).toLocaleString()} ETB
                        </strong>

                    </div>


                    <div class="admin-revenue-card-body">

                        <div>
                            <strong>Payer:</strong>
                            ${item.payer_name}
                        </div>

                        <div>
                            <strong>Payment:</strong>
                            ${item.payment_method}
                        </div>

                        <div>
                            <strong>Status:</strong>
                            ${item.payment_status}
                        </div>

                        <div>
                            <strong>Date:</strong>
                            ${item.payment_date || "Not provided"}
                        </div>

                    </div>

                </div>
            `;

        }).join("");

    }


    /* =====================================================
       CREATE REVENUE
       ===================================================== */

    revenueForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const formData =
                new FormData(revenueForm);


            const revenueData = {

                revenueType:
                    formData.get("revenueType"),

                description:
                    formData.get("description"),

                payerName:
                    formData.get("payerName"),

                amount:
                    formData.get("amount"),

                paymentMethod:
                    formData.get("paymentMethod"),

                paymentStatus:
                    formData.get("paymentStatus"),

                paymentDate:
                    formData.get("paymentDate"),

                reference:
                    formData.get("reference"),

                notes:
                    formData.get("notes")

            };


            try {

                const response =
                    await fetch(
                        API_BASE + "/api/revenue",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    revenueData
                                )
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Unable to save revenue."
                    );

                }


                alert(
                    "Revenue record saved successfully."
                );


                revenueForm.reset();

                loadRevenue();


            } catch (error) {

                console.error(
                    "Revenue save error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to save revenue record."
                );

            }

        }
    );


    /* =====================================================
       REFRESH
       ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadRevenue
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadRevenue();

});