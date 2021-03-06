/*
 * Added By: Lauren
 * Added On: July 13, 2012
 * 
 * Last Modified By: Lauren
 * Last Modified On: July 18, 2012
 * 
 * Controls the appearance of the checkboxes and what they select.
 */

(function ($) {

    $(document).ready(function(){

        // Hide all of the checkboxes
        // IE for some reason won't perform the click properly if the checkboxes
        // are not actually shown. So, if the browser is IE, position it somewhere
        // no one would ever see. Otherwise we can just not display it, which of
        // course makes a thousand times more sense. Thanks IE.
        if (! $.browser.msie) {
            $('.form-checkbox').css('display', 'none');
        } else {
            $('.form-checkbox').each(function () {
                $(this).css('position', 'absolute').css('left', '-5000px').css('top', '-500px');
            });
        }

        // Get the values that a user already has selected
        var $selectedValues = Drupal.settings.selectedValues;
        
        if ($selectedValues != null) { // Handler for checkboxes where previous selected not known
           
            // These are in the User Profile / User Registration pages
            // 
            // Error handling for the "select_or_other" module
            if (jQuery.inArray('ROLE_OTHER', $selectedValues, 0) >= 0) {
                $('.form-item-field-occupation-und-select-select-or-other').addClass('checked');
                $('input#edit-field-occupation-und-select-select-or-other').attr('checked', true);
                $('input#edit-field-occupation-und-other').css('display', 'block');
                /* pre 508 compliance code
                $('.form-item-field-occupation-und-select-select-or-other').parent().parent().next().css('display', 'block');
                $('.form-item-field-occupation-und-select-select-or-other').parent().parent().next().children('input').css('display', 'block');
                */
            }
            // 
            if (jQuery.inArray('AOI_OTHER', $selectedValues, 0) >= 0) {
                $('.form-item-field-areas-of-interest-und-select-select-or-other').addClass('checked');
                $('input#edit-field-areas-of-interest-und-select-select-or-other').attr('checked', true);
                $('input#edit-field-areas-of-interest-und-other').css('display', 'block');
                /* pre 508 compliance code
                $('.form-item-field-areas-of-interest-und-select-select-or-other').parent().parent().next().css('display', 'block');
                $('.form-item-field-areas-of-interest-und-select-select-or-other').parent().parent().next().children('input').css('display', 'block');
                */
            }
        }
        
        $('.form-item-field-occupation-und-other').insertAfter($('.form-item-field-occupation-und-select-select-or-other'));
        $('.form-item-field-occupation-und-other').prepend('<label class="hidden-508" for="edit-field-occupation-und-other">Please Specify the Occupation Type "Other"</label>');
        $('.form-item-field-areas-of-interest-und-other').insertAfter($('.form-item-field-areas-of-interest-und-select-select-or-other'));
        $('.form-item-field-areas-of-interest-und-other').prepend('<label class="hidden-508" for="edit-field-areas-of-interest-und-other">Please Specify the Area of Interest Type "Other"</label>');
        $('<label class="hidden-508" for="edit-field-institution-type-und-other">Please Specify the Institution Type "Other"</label>').insertBefore($('input#edit-field-institution-type-und-other'));
        

        // For every checkbox we have, figure out if it's supposed to start out 
        // as checked (e.g. User has already selected that value) or unchecked
        jQuery.each($('.form-type-checkbox'), function()  {
            
            // Make this tabbable
            $(this).attr('tabIndex', 0);
            
            // Get the value of the INPUT checkbox
            var $inputvalue = $(this).children('input').val();
            // Default is to be unchecked (aka not found as a preselected value)
            var $found = false;
            
            // Check to see any of the previously selected values that we have 
            // match this
            for (key in $selectedValues) {
                // If we find a match, make sure that the INPUT is checked to 
                // TRUE and add the checked CLASS (dark square).
                if ($selectedValues[key] == $inputvalue) {
                    $found = true;
                    $(this).addClass('checked');
                    $(this).children('input').attr('checked', true);
                    // No need to keep looping for this INPUT, we found what we 
                    // were looking for.
                    break;
                }
            }
            
            if ($(this).parent().hasClass('rtype-checkbox')) {
                $(this).children('input').addClass('progress-disabled');
            }
            
            // If an item was not found AND not checked, then we must ensure that 
            // it does not have a checked attribute and that we add the unchecked 
            // CLASS (dark square).
            if (!$found && !$(this).hasClass('checked')) {
                $(this).addClass('unchecked');
                $(this).children('input').removeAttr('checked');
            }

        });
        

       
        // Every time we click on a DIV with a checkbox in it, we must toggle it.
        // Also, we must make sure to toggle the Other box if SELECT_OR_OTHER is
        // chosen.
        $('div.form-type-checkbox').click(function (e) {
           /* alert(e.target.nodeName);*/
            
            // This line right here is not what keeps the LABEL from selecting
            // the checkbox twice.
             if (e.target.nodeName != 'LABEL') {
                // First, determine if it's checked or unchecked so we don't
                // recalculate these values.
                var $isChecked = $(this).hasClass('checked');
                var $isUnchecked = $(this).hasClass('unchecked');

                // If it is already checked, uncheck it and remove that INPUT's
                // checked attribute. Else, do opposite.
                if ($isChecked) {
                    $(this).addClass('unchecked');
                    $(this).removeClass('checked');
                    $(this).children('input').removeAttr('checked');
                } else if ($isUnchecked) {
                    $(this).removeClass('unchecked');
                    $(this).addClass('checked');
                    $(this).children('input').attr('checked', 'checked');
                }
            
                if ($(this).children('input').val() == 'select_or_other') {
                    $(this).next().children('input').css('display', 'block');

                    /* pre 508 fix code
                    $(this).parent().parent().next().show();
					$(this).parent().parent().next().children('input').val('');
                    $(this).parent().parent().next().children('input').show();   
                    */
                }
                
            }
              
        // Return FALSE so it doesn't loop through again.
        // DO NOT PUT "return false;" !!!!!!!!!!!!!!!!!!!
        // JS will not recognize this and this script will loop through twice.
        //return FALSE; 
        //if ($(this).parent().parent().parent().hasClass('select-or-other')) {
        //return false;
        //}
        // IDK... I had to add return false back in and now it works again.
        // I'm really not sure what's going on with this... Maybe ending 
        // both jQuery and JS scripts? But it works now.
            
        // Ok more investigation... return false will keep the non-Other values
        // from executing twice.
            
        // Final investigation results... clicking on the DIV was not the problem,
        // it was clicking on the LABEL that fired the click twice. UN/BINDing
        // handlers didn't seem to really work, but there are two different event
        // target names passed in when you put a parameter in there:
        // LABEL & INPUT. I just didn't execute the code if it was LABEL so we
        // don't need the return false; FYI- clicking on the div has the
        // target node name of DIV. This is officially solved. -Lauren
        });
        
        $('div.form-type-checkbox').keyup(function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key == 13 || key == 32) { // Enter Key & SPACE key (Tab == 9)
                e.preventDefault();
                var $isChecked = $(this).hasClass('checked');
                var $isUnchecked = $(this).hasClass('unchecked');

                // If it is already checked, uncheck it and remove that INPUT's
                // checked attribute. Else, do opposite.
                if ($isChecked) {
                    $(this).addClass('unchecked');
                    $(this).removeClass('checked');
                    $(this).children('input').removeAttr('checked');
                } else if ($isUnchecked) {
                    $(this).removeClass('unchecked');
                    $(this).addClass('checked');
                    $(this).children('input').attr('checked', 'checked');
                }
            
                if ($(this).children('input').val() == 'select_or_other') {
                    if ($isUnchecked) {
                        $(this).next().css('display', 'block');
                        $(this).next().children('input').css('display', 'block');
                    }
                    else if ($isChecked) {
                        $(this).next().css('display', 'none');
                        $(this).next().children('input').css('display', 'none');
                    }
                    

                /* pre 508 fix code
                    $(this).parent().parent().next().show();
					$(this).parent().parent().next().children('input').val('');
                    $(this).parent().parent().next().children('input').show();   
                    */
                }
            }
        });

    });
    
})(jQuery); 


