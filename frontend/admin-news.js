var API_BASE = window.location.origin;
/* =====================================================
   SHAGAR CHAMBER
   ADMIN NEWS MANAGEMENT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const newsForm =
        document.getElementById("newsForm");

    const newsList =
        document.getElementById("admin-news-list");

    const refreshButton =
        document.getElementById("refreshNews");

    const editNewsPanel =
        document.getElementById("edit-news-panel");

    const editNewsForm =
        document.getElementById("editNewsForm");

    const cancelEditNews =
        document.getElementById("cancelEditNews");
    /* =====================================================
       LOAD NEWS
       ===================================================== */

    async function loadNews() {

        if (!newsList) {
            return;
        }

        newsList.innerHTML = `
            <div class="admin-loading">
                <i class="fas fa-spinner fa-spin"></i>
                Loading news...
            </div>
        `;


        try {

            const response =
                await fetch(
                    API_BASE + "/api/news"
                );


            const result =
                await response.json();


            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Unable to load news."
                );

            }


            const news =
                result.news;


            if (!news.length) {

                newsList.innerHTML = `
                    <div class="admin-empty">

                        <i class="fas fa-newspaper"></i>

                        <h3>
                            No News Articles
                        </h3>

                        <p>
                            No news articles have been
                            published yet.
                        </p>

                    </div>
                `;

                return;
            }


            newsList.innerHTML =
                news.map(function (article) {

                    const publishedDate =
                        article.published_at
                            ? new Date(
                                article.published_at
                            ).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            )
                            : "Not published";


                    return `
                        <article
                            class="admin-opportunity-card admin-news-card"
                        >

                            <div class="admin-opportunity-main">


                                <span
                                    class="admin-opportunity-category"
                                >
                                    ${article.category}
                                </span>


                                <h4>
                                    ${article.title}
                                </h4>


                                ${
                                    article.author
                                        ? `
                                            <p>
                                                <i class="fas fa-user"></i>
                                                ${article.author}
                                            </p>
                                        `
                                        : ""
                                }


                                ${
                                    article.excerpt
                                        ? `
                                            <p
                                                class="admin-opportunity-description"
                                            >
                                                ${article.excerpt}
                                            </p>
                                        `
                                        : `
                                            <p
                                                class="admin-opportunity-description"
                                            >
                                                ${article.content.substring(
                                                    0,
                                                    180
                                                )}...
                                            </p>
                                        `
                                }


                                <div
                                    class="admin-opportunity-meta"
                                >

                                    <span>

                                        <i class="fas fa-calendar"></i>

                                        ${publishedDate}

                                    </span>


                                    <span
                                        class="admin-status ${
                                            article.status === "Published"
                                                ? "open"
                                                : "closed"
                                        }"
                                    >

                                        <i
                                            class="fas fa-circle"
                                        ></i>

                                        ${article.status}

                                    </span>

                                </div>

                            </div>


                         <div class="admin-opportunity-actions">

    <button
        type="button"
        class="admin-edit-news-button"
        data-id="${article.id}"
    >
        <i class="fas fa-pen-to-square"></i>
        Edit
    </button>

    <button
        type="button"
        class="admin-delete-news-button"
        data-id="${article.id}"
    >
        <i class="fas fa-trash"></i>
        Delete
    </button>

</div>

                        </article>
                    `;

                }).join("");


            attachDeleteButtons();


        } catch (error) {

            console.error(
                "Failed to load news:",
                error
            );


            newsList.innerHTML = `
                <div class="admin-error">

                    <i
                        class="fas fa-triangle-exclamation"
                    ></i>

                    <h3>
                        Unable to Load News
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
       CREATE NEWS
       ===================================================== */

    if (newsForm) {

        newsForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const submitButton =
                    newsForm.querySelector(
                        ".admin-primary-button"
                    );


                const newsData = {

                    title:
                        document
                            .getElementById("newsTitle")
                            .value
                            .trim(),

                    category:
                        document
                            .getElementById("newsCategory")
                            .value,

                    imageUrl:
                        document
                            .getElementById("newsImage")
                            .value
                            .trim(),

                    excerpt:
                        document
                            .getElementById("newsExcerpt")
                            .value
                            .trim(),

                    content:
                        document
                            .getElementById("newsContent")
                            .value
                            .trim(),

                    author:
                        document
                            .getElementById("newsAuthor")
                            .value
                            .trim(),

                    status:
                        document
                            .getElementById("newsStatus")
                            .value

                };


                if (
                    !newsData.title ||
                    !newsData.category ||
                    !newsData.content
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
                            API_BASE + "/api/news",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        newsData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Unable to create news article."
                        );

                    }


                    alert(
                        "News article created successfully."
                    );


                    newsForm.reset();


                    await loadNews();


                } catch (error) {

                    console.error(
                        "Create news error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Unable to create news article."
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
       DELETE NEWS
       ===================================================== */

    function attachDeleteButtons() {

        const deleteButtons =
            document.querySelectorAll(
                ".admin-delete-news-button"
            );


        deleteButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                async function () {

                    const newsId =
                        button.dataset.id;


                    const confirmed =
                        confirm(
                            "Are you sure you want to permanently delete this news article?"
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
                                `${API_BASE}/api/news/${newsId}`,
                                {
                                    method: "DELETE"
                                }
                            );


                        const result =
                            await response.json();


                        if (!response.ok) {

                            throw new Error(
                                result.message ||
                                "Unable to delete news article."
                            );

                        }


                        alert(
                            "News article deleted successfully."
                        );


                        await loadNews();


                    } catch (error) {

                        console.error(
                            "Delete news error:",
                            error
                        );


                        alert(
                            error.message ||
                            "Unable to delete news article."
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
            const editButtons =
        document.querySelectorAll(".admin-edit-news-button");

    editButtons.forEach(function (button) {

        button.addEventListener("click", async function () {

            const newsId = button.dataset.id;

            try {

                const response = await fetch(
                    `${API_BASE}/api/news/${newsId}`
                );

                const result = await response.json();

                if (!response.ok || !result.success) {

                    throw new Error(
                        result.message ||
                        "Unable to load news article."
                    );

                }

                const article = result.news;

                document.getElementById("editNewsId").value =
                    article.id;

                document.getElementById("editNewsTitle").value =
                    article.title || "";

                document.getElementById("editNewsCategory").value =
                    article.category || "";

                document.getElementById("editNewsAuthor").value =
                    article.author || "";

                document.getElementById("editNewsImage").value =
                    article.image_url || "";

                document.getElementById("editNewsExcerpt").value =
                    article.excerpt || "";

                document.getElementById("editNewsContent").value =
                    article.content || "";

                document.getElementById("editNewsStatus").value =
                    article.status || "Published";

                editNewsPanel.style.display = "block";

                editNewsPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } catch (error) {

                console.error(
                    "Load news for editing error:",
                    error
                );

                alert(
                    error.message ||
                    "Unable to load news article."
                );

            }

        });

    });

    }

    if (editNewsForm) {

        editNewsForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const newsId =
                    document.getElementById("editNewsId").value;

                const saveButton =
                    editNewsForm.querySelector(
                        ".admin-primary-button"
                    );

                const newsData = {

                    title:
                        document.getElementById(
                            "editNewsTitle"
                        ).value.trim(),

                    category:
                        document.getElementById(
                            "editNewsCategory"
                        ).value,

                    imageUrl:
                        document.getElementById(
                            "editNewsImage"
                        ).value.trim(),

                    excerpt:
                        document.getElementById(
                            "editNewsExcerpt"
                        ).value.trim(),

                    content:
                        document.getElementById(
                            "editNewsContent"
                        ).value.trim(),

                    author:
                        document.getElementById(
                            "editNewsAuthor"
                        ).value.trim(),

                    status:
                        document.getElementById(
                            "editNewsStatus"
                        ).value

                };

                if (
                    !newsData.title ||
                    !newsData.category ||
                    !newsData.content
                ) {

                    alert(
                        "Please complete all required fields."
                    );

                    return;
                }

                const originalHTML =
                    saveButton.innerHTML;

                saveButton.disabled = true;

                saveButton.innerHTML = `
                    <i class="fas fa-spinner fa-spin"></i>
                    Saving...
                `;

                try {

                    const response = await fetch(
                        `${API_BASE}/api/news/${newsId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(newsData)
                        }
                    );

                    const result =
                        await response.json();

                    if (
                        !response.ok ||
                        !result.success
                    ) {

                        throw new Error(
                            result.message ||
                            "Unable to update news article."
                        );

                    }

                    alert(
                        "News article updated successfully."
                    );

                    editNewsForm.reset();

                    editNewsPanel.style.display =
                        "none";

                    await loadNews();

                } catch (error) {

                    console.error(
                        "Update news error:",
                        error
                    );

                    alert(
                        error.message ||
                        "Unable to update news article."
                    );

                } finally {

                    saveButton.disabled = false;

                    saveButton.innerHTML =
                        originalHTML;

                }

            }
        );

    }

    if (cancelEditNews) {

        cancelEditNews.addEventListener(
            "click",
            function () {

                editNewsForm.reset();

                editNewsPanel.style.display =
                    "none";

            }
        );

    }

    /* =====================================================
       REFRESH BUTTON
       ===================================================== */

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            loadNews
        );

    }



    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadNews();

});