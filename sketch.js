function preload() {
  preload_map()
}

var cvw = 800
var cvh = 600
var board = new Board(cvw, cvh)

var tmp

function setup() {
  let cnv = createCanvas(board._w, board._h)
  cnv.drop(board.import_json)
}

function draw() {
  background(240)
  board.draw()
}

function keyPressed() {
  board.key_pressed(keyCode, key, mouseX, mouseY)
}

function keyReleased() {
  board.key_released(keyCode, key, mouseX, mouseY)
}

function mouseClicked() {
  board.mouse_clicked(mouseX, mouseY)
  return false
}

function mouseDragged() {
  board.drag(mouseX, mouseY)
  return false
}