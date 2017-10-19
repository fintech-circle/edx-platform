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
            },

            tabClick: function(event){
                event.preventDefault();
                var targetTab = $(event.currentTarget);
                if(!targetTab.hasClass('active')) {
                    this.$tabs.removeClass('active');
                    targetTab.addClass('active');
                    var categoryText = targetTab.find('a').attr('data-tag');
                    this.trigger('tab_change',categoryText);
                }
            },

            getCategoryTabText: function(index) {
                return this.$tabs.eq(index).find('a').attr('data-tag');
            }

        });
    });
})(define || RequireJS.define);
