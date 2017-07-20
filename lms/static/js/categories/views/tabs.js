(function(define) {
    define(['jquery', 'backbone', 'gettext'], function($, Backbone, gettext) {
        'use strict';

        return Backbone.View.extend({

            el: '#category-tabs',
            events: {
                'click li.category-tab': 'tabClick'
            },

            initialize: function() {
                this.$tabs = this.$el.find('.category-tab');
                // this.$searchButton = this.$el.find('button');
                // this.$message = this.$el.find('#discovery-message');
                // this.$loadingIndicator = this.$el.find('#loading-indicator');
            },

            tabClick: function(event){
                event.preventDefault();
                var targetTab = $(event.currentTarget);
                if(!targetTab.hasClass('active')) {
                    this.$tabs.removeClass('active');
                    targetTab.addClass('active');
                    var categoryText = targetTab.find('a').text();
                    this.trigger('tab_change',categoryText);
                }
            },

            getCategoryTabText: function(index) {
                return this.$tabs.eq(index).find('a').text();
            }

            // submitForm: function(event) {
            //     event.preventDefault();
            //     this.doSearch();
            // },

            // doSearch: function(term) {
            //     if (term !== undefined) {
            //         this.$searchField.val(term);
            //     }
            //     else {
            //         term = this.$searchField.val();
            //     }
            //     this.trigger('search', $.trim(term));
            // },

            // clearSearch: function() {
            //     this.$searchField.val('');
            // },

            // showLoadingIndicator: function() {
            //     this.$loadingIndicator.removeClass('hidden');
            // },

            // hideLoadingIndicator: function() {
            //     this.$loadingIndicator.addClass('hidden');
            // },

            // showFoundMessage: function(count) {
            //     var msg = ngettext(
            //     'Viewing %s course',
            //     'Viewing %s courses',
            //     count
            // );
            //     this.$message.html(interpolate(msg, [count]));
            // },

            // showNotFoundMessage: function(term) {
            //     var msg = interpolate(
            //     gettext('We couldn\'t find any results for "%s".'),
            //     [_.escape(term)]
            // );
            //     this.$message.html(msg);
            //     this.clearSearch();
            // },

            // showErrorMessage: function() {
            //     this.$message.html(gettext('There was an error, try searching again.'));
            // }

        });
    });
})(define || RequireJS.define);
