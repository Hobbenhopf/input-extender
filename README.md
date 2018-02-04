# input-extender
Small JS Lib to extend (visually) an input field

![Alt text](/example/example1.PNG "Example 1")

# Configuration 
Right now there are only a few configuration options.

```
 var config = {
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
```

To add your custom configuration call ```$extender.init($yourInputField, config)```.

Look into [Example 1](/example/example1.html)  for a more detailed instruction on how to use this lib.
