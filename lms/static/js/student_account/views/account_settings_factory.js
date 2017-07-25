(function(define, undefined) {
    'use strict';
    define([
        'gettext', 'jquery', 'underscore', 'backbone', 'logger',
        'js/student_account/models/user_account_model',
        'js/student_account/models/user_preferences_model',
        'js/student_account/views/account_settings_fields',
        'js/student_account/views/account_settings_view',
        'edx-ui-toolkit/js/utils/string-utils'
    ], function(gettext, $, _, Backbone, Logger, UserAccountModel, UserPreferencesModel,
                 AccountSettingsFieldViews, AccountSettingsView, StringUtils) {
        return function(
            fieldsData,
            ordersHistoryData,
            authData,
            passwordResetSupportUrl,
            userAccountsApiUrl,
            userPreferencesApiUrl,
            accountUserId,
            platformName
        ) {
            var accountSettingsElement, userAccountModel, userPreferencesModel, aboutSectionsData,
                accountsSectionData, ordersSectionData, accountSettingsView, showAccountSettingsPage,
                showLoadingError, orderNumber, getUserField, userFields;

            accountSettingsElement = $('.wrapper-account-settings');

            userAccountModel = new UserAccountModel();
            userAccountModel.url = userAccountsApiUrl;

            userPreferencesModel = new UserPreferencesModel();
            userPreferencesModel.url = userPreferencesApiUrl;

            aboutSectionsData = [
                {
                    title: gettext('Basic Account Information'),
                    subtitle: gettext('These settings include basic information about your account. You can also specify additional information and see your linked social accounts on this page.'),  // eslint-disable-line max-len
                    fields: [
                        {
                            view: new AccountSettingsFieldViews.ReadonlyFieldView({
                                model: userAccountModel,
                                title: gettext('Username'),
                                valueAttribute: 'username',
                                helpMessage: StringUtils.interpolate(
                                    gettext('The name that identifies you throughout the {platform_name}. You cannot change your username.'),  // eslint-disable-line max-len
                                    {platform_name: platformName}
                                )
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.TextFieldView({
                                model: userAccountModel,
                                title: gettext('Full Name'),
                                valueAttribute: 'name',
                                helpMessage: gettext(
                                    'The name that is used for ID verification and appears on your certificates (if applicable). Other learners never see your full name. Make sure to enter your name exactly as it appears on your government-issued photo ID.'  // eslint-disable-line max-len
                                ),
                                persistChanges: true
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.EmailFieldView({
                                model: userAccountModel,
                                title: gettext('Email Address'),
                                valueAttribute: 'email',
                                helpMessage: StringUtils.interpolate(
                                    gettext('The email address you use to sign in. Communications from the {platform_name} and your courses are sent to this address.'),  // eslint-disable-line max-len
                                    {platform_name: platformName}
                                ),
                                persistChanges: true
                            })
                        },
                        {
                            view: new AccountSettingsFieldViews.PasswordFieldView({
                                model: userAccountModel,
                                title: gettext('Password'),
                                screenReaderTitle: gettext('Reset Your Password'),
                                valueAttribute: 'password',
                                emailAttribute: 'email',
                                passwordResetSupportUrl: passwordResetSupportUrl,
                                linkTitle: gettext('Reset Your Password'),
                                linkHref: fieldsData.password.url,
                                helpMessage: StringUtils.interpolate(
                                    gettext('When you select "Reset Your Password", a message will be sent to the email address for your {platform_name} account. Click the link in the message to reset your password.'),  // eslint-disable-line max-len
                                    {platform_name: platformName}
                                )
                            })
                        }
                    ]
                }
            ];

            // set TimeZoneField to listen to CountryField
            getUserField = function(list, search) {
                return _.find(list, function(field) {
                    return field.view.options.valueAttribute === search;
                }).view;
            };
            userFields = _.find(aboutSectionsData, function(section) {
                return section.title === gettext('Basic Account Information');
            }).fields;

            accountsSectionData = [
                {
                    title: gettext('Linked Accounts'),
                    subtitle: StringUtils.interpolate(
                        gettext('Use your third-party login to simply sign in to your {platform_name} account.'),
                        {platform_name: platformName}
                    ),
                    fields: _.map(authData.providers, function(provider) {
                        return {
                            view: new AccountSettingsFieldViews.AuthFieldView({
                                title: provider.name,
                                valueAttribute: 'auth-' + provider.id,
                                helpMessage: '',
                                connected: provider.connected,
                                connectUrl: provider.connect_url,
                                acceptsLogins: provider.accepts_logins,
                                disconnectUrl: provider.disconnect_url,
                                platformName: platformName
                            })
                        };
                    })
                }
            ];

            ordersHistoryData.unshift(
                {
                    title: gettext('ORDER NAME'),
                    order_date: gettext('ORDER PLACED'),
                    price: gettext('TOTAL'),
                    number: gettext('ORDER NUMBER')
                }
            );

            ordersSectionData = [
                {
                    title: gettext('My Orders'),
                    subtitle: StringUtils.interpolate(
                        gettext('This page contains information about orders that you have placed with the {platform_name}.'),  // eslint-disable-line max-len
                        {platform_name: platformName}
                    ),
                    fields: _.map(ordersHistoryData, function(order) {
                        orderNumber = order.number;
                        if (orderNumber === 'ORDER NUMBER') {
                            orderNumber = 'orderId';
                        }
                        return {
                            view: new AccountSettingsFieldViews.OrderHistoryFieldView({
                                totalPrice: order.price,
                                orderId: order.number,
                                orderDate: order.order_date,
                                receiptUrl: order.receipt_url,
                                valueAttribute: 'order-' + orderNumber,
                                lines: order.lines
                            })
                        };
                    })
                }
            ];

            accountSettingsView = new AccountSettingsView({
                model: userAccountModel,
                accountUserId: accountUserId,
                el: accountSettingsElement,
                tabSections: {
                    aboutTabSections: aboutSectionsData,
                    accountsTabSections: accountsSectionData,
                    ordersTabSections: ordersSectionData
                },
                userPreferencesModel: userPreferencesModel
            });

            accountSettingsView.render();

            showAccountSettingsPage = function() {
                // Record that the account settings page was viewed.
                Logger.log('edx.user.settings.viewed', {
                    page: 'account',
                    visibility: null,
                    user_id: accountUserId
                });
            };

            showLoadingError = function() {
                accountSettingsView.showLoadingError();
            };

            userAccountModel.fetch({
                success: function() {
                    // Fetch the user preferences model
                    userPreferencesModel.fetch({
                        success: showAccountSettingsPage,
                        error: showLoadingError
                    });
                },
                error: showLoadingError
            });

            return {
                userAccountModel: userAccountModel,
                userPreferencesModel: userPreferencesModel,
                accountSettingsView: accountSettingsView
            };
        };
    });
}).call(this, define || RequireJS.define);
