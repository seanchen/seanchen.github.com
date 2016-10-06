/**
 * simple functions to get started
 */
jQuery(document).ready(function($) {

    var defaultOps = {
      gameBoard: {
        id: 'alphabet-rain',
        width: '400px',
        height: '600px'
      },
      gameControl: {
        initialDroppingInterval: '500'
      },
      svg: {
        styles: {
          width: "32px",
          height: "32px",
          top: "0",
          left: "0",
          position: "absolute",
          border: "0px solid purple"
        }, 
        attrs: {
          viewBox: '0 0 200 200'
        }
      },
      circle: {
        attrs: {
          cx: "100",
          cy: "100",
          r: "97",
          fill: "yellow",
          stroke: "navy",
          stroke_width: "6"
        },
        styles: {}
      },
      text: {
        attrs: {
          x: "40",
          y: "160",
          fill: "red",
          font_family: '"Lucida Console", Courier, monospace',
          font_size: "190"
        },
        styles: {}
      }
    };

    // load the JSON editor
    var container = document.getElementById('jsoneditor');
    var editor = new JSONEditor(container, {});
    editor.set(defaultOps);

    // calculate the game board:
    var gameBoard = d3.select('#svgpreview');
    var $gameBoard = $('#svgpreview');
    console.log($gameBoard.offset());

    // draw the game board.
    $('#drawGameBoard').click(function() {

        var previewdiv = d3.select('#svgpreview');
        var specs = editor.get();
        // do we need remove the existing one?
        $('#' + specs.gameBoard.id).remove();
        drawSvgElement(previewdiv, 'svg', 
                       {'attrs': specs.gameBoard,
                        'styles': {}});
    });

    $('#drawing').click(function() {

        // remove the existing svg.
        //$('#thesvg').remove(); 
        // loop the char code.
        //for(var i = 65; i <= 90; i ++) {
        //    drawCharacterInCircle(String.fromCharCode(i),
        //                          editor.get());
        //}
        var specs = editor.get();
        specs = setRandomLeft(specs);
        drawCharacterInCircle(getRandomChar(), specs);
    });

    // dropping task id
    var droppingId = 0;

    $('#start-dropping').click(function() {

        var specs = editor.get();
        //console.log(specs);
        // get from specs, the unit is in ms
        var initDroppingInterval =
            specs.gameControl.initialDroppingInterval;
        // start dropping rain
        droppingId = droppingId > 0 ? droppingId :
                     window.setInterval(droppingRain, 
                                        initDroppingInterval, specs);
    });

    $('#stop-dropping').click(function() {

        window.clearInterval(droppingId);
        // reset the droppingId to 0;
        droppingId = 0;
    });

    // handle the keydown event to kill those rain drops.
    $('body').keydown(function(event) {

        var theKey = event.key.toUpperCase();
        var selector = "svg[id^='letter-" + theKey + "-']";
        // here is how we check 
        // if the selector has matched elements
        if($(selector).length > 0) {
            // kill the first one only.
            $(selector)[0].remove();
            // kill all matches.
            //$(selector).each(function(index) {
            //    // remove it to kill
            //    $(this).remove();
            //});
        }
    });
});

/**
 * dropping task
 */
function droppingRain(specs) {

    // get the game board height.
    var boardHeight = $('#svgpreview').innerHeight();

    // get all svg with match id patterns:
    $("svg[id^='letter-']").each(function(index) {
        // the object this will be the DOM element.
        var $svg = $(this);
        // get the position in the game board.
        var currentTop = parseInt($svg.css('top'));
        // the dropping space for each dropping.
        var pace = $svg.height();

        // caculate the new top position.
        var newTop = currentTop + pace / 2;
        if (newTop + pace >= boardHeight) {
            // it will drop out of game board, remove it.
            $svg.remove();
        } else {
            // move to the new position.
            $svg.css({"top": newTop + "px"});
        }
    });

    // draw a letter after moving rain drops.
    specs = setRandomLeft(specs);
    drawCharacterInCircle(getRandomChar(), specs);
}

/**
 * get random left.
 */
function setRandomLeft(specs) {

    // find the inner width of the game board.
    var $preview = $('#svgpreview');
    var innerWidth = $preview.innerWidth();
    var charWidth = parseInt(specs.svg.styles.width);
    var max = innerWidth - charWidth;
    var left = Math.floor(Math.random() * max);
    specs.svg.styles.left = left;

    return specs;
}

/**
 * randomly return a char code.
 */
function getRandomChar() {

    // 65 to 90 for now.
    var min = Math.ceil(65);
    var max = Math.floor(91);
    var code = Math.floor(Math.random() * (max - min)) + 65;
    return String.fromCharCode(code);
}

/**
 * build the game board.
 */
function drawGameBoard() {

    // draw the game board...
    var preview = d3.select('#svgpreview');
    var gameBoard = preview.append("svg");
    // set id.
    gameBoard.attr('id', 'alphabet-rain');
}

/**
 * try to builde the svg with a circle and text inside the circle.
 * here are the HTML code.
 *   <svg>
 *     <circle></circle>
 *     <text></text>
 *   </svg>
 */
function drawCharacterInCircle(character, options) {

    var previewdiv = d3.select('#svgpreview');
    //console.log(options.svg.styles.width);
    // append the svg.
    var svg = drawSvgElement(previewdiv, 'svg', options.svg);
    //var svg = previewdiv.append("svg");
    // id should have this format.
    //   letter-[x]-[style.left]
    var theId = 'letter-' + character + '-' +
                options.svg.styles.left;
    svg.attr('id', theId);

    // append the circle.
    drawSvgElement(svg, 'circle', options.circle);
    // append the text.
    var text = drawSvgElement(svg, 'text', options.text);
    text.text(character);
}

/**
 * draw a svg element.
 */
function drawSvgElement(dist, elementName, options) {

    var element = dist.append(elementName);
    for(var attr in options.attrs) {
        element.attr(attr.replace(/_/g, '-'), options.attrs[attr]);
    }
    for(var style in options.styles) {
        element.style(style, options.styles[style]);
    }

    return element;
}
