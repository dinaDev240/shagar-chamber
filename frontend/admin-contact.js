var API_BASE = window.location.origin;
/* =====================================================
   SHAGAR CHAMBER
   ADMIN CONTACT MESSAGES MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const messagesList =
        document.getElementById(
            "admin-contact-messages-list"
        );

    const refreshButton =
        document.getElementById(
            "refreshMessages"
        );


    /* =====================================================
       LOAD CONTACT MESSAGES
       ===================================================== */

    function loadMessages() {

        messagesList.innerHTML = `
            <p>
                Loading messages...
            </p>
        `;


        fetch(
            API_BASE + "/api/contact"
        )

            .then(response => response.json())

            .then(result => {

                if (!result.success) {

                    throw new Error(
                        "Failed to load messages."
                    );

                }


                const messages =
                    result.messages || [];


                /* =========================================
                   NO MESSAGES
                   ========================================= */

                if (messages.length === 0) {

                    messagesList.innerHTML = `

                        <div class="admin-empty-state">

                            <i class="fa-solid fa-envelope-open"></i>

                            <h3>
                                No Contact Messages
                            </h3>

                            <p>
                                There are currently no
                                messages from website visitors.
                            </p>

                        </div>

                    `;

                    return;
                }


                /* =========================================
                   DISPLAY MESSAGES
                   ========================================= */

                messagesList.innerHTML =
                    messages.map(message => {

                        const statusClass =
                            message.status
                                .toLowerCase();


                        return `

                            <article
                                class="admin-message-card"
                            >

                                <div
                                    class="admin-message-header"
                                >

                                    <div>

                                        <span
                                            class="admin-message-status ${statusClass}"
                                        >
                                            ${message.status}
                                        </span>

                                        <h3>
                                            ${message.subject}
                                        </h3>

                                    </div>


                                    <span
                                        class="admin-message-date"
                                    >

                                        ${new Date(
                                            message.created_at
                                        ).toLocaleString()}

                                    </span>

                                </div>


                                <div
                                    class="admin-message-contact"
                                >

                                    <p>
                                        <i
                                            class="fa-solid fa-user"
                                        ></i>

                                        <strong>
                                            ${message.full_name}
                                        </strong>
                                    </p>


                                    <p>
                                        <i
                                            class="fa-solid fa-envelope"
                                        ></i>

                                        ${message.email}
                                    </p>


                                    ${
                                        message.phone
                                            ? `
                                                <p>
                                                    <i
                                                        class="fa-solid fa-phone"
                                                    ></i>

                                                    ${message.phone}
                                                </p>
                                              `
                                            : ""
                                    }

                                </div>


                                <div
                                    class="admin-message-content"
                                >

                                    <p>
                                        ${message.message}
                                    </p>

                                </div>


                                <div
                                    class="admin-message-actions"
                                >

                                    <button
                                        type="button"
                                        class="admin-status-button"
                                        data-status-id="${message.id}"
                                        data-status="Read"
                                    >

                                        <i
                                            class="fa-solid fa-envelope-open"
                                        ></i>

                                        Mark Read

                                    </button>


                                    <button
                                        type="button"
                                        class="admin-status-button"
                                        data-status-id="${message.id}"
                                        data-status="Replied"
                                    >

                                        <i
                                            class="fa-solid fa-reply"
                                        ></i>

                                        Mark Replied

                                    </button>


                                    <button
                                        type="button"
                                        class="admin-delete-button"
                                        data-delete-message="${message.id}"
                                    >

                                        <i
                                            class="fa-solid fa-trash"
                                        ></i>

                                        Delete

                                    </button>

                                </div>

                            </article>

                        `;

                    }).join("");


                attachStatusButtons();

                attachDeleteButtons();

            })

            .catch(error => {

                console.error(
                    "Error loading contact messages:",
                    error
                );


                messagesList.innerHTML = `

                    <div class="admin-empty-state">

                        <i
                            class="fa-solid fa-triangle-exclamation"
                        ></i>

                        <h3>
                            Unable to Load Messages
                        </h3>

                        <p>
                            Please make sure the backend
                            server is running.
                        </p>

                    </div>

                `;

            });

    }


    /* =====================================================
       UPDATE MESSAGE STATUS
       ===================================================== */

    function attachStatusButtons() {

        const statusButtons =
            document.querySelectorAll(
                "[data-status-id]"
            );


        statusButtons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const messageId =
                        this.dataset.statusId;

                    const newStatus =
                        this.dataset.status;


                    fetch(
                        `${API_BASE}/api/contact/${messageId}/status`,
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                status: newStatus
                            })
                        }
                    )

                        .then(response =>
                            response.json()
                        )

                        .then(result => {

                            if (!result.success) {

                                throw new Error(
                                    result.message
                                );

                            }


                            loadMessages();

                        })

                        .catch(error => {

                            console.error(
                                "Status update error:",
                                error
                            );

                            alert(
                                "Failed to update message status."
                            );

                        });

                }
            );

        });

    }


    /* =====================================================
       DELETE MESSAGE
       ===================================================== */

    function attachDeleteButtons() {

        const deleteButtons =
            document.querySelectorAll(
                "[data-delete-message]"
            );


        deleteButtons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const messageId =
                        this.dataset.deleteMessage;


                    const confirmed =
                        confirm(
                            "Are you sure you want to delete this message?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    fetch(
                        `${API_BASE}/api/contact/${messageId}`,
                        {
                            method: "DELETE"
                        }
                    )

                        .then(response =>
                            response.json()
                        )

                        .then(result => {

                            if (!result.success) {

                                throw new Error(
                                    result.message
                                );

                            }


                            loadMessages();

                        })

                        .catch(error => {

                            console.error(
                                "Delete message error:",
                                error
                            );

                            alert(
                                "Failed to delete message."
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
            loadMessages
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadMessages();

});