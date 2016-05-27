'use strict';

function KnpPaginatorAjax() {
    this.loading = false;
    this.noMorePagesLeft = false;
    this.ajaxLoadedContent = [];
}

KnpPaginatorAjax.prototype.getCurrentPage = function() {
    return parseInt(this.pageElem.find('li.active span').text());
};

KnpPaginatorAjax.prototype.getNextPage = function() {
    var data = this.ajaxLoadedContent.pop();

    if (data) {
        var nextPageElem = data.find(this.options.paginationSelector).find('li.active').next().find('a');
    } else {
        var nextPageElem = this.pageElem.find('li.active').next().find('a');
    }

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

KnpPaginatorAjax.prototype.setAjaxLoadedContent = function(html) {
    this.ajaxLoadedContent.push(html);
    this.update();
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
    var loadMoreButton = $("<div class='text-center'><button class='btn btn-default loadMore'>"+this.options.loadMoreText+"</button></div>");
    var spinner = $("<div class='text-center' style='display:none;'><button class='btn btn-default disabled'>"+this.options.loadingText+"</button></div>");
    this.loadMoreButton = loadMoreButton;
    this.spinner = spinner;
    this.pageElem.after(loadMoreButton);
    this.pageElem.after(spinner);
    loadMoreButton.click(this.clickListener.bind(this));
};

KnpPaginatorAjax.prototype.update = function() {
    if (this.getNextPage()) {
        this.loadMoreButton.show();
    } else {
        this.loadMoreButton.hide();
    }
};

KnpPaginatorAjax.prototype.clickListener = function() {
    var self = this;
    this.loading = true;

    var nextPage = this.getNextPage();

    var options = this.options;

    this.spinner.show();
    this.loadMoreButton.hide();
    $.get(nextPage.url, function(data) {
        self.spinner.hide();
        self.loadMoreButton.show();
        var data = $(data);
        //console.log();
        var elements = data.find(options.elementsSelector);

        if (data.filter(options.elementsSelector).length) {
            //there is #elements_selector div in the response, which means
            //setAjaxLoadedContent is used
            $(options.elementsSelector).append(data.filter(options.elementsSelector));
        } else {
            $(options.elementsSelector).append(elements);
        }

        //$(options.elementsSelector).html(data.find('#products').html());
        //console.log(data.html());
        //console.log(data.find('#products'));

        self.pageElem = data.find(self.options.paginationSelector);

        if (!self.getNextPage()) {
            self.loadMoreButton.hide();
            self.noMorePagesLeft = true;
        }

        self.loading = false;
    });
};
