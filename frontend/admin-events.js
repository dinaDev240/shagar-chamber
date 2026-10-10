var API_BASE = (window.location.port === "5000") ? window.location.origin : ("http://" + (window.location.hostname || "localhost") + ":5000");
/* =====================================================
   SHAGAR CHAMBER
   ADMIN EVENTS MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const eventForm =
        document.getElementById("eventForm");

    const eventsList =
        document.getElementById("admin-events-list");

    const refreshButton =
        document.getElementById("refreshEvents");


    const API_URL =
        API_BASE + "/api/events";


    /* =====================================================
       LOAD EVENTS
       ===================================================== */

    async function loadEvents() {

        eventsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading events...</p>
            </div>
        `;


        try {

            const response =
                await fetch(API_URL);

            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.message || "Failed to load events."
                );

            }


            displayEvents(data.events);


        } catch (error) {

            console.error(
                "Error loading events:",
                error
            );


            eventsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-triangle-exclamation"></i>
                    <p>
                        Failed to load events.
                    </p>
                </div>
            `;

        }

    }


    /* =====================================================
       DISPLAY EVENTS
       ===================================================== */

    function displayEvents(events) {

        if (!events || events.length === 0) {

            eventsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-xmark"></i>
                    <p>
                        No events have been created yet.
                    </p>
                </div>
            `;

            return;
        }


        eventsList.innerHTML = "";


        events.forEach(function (event) {

            const eventItem =
                document.createElement("div");

            eventItem.className = "event-item";


            const formattedDate =
                formatDate(event.event_date);


            const formattedTime =
                event.event_time
                    ? formatTime(event.event_time)
                    : "Time not specified";


            eventItem.innerHTML = `

                <div class="event-info">

                    <h4>
                        ${escapeHTML(event.title)}
                    </h4>


                    <div class="event-meta">

                        <span>
                            <i class="fas fa-tag"></i>
                            ${escapeHTML(event.event_type)}
                        </span>


                        <span>
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </span>


                        <span>
                            <i class="fas fa-clock"></i>
                            ${formattedTime}
                        </span>


                        ${
                            event.location
                                ? `
                                    <span>
                                        <i class="fas fa-location-dot"></i>
                                        ${escapeHTML(event.location)}
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    ${
                        event.description
                            ? `
                                <div class="event-description">
                                    ${escapeHTML(
                                        event.description
                                    )}
                                </div>
                              `
                            : ""
                    }


                    <span class="event-status">
                        ${escapeHTML(event.status)}
                    </span>

                </div>


                <div class="event-actions">

                    <button
                        class="action-btn edit-btn"
                        onclick="editEvent(${event.id})"
                        title="Edit Event"
                    >
                        <i class="fas fa-pen"></i>
                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteEvent(${event.id})"
                        title="Delete Event"
                    >
                        <i class="fas fa-trash"></i>
                    </button>

                </div>

            `;


            eventsList.appendChild(eventItem);

        });

    }


    /* =====================================================
       SAVE EVENT
       ===================================================== */

    eventForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const formData =
                new FormData(eventForm);


            const eventData = {

                title:
                    formData.get("title").trim(),

                eventType:
                    formData.get("eventType"),

                description:
                    formData.get("description").trim(),

                eventDate:
                    formData.get("eventDate"),

                eventTime:
                    formData.get("eventTime"),

                location:
                    formData.get("location").trim(),

                imageUrl:
                    formData.get("imageUrl").trim(),

                contactEmail:
                    formData.get("contactEmail").trim(),

                contactPhone:
                    formData.get("contactPhone").trim(),

                status:
                    formData.get("status")

            };


            try {

                const response =
                    await fetch(API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(eventData)

                    });


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Failed to create event."
                    );

                }


                alert(
                    "Event created successfully!"
                );


                eventForm.reset();


                loadEvents();


            } catch (error) {

                console.error(
                    "Error creating event:",
                    error
                );


                alert(
                    error.message ||
                    "Failed to create event."
                );

            }

        }
    );


    /* =====================================================
       DELETE EVENT
       ===================================================== */

    window.deleteEvent = async function (id) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this event?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Failed to delete event."
                );

            }


            alert(
                "Event deleted successfully!"
            );


            loadEvents();


        } catch (error) {

            console.error(
                "Error deleting event:",
                error
            );


            alert(
                error.message ||
                "Failed to delete event."
            );

        }

    };


    /* =====================================================
       EDIT EVENT
       ===================================================== */

    window.editEvent = async function (id) {

        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Failed to load event."
                );

            }


            const event =
                data.event;


            document.getElementById("title").value =
                event.title || "";


            document.getElementById("eventType").value =
                event.event_type || "";


            document.getElementById("description").value =
                event.description || "";


            document.getElementById("eventDate").value =
                formatInputDate(event.event_date);


            document.getElementById("eventTime").value =
                event.event_time
                    ? String(event.event_time).substring(0, 5)
                    : "";


            document.getElementById("location").value =
                event.location || "";


            document.getElementById("imageUrl").value =
                event.image_url || "";


            document.getElementById("contactEmail").value =
                event.contact_email || "";


            document.getElementById("contactPhone").value =
                event.contact_phone || "";


            document.getElementById("status").value =
                event.status || "Upcoming";


            /*
             * Store the ID of the event being edited.
             */

            eventForm.dataset.editingId =
                event.id;


            const submitButton =
                eventForm.querySelector(
                    'button[type="submit"]'
                );


            submitButton.innerHTML = `
                <i class="fas fa-pen"></i>
                Update Event
            `;


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


        } catch (error) {

            console.error(
                "Error loading event:",
                error
            );


            alert(
                error.message ||
                "Failed to load event."
            );

        }

    };


    /* =====================================================
       HANDLE RESET
       ===================================================== */

    eventForm.addEventListener(
        "reset",
        function () {

            delete eventForm.dataset.editingId;


            const submitButton =
                eventForm.querySelector(
                    'button[type="submit"]'
                );


            submitButton.innerHTML = `
                <i class="fas fa-save"></i>
                Save Event
            `;

        }
    );


    /* =====================================================
       UPDATE EVENT
       ===================================================== */

    async function updateEvent(id, eventData) {

        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(eventData)
                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Failed to update event."
                );

            }


            alert(
                "Event updated successfully!"
            );


            eventForm.reset();

            loadEvents();


        } catch (error) {

            console.error(
                "Error updating event:",
                error
            );


            alert(
                error.message ||
                "Failed to update event."
            );

        }

    }


    /* =====================================================
       MODIFY SAVE HANDLER FOR EDITING
       ===================================================== */

    eventForm.addEventListener(
        "submit",
        async function (event) {

            const editingId =
                eventForm.dataset.editingId;


            if (!editingId) {
                return;
            }


            event.preventDefault();


            const formData =
                new FormData(eventForm);


            const eventData = {

                title:
                    formData.get("title").trim(),

                eventType:
                    formData.get("eventType"),

                description:
                    formData.get("description").trim(),

                eventDate:
                    formData.get("eventDate"),

                eventTime:
                    formData.get("eventTime"),

                location:
                    formData.get("location").trim(),

                imageUrl:
                    formData.get("imageUrl").trim(),

                contactEmail:
                    formData.get("contactEmail").trim(),

                contactPhone:
                    formData.get("contactPhone").trim(),

                status:
                    formData.get("status")

            };


            await updateEvent(
                editingId,
                eventData
            );

        }
    );


    /* =====================================================
       REFRESH BUTTON
       ===================================================== */

    refreshButton.addEventListener(
        "click",
        loadEvents
    );


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(dateString) {

        if (!dateString) {
            return "Date not specified";
        }


        const date =
            new Date(dateString);


        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }


    /* =====================================================
       FORMAT TIME
       ===================================================== */

    function formatTime(timeString) {

        const parts =
            String(timeString).split(":");


        if (parts.length < 2) {
            return timeString;
        }


        let hour =
            parseInt(parts[0], 10);

        const minute =
            parts[1];


        const period =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12 || 12;


        return `${hour}:${minute} ${period}`;

    }


    /* =====================================================
       FORMAT DATE FOR INPUT
       ===================================================== */

    function formatInputDate(dateString) {

        if (!dateString) {
            return "";
        }


        return String(dateString).substring(0, 10);

    }


    /* =====================================================
       SECURITY — ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadEvents();

});