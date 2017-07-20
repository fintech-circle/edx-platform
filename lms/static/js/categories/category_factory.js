(function(define) {
    'use strict';

    define(['backbone', 'js/discovery/models/search_state', 'js/discovery/collections/filters',
        'js/discovery/views/search_form', 'js/discovery/views/courses_listing',
        'js/discovery/views/filter_bar', 'js/discovery/views/refine_sidebar', 'js/categories/views/tabs'],
        function(Backbone, SearchState, Filters, SearchForm, CoursesListing, FilterBar, RefineSidebar, CategoryTabs) {
            return function(userLanguage, userTimezone) {
                var dispatcher = _.extend({}, Backbone.Events);
                var search = new SearchState();
                var tabs = new CategoryTabs();
                var listing;
                var courseListingModel = search.discovery;
                courseListingModel.userPreferences = {
                    userLanguage: userLanguage,
                    userTimezone: userTimezone
                };
                listing = new CoursesListing({model: courseListingModel});

                dispatcher.listenTo(tabs, 'tab_change', function(query) {
                    search.performSearch(query);
                });

                dispatcher.listenTo(listing, 'next', function() {
                    search.loadNextPage();
                });

                dispatcher.listenTo(search, 'next', function() {
                    listing.renderNext();
                });

                dispatcher.listenTo(search, 'search', function(query, total) {
                    if (total > 0) {

                    }
                    else {

                    }
                    listing.render();
                });

                dispatcher.listenTo(search, 'error', function() {
                    console.log('search error');
                });

                // trigger search for first tab
                search.performSearch(tabs.getCategoryTabText(0));
               
            };
        });
})(define || RequireJS.define);
