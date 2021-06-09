class Actions {
  constructor(board) {
    this._map = [
      { _text: "Terrain", _actions: [
        { _text: "Create opened curve path", _run: function(mx, my) { boardAddPathOrNode(board, mx, my, 0) }, _activ: true },
        { _text: "Create opened angular path", _run: function(mx, my) { boardAddPathOrNode(board, mx, my, 1) }, _activ: true },
        { _text: "Create closed angular path", _run: function(mx, my) { boardAddPathOrNode(board, mx, my, 2) }, _activ: true },
        { _text: "Increase elevation", _run: function(mx, my) { }, _activ: true },
        { _text: "Decrease elevation", _run: function(mx, my) { }, _activ: true },
      ]},
      { _text: "Buildings", _actions: [
        { _text: "Add small rct. house", _run: function(mx, my) { map_add_house(board, mx, my, 0) }, _activ: true },
        { _text: "Add small sqr. house", _run: function(mx, my) { map_add_house(board, mx, my, 1) }, _activ: true },
        { _text: "Add large rect. house", _run: function(mx, my) {  map_add_house(board, mx, my, 2) }, _activ: true },
        { _text: "Add large sqrt. house", _run: function(mx, my) {  map_add_house(board, mx, my, 3) }, _activ: true },
        { _text: "Add large house with inner yard", _run: function(mx, my) { map_add_house_yard(board, mx, my, 0) }, _activ: true },
        { _text: "Add stall", _run: function(mx, my) { map_add_stall(board, mx, my) }, _activ: true },
        { _text: "Add well", _run: function(mx, my) { map_add_well(board, mx, my) }, _activ: true },
        { _text: "Add pool fountain", _run: function(mx, my) { map_add_fountain(board, mx, my) }, _activ: true },
        { _text: "Add tent", _run: function(mx, my) { map_add_tent(board, mx, my, 1) }, _activ: true },
        { _text: "Add large tent", _run: function(mx, my) { map_add_tent(board, mx, my, 2) }, _activ: true },
      ]},
      { _text: "Map", _actions: [
        { _text: "Increase 10px in w", _run: function(mx, my) { board._change_size(10, 0) }, _activ: false },
        { _text: "Decrease 10px in w", _run: function(mx, my) { board._change_size(-10, 0) }, _activ: false },
        { _text: "Increase 10px in h", _run: function(mx, my) { board._change_size(0, 10) }, _activ: false },
        { _text: "Decrease 10px in h", _run: function(mx, my) { board._change_size(0, -10) }, _activ: false },
        { _text: "Increase 100px", _run: function(mx, my) { board._change_size(100, 100) }, _activ: false },
        { _text: "Decrease 100px", _run: function(mx, my) { board._change_size(-100, -100) }, _activ: false },
        { _text: "Increase scale by 0.25", _run: function(mx, my) { board._change_scale(0.25) }, _activ: false },
        { _text: "Decrease scale by 0.25", _run: function(mx, my) { board._change_scale(-0.25) }, _activ: false }
      ]}
    ] 
  }
  
  run(bindex = 0, aindex = 0, mx, my) {
    this._map[bindex]._actions[aindex]._run(mx, my)
  }
  
  len_block() {
    return this._map.length
  }
  
  len_action(bindex = 0) {
    return this._map[bindex]._actions.length
  }
  
  text_block(bindex = 0) {
    return this._map[bindex]._text
  }
  
  text_action(bindex = 0, aindex = 0) {
    return this._map[bindex]._actions[aindex]._text
  }
  
  requires_activation(bindex = 0, aindex = 0){
    return this._map[bindex]._actions[aindex]._activ
  }
}

function map_add_house_yard(board, mx, my, st) {
  board._map.unselect()

  var nh = new BigHouseCentralYard(mx, my)
  nh.set_style(board._style.draw)
  nh.set_selected(true, true)

  board._map.add_to_buildings(nh)
}

function map_add_tent(board, mx, my, sz) {
  board._map.unselect()
  
  var nc 
  if(sz == 1) {
    nc = new Tent(mx, my)
  } else {
    nc = new LargeTent(mx, my)
  }
  nc.set_style(board._style.draw)
  nc.set_selected(true, true)

  board._map.add_to_buildings(nc)
}

function map_add_stall(board, mx, my) {
  board._map.unselect()
  
  var ns = new Stall(mx, my)
  ns.set_style(board._style.draw)
  ns.set_selected(true, true)

  board._map.add_to_buildings(ns)
}

function map_add_fountain(board, mx, my) {
  board._map.unselect()
  
  var nf = new PoolFountain(mx, my)
  nf.set_style(board._style.draw)
  nf.set_selected(true, true)

  board._map.add_to_buildings(nf)
}

function map_add_well(board, mx, my) {
  board._map.unselect()

  var nw = new Well(mx, my)
  nw.set_style(board._style.draw)
  nw.set_selected(true, true)

  board._map.add_to_buildings(nw)
}

function map_add_house(board, mx, my, sz = 0) {
  board._map.unselect()

  var nhouse;
  if(sz == 0) {
    nhouse = new TownHouse(mx, my, props = { w: 30, h: 40, ns: 5, ls: 7 })
  } else if(sz == 1) {
    nhouse = new TownHouse(mx, my, props = { w: 30, h: 30, ns: 4, ls: 5 })
  } else if(sz == 2) {
    nhouse = new LargeTownHouse (mx, my, props = { w: 70, h: 90, ns: 10, ls: 15, chm: 1, dor: 2, lyt: 0 })
  } else if(sz == 3) {
    nhouse = new LargeTownHouse (mx, my, props = { w: 70, h: 70, ns: 8, ls: 12, chm: 1, dor: 2, lyt: 0 })
  }
  
  nhouse.set_style(board._style.draw)
  nhouse.set_selected(true, true)

  board._map.add_to_buildings(nhouse)
}

function boardAddPathOrNode(board, mx, my, st) {
  var sel = board._map._terrain.filter((obj) => obj.is_selected(mx, my))
  if(sel.length == 1) {
    sel[0].add_node(mx, my)
  } else {
    board._map.unselect()
    var npath
    if(st == 0) {
      npath = new CurvePath(mx, my, board._style.draw)
    } else if(st == 1) {
      npath = new AnglePath(mx, my, board._style.draw)
    } else {
      npath = new AngleClosedPath(mx, my, board._style.draw)
    }
    npath.set_selected(true, true)
    board._map._terrain.push(npath)
  }
}