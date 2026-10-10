var API_BASE = (window.location.port === "5000") ? window.location.origin : ("http://" + (window.location.hostname || "localhost") + ":5000");
/* =====================================================
   SHAGAR CHAMBER
   JOB APPLICATION
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const applicationForm =
        document.getElementById("jobApplicationForm");

    const jobTitleInput =
        document.getElementById("jobTitle");

    const opportunityIdInput =
        document.getElementById("opportunityId");


    /* =====================================================
       GET JOB ID FROM URL
       ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    const opportunityId =
        urlParams.get("id");


    /* =====================================================
       CHECK JOB ID
       ===================================================== */

    if (!opportunityId) {

        jobTitleInput.value =
            "No job selected";

        alert(
            "No job was selected. Please return to the Jobs section and click Apply Now."
        );

        return;
    }


    opportunityIdInput.value =
        opportunityId;


    /* =====================================================
       LOAD JOB INFORMATION
       ===================================================== */

    async function loadJob() {

        try {

            const response = await fetch(
                `${API_BASE}/api/opportunities/${opportunityId}`
            );

            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load job information."
                );

            }


            const opportunity =
                data.opportunity;


            jobTitleInput.value =
                opportunity.title;


        } catch (error) {

            console.error(
                "Job loading error:",
                error
            );

            jobTitleInput.value =
                "Unable to load position";

            alert(
                "Unable to load the selected job."
            );

        }

    }


    /* =====================================================
       SUBMIT APPLICATION
       ===================================================== */

    applicationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const submitButton =
                applicationForm.querySelector(
                    'button[type="submit"]'
                );


            const formData =
                new FormData(applicationForm);


            formData.append(
                "jobTitle",
                jobTitleInput.value
            );


            submitButton.disabled = true;

            submitButton.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Submitting...
            `;


            try {

                const response =
                    await fetch(
                        API_BASE + "/api/job-applications",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Unable to submit application."
                    );

                }


                alert(
                    "Your job application has been submitted successfully."
                );


                applicationForm.reset();


                opportunityIdInput.value =
                    opportunityId;

                jobTitleInput.value =
                    data.jobTitle ||
                    jobTitleInput.value;


            } catch (error) {

                console.error(
                    "Application submission error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to submit your application."
                );

            } finally {

                submitButton.disabled = false;

                submitButton.innerHTML = `
                    <i class="fas fa-paper-plane"></i>
                    Submit Application
                `;

            }

        }
    );


    /* =====================================================
       START
       ===================================================== */

    loadJob();

});