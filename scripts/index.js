//======================================
// Functions
//======================================
function toggleDisplayPane(paneId) {
  // make name into JQuery selector
  paneId = "#pane" + paneId;

  //calculate width and adjust ALL panes

  $(paneId).toggle();
  resizeAll();
}

function resizeAll() {
  var paneWidth = calculatePaneWidth();
  $(".pane").css("width", paneWidth + "%");

}

function resizeAfterDrag(event, ui) {
  // only width is allowed to change
  constrainY(event, ui);

  // don't allow resize of any panes marked as "fixed"
  if (ui.element.hasClass("fixed")) {
    $(this).mouseup();
  }
  else {
    // get total width of all visible panes up to and including this one
    var prev = ui.element.prevAll(".pane:visible");
    var prevTotalWidth = parseInt(ui.element.css("width"));

    // this comes back as px
    if (prev.length > 0) {
      for (var i = 0; i < prev.length; i++) {
        prevTotalWidth += parseInt($(prev[i]).css("width"));
      };
    };

    // calculate how big the subsequent panes should be
    var containerWidth = parseInt($("#container").css("width"));
    var left = prevTotalWidth;
    var remaining = containerWidth - left;

    var next = ui.element.nextAll(".pane:visible");
    var paneWidth = remaining / next.length - 1;

    var paneWidthPct = (paneWidth / containerWidth * 100) +"%";

    // and resize them
    if (next.length > 0) {
      for (var n = 0; n < next.length; n++) {
        $(next[n]).css("width", paneWidthPct );
      };
    };

    // and make this one also still pct
    var currPct = parseInt(ui.element.css("width")) / containerWidth * 100 + "%";
    ui.element.css("width", currPct);

  };

}


// equal width for one pane given how many are on display
// as a string inclusing the % sign
function calculatePaneWidth() {

  var numVisiblePanes = $(".pane:visible").length;
  var containerWidth = 100; //$("#panes").css("width");


  if (numVisiblePanes == 0) {
    return containerWidth;
  }

  return parseInt(containerWidth) / numVisiblePanes;
}

function toggleMenuItemColour(element) {
  //**TODO: do this by adding and removing classess - more elegant
  if (element.css("background-color") != "rgb(255, 255, 255)") {
    element.css("background-color", "rgb(255, 255, 255)");
  }
  else {
    element.css("background-color", "lightgray");
  }

}


//---------------------------------------
// constrain functions for resizable
//---------------------------------------
function constrainX(event, ui) {
  ui.size.height = ui.originalSize.width;
}

function constrainY(event, ui) {
  ui.size.height = ui.originalSize.height;
}
//---------------------------------------


//---------------------------------------
//Event handler functions
//---------------------------------------
function menuItemClick() {
  // toggle background colour - white = selected
  toggleMenuItemColour($(this));

  // display pane
  toggleDisplayPane($(this).prop("id"));
}

function codeChanged() {

  // assemble full page wth style in heads
  var html = $("#panehtml .code").val();
  var style = $("#panecss .code").val();
  var script = $("#panejs .code").val();

  var outputFrame = $("#outputframe").contents().find("html");
  var head = outputFrame.find("head");
  var styleExisting = head.find("style");

  // It seems a world of hurt to do this any other way
  // than prepending/appending the style tag as text
  if ($.type(styleExisting.html()) === "undefined") {
    head.append('<style>' + style + '</style>');
  }
  else{
    $(styleExisting).html(style);
  };

  outputFrame.find("body").html(html);



  // eval the script part
  document.getElementById("outputframe").contentWindow.eval(script);
}

//---------------------------------------


//======================================
// Event Handlers
//======================================
$(".menuitem").click(menuItemClick);
$(".pane")
  .resizable({ resize: resizeAfterDrag, containment: "#panes" });
$(".code").on("change keyup paste", codeChanged);

//======================================
// Main
//======================================

// default panes to not visible
// buttons are already grey, so that is OK
$(".pane").hide();

//set up example content
codeChanged();