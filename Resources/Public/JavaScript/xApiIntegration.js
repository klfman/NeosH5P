/**
 * This file's code was inspired by https://wordpress.org/plugins/wp-h5p-xapi/
 */

H5P.jQuery(function($) {
    function printDebug(message, code = null) {
        if (!lrsEnableDebugLogging) {
            return;
        }

        // TODO Leon: only print if debug mode is enabled
        if (code == null) {
            console.log(message);
        } else {
            console.error("Unable to save xAPI statement");
            console.log("Unable to save result data.\n\nMessage: " + message + "\n" + "Code: " + code);
        }
    }

    function onXapiPostError(xhr, message) {
        printDebug("xapi post error");
        printDebug(xhr.responseText);
        printDebug(message, xhr.status);
    }

    function onXapiPostSuccess(res, textStatus, xhr) {
        if (!res.hasOwnProperty("ok")) {
            printDebug("xapi post error");
            printDebug(xhr.responseText);
            printDebug("Got bad response back...", 500);
        }

        if (!res.ok) {
            printDebug("xapi post error");
            printDebug(xhr.responseText);
            printDebug(res.message, res.code);
        }

        if (res.ok) {
            // TODO Leon: Event should be documented
            $.event.trigger({
                type: "h5pXapiStatementSaved",
                message: res.message
            });
        }
    }

    function onXapi(event) {
        console.log(event);

        if (!lrsAjaxUrl) {
            printDebug("LRS ajax url was not set")
            return;
        }

        // let data = {
        //     action: 'xapi_event'
        // };
        //
        // if (typeof event.data.statement.context === 'undefined') {
        //     //console.log("here, context");
        //     event.data.statement.context = {};
        // }
        // if (typeof event.data.statement.context.contextActivities === 'undefined') {
        //     //console.log("here, contextActivities");
        //     event.data.statement.context.contextActivities = {};
        // }
        // if (typeof event.data.statement.context.contextActivities.grouping === 'undefined') {
        //     //console.log("here, grouping");
        //     event.data.statement.context.contextActivities.grouping = [];
        // }
        // //
        // // if (xapi_settings.context_activity)
        // //     event.data.statement.context.contextActivities.grouping.push(xapi_settings.context_activity);
        //
        // data.statement = JSON.stringify(event.data.statement);

        $.ajax({
            type: "POST",
            url: lrsAjaxUrl,
            data: event,
            dataType: "json",
            success: onXapiPostSuccess,
            error: onXapiPostError
        });
    }

    $(document).ready(function() {
        if (typeof H5P !== 'undefined' && H5P.externalDispatcher) {
            H5P.externalDispatcher.on('xAPI', onXapi);
        }
    });
});
