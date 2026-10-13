var API_BASE = window.location.origin;
/* =========================================================
   SHAGAR CHAMBER
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const siteHeader = document.getElementById("site-header");

    function handleHeaderScroll() {
        if (!siteHeader) return;

        if (window.scrollY > 50) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleHeaderScroll);
    handleHeaderScroll();


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const mobileMenuButton =
        document.getElementById("mobile-menu-button");


    const navMenu =
        document.getElementById("nav-menu");

    if (mobileMenuButton && navMenu) {

        mobileMenuButton.addEventListener("click", function () {

            const isOpen =
                navMenu.classList.toggle("active");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            const bars =
                mobileMenuButton.querySelectorAll("span");

            if (isOpen) {

                bars[0].style.transform =
                    "rotate(45deg) translate(5px, 5px)";

                bars[1].style.opacity = "0";

                bars[2].style.transform =
                    "rotate(-45deg) translate(5px, -5px)";

            } else {

                bars[0].style.transform = "";
                bars[1].style.opacity = "";
                bars[2].style.transform = "";
            }
        });


        /* Close mobile menu after clicking a link */

        const navLinks =
            navMenu.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navMenu.classList.remove("active");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                const bars =
                    mobileMenuButton.querySelectorAll("span");

                bars[0].style.transform = "";
                bars[1].style.opacity = "";
                bars[2].style.transform = "";
            });
        });


        /* Close menu when clicking outside */

        document.addEventListener("click", function (event) {

            if (
                !navMenu.contains(event.target) &&
                !mobileMenuButton.contains(event.target)
            ) {

                navMenu.classList.remove("active");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                const bars =
                    mobileMenuButton.querySelectorAll("span");

                bars[0].style.transform = "";
                bars[1].style.opacity = "";
                bars[2].style.transform = "";
            }
        });
    }


    /* =====================================================
       ACTIVE NAVIGATION LINK
       ===================================================== */

    const sections = document.querySelectorAll(
        "#home, #about, #sectors, #services, #membership, #opportunities, #jobs, #events, #expo, #news, #partnerships, #contact"
    );

    const navigationLinks =
        document.querySelectorAll(
            "#nav-menu a[href^='#']"
        );

    if (
        sections.length &&
        navigationLinks.length &&
        "IntersectionObserver" in window
    ) {

        const sectionObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            const currentSection =
                                entry.target.getAttribute("id");

                            navigationLinks.forEach(
                                function (link) {

                                    link.classList.remove(
                                        "active"
                                    );

                                    const target =
                                        link.getAttribute(
                                            "href"
                                        );

                                    if (
                                        target ===
                                        "#" + currentSection
                                    ) {
                                        link.classList.add(
                                            "active"
                                        );
                                    }
                                }
                            );
                        }
                    });
                },
                {
                    rootMargin:
                        "-30% 0px -60% 0px"
                }
            );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backToTop =
        document.getElementById("backToTop");

    if (backToTop) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 500) {
                    backToTop.classList.add("show");
                } else {
                    backToTop.classList.remove("show");
                }
            }
        );

        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    }


    /* =====================================================
       FOOTER CURRENT YEAR
       ===================================================== */

    const currentYear =
        document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


   /* =====================================================
   MEMBERSHIP APPLICATION
   ===================================================== */

/* =====================================================
   MEMBERSHIP APPLICATION
   ===================================================== */

const membershipForm =
    document.getElementById("membershipForm");
   

if (membershipForm) {
const businessCategorySelect =
    document.getElementById("businessCategory");

const membershipFeeDisplay =
    document.getElementById("membershipFeeDisplay");

const membershipFeeAmount =
    document.getElementById("membershipFeeAmount");

if (businessCategorySelect) {

    businessCategorySelect.addEventListener(
        "change",
        function () {

            if (this.value === "trader") {

                membershipFeeDisplay.style.display = "block";

                membershipFeeAmount.textContent =
                    "1,000 ETB";

            } else if (this.value === "plc") {

                membershipFeeDisplay.style.display = "block";

                membershipFeeAmount.textContent =
                    "5,000 ETB";

            } else {

                membershipFeeDisplay.style.display = "none";

                membershipFeeAmount.textContent =
                    "0 ETB";
            }

        }
    );

}
// =====================================================
// PAYMENT METHOD → PAYMENT ACCOUNT
// =====================================================

const paymentMethodSelect =
    document.getElementById("paymentMethod");

const paymentAccountDisplay =
    document.getElementById("paymentAccountDisplay");

const paymentAccountNumber =
    document.getElementById("paymentAccountNumber");

if (paymentMethodSelect) {

    paymentMethodSelect.addEventListener(
        "change",
        function () {

            const accounts = {
                CBE: "1000546634551",
                CBO: "1023500127523",
                Sinke: "10553476312216",
                Awash: "013031159104100"
            };

            if (accounts[this.value]) {

                paymentAccountDisplay.style.display =
                    "block";

                paymentAccountNumber.textContent =
                    accounts[this.value];

            } else {

                paymentAccountDisplay.style.display =
                    "none";

                paymentAccountNumber.textContent =
                    "-";
            }

        }
    );

}
    membershipForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            // Get form values
            const fullName =
                document.getElementById("fullName").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const nationalIdFront =
                document.getElementById("nationalIdFront");

            const nationalIdBack =
                document.getElementById("nationalIdBack");

            const businessName =
                document.getElementById("businessName").value.trim();

            const tin =
                document.getElementById("tin").value.trim();

            const businessSector =
                document.getElementById("businessSector").value;

            const businessAddress =
                document.getElementById("businessAddress").value.trim();

            const membershipType =
                document.getElementById("membershipType").value;

           const businessCategory =
    document.getElementById("businessCategory").value;

            const businessDescription =
                document.getElementById("businessDescription").value.trim();
const paymentMethod =
    document.getElementById("paymentMethod").value;

const paymentReceipt =
    document.getElementById("paymentReceipt");

            // Check National ID files
            const frontFile =
                nationalIdFront.files[0];

            const backFile =
                nationalIdBack.files[0];


            // Required field validation
            if (
                !fullName ||
                !phone ||
                !email ||
                !frontFile ||
                !backFile ||
                !businessName ||
                !businessSector ||
                !businessAddress ||
                !membershipType ||
                !businessCategory ||
                !paymentMethod ||
                !paymentReceipt.files[0] ||
                !businessDescription 
            ) {

                alert(
                    "Please complete all required fields, including both sides of your National ID."
                );

                return;
                
            }


            // Email validation
            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            // Find submit button
            const submitButton =
                membershipForm.querySelector(
                    ".membership-form-actions .membership-button"
                );

            if (!submitButton) {
                return;
            }


            // Save original button
            const originalHTML =
                submitButton.innerHTML;


            // Disable button while submitting
            submitButton.disabled = true;

            submitButton.innerHTML = `
                <span>Submitting...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;


            // Create FormData
            const formData =
                new FormData();

            formData.append(
                "fullName",
                fullName
            );

            formData.append(
                "email",
                email
            );

            formData.append(
                "phone",
                phone
            );

            formData.append(
                "nationalIdFront",
                frontFile
            );

            formData.append(
                "nationalIdBack",
                backFile
            );

            formData.append(
                "tin",
                tin
            );

            formData.append(
                "businessName",
                businessName
            );

            formData.append(
                "businessSector",
                businessSector
            );

            formData.append(
                "businessAddress",
                businessAddress
            );

            formData.append(
                "businessDescription",
                businessDescription
            );

            formData.append(
                "membershipType",
                membershipType
            );

            formData.append(
    "businessCategory",
    businessCategory
);

formData.append(
    "paymentMethod",
    paymentMethod
);

formData.append(
    "paymentReceipt",
    paymentReceipt.files[0]
);


            try {

                // Send membership application
                // to Node.js backend
                const response = await fetch(
                    API_BASE + "/api/members/register",
                    {
                        method: "POST",
                        body: formData
                    }
                );


                const result =
                    await response.json();


                // Backend returned an error
                if (!response.ok) {

                    alert(
                        result.message ||
                        "Something went wrong while submitting your application."
                    );

                    return;
                }


                // Successful registration
                alert(
                    "Thank you, " +
                    fullName +
                    "!\n\n" +
                    result.message +
                    "\n\n" +
                    "Membership Type: " +
                    result.membership_type +
                    "\n" +
                    "Membership Fee: " +
                    result.membership_fee.toLocaleString() +
                    "\n" +
                    "Application Status: Pending"
                );


                // Clear form
                membershipForm.reset();


            } catch (error) {

                console.error(
                    "Membership submission error:",
                    error
                );

              alert(
    "Membership submission failed:\n\n" +
    (error.message || "Unknown error. Check the browser console.")
);

            } finally {

                // Restore button
                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalHTML;
            }
        }
    );
}

    /* =====================================================
       CONTACT FORM
       ===================================================== */

    /* =====================================================
   CONTACT FORM
   ===================================================== */

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =================================================
               GET FORM VALUES
               ================================================= */

            const fullName =
                document.getElementById(
                    "contactName"
                ).value.trim();

            const email =
                document.getElementById(
                    "contactEmail"
                ).value.trim();

            const phone =
                document.getElementById(
                    "contactPhone"
                ).value.trim();

            const subject =
                document.getElementById(
                    "contactSubject"
                ).value;

            const message =
                document.getElementById(
                    "contactMessage"
                ).value.trim();


            /* =================================================
               VALIDATION
               ================================================= */

            if (
                !fullName ||
                !email ||
                !subject ||
                !message
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;
            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            /* =================================================
               SUBMIT BUTTON
               ================================================= */

            const submitButton =
                contactForm.querySelector(
                    ".contact-submit-btn"
                );


            if (!submitButton) {
                return;
            }


            const originalButtonHTML =
                submitButton.innerHTML;


            submitButton.disabled = true;

            submitButton.innerHTML = `
                <span>Sending...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;


            /* =================================================
               SEND MESSAGE TO BACKEND
               ================================================= */

            try {

                const response =
                    await fetch(
                        API_BASE + "/api/contact",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                fullName: fullName,
                                email: email,
                                phone: phone,
                                subject: subject,
                                message: message
                            })
                        }
                    );


                const result =
                    await response.json();


                /* =============================================
                   HANDLE API ERROR
                   ============================================= */

                if (!response.ok || !result.success) {

                    throw new Error(
                        result.message ||
                        "Failed to send message."
                    );

                }


                /* =============================================
                   SUCCESS
                   ============================================= */

                alert(
                    "Thank you, " +
                    fullName +
                    "!\n\n" +
                    "Your message has been sent successfully.\n" +
                    "Our team will contact you as soon as possible."
                );


                contactForm.reset();


            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                alert(
                    "Sorry, your message could not be sent.\n\n" +
                    "Please try again later."
                );


            } finally {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    originalButtonHTML;

            }

        }
    );

}


    /* =====================================================
       SMOOTH ANCHOR NAVIGATION
       ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                const headerHeight =
                    siteHeader
                        ? siteHeader.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight +
                    2;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        );
    });


    /* =====================================================
       SIMPLE CARD REVEAL ANIMATION
       ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".about-card, " +
            ".value-card, " +
            ".sector-card, " +
            ".service-card, " +
            ".job-card, " +
            ".event-card, " +
            ".news-card, " +
            ".partnership-card, " +
            ".expo-card"
        );


    if (
        animatedElements.length &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );
                        }
                    });
                },
                {
                    threshold: 0.08
                }
            );


        animatedElements.forEach(
            function (element) {

                element.style.opacity = "0";

                element.style.transform =
                    "translateY(20px)";

                element.style.transition =
                    "opacity 0.6s ease, transform 0.6s ease";

                revealObserver.observe(
                    element
                );
            }
        );
    }
/* =====================================================
   LOAD JOBS & OPPORTUNITIES FROM BACKEND
   ===================================================== */

const opportunitiesContainer =
    document.getElementById("opportunities-container");

async function loadOpportunities() {

    if (!opportunitiesContainer) {
        return;
    }

    try {

        const response = await fetch(
            API_BASE + "/api/opportunities"
        );

        const responseText = await response.text();

let result;

try {
    result = JSON.parse(responseText);
} catch {
    throw new Error(
        `Server returned an unexpected response (HTTP ${response.status}).`
    );
}

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                "Unable to load opportunities."
            );
        }

        const opportunities = result.opportunities;
const openOpportunities =
    opportunities.filter(function (opportunity) {
        return opportunity.status === "Open";
    });
        // No opportunities available
        if (!openOpportunities.length) {

            opportunitiesContainer.innerHTML = `
                <div class="no-opportunities">
                    <i class="fas fa-briefcase"></i>
                    <h3>No Opportunities Available</h3>
                    <p>
                        There are currently no open opportunities.
                        Please check back later.
                    </p>
                </div>
            `;

            return;
        }

        // Create opportunity cards
        opportunitiesContainer.innerHTML =
           openOpportunities.map(function (opportunity) {

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
                        : "No deadline specified";

                const categoryIcons = {
                    "Job": "fa-briefcase",
                    "Business Opportunity": "fa-building",
                    "Training": "fa-graduation-cap",
                    "Tender": "fa-file-contract",
                    "Other": "fa-circle-info"
                };

                const icon =
                    categoryIcons[opportunity.category] ||
                    "fa-briefcase";

                return `
                    <article class="job-card">

                        <div class="job-card-icon">
                            <i class="fas ${icon}"></i>
                        </div>

                        <div class="job-card-content">

                            <span class="job-category">
                                ${opportunity.category}
                            </span>

                            <h3>
                                ${opportunity.title}
                            </h3>

                            ${
                                opportunity.organization
                                    ? `
                                        <p class="job-organization">
                                            <i class="fas fa-building"></i>
                                            ${opportunity.organization}
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                opportunity.location
                                    ? `
                                        <p class="job-location">
                                            <i class="fas fa-location-dot"></i>
                                            ${opportunity.location}
                                        </p>
                                    `
                                    : ""
                            }

                            <p class="job-description">
                                ${opportunity.description}
                            </p>

                            ${
                                opportunity.requirements
                                    ? `
                                        <div class="job-requirements">
                                            <strong>
                                                <i class="fas fa-list-check"></i>
                                                Requirements
                                            </strong>

                                            <p>
                                                ${opportunity.requirements}
                                            </p>
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="job-meta">

                                <span>
                                    <i class="fas fa-calendar"></i>
                                    Deadline:
                                    ${deadline}
                                </span>

                                <span class="job-status">
                                    <i class="fas fa-circle"></i>
                                    ${opportunity.status}
                                </span>

                            </div>

                            ${
                                opportunity.contact_email ||
                                opportunity.contact_phone
                                    ? `
                                        <div class="job-contact">

                                            ${
                                                opportunity.contact_email
                                                    ? `
                                                        <a href="mailto:${opportunity.contact_email}">
                                                            <i class="fas fa-envelope"></i>
                                                            Contact
                                                        </a>
                                                    `
                                                    : ""
                                            }

                                            ${
                                                opportunity.contact_phone
                                                    ? `
                                                        <a href="tel:${opportunity.contact_phone}">
                                                            <i class="fas fa-phone"></i>
                                                            Call
                                                        </a>
                                                    `
                                                    : ""
                                            }

                                        </div>
                                    `
                                    : ""
                                    
                            }
                            ${
                                opportunity.category === "Job"
                                    ? `
                                        <a
                                            href="job-application.html?id=${opportunity.id}"
                                            class="job-apply-button"
                                        >
                                            <i class="fas fa-paper-plane"></i>
                                            Apply Now
                                        </a>
                                    `
                                    : ""
                            }
                        </div>

                    </article>
                `;

            }).join("");

    } catch (error) {

        console.error(
            "Failed to load opportunities:",
            error
        );

        opportunitiesContainer.innerHTML = `
            <div class="no-opportunities">
                <i class="fas fa-triangle-exclamation"></i>
                <h3>Unable to Load Opportunities</h3>
                <p>
                    Please try again later.
                </p>
            </div>
        `;
    }
}

loadOpportunities();
});
/* =====================================================
   SHAGAR CHAMBER
   PUBLIC NEWS LOADER
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const newsContainer =
        document.getElementById("news-container");

    if (!newsContainer) return;

    fetch(API_BASE + "/api/news")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to load news");
            }

            return response.json();
        })
        .then(function (result) {

            const news =
                result.news || [];

            /* Show only published news */
            const publishedNews =
                news.filter(function (article) {
                    return article.status === "Published";
                });

            /* No published news */
            if (!publishedNews.length) {

                newsContainer.innerHTML = `
                    <div class="news-empty-state">
                        <i class="fa-solid fa-newspaper"></i>
                        <p>No news articles available at the moment.</p>
                    </div>
                `;

                return;
            }

            /* Display news */
            newsContainer.innerHTML =
                publishedNews.map(function (article) {

                    const date =
                        article.published_at
                            ? new Date(article.published_at)
                                .toLocaleDateString()
                            : "";

                    const image =
                        article.image_url
                            ? `
                                <div class="news-card-image">
                                    <img
                                        src="${article.image_url}"
                                        alt="${article.title}"
                                    >
                                </div>
                              `
                            : `
                                <div class="news-card-image news-card-placeholder">
                                    <i class="fa-solid fa-newspaper"></i>
                                </div>
                              `;

                    return `
                        <article class="news-card">

                            ${image}

                            <div class="news-card-content">

                                <span class="news-card-category">
                                    ${article.category}
                                </span>

                                <h3>
                                    ${article.title}
                                </h3>

                                ${
                                    article.excerpt
                                        ? `<p>${article.excerpt}</p>`
                                        : `<p>${article.content.substring(0, 150)}...</p>`
                                }

                                <div class="news-card-meta">

                                    <span>
                                        <i class="fa-regular fa-calendar"></i>
                                        ${date}
                                    </span>

                                    ${
                                        article.author
                                            ? `
                                                <span>
                                                    <i class="fa-regular fa-user"></i>
                                                    ${article.author}
                                                </span>
                                              `
                                            : ""
                                    }

                                </div>

                                <button
                                    class="news-read-more"
                                    type="button"
                                    data-news-id="${article.id}"
                                >
                                    Read More
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>

                            </div>

                        </article>
                    `;

                }).join("");

        })
        .catch(function (error) {

            console.error(
                "News loading error:",
                error
            );

            newsContainer.innerHTML = `
                <div class="news-empty-state">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <p>Unable to load news at this time.</p>
                </div>
            `;

        });

});
/* =====================================================
   NEWS READ MORE BUTTON
   ===================================================== */

document.addEventListener("click", function (event) {

    const readMoreButton =
        event.target.closest(".news-read-more");

    if (!readMoreButton) return;

    const newsId =
        readMoreButton.getAttribute("data-news-id");

    if (!newsId) return;

    window.location.href =
        `news-details.html?id=${newsId}`;

});
/* =====================================================
   SHAGAR CHAMBER
   PUBLIC EXPO LOADER
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const expoContainer =
        document.getElementById("expo-container");

    if (!expoContainer) return;


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


            /* Show only active expos */

            const activeExpos =
                expos.filter(function (expo) {

                    return (
                        expo.status === "Upcoming" ||
                        expo.status === "Ongoing"
                    );

                });


            /* No expos */

            if (!activeExpos.length) {

                expoContainer.innerHTML = `
                    <div class="expo-empty-state">

                        <i class="fa-solid fa-calendar-xmark"></i>

                        <p>
                            No upcoming expos are available
                            at the moment.
                        </p>

                    </div>
                `;

                return;

            }


            /* Display expos */

            expoContainer.innerHTML =
                activeExpos.map(function (expo) {

                    const isInternational =
                        expo.type === "International Expo";


                    const icon =
                        isInternational
                            ? "fa-globe"
                            : "fa-flag";


                    const defaultImage =
    isInternational
        ? "assets/images/international-expo.jpg"
        : "assets/images/national-expo.jpg";



        const image =
    expo.image_url
        ? `
            <img
                src="${expo.image_url}"
                alt="${expo.title}"
            >
          `
        : `
            <img
                src="${defaultImage}"
                alt="${expo.title}"
            >
          `;


                    const startDate =
                        expo.start_date
                            ? new Date(
                                expo.start_date
                            ).toLocaleDateString()
                            : "";


                    const endDate =
                        expo.end_date
                            ? new Date(
                                expo.end_date
                            ).toLocaleDateString()
                            : "";


                    const dateText =
                        startDate && endDate
                            ? `${startDate} - ${endDate}`
                            : startDate;


                    return `
                        <article class="expo-card">

                            <div class="expo-image">

                                ${image}

                                <div class="expo-image-overlay"></div>

                                <span class="expo-type">

                                    <i
                                        class="fa-solid ${icon}"
                                    ></i>

                                    ${expo.type}

                                </span>

                            </div>


                            <div class="expo-content">

                                <h3>
                                    ${expo.title}
                                </h3>


                                <span class="expo-subtitle">
                                    ${
                                        isInternational
                                            ? "GLOBAL CONNECTIONS, PARTNERSHIPS & OPPORTUNITIES"
                                            : "SHOWCASING LOCAL BUSINESS, PRODUCTS & OPPORTUNITIES"
                                    }
                                </span>


                                <p>
                                    ${expo.description}
                                </p>


                                <div class="expo-features">

                                    ${
                                        expo.location
                                            ? `
                                                <div class="expo-feature">

                                                    <i class="fa-solid fa-location-dot"></i>

                                                    <div>

                                                        <strong>
                                                            Location
                                                        </strong>

                                                        <small>
                                                            ${expo.location}
                                                        </small>

                                                    </div>

                                                </div>
                                            `
                                            : ""
                                    }


                                    ${
                                        dateText
                                            ? `
                                                <div class="expo-feature">

                                                    <i class="fa-regular fa-calendar"></i>

                                                    <div>

                                                        <strong>
                                                            Expo Dates
                                                        </strong>

                                                        <small>
                                                            ${dateText}
                                                        </small>

                                                    </div>

                                                </div>
                                            `
                                            : ""
                                    }


                                    ${
                                        expo.contact_email
                                            ? `
                                                <div class="expo-feature">

                                                    <i class="fa-regular fa-envelope"></i>

                                                    <div>

                                                        <strong>
                                                            Contact
                                                        </strong>

                                                        <small>
                                                            ${expo.contact_email}
                                                        </small>

                                                    </div>

                                                </div>
                                            `
                                            : ""
                                    }


                                    <div class="expo-feature">

                                        <i class="fa-solid fa-chart-line"></i>

                                        <div>

                                            <strong>
                                                Business Opportunities
                                            </strong>

                                            <small>
                                                Discover new opportunities
                                            </small>

                                        </div>

                                    </div>

                                </div>


                                <a
                                    href="#contact"
                                    class="expo-button"
                                >
                                    Contact Chamber

                                    <span>
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </span>

                                </a>

                            </div>

                        </article>
                    `;

                }).join("");

        })


        .catch(function (error) {

            console.error(
                "Expo loading error:",
                error
            );


            expoContainer.innerHTML = `
                <div class="expo-empty-state">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <p>
                        Unable to load Expo information
                        at this time.
                    </p>

                </div>
            `;

        });

});
/* =====================================================
   SHAGAR CHAMBER
   PUBLIC PARTNERSHIPS LOADER
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const partnershipsContainer =
        document.getElementById("partnerships-container");

    if (!partnershipsContainer) {
        return;
    }


    /* =====================================================
       LOAD ACTIVE PARTNERSHIPS
       ===================================================== */

    fetch(API_BASE + "/api/partnerships")

        .then(response => response.json())

        .then(result => {

            if (!result.success) {
                throw new Error("Failed to load partnerships.");
            }


            const partnerships =
                result.partnerships || [];


            /* =================================================
               SHOW ONLY ACTIVE PARTNERSHIPS
               ================================================= */

            const activePartnerships =
                partnerships.filter(
                    partnership =>
                        partnership.status === "Active"
                );


            /* =================================================
               NO ACTIVE PARTNERSHIPS
               ================================================= */

            if (activePartnerships.length === 0) {

                partnershipsContainer.innerHTML = `

                    <div class="partnership-empty-state">

                        <div class="partnership-empty-icon">

                            <i class="fa-solid fa-handshake"></i>

                        </div>

                        <h3>
                            Partnerships Coming Soon
                        </h3>

                        <p>
                            Shagar Chamber is building strong
                            partnerships with businesses,
                            organizations and institutions.
                        </p>

                    </div>

                `;

                return;
            }


            /* =================================================
               CREATE PARTNERSHIP CARDS
               ================================================= */

            partnershipsContainer.innerHTML =
                activePartnerships.map(partnership => {

                    let icon =
                        "fa-handshake";


                    const type =
                        (partnership.partner_type || "")
                            .toLowerCase();


                    if (type.includes("bank")) {

                        icon = "fa-building-columns";

                    } else if (type.includes("government")) {

                        icon = "fa-landmark";

                    } else if (type.includes("company")) {

                        icon = "fa-building";

                    } else if (type.includes("ngo")) {

                        icon = "fa-people-group";

                    } else if (type.includes("international")) {

                        icon = "fa-globe";

                    } else if (type.includes("association")) {

                        icon = "fa-users";

                    }


                    const websiteButton =
                        partnership.website_url
                            ? `
                                <a
                                    href="${partnership.website_url}"
                                    class="partnership-button"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Partner
                                    <i class="fa-solid fa-arrow-right"></i>
                                </a>
                              `
                            : `
                                <a
                                    href="#contact"
                                    class="partnership-button"
                                >
                                    Connect With Us
                                    <i class="fa-solid fa-arrow-right"></i>
                                </a>
                              `;


                    return `

                        <article class="partnership-card">

                            <div class="partnership-icon">

                                <i class="fa-solid ${icon}"></i>

                            </div>


                            <span class="partnership-category">

                                ${partnership.partner_type}

                            </span>


                            <h3>

                                ${partnership.partner_name}

                            </h3>


                            <p>

                                ${
                                    partnership.description ||
                                    "Working with Shagar Chamber to support business growth and economic opportunities."
                                }

                            </p>


                            ${websiteButton}

                        </article>

                    `;

                }).join("");

        })


        /* =====================================================
           ERROR HANDLING
           ===================================================== */

        .catch(error => {

            console.error(
                "Error loading partnerships:",
                error
            );

            partnershipsContainer.innerHTML = `

                <div class="partnership-empty-state">

                    <div class="partnership-empty-icon">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                    </div>

                    <h3>
                        Unable to Load Partnerships
                    </h3>

                    <p>
                        Please try again later.
                    </p>

                </div>

            `;

        });

});
/* =====================================================
   SHAGAR CHAMBER
   PUBLIC EVENTS LOADER
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const eventsContainer =
        document.getElementById("events-container");

    if (!eventsContainer) {
        return;
    }


    /* =====================================================
       LOAD EVENTS FROM API
       ===================================================== */

    fetch(API_BASE + "/api/events")

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Failed to load events");
            }

            return response.json();

        })

        .then(function (result) {

            const events =
                result.events || [];


            /* =================================================
               SHOW ONLY UPCOMING EVENTS
               ================================================= */

            const upcomingEvents =
                events.filter(function (event) {

                    return event.status === "Upcoming";

                });


            /* =================================================
               NO UPCOMING EVENTS
               ================================================= */

            if (upcomingEvents.length === 0) {

                eventsContainer.innerHTML = `

                    <div class="events-empty-state">

                        <i class="fa-solid fa-calendar-xmark"></i>

                        <p>
                            No upcoming events are available
                            at the moment.
                        </p>

                    </div>

                `;

                return;
            }


            /* =================================================
               DISPLAY EVENTS
               ================================================= */

            eventsContainer.innerHTML =
                upcomingEvents.map(function (event) {


                    /* EVENT IMAGE */

                    const image =
                        event.image_url
                            ? `
                                <img
                                    src="${event.image_url}"
                                    alt="${event.title}"
                                    class="events-live-image"
                                >
                              `
                            : `
                                <div class="events-live-image-placeholder">

                                    <i class="fa-solid fa-calendar-days"></i>

                                </div>
                              `;


                    /* EVENT DATE */

                    const eventDate =
                        event.event_date
                            ? new Date(
                                event.event_date
                              ).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                              )
                            : "";


                    /* EVENT TIME */

                    const eventTime =
                        event.event_time
                            ? event.event_time.substring(0, 5)
                            : "";


                    return `

                        <article class="events-live-card">


                            ${image}


                            <div class="events-live-content">


                                <span class="events-live-category">

                                    ${event.event_type || "EVENT"}

                                </span>


                                <h3>

                                    ${event.title}

                                </h3>


                                <p class="events-live-description">

                                    ${
                                        event.description ||
                                        "Join Shagar Chamber for this important business event."
                                    }

                                </p>


                                <div class="events-live-meta">


                                    ${
                                        eventDate
                                            ? `
                                                <span>

                                                    <i class="fa-regular fa-calendar"></i>

                                                    ${eventDate}

                                                </span>
                                              `
                                            : ""
                                    }


                                    ${
                                        eventTime
                                            ? `
                                                <span>

                                                    <i class="fa-regular fa-clock"></i>

                                                    ${eventTime}

                                                </span>
                                              `
                                            : ""
                                    }


                                    ${
                                        event.location
                                            ? `
                                                <span>

                                                    <i class="fa-solid fa-location-dot"></i>

                                                    ${event.location}

                                                </span>
                                              `
                                            : ""
                                    }


                                    ${
                                        event.contact_email
                                            ? `
                                                <span>

                                                    <i class="fa-regular fa-envelope"></i>

                                                    ${event.contact_email}

                                                </span>
                                              `
                                            : ""
                                    }


                                </div>


                            </div>


                        </article>

                    `;

                }).join("");

        })


        /* =====================================================
           ERROR HANDLING
           ===================================================== */

        .catch(function (error) {

            console.error(
                "Events loading error:",
                error
            );


            eventsContainer.innerHTML = `

                <div class="events-empty-state">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <p>
                        Unable to load events at this time.
                    </p>

                </div>

            `;

        });

});