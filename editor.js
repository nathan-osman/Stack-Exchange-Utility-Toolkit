/*===========================================
      Stack Exchange Utility Toolkit
       Copyright 2013 - Nathan Osman
===========================================*/

/* Constructs a new Editor object, which represents an instance
   of the WMD editor. post_id represents the ID of the post being
   edited, and is used to find the editor on the page. */
function Editor(post_id) {
    
    /* If the user provided post_id, then find the editor with the
       appropriate ID, otherwise grab the anonymous editor. */
    var editor = (typeof post_id == 'undefined')?
        $('#post-editor'):
        $('#post-editor-' + post_id);
    
    /* Find the button toolbar in the editor. */
    var toolbar = editor.find('.wmd-button-row');
    
    var button_queue  = [];
    var button_timout = 0;
    
    /* Checks to see if the editor has loaded yet. If so, adds the buttons
       directly to the toolbar. If not, schedules another attempt for later. */
    var clearButtonQueue = function() {
        
        var left = toolbar.find('li:not(.wmd-help-button):last').css('left');
        if(left === null) {
            
            if(!button_timeout)
                button_timeout = window.setTimeout(clearButtonTimeout, 500);
        }
        else {

            /* Determine the offset of the last button and begin inserting buttons. */
            var offset = parseInt(left.replace(/\D/g, '')) + 25;
            for(var i=0;i<button_queue.length;++i) {
                
                /* Insert the separator. */
                toolbar.append('<li class="wmd-spacer" style="left: ' + offset + 'px;"></li>');
                offset += 25;
                
                for(var j=0;j<button_queue[i].length;++j) {
                    
                    /* Load the parameters for the new button. */
                    var p = button_queue[i][j];
                    
                    /* Start building the button... */
                    var button = $('<li class="wmd-button"></li>');
                    button.attr('title', p['title']);
                    button.css('backgroundImage', 'url(' + p['icon'] + ')');
                    button.css('backgroundPosition', 'center');
                    button.css('backgroundRepeat', 'no-repeat');
                    button.css('left', offset + 'px');
                    
                    /* Set the event handler for the button and insert it. */
                    button.click(p['callback']);
                    toolbar.append(button);
                    
                    offset += 25;
                }
            }
        }
    };
    
    /* Adds the provided buttons to the toolbar. */
    this.addToolbarButtons = function(buttons) {
        
        button_queue.push(buttons);
        clearButtonQueue();
    };
    
    /* When invoked with no parameters, returns the current text
       selection in the editor. When a parameter is supplied, the
       currently selected text is replaced with the parameter. */
    this.selectedText = function(text) {
        
        /* Get the contents of the editor and current selection indices. */
        var contents = editor.val();
        var start    = editor[0].selectionStart;
        var end      = editor[0].selectionEnd;
        
        /* If no parameter was supplied, simply return the current text. */
        if(typeof text == 'undefined')
            return contents.substr(start, end);
        
        /* Set the new contents of the editor. */
        contents = contents.substr(0, start) + text + contents.substr(end);
        editor.val(contents);
        
        /* Set the focus to the editor and highlight the newly inserted text. */
        editor[0].focus();
        editor[0].selectionStart = start;
        editor[0].selectionEnd   = start + text.length;
        
        // TODO: this is rather innefficient as it refreshes ALL previews.
        
        /* Lastly, refresh the preview. */
        StackExchange.MarkdownEditor.refreshAllPreviews();
    };
}