var $extender = (function () {
    var defaultConfiguration = {
        resizeDelay: 0, // delay before the resize actually triggers in milliseconds
        initialInputShrinkWidth: 42,  // the number of pixels the width of the input field is decreased during the extension
        inputShrinkWidth: 4, // the number of pixels the width of the input field is decreased in the beforeResize Function

        beforeElements: {
            class: "" // the css class(es) added to the beforeElements span 
        },

        afterElements: {
            class: "" // the css class(es) added to the afterElements span 
        }
    };

    /**
     * holding the actual config values (after the init)
     */
    var config;

    /**
     * The input field to be extended
     */
    var $inputField;

    /**
     * All elements to be added before the input field
     */
    var elementsBefore = [];

    /**
     * The jquery object holding all elementsBefore objects
     */
    var $elementsBefore = $("");

    /**
     * All elements to be added after the input field
     */
    var elementsAfter = [];

    /**
     * The jquery object holding all elementsAfter objects
     */
    var $elementsAfter = $("");

    /**
     * The jquery object representing the wrapping element of the input field
     */
    var $wrapper;


    /**
     * Checks if a jquery element exists
     * 
     * @param {boolean} true if the element exists, false otherwise  
     */
    function exists($element) {
        return $element && $element.length > 0;
    }

    /**
     * Creates the wrapping element and moves the input field inside the wrapper.
     */
    function createWrapper() {
        $wrapper = $('<span class="extend-wrapper extend-wrapper-js"></span>');
        $wrapper.insertBefore($inputField);

        if (elementsBefore.length > 0) {
            $elementsBefore = $('<span class="extend-before-elements-js"></span>');
            if (typeof config.beforeElements.class === "string") {
                $elementsBefore.addClass(config.beforeElements.class);
            } else {
                $.each(config.beforeElements.class, function (index, value) {
                    $elementsBefore.addClass(value);
                });
            }

            $elementsBefore.appendTo($wrapper);
        }

        oldWidth = $inputField.outerWidth();
        $inputField.detach().appendTo($wrapper);
        $inputField.css("width", $inputField.width() - config.initialInputShrinkWidth);

        if (elementsAfter.length > 0) {
            $elementsAfter = $('<span class="extend-after-elements-js"></span>');
            if (typeof config.afterElements.class === "string") {
                $elementsAfter.addClass(config.afterElements.class);
            } else {
                $.each(config.beforeElements.class, function (index, value) {
                    $elementsBefore.addClass(value);
                });
            }
            $elementsAfter.appendTo($wrapper);
        }
    }

    var oldWidth;
    /**
     * Moves the necessary styles from the input field to the wrapper. 
     */
    function restyle() {
        moveCssToWrapper("display", "inline-block");
        moveCssToWrapper("padding", "0");
        moveCssToWrapper("margin", "0");
        moveCssToWrapper("border", "0");
        moveCssToWrapper("border-radius");
        moveCssToWrapper("background-color");
        moveCssToWrapper("box-sizing", "content-box")

        $inputField.addClass("extend-input");
    }

    function moveCssToWrapper(propertyName, newPropertyValue) {
        var propertyValue = $inputField.css(propertyName);

        if (newPropertyValue) {
            $inputField.css(propertyName, newPropertyValue);
        }

        $wrapper.css(propertyName, propertyValue);
    }

    /**
     * Adds all the elements before and after the input field.
     */
    function addElements() {
        $elementsBefore.append(elementsBefore);
        $elementsAfter.append(elementsAfter);
    }

    /**
     * Decreases the input field width a bit to allow the increasing of the border-width.
     * 
     * Helps to modify the wrapper inner width, to reduces side effects which would lead to a linebreak before the input field.
     */
    function beforeResize() {
        $inputField.css("width", $inputField.width() - config.inputShrinkWidth);
    }

    /**
     * Resizes the input field in order to fit all elements in the same space as the input field was.
     */
    function resize() {
        setTimeout(function () {
            $wrapper.css("width", oldWidth);

            var newInputWidth = $wrapper.width() - ($elementsBefore.outerWidth(true) || 0) - ($elementsAfter.outerWidth(true) || 0);
            $inputField.css("width", newInputWidth);
        }, config.resizeDelay);
    }

    $(window).resize(function () {
        oldWidth = $wrapper.parent().width();
        resize();
    });

    return {
        /**
         * Initializes the extend object.
         * 
         * @param options the config object holding user defined configuration (overwrites the default configuration)
         */
        init: function ($jqueryInputField, options) {
            $inputField = $jqueryInputField;
            config = $.extend({}, defaultConfiguration, options);
        },

        /**
         * Starts the extend logic.
         * 
         * If the method was called before, all objects are updated and all properties are recalculated.
         */
        extend: function () {
            createWrapper();
            addElements();
            restyle();
            resize();

            $inputField.focus(function () {
                beforeResize();
                $wrapper.addClass("extend-wrapper-focus");
                resize();
            });

            $inputField.blur(function () {
                $wrapper.removeClass("extend-wrapper-focus");
                resize();
            });
        },

        addElementBefore: function ($jqueryElement) {
            if (exists($jqueryElement)) {
                elementsBefore.push($jqueryElement);
            }
        },

        addElementAfter: function ($jqueryElement) {
            if (exists($jqueryElement)) {
                elementsAfter.push($jqueryElement);
            }
        }
    }
})();