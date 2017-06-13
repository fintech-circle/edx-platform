(function(define, undefined) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'edx-ui-toolkit/js/utils/string-utils',
        'edx-ui-toolkit/js/utils/html-utils', 'js/views/fields', 'js/views/image_field', 'backbone-super'
    ], function(gettext, $, _, Backbone, StringUtils, HtmlUtils, FieldViews, ImageFieldView) {
        var LearnerProfileFieldViews = {};

        LearnerProfileFieldViews.AccountPrivacyFieldView = FieldViews.DropdownFieldView.extend({

            render: function() {
                this._super();
                this.showNotificationMessage();
                return this;
            },

            showNotificationMessage: function() {
                var accountSettingsLink = HtmlUtils.joinHtml(
                    HtmlUtils.interpolateHtml(
                        HtmlUtils.HTML('<a href="{settings_url}">'), {settings_url: this.options.accountSettingsPageUrl}
                    ),
                    gettext('Account Settings page.'),
                    HtmlUtils.HTML('</a>')
                );
                this._super('');
            },

        });

        LearnerProfileFieldViews.ProfileImageFieldView = ImageFieldView.extend({

            screenReaderTitle: gettext('Profile Image'),

            imageUrl: function() {
                return this.model.profileImageUrl();
            },

            imageAltText: function() {
                return interpolate_text(
                    gettext('Profile image for {username}'), {username: this.model.get('username')}
                );
            },

            imageChangeSucceeded: function(e, data) {
                var view = this;
                // Update model to get the latest urls of profile image.
                this.model.fetch().done(function() {
                    view.setCurrentStatus('');
                    view.render();
                    view.$('.u-field-upload-button').focus();
                }).fail(function() {
                    view.setCurrentStatus('');
                    view.showErrorMessage(view.errorMessage);
                });
            },

            imageChangeFailed: function(e, data) {
                this.setCurrentStatus('');
                this.showImageChangeFailedMessage(data.jqXHR.status, data.jqXHR.responseText);
            },

            showImageChangeFailedMessage: function(status, responseText) {
                if (_.contains([400, 404], status)) {
                    try {
                        var errors = JSON.parse(responseText);
                        this.showErrorMessage(errors.user_message);
                    } catch (error) {
                        this.showErrorMessage(this.errorMessage);
                    }
                } else {
                    this.showErrorMessage(this.errorMessage);
                }
            },

            showErrorMessage: function(message) {
                this.options.messageView.showMessage(message);
            },

            isEditingAllowed: function() {
                return this.model.isAboveMinimumAge();
            },

            isShowingPlaceholder: function() {
                return !this.model.hasProfileImage();
            },

            clickedRemoveButton: function(e, data) {
                this.options.messageView.hideMessage();
                this._super(e, data);
            },

            fileSelected: function(e, data) {
                this.options.messageView.hideMessage();
                this._super(e, data);
            }
        });

        return LearnerProfileFieldViews;
    });
}).call(this, define || RequireJS.define);
