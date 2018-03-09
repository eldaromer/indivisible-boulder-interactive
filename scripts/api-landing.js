function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var slug = getParameterByName('slug');

$(document).ready(function () {
    if (slug) {

        var bill;

        $.ajax({
            url: "https://api.propublica.org/congress/v1/bills/search.json?query="+slug,
            type: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader('X-API-Key', 'NNmNjh1IsJT4QUZLwJYiKdBf7Kc0pEL00tjVAlRB');}
        }).done(function(data){

            if(data.results[0].num_results > 0) {
                console.log(data.results[0].bills[0]);
                bill = data.results[0].bills[0];

                var main = $('.Main-content');
                document.title=bill.number + ': ' + bill.short_title + ' — IndivisibleBoulder';
                main.append(`<article class='BlogItem hentry'>
<h1 class='BlogItem-title'>` + bill.number + `: ` + bill.short_title +`</h1>
<div class='sqs-layout sqs-grid-12 columns-12'>
<div class='row sqs-row'><div class='col sqs-col-12 span-12'>
<div class='sqs-block html-block sqs-block-html'>
<div class='sqs-block-content'>

<p><strong>Summary: </strong><span style='font-size:11pt'>` + (bill.summary?bill.summary:"Automatic summary unavailable") +`</span></p>
<p><strong>Introduced on: </strong><span style='font-size:11pt'>` + bill.introduced_date +`</span></p>
<p><strong>Sponsor: </strong><span style='font-size:11pt'>` + bill.sponsor_title + ' ' + bill.sponsor_name + ', ' + bill.sponsor_state + ' ' + bill.sponsor_party +`</span></p>
<p><strong>Status: </strong><span style='font-size:11pt'>` + (bill.active?"Active":"Not Active") +`</span></p>
<p><strong>House Status: </strong><span style='font-size:11pt'>` + (bill.house_passage?"Passed on " + bill.house_passage: "Not Passed") +`</span></p>
<p><strong>Senate Status: </strong><span style='font-size:11pt'>` + (bill.senate_passage?"Passed on " + bill.senate_passage: "Not Passed") +`</span></p>
<p><strong>Latest Major Action Date: </strong><span style='font-size:11pt'>` + bill.latest_major_action_date +`</span></p>
<p><strong>Latest Major Action: </strong><span style='font-size:11pt'>` + bill.latest_major_action +`</span></p>
<p><strong>Committees Responsible: </strong><span style='font-size:11pt'>` + bill.committees +`</span></p>
<p><strong>Congress Url: </strong><span style='font-size:11pt'><a target"_blank" href="` + bill.congressdotgov_url +`">` + bill.congressdotgov_url + `</a></span></p>
<p><strong>GovTrack Url: </strong><span style='font-size:11pt'><a target"_blank" href="` + bill.govtrack_url +`">` + bill.govtrack_url + `</a></span></p>

</div></div></div></div></div></article>`);

            } else {
                var main = $('.Main-content');
                main.append("<article class='BlogItem hentry'><h1 class='BlogItem-title'>No results for bill with slug: " + slug + "</h1></article>");
            }

        });



    } else {
        var main = $('.Main-content');
        main.append("<article class='BlogItem hentry'><h1 class='BlogItem-title'>Bill Slug Not Provided</h1></article>");
    }
});