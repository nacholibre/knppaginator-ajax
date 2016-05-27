# knppaginator-ajax
Add ajax load more style button to the symfony2 knp paginator plugin

You should include the javascript file after jquery. This script only works with https://github.com/KnpLabs/KnpPaginatorBundle with this options.

```
knp_paginator:
    ..
    default_options:
        ..
    template:
        pagination: KnpPaginatorBundle:Pagination:twitter_bootstrap_v3_pagination.html.twig
        ..
```
        
After `{{ knp_pagination_render(products) }}` you shoul call

```
$(function() {
    var knp = new KnpPaginatorAjax();

    knp.init({
        'loadMoreText': 'Load More', //load more text
        'loadingText': 'Loading..', //loading text
        'elementsSelector': '#elements', //this is where the script will append and search results
        'paginationSelector': 'ul.pagination', //pagination selector
    });
});
```

`knp.setAjaxLoadedContent(html);` is used when you need to reload pagination
because you've added content manually with javascript.
