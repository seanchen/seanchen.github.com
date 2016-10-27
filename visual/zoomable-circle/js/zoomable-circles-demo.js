jQuery(document).ready(function($) {

    new Clipboard('#copybtn');

    var container = document.getElementById('jsoneditor');
    // load the JSON editor
    var editor = new JSONEditor(container, {});
    // get the URL to JSON file.
    var dataUrl = $('#example').val();
    // initially load the data.
    loadData(dataUrl, editor);

    // change examples .
    $('#example').change(function() {
        dataUrl = $(this).val();
        loadData(dataUrl, editor);
    });

    // rebuild the circles.
    $('#reload').click(function() {
        // remove the existing one.
        $('#svgpreview').empty();
        // rebuild the circles.
        circleChart("#svgpreview", 20, 500, editor.get());
        // update the JSON source code.
        $('#jsonstring').html(JSON.stringify(editor.get()).
                              replace(/,/g, ',\n'));
    });

    // load the circles in full screen, using modal for now.
    $('#fullscreen').click(function() {
        $('#svgfullscreen').empty();
        var diameter = $('#fullscreenSize').val();
        // rebuild the circles.
        circleChart("#svgfullscreen", 10, diameter, editor.get());
        // update the JSON source code.
        $('#jsonstring').html(JSON.stringify(editor.get()).
                              replace(/,/g, ',\n'));
    });
});

/**
 * load data from the given url, set it to JSON editor and load
 * the zoomable circles.
 */
function loadData(dataUrl, jsonEditor) {

    // jQuery getJSON will read the file from a Web resources.
    $.getJSON(dataUrl, function(data) {
    //$.getJSON('data/simple-zoomable-circle.json', function(data) {
        // set data to JSON editor.
        jsonEditor.set(data);
        // remove the existing one.
        $('#svgpreview').empty();
        // build the circles...
        circleChart("#svgpreview", 20, 500, jsonEditor.get());
        //console.log(JSON.stringify(data));
        // update the JSON source code
        $('#jsonstring').html(JSON.stringify(data).
                              replace(/,/g, ',\n'));
    });
}
