function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var page = getParameterByName('page');

$(document).ready(function() {

    var url = page ? "https://18.218.37.172/bills/" + page : "https://18.218.37.172/bills";

    $.ajax({
        url: url,
        type: "GET"
    }).done(function(data) {
        var main = $('.Main--page');
        main.removeClass('Main--page').addClass('Main--blog-list').empty();
        var startPadding = "<section class=\"Main-content\" data-content-field=\"main-content\">\n    <section class=\"BlogList BlogList--posts-excerpt sqs-blog-list clear\" data-columns=\"2\">";
        var endPadding =  "</section> </section>";
        console.log(data);
    });


    /*main.append(`<section class="Main-content" data-content-field="main-content">
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
    `);*/
});