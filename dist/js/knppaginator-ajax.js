'use strict';

function KnpPaginatorAjax() {
    this.loading = false;
    this.noMorePagesLeft = false;
}

KnpPaginatorAjax.prototype.getCurrentPage = function() {
    return parseInt(this.pageElem.find('li.active span').text());
};

KnpPaginatorAjax.prototype.getNextPage = function() {
    var nextPageElem = this.pageElem.find('li.active').next().find('a');
    var nextPageNumber = parseInt(nextPageElem.text());

    if (!nextPageElem.hasClass('disabled') && nextPageNumber) {
        return {
            'url': nextPageElem.attr('href'),
            'number': parseInt(nextPageNumber),
        };
    } else {
        //there is no next page
        return false;
    }
};

KnpPaginatorAjax.prototype.init = function(options) {
    this.options = options;

    //options = {
    //    'loadMoreText': 'Load More',
    //    'elementsSelector': '#products',
    //    'paginationSelector': 'ul.pagination',
    //};

    this.pageElem = $(options.paginationSelector);
    this.pageElem.hide();

    this.injectLoadMoreButton();
};

KnpPaginatorAjax.prototype.injectLoadMoreButton = function() {
    var loadMoreButton = $("<div class='clearfix'></div><div class='text-center'><button class='btn btn-default loadMore'>"+this.options.loadMoreText+"</button></div>");
    this.loadMoreButton = loadMoreButton;
    this.pageElem.after(loadMoreButton);
    loadMoreButton.click(this.clickListener.bind(this));
};

KnpPaginatorAjax.prototype.clickListener = function() {
    var self = this;
    this.loading = true;

    var nextPage = this.getNextPage();

    var options = this.options;

    $.get(nextPage.url, function(data) {
        var data = $(data);
        var elements = data.find(options.elementsSelector);
        $(options.elementsSelector).append(elements);

        self.pageElem = data.find(self.options.paginationSelector);

        if (!self.getNextPage()) {
            self.loadMoreButton.hide();
            self.noMorePagesLeft = true;
        }

        self.loading = false;
    });
};
