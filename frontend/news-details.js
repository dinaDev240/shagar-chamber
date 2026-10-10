var API_BASE = (window.location.port === "5000") ? window.location.origin : ("http://" + (window.location.hostname || "localhost") + ":5000");
/* =====================================================
   SHAGAR CHAMBER
   NEWS DETAILS PAGE
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const newsContainer =
        document.getElementById("news-details-container");

    if (!newsContainer) return;


    /* =====================================================
       GET NEWS ID FROM URL
       Example:
       news-details.html?id=1
       ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    const newsId =
        urlParams.get("id");


    /* =====================================================
       CHECK NEWS ID
       ===================================================== */

    if (!newsId) {

        newsContainer.innerHTML = `
            <div class="news-empty-state">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h2>
                    News Article Not Found
                </h2>

                <p>
                    The requested news article could not be found.
                </p>

                <a
                    href="index.html#news"
                    class="news-details-back"
                >
                    <i class="fa-solid fa-arrow-left"></i>
                    Back to News
                </a>

            </div>
        `;

        return;
    }


    /* =====================================================
       LOAD NEWS ARTICLE
       ===================================================== */

    fetch(
        `${API_BASE}/api/news/${newsId}`
    )

        .then(function (response) {

            if (!response.ok) {
                throw new Error("News article not found");
            }

            return response.json();

        })

        .then(function (result) {

            const article =
                result.news;


            /* =================================================
               CHECK ARTICLE
               ================================================= */

            if (!article) {
                throw new Error("News article not found");
            }


            /* =================================================
               ONLY PUBLISHED ARTICLES ARE PUBLIC
               ================================================= */

            if (article.status !== "Published") {

                newsContainer.innerHTML = `
                    <div class="news-empty-state">

                        <i class="fa-solid fa-lock"></i>

                        <h2>
                            Article Unavailable
                        </h2>

                        <p>
                            This news article is not currently available.
                        </p>

                        <a
                            href="index.html#news"
                            class="news-details-back"
                        >
                            <i class="fa-solid fa-arrow-left"></i>
                            Back to News
                        </a>

                    </div>
                `;

                return;
            }


            /* =================================================
               FORMAT DATE
               ================================================= */

            let formattedDate = "";

            if (article.published_at) {

                formattedDate =
                    new Date(
                        article.published_at
                    ).toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        }
                    );
            }


            /* =================================================
               IMAGE
               ================================================= */

            const imageHTML =
                article.image_url

                    ? `
                        <div class="news-details-image">

                            <img
                                src="${article.image_url}"
                                alt="${article.title}"
                            >

                        </div>
                      `

                    : `
                        <div class="news-details-image news-details-placeholder">

                            <i class="fa-solid fa-newspaper"></i>

                        </div>
                      `;


            /* =================================================
               DISPLAY ARTICLE
               ================================================= */

            newsContainer.innerHTML = `

                ${imageHTML}


                <article class="news-details-content">

                    <div class="news-details-category">
                        ${article.category}
                    </div>


                    <h1>
                        ${article.title}
                    </h1>


                    <div class="news-details-meta">

                        <span>
                            <i class="fa-regular fa-calendar"></i>
                            ${formattedDate}
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


                    ${
                        article.excerpt
                            ? `
                                <p class="news-details-excerpt">
                                    ${article.excerpt}
                                </p>
                              `
                            : ""
                    }


                    <div class="news-details-body">

                        ${article.content}

                    </div>


                    <div class="news-details-footer">

                        <a
                            href="index.html#news"
                            class="news-details-back"
                        >
                            <i class="fa-solid fa-arrow-left"></i>
                            Back to News
                        </a>

                    </div>

                </article>

            `;


            /* =================================================
               UPDATE PAGE TITLE
               ================================================= */

            document.title =
                `${article.title} | Shagar Chamber`;

        })

        .catch(function (error) {

            console.error(
                "News details loading error:",
                error
            );

            newsContainer.innerHTML = `

                <div class="news-empty-state">

                    <i class="fa-solid fa-circle-exclamation"></i>

                    <h2>
                        Unable to Load Article
                    </h2>

                    <p>
                        The news article could not be loaded.
                        Please try again later.
                    </p>

                    <a
                        href="index.html#news"
                        class="news-details-back"
                    >
                        <i class="fa-solid fa-arrow-left"></i>
                        Back to News
                    </a>

                </div>

            `;

        });

});