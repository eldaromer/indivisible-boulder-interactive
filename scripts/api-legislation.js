$(document).ready(function() {

    $.ajax({
        url: ""
    })

    var main = $('.Main--page');
    main.removeClass('Main--page').addClass('Main--blog-list').empty();
    main.append(`<section class="Main-content" data-content-field="main-content">
    <section class="BlogList BlogList--posts-excerpt sqs-blog-list clear" data-columns="2">
        <article class="BlogList-item hentry post-type-text article-index-1">
            <a href="#" class="BlogList-item-title" data-content-field="title">Test Title</a>
            <div class="Blog-meta BlogList-item-meta">
                <a href="#" class="Blog-meta-item Blog-meta-item--author">Indivisible Boulder</a>
                <time class="Blog-meta-item Blog-meta-item--date" date="2018-03-18">March 18, 2018</time>
            </div>
        </article>
    </section>
</section>
    `);
});