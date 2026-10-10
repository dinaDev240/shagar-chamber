var API_BASE = (window.location.port === "5000") ? window.location.origin : ("http://" + (window.location.hostname || "localhost") + ":5000");
/* =====================================================
   SHAGAR CHAMBER
   ADMIN MEMBERSHIP MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

const membersList =
        document.getElementById("admin-members-list");

// =====================================================
// SEARCH & FILTER CONTROLS
// =====================================================

const memberSearch =
    document.getElementById("memberSearch");

const memberStatusFilter =
    document.getElementById("memberStatusFilter");

const memberTypeFilter =
    document.getElementById("memberTypeFilter");

const memberPaymentFilter =
    document.getElementById("memberPaymentFilter");

const clearMemberFilters =
    document.getElementById("clearMemberFilters");
// =====================================================
// LOAD MEMBERSHIP APPLICATIONS
// =====================================================
 function getFileName(filePath) {

    if (!filePath) {
           return "";
        }

        return filePath
            .split(/[\\/]/)
            .pop();
    }
    async function loadMembers() {

        try {

            const response = await fetch(
    API_BASE + "/api/members",
    {
        credentials: "include"
    }
);

            const result = await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Unable to load membership applications."
                );
            }


            // No applications
            if (!result.members.length) {

                membersList.innerHTML = `
                    <div class="admin-empty-state">

                        <i class="fas fa-users"></i>

                        <h3>
                            No Membership Applications
                        </h3>

                        <p>
                            There are currently no membership
                            applications to review.
                        </p>

                    </div>
                `;

                return;
            }


            // Display applications
          membersList.innerHTML =
    result.members.map(function (member) {

        const frontFileName =
            getFileName(member.national_id_front);

        const backFileName =
            getFileName(member.national_id_back);

            const paymentReceiptFileName =
    
        getFileName(member.payment_receipt);

        return `
          <div
    class="admin-member-card"
    data-member-status="${member.status || ""}"
    data-member-type="${member.membership_type || ""}"
    data-member-payment="${member.payment_status || ""}"
>

    <div class="admin-member-card-header">

    <div>

        <span class="member-status">
            ${member.status}
        </span>

        <h3>
            ${member.full_name}
        </h3>

    </div>

    <span class="member-type">
        ${member.membership_type}
    </span>

</div>

${member.status === "Pending" ? `
    <div class="admin-member-actions">

        <button
            type="button"
            class="approve-member-button"
            data-member-id="${member.id}"
        >
            <i class="fas fa-check"></i>
            Approve
        </button>

        <button
            type="button"
            class="reject-member-button"
            data-member-id="${member.id}"
        >
            <i class="fas fa-times"></i>
            Reject
        </button>

    </div>
` : ""}

                            <div class="admin-member-info">

                                <p>
                                    <strong>Email:</strong>
                                    ${member.email}
                                </p>

                                <p>
                                    <strong>Phone:</strong>
                                    ${member.phone}
                                </p>

                                <p>
                                    <strong>Business:</strong>
                                    ${member.business_name}
                                </p>

                                <p>
                                    <strong>Sector:</strong>
                                    ${member.business_type}
                                </p>

                                <p>
    <strong>Business Type:</strong>
    ${member.business_category || "-"}
</p>

<p>
    <strong>Fee:</strong>
    ${Number(
        member.membership_fee
    ).toLocaleString()} ETB
</p>

<p>
    <strong>Payment Method:</strong>
    ${member.payment_method || "-"}
</p>

<p>
    <strong>Payment Status:</strong>
    ${member.payment_status}
</p>

${
    member.payment_status === "Pending"
        ? `
            <div class="admin-payment-actions">

                <button
                    type="button"
                    class="verify-payment-button"
                    data-member-id="${member.id}"
                >
                    <i class="fas fa-check-circle"></i>
                    Verify Payment
                </button>

                <button
                    type="button"
                    class="failed-payment-button"
                    data-member-id="${member.id}"
                >
                    <i class="fas fa-times-circle"></i>
                    Mark Failed
                </button>

            </div>
        `
        : ""
}
<div class="member-id-section">

    <h4>
        <i class="fas fa-id-card"></i>
        National ID
    </h4>

    <div class="member-id-images">

        <div class="member-id-image-box">

            <h5>Front</h5>

            <img
                src=API_BASE + "/api/members/id-image/${encodeURIComponent(frontFileName)}"
                alt="National ID Front"
            >

        </div>

        <div class="member-id-image-box">

            <h5>Back</h5>

            <img
               src=API_BASE + "/api/members/id-image/${encodeURIComponent(backFileName)}"
                alt="National ID Back"
            >

        </div>

    </div>

</div>
<div class="member-id-section">

    <h4>
        <i class="fas fa-receipt"></i>
        Payment Receipt
    </h4>

    <div class="member-id-images">

        <div class="member-id-image-box">

            <h5>Receipt</h5>

            ${
                paymentReceiptFileName
                    ? `
                        <img
                            src=API_BASE + "/api/members/payment-receipt/${encodeURIComponent(paymentReceiptFileName)}"
                            alt="Payment Receipt"
                        >
                    `
                    : `
                        <p>
                            No payment receipt uploaded.
                        </p>
                    `
            }

        </div>

    </div>

</div>
                            </div>

                          </div>

                        </div>
                    `;

                }).join("");
filterMembers();
        } catch (error) {

            console.error(
                "Membership loading error:",
                error
            );

            membersList.innerHTML = `
                <div class="admin-empty-state">

                    <i class="fas fa-triangle-exclamation"></i>

                    <h3>
                        Unable to Load Applications
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </div>
            `;
        }
    } 
     // =====================================================
    // APPROVE MEMBERSHIP APPLICATION
   // =====================================================

    async function approveMember(memberId) {

        const confirmed = confirm(
            "Are you sure you want to approve this membership application?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_BASE}/api/members/${memberId}/status`,
                {
                    method: "PATCH",
              credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: "Active"
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Unable to approve membership application."
                );

            }

            alert(
                "Membership application approved successfully!"
            );

            loadMembers();

        } catch (error) {

            console.error(
                "Membership approval error:",
                error
            );

            alert(error.message);

        }
    }
    // =====================================================
// REJECT MEMBERSHIP APPLICATION
// =====================================================

async function rejectMember(memberId) {

    const confirmed = confirm(
        "Are you sure you want to reject this membership application?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/api/members/${memberId}/status`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "Rejected"
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                "Unable to reject membership application."
            );
        }

        alert(
            "Membership application rejected successfully!"
        );

        loadMembers();

    } catch (error) {

        console.error(
            "Membership rejection error:",
            error
        );

        alert(error.message);
    }
}
// =====================================================
// VERIFY PAYMENT
// =====================================================

async function verifyPayment(memberId) {

    const confirmed = confirm(
        "Have you verified this payment receipt and received the payment?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/api/members/${memberId}/payment-status`,
            {
                method: "PATCH",
credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    paymentStatus: "Paid"
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to verify payment."
            );

        }

        alert(
            "Payment verified successfully!"
        );

        loadMembers();

    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );

        alert(error.message);

    }

}

// =====================================================
// MARK PAYMENT AS FAILED
// =====================================================

async function markPaymentFailed(memberId) {

    const confirmed = confirm(
        "Are you sure you want to mark this payment as failed?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/api/members/${memberId}/payment-status`,
            {
                method: "PATCH",
credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    paymentStatus: "Failed"
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to update payment status."
            );

        }

        alert(
            "Payment marked as failed."
        );

        loadMembers();

    } catch (error) {

        console.error(
            "Payment status error:",
            error
        );

        alert(error.message);

    }

}
// =====================================================
// SEARCH & FILTER MEMBERS
// =====================================================

function filterMembers() {

    const searchTerm =
        memberSearch
            ? memberSearch.value
                .trim()
                .toLowerCase()
            : "";

    const selectedStatus =
        memberStatusFilter
            ? memberStatusFilter.value
            : "";

    const selectedType =
        memberTypeFilter
            ? memberTypeFilter.value
            : "";

    const selectedPayment =
        memberPaymentFilter
            ? memberPaymentFilter.value
            : "";


    const memberCards =
        membersList.querySelectorAll(
            ".admin-member-card"
        );


    let visibleCount = 0;


    memberCards.forEach(function (card) {

        const cardText =
            card.textContent.toLowerCase();


        const cardStatus =
            card.dataset.memberStatus || "";

        const cardType =
            card.dataset.memberType || "";

        const cardPayment =
            card.dataset.memberPayment || "";


        const matchesSearch =
            !searchTerm ||
            cardText.includes(searchTerm);


        const matchesStatus =
            !selectedStatus ||
            cardStatus === selectedStatus;


        const matchesType =
            !selectedType ||
            cardType === selectedType;


        const matchesPayment =
            !selectedPayment ||
            cardPayment === selectedPayment;


        const shouldShow =
            matchesSearch &&
            matchesStatus &&
            matchesType &&
            matchesPayment;


        if (shouldShow) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    // No matching results

    let noResults =
        document.getElementById(
            "member-filter-no-results"
        );


    if (
        visibleCount === 0 &&
        memberCards.length > 0
    ) {

        if (!noResults) {

            noResults =
                document.createElement("div");

            noResults.id =
                "member-filter-no-results";

            noResults.className =
                "admin-empty-state";

            noResults.innerHTML = `
                <i class="fas fa-search"></i>

                <h3>
                    No Matching Members
                </h3>

                <p>
                    No membership applications
                    match your search or filters.
                </p>
            `;

            membersList.appendChild(
                noResults
            );
        }

        noResults.style.display = "";

    } else {

        if (noResults) {

            noResults.style.display =
                "none";

        }

    }

}
// =====================================================
// ADMIN MEMBERSHIP BUTTON CLICKS
// =====================================================

membersList.addEventListener("click", function (event) {

    // =====================================================
    // APPROVE MEMBER
    // =====================================================

    const approveButton =
        event.target.closest(".approve-member-button");

    if (approveButton) {

        const memberId =
            approveButton.dataset.memberId;

        approveMember(memberId);

        return;
    }


    // =====================================================
    // REJECT MEMBER
    // =====================================================

    const rejectButton =
        event.target.closest(".reject-member-button");

    if (rejectButton) {

        const memberId =
            rejectButton.dataset.memberId;

        rejectMember(memberId);

        return;
    }


    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    const verifyPaymentButton =
        event.target.closest(".verify-payment-button");

    if (verifyPaymentButton) {

        const memberId =
            verifyPaymentButton.dataset.memberId;

        verifyPayment(memberId);

        return;
    }


    // =====================================================
    // MARK PAYMENT AS FAILED
    // =====================================================

    const failedPaymentButton =
        event.target.closest(".failed-payment-button");

    if (failedPaymentButton) {

        const memberId =
            failedPaymentButton.dataset.memberId;

        markPaymentFailed(memberId);

        return;
    }

});

// =====================================================
// FILTER EVENTS
// =====================================================

if (memberSearch) {

    memberSearch.addEventListener(
        "input",
        filterMembers
    );

}


if (memberStatusFilter) {

    memberStatusFilter.addEventListener(
        "change",
        filterMembers
    );

}


if (memberTypeFilter) {

    memberTypeFilter.addEventListener(
        "change",
        filterMembers
    );

}


if (memberPaymentFilter) {

    memberPaymentFilter.addEventListener(
        "change",
        filterMembers
    );

}


// =====================================================
// CLEAR FILTERS
// =====================================================

if (clearMemberFilters) {

    clearMemberFilters.addEventListener(
        "click",
        function () {

            if (memberSearch) {
                memberSearch.value = "";
            }

            if (memberStatusFilter) {
                memberStatusFilter.value = "";
            }

            if (memberTypeFilter) {
                memberTypeFilter.value = "";
            }

            if (memberPaymentFilter) {
                memberPaymentFilter.value = "";
            }

            filterMembers();

        }
    );

}

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    loadMembers();

});