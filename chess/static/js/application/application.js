// Generated by CoffeeScript 1.3.3
(function() {
  var Bishop, Board, BoardCell, ChessPiece, King, Knight, Pawn, Position, Queen, Rook, add_black_pieces, add_white_pieces,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Position = (function() {

    function Position(row, column) {
      this.row = ko.observable(row);
      this.column = ko.observable(column);
    }

    return Position;

  })();

  ChessPiece = (function() {

    function ChessPiece(name, color) {
      this.name = ko.observable(name);
      this.color = ko.observable(color);
      this.img = ko.observable('');
    }

    return ChessPiece;

  })();

  BoardCell = (function() {

    function BoardCell(row, column) {
      var chesspiece;
      this.position = new Position(row, column);
      chesspiece = new ChessPiece('');
      this.chess_piece = ko.observable(chesspiece);
    }

    BoardCell.prototype.select = function() {
      return window.chessboard.selected(this);
    };

    return BoardCell;

  })();

  Board = (function() {

    function Board() {
      var column, row, _i, _j, _len, _len1, _ref, _ref1;
      this.columns = ko.observableArray([
        {
          name: 'a'
        }, {
          name: 'b'
        }, {
          name: 'c'
        }, {
          name: 'd'
        }, {
          name: 'e'
        }, {
          name: 'f'
        }, {
          name: 'g'
        }, {
          name: 'h'
        }
      ]);
      this.rows = ko.observableArray([
        {
          name: '8'
        }, {
          name: '7'
        }, {
          name: '6'
        }, {
          name: '5'
        }, {
          name: '4'
        }, {
          name: '3'
        }, {
          name: '2'
        }, {
          name: '1'
        }
      ]);
      this.moves = ko.observableArray([]);
      this.clicked = ko.observable(false);
      this.selected_cell = ko.observable();
      this.boardpieces = ko.observableArray();
      _ref = this.rows();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _ref1 = this.columns();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          column = _ref1[_j];
          this.boardpieces.push(new BoardCell(row.name, column.name));
        }
      }
    }

    Board.prototype.selected = function(cell) {
      var column, index, row;
      index = this.boardpieces.indexOf(cell);
      row = parseInt(index / 8);
      column = index % 8;
      if (this.clicked() === true) {
        return this.move_piece(this.selected_cell, cell, index);
      } else {
        if (cell.chess_piece().color() === void 0) {
          return "selected empty cell";
        }
        console.log(cell.chess_piece().color());
        this.selected_cell = cell;
        return this.clicked(true);
      }
    };

    Board.prototype.is_valid = function(from, to, to_index) {
      var from_column, from_index, from_row, to_column, to_row;
      from_index = this.boardpieces.indexOf(from);
      from_row = parseInt(from_index / 8);
      from_column = from_index % 8;
      to_row = parseInt(to_index / 8);
      to_column = to_index % 8;
      if (from.chess_piece().is_move_valid(from_row, from_column, to_row, to_column) === false) {
        return false;
      }
      if (from.chess_piece().name() === '') {
        return false;
      }
      if (from.chess_piece().color() === to.chess_piece().color()) {
        return false;
      }
      console.log(from.chess_piece().color());
      return true;
    };

    Board.prototype.move_piece = function(from, to, to_index) {
      this.clicked(false);
      if (this.is_valid(from, to, to_index) === false) {
        return "invalid move";
      }
      this.moves.push({
        name: from.chess_piece().name(),
        from_row: from.position.row(),
        from_column: from.position.column(),
        to_row: to.position.row(),
        to_column: to.position.column()
      });
      to.chess_piece(from.chess_piece());
      return from.chess_piece(new ChessPiece(''));
    };

    Board.prototype.add_piece = function(piece, column, row) {
      var index;
      index = (row * 8) + column;
      return this.boardpieces()[index].chess_piece(piece);
    };

    return Board;

  })();

  Pawn = (function(_super) {

    __extends(Pawn, _super);

    function Pawn(name, color, direction) {
      var pawn;
      Pawn.__super__.constructor.call(this, name, color);
      this.direction = direction;
      if (color === 'white') {
        pawn = '♙ ';
      }
      if (color === 'black') {
        pawn = '♟';
      }
      this.img = ko.observable(pawn);
    }

    Pawn.prototype.is_move_valid = function(from_row, from_column, to_row, to_column) {
      if (from_column - to_column !== 0) {
        return false;
      }
      console.log(from_row - to_row);
      if (from_row - to_row !== -1 && this.direction === -1) {
        return false;
      }
      if (from_row - to_row !== 1 && this.direction === 1) {
        return false;
      }
      return true;
    };

    return Pawn;

  })(ChessPiece);

  Rook = (function(_super) {

    __extends(Rook, _super);

    function Rook(name, color) {
      var rook;
      Rook.__super__.constructor.call(this, name, color);
      if (color === 'white') {
        rook = '♖';
      }
      if (color === 'black') {
        rook = '♜';
      }
      this.img = ko.observable(rook);
    }

    Rook.prototype.is_move_valid = function(from_row, from_column, to_row, to_column) {
      if (from_row !== to_row && from_column !== to_column) {
        return false;
      }
      if (from_row === to_row && from_column === to_column) {
        return false;
      }
      return true;
    };

    return Rook;

  })(ChessPiece);

  Knight = (function(_super) {

    __extends(Knight, _super);

    function Knight(name, color) {
      var knight;
      Knight.__super__.constructor.call(this, name, color);
      if (color === 'white') {
        knight = '♘';
      }
      if (color === 'black') {
        knight = '♞';
      }
      this.img = ko.observable(knight);
    }

    Knight.prototype.is_move_valid = function(from_row, from_column, to_row, to_column) {
      if ((from_row - 1 === to_row && from_column - 2 === to_column) || (from_row + 1 === to_row && from_column - 2 === to_column) || (from_row + 2 === to_row && from_column - 1 === to_column) || (from_row - 2 === to_row && from_column - 1 === to_column) || (from_row + 1 === to_row && from_column + 2 === to_column) || (from_row - 1 === to_row && from_column + 2 === to_column) || (from_row + 2 === to_row && from_column + 1 === to_column) || (from_row - 2 === to_row && from_column + 1 === to_column)) {
        return true;
      }
      return false;
    };

    return Knight;

  })(ChessPiece);

  Bishop = (function(_super) {

    __extends(Bishop, _super);

    function Bishop(name, color) {
      var bishop;
      Bishop.__super__.constructor.call(this, name, color);
      if (color === 'white') {
        bishop = '♗';
      }
      if (color === 'black') {
        bishop = '♝';
      }
      this.img = ko.observable(bishop);
    }

    Bishop.prototype.is_move_valid = function(from_row, from_column, to_row, to_column) {
      var rise, run;
      if (from_row === to_row && from_column === to_column) {
        return false;
      }
      rise = Math.abs(to_column - from_column);
      run = Math.abs(to_row - from_row);
      if (parseInt(rise / run) !== 1) {
        return false;
      }
      return true;
    };

    return Bishop;

  })(ChessPiece);

  Queen = (function(_super) {

    __extends(Queen, _super);

    function Queen(name, color) {
      var queen;
      Queen.__super__.constructor.call(this, name, color);
      if (color === 'white') {
        queen = '♕';
      }
      if (color === 'black') {
        queen = '♛';
      }
      this.img = ko.observable(queen);
    }

    Queen.prototype.is_move_valid = function(from_row, from_column, to_row, to_column) {
      var rise, run;
      rise = Math.abs(to_column - from_column);
      run = Math.abs(to_row - from_row);
      if (from_row === to_row && from_column === to_column) {
        return false;
      }
      if ((from_row !== to_row && from_column !== to_column) && parseInt(rise / run) !== 1) {
        return false;
      }
      return true;
    };

    return Queen;

  })(ChessPiece);

  King = (function(_super) {

    __extends(King, _super);

    function King(name, color) {
      var king;
      King.__super__.constructor.call(this, name, color);
      if (color === 'white') {
        king = '♔';
      }
      if (color === 'black') {
        king = '♚';
      }
      this.img = ko.observable(king);
    }

    King.prototype.is_move_valid = function(from_row, from_column, to_row, to_column) {
      var rise, run;
      rise = Math.abs(to_column - from_column);
      run = Math.abs(to_row - from_row);
      if (from_row === to_row && from_column === to_column) {
        return false;
      }
      if (rise > 1 || run > 1) {
        return false;
      }
      return true;
    };

    return King;

  })(ChessPiece);

  console.log("applying bindings..");

  window.chessboard = new Board();

  add_black_pieces = function() {
    var bishop_left, bishop_right, column, king, knight_left, knight_right, pawn, queen, rook_left, rook_right, _i;
    for (column = _i = 0; _i <= 7; column = ++_i) {
      pawn = new Pawn('pawn', 'black', -1);
      console.log(pawn, column);
      window.chessboard.add_piece(pawn, column, 1);
    }
    knight_left = new Knight('knight', 'black');
    knight_right = new Knight('knight', 'black');
    window.chessboard.add_piece(knight_left, 1, 0);
    window.chessboard.add_piece(knight_right, 6, 0);
    bishop_left = new Bishop('bishop', 'black');
    bishop_right = new Bishop('bishop', 'black');
    window.chessboard.add_piece(bishop_left, 2, 0);
    window.chessboard.add_piece(bishop_right, 5, 0);
    rook_left = new Rook('rook', 'black');
    rook_right = new Rook('rook', 'black');
    window.chessboard.add_piece(rook_left, 0, 0);
    window.chessboard.add_piece(rook_right, 7, 0);
    queen = new Queen('queen', 'black');
    window.chessboard.add_piece(queen, 3, 0);
    king = new King('king', 'black');
    return window.chessboard.add_piece(king, 4, 0);
  };

  add_white_pieces = function() {
    var bishop_left, bishop_right, column, king, knight_left, knight_right, pawn, queen, rook_left, rook_right, _i;
    for (column = _i = 0; _i <= 7; column = ++_i) {
      pawn = new Pawn('pawn', 'white', 1);
      console.log(pawn, column);
      window.chessboard.add_piece(pawn, column, 6);
    }
    knight_left = new Knight('knight', 'white');
    knight_right = new Knight('knight', 'white');
    window.chessboard.add_piece(knight_left, 1, 7);
    window.chessboard.add_piece(knight_right, 6, 7);
    bishop_left = new Bishop('bishop', 'white');
    bishop_right = new Bishop('bishop', 'white');
    window.chessboard.add_piece(bishop_left, 2, 7);
    window.chessboard.add_piece(bishop_right, 5, 7);
    rook_left = new Rook('rook', 'white');
    rook_right = new Rook('rook', 'white');
    window.chessboard.add_piece(rook_left, 0, 7);
    window.chessboard.add_piece(rook_right, 7, 7);
    queen = new Queen('queen', 'white');
    window.chessboard.add_piece(queen, 3, 7);
    king = new King('king', 'white');
    return window.chessboard.add_piece(king, 4, 7);
  };

  add_white_pieces();

  add_black_pieces();

  ko.applyBindings(window.chessboard);

}).call(this);
