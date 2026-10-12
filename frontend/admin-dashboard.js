var API_BASE = window.location.origin;
/* =====================================================
   SHAGAR CHAMBER
   UNIFIED ADMIN DASHBOARD
   ===================================================== */


function getStoredAdmin() {
    try {
        const stored = localStorage.getItem("shagar_admin") || sessionStorage.getItem("shagar_admin");
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
}

async function checkAdminAuthentication() {
    const apiHost = window.location.hostname || "localhost";
    const storedAdmin = getStoredAdmin();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(
            `${API_BASE}/api/admin/test`,
            {
                method: "GET",
                credentials: "include",
                signal: controller.signal
            }
        );
        clearTimeout(timeoutId);

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
            if (data.admin) {
                localStorage.setItem("shagar_admin", JSON.stringify(data.admin));
                sessionStorage.setItem("shagar_admin", JSON.stringify(data.admin));
            }
            return true;
        }

        // If backend explicitly rejected session and no local admin stored
        if (!storedAdmin) {
            return false;
        }

        return true;

    } catch (error) {
        console.warn("Backend auth check unavailable, verifying local session:", error);
        return !!storedAdmin;
    }
}

document.addEventListener("DOMContentLoaded", async function () {

    const isAuthenticated = await checkAdminAuthentication();

    if (!isAuthenticated) {
        window.location.href = "admin-login.html";
        return;
    }

    // Display admin user details in topbar
    const admin = getStoredAdmin();
    const adminUserEl = document.querySelector(".admin-user span");
    if (adminUserEl && admin && (admin.fullName || admin.email)) {
        adminUserEl.textContent = admin.fullName || admin.email;
    }

    console.log("Admin Dashboard JavaScript loaded successfully.");
    // =====================================================
    // LOAD TOTAL MEMBERS
    // =====================================================

    fetch(
    API_BASE + "/api/members",
    {
        credentials: "include"
    }
)
        .then(response => response.json())
        .then(data => {

            if (data.success) {

                const totalMembers =
                    document.getElementById("total-members");

                totalMembers.textContent =
                    data.members.length;

            }

        })
        .catch(error => {

            console.error(
                "Failed to load members:",
                error
            );

        });
        // =====================================================
// LOAD REVENUE STATISTICS
// =====================================================

fetch(
    API_BASE + "/api/revenue",
    {
        credentials: "include"
    }
)
    .then(response => response.json())
    .then(data => {

        if (data.success) {

            const revenueRecords = data.revenue || [];

            // Calculate total revenue
            const totalRevenue = revenueRecords.reduce(
                (total, record) => {
                    return total + Number(record.amount || 0);
                },
                0
            );

            // Calculate paid revenue
            const paidRevenue = revenueRecords
                .filter(record => record.payment_status === "Paid")
                .reduce(
                    (total, record) => {
                        return total + Number(record.amount || 0);
                    },
                    0
                );

            // Calculate pending revenue
            const pendingRevenue = revenueRecords
                .filter(record => record.payment_status === "Pending")
                .reduce(
                    (total, record) => {
                        return total + Number(record.amount || 0);
                    },
                    0
                );


            // Display total revenue
            const totalRevenueElement =
                document.getElementById("total-revenue");

            if (totalRevenueElement) {
                totalRevenueElement.textContent =
                    totalRevenue.toLocaleString() + " ETB";
            }


            // Display paid revenue
            const paidRevenueElement =
                document.getElementById("paid-revenue");

            if (paidRevenueElement) {
                paidRevenueElement.textContent =
                    paidRevenue.toLocaleString() + " ETB";
            }


            // Display pending revenue
            const pendingRevenueElement =
                document.getElementById("pending-revenue");

            if (pendingRevenueElement) {
                pendingRevenueElement.textContent =
                    pendingRevenue.toLocaleString() + " ETB";
            }


            // Display number of revenue records
            const revenueCountElement =
                document.getElementById("revenue-count");

            if (revenueCountElement) {
                revenueCountElement.textContent =
                    revenueRecords.length;
            }

        } else {

            console.error(
                "Failed to load revenue data:",
                data.message
            );

        }

    })
    .catch(error => {

        console.error(
            "Revenue API error:",
            error
        );

    });
  // =====================================================
// LOAD EVENTS STATISTICS
// =====================================================

fetch(API_BASE + "/api/events")
    .then(response => response.json())
    .then(data => {

        if (data.success) {

            const events = data.events || [];


            // =================================================
            // TOTAL EVENTS
            // =================================================

            const totalEvents = events.length;

            const totalEventsElement =
                document.getElementById("total-events");

            if (totalEventsElement) {

                totalEventsElement.textContent =
                    totalEvents;

            }


            // =================================================
            // UPCOMING EVENTS
            // =================================================

            const upcomingEvents = events.filter(event =>
                event.status === "Upcoming"
            );

            const upcomingEventsElement =
                document.getElementById("upcoming-events");

            if (upcomingEventsElement) {

                upcomingEventsElement.textContent =
                    upcomingEvents.length;

            }


            // =================================================
            // COMPLETED EVENTS
            // =================================================

            const completedEvents = events.filter(event =>
                event.status === "Completed"
            );

            const completedEventsElement =
                document.getElementById("completed-events");

            if (completedEventsElement) {

                completedEventsElement.textContent =
                    completedEvents.length;

            }


            // =================================================
            // EVENT RECORDS
            // =================================================

            const eventsCountElement =
                document.getElementById("events-count");

            if (eventsCountElement) {

                eventsCountElement.textContent =
                    events.length;

            }

        } else {

            console.error(
                "Failed to load events:",
                data.message
            );

        }

    })
    .catch(error => {

        console.error(
            "Events API error:",
            error
        );

    });
 // =====================================================
    // LOAD TOTAL OPPORTUNITIES
    // =====================================================

    fetch(API_BASE + "/api/opportunities")
        .then(response => response.json())
        .then(data => {

            if (data.success) {

                const totalOpportunities =
                    document.getElementById("total-opportunities");

                totalOpportunities.textContent =
                    data.opportunities.length;

            }

        })
        .catch(error => {

            console.error(
                "Failed to load opportunities:",
                error
            );

     });


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

            console.log(
                "Job applications dashboard data:",
                data
            );

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
    // =====================================================
    // ADMIN LOGOUT
    // =====================================================

    const logoutButton =
        document.getElementById("adminLogout");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                // Clear stored admin credentials
                localStorage.removeItem("shagar_admin");
                sessionStorage.removeItem("shagar_admin");

                const apiHost = window.location.hostname || "localhost";

                fetch(
                    `${API_BASE}/api/admin/logout`,
                    {
                        method: "POST",
                        credentials: "include"
                    }
                )
                .catch(() => {})
                .finally(() => {
                    window.location.href = "admin-login.html";
                });

            }
        );

    }

});