var Placeholder;

(function () {
    'use strict';

    /*global Extension */

    Placeholder = Extension.extend({
        name: 'placeholder',

        /* Placeholder Options */

        /* text: [string]
         * Text to display in the placeholder
         */
        text: 'Type your text',

        /* hideOnClick: [boolean]
         * Should we hide the placeholder on click (true) or when user starts typing (false)
         */
        hideOnClick: true,

        init: function () {
            this.initPlaceholders();
            this.attachEventHandlers();
        },

        initPlaceholders: function () {
            this.base.elements.forEach(function (el) {
                if (!el.getAttribute('data-placeholder')) {
                    el.setAttribute('data-placeholder', this.text);
                }
                this.updatePlaceholder(el);
            }, this);
        },

        showPlaceholder: function (el) {
            if (el) {
                el.classList.add('medium-editor-placeholder');
            }
        },

        hidePlaceholder: function (el) {
            if (el) {
                el.classList.remove('medium-editor-placeholder');
            }
        },

        updatePlaceholder: function (el) {
            // if one of these element ('img, blockquote, ul, ol') are found inside the given element, we won't display the placeholder
            if (!(el.querySelector('img, blockquote, ul, ol')) && el.textContent.replace(/^\s+|\s+$/g, '') === '') {
                this.showPlaceholder(el);
            } else {
                this.hidePlaceholder(el);
            }
        },

        attachEventHandlers: function () {
            // Custom events
            this.base.subscribe('blur', this.handleExternalInteraction.bind(this));

            // Check placeholder on blur
            this.base.subscribe('editableBlur', this.handleBlur.bind(this));

            // if we don't want the placeholder to be removed on click but when user start typing
            if (this.hideOnClick) {
                this.base.subscribe('editableClick', this.handleHidePlaceholderEvent.bind(this));
            } else {
                this.base.subscribe('editableKeyup', this.handleBlur.bind(this));
            }

            // Events where we always hide the placeholder
            this.base.subscribe('editableKeypress', this.handleHidePlaceholderEvent.bind(this));
            this.base.subscribe('editablePaste', this.handleHidePlaceholderEvent.bind(this));
        },

        handleHidePlaceholderEvent: function (event, element) {
            // Events where we hide the placeholder
            this.hidePlaceholder(element);
        },

        handleBlur: function (event, element) {
            // Update placeholder for element that lost focus
            this.updatePlaceholder(element);
        },

        handleExternalInteraction: function () {
            // Update all placeholders
            this.initPlaceholders();
        }
    });
}());
