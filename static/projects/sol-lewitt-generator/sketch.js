function setup() {
    createCanvas($("body").width(), $("body").height());
    background(0);
    stroke(255);
    strokeWeight(2);
    var structure_count = Math.random() * 2 + 1;
    noFill();

  for (var j = 0; j <= structure_count; j++) {
    var x_coordinate = Math.random() * width / 2;
    var y_coordinate = Math.random() * width / 2;
    var margin = Math.random() * 100 + 5;
    var margin_alt = Math.random() * 150 + 5;
    var line_width = Math.random() * width + 5;
    var line_count = Math.random() * 200 + 20;
    var line_rotation = Math.random() * 60 + 20;

    for (var i = 0; i <= line_count; i++) {
        y_coordinate = y_coordinate + margin;
        line(x_coordinate, y_coordinate, x_coordinate + line_width, y_coordinate + margin);
        line(x_coordinate + line_width, y_coordinate + margin, x_coordinate + line_width * 2, y_coordinate + margin_alt * 2);
    }

    rotate(line_rotation);
}
    
}

function keyPressed() {
    setup();
}

$("#download").on("click", function() {
  save('LeWitt-' + Date.now() + '.jpg');
});