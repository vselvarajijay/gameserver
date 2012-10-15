
class Position
    constructor: (row, column)->
        @row = ko.observable(row)
        @column = ko.observable(column)

class ChessPiece
    constructor: (name, color)->
        @name  = ko.observable(name)
        @color = ko.observable(color)
        @img = ko.observable('')

class BoardCell
    constructor: (row, column)->
        @position = new Position(row, column)
        chesspiece = new ChessPiece('')
        @chess_piece = ko.observable(chesspiece)

    select: () ->
        window.chessboard.selected this


class Board
    constructor: ()->
        @columns = ko.observableArray([{name:'a'},{name:'b'},{name:'c'},{name:'d'},{name:'e'},{name:'f'},{name:'g'},{name:'h'}])
        @rows = ko.observableArray([{name:'8'},{name:'7'},{name:'6'},{name:'5'},{name:'4'},{name:'3'},{name:'2'},{name:'1'}])
        @moves = ko.observableArray([])
        @clicked = ko.observable(false)
        @selected_cell = ko.observable()
        @boardpieces = ko.observableArray()
        this.boardpieces.push new BoardCell(row.name, column.name) for column in this.columns() for row in this.rows()

    selected: (cell) ->
         index = this.boardpieces.indexOf(cell)
         row = parseInt(index/8)
         column = index%8

         if this.clicked() is true
             this.move_piece(this.selected_cell, cell, index)
         else
             return "selected empty cell" if cell.chess_piece().color() is undefined
             console.log cell.chess_piece().color()
             this.selected_cell = cell
             this.clicked(true)


    is_valid: (from, to, to_index)->
         from_index = this.boardpieces.indexOf(from)

         from_row = parseInt(from_index/8)
         from_column = from_index%8
         to_row = parseInt(to_index/8)
         to_column = to_index%8

         return false if from.chess_piece().is_move_valid(from_row, from_column, to_row, to_column) is false
         return false if from.chess_piece().name() is ''
         return false if from.chess_piece().color() == to.chess_piece().color()
         console.log from.chess_piece().color()
         return true

    move_piece: (from, to, to_index)->
         this.clicked(false)
         return "invalid move" if this.is_valid(from, to, to_index) is false

         this.moves.push({name: from.chess_piece().name(),from_row: from.position.row(),from_column: from.position.column(),to_row: to.position.row(),to_column: to.position.column()})

         to.chess_piece(from.chess_piece())
         from.chess_piece(new ChessPiece(''))

    add_piece: (piece, column, row)->
        index = (row * 8) + column
        this.boardpieces()[index].chess_piece(piece)

class Pawn extends ChessPiece
    constructor: (name, color, direction)->
        super(name, color)
        @direction = direction
        pawn='♙ 'if color is 'white'
        pawn='♟' if color is 'black'
        @img = ko.observable(pawn)

    is_move_valid: (from_row, from_column, to_row, to_column)->
        return false if from_column-to_column!=0
        console.log from_row-to_row
        return false if from_row-to_row!=-1 and this.direction == -1
        return false if from_row-to_row!=1 and this.direction == 1
        return true


class Rook extends ChessPiece
    constructor: (name, color)->
        super(name, color)
        rook='♖' if color is 'white'
        rook='♜' if color is 'black'
        @img = ko.observable(rook)

    is_move_valid: (from_row, from_column, to_row, to_column)->
        return false if from_row!=to_row and from_column!=to_column
        return false if from_row==to_row and from_column==to_column
        return true

class Knight extends ChessPiece
    constructor: (name, color)->
        super(name, color)
        knight='♘' if color is 'white'
        knight='♞' if color is 'black'
        @img = ko.observable(knight)

    is_move_valid: (from_row, from_column, to_row, to_column)->
        if (from_row-1==to_row and from_column-2==to_column) or
           (from_row+1==to_row and from_column-2==to_column) or
           (from_row+2==to_row and from_column-1==to_column) or
           (from_row-2==to_row and from_column-1==to_column) or
           (from_row+1==to_row and from_column+2==to_column) or
           (from_row-1==to_row and from_column+2==to_column) or
           (from_row+2==to_row and from_column+1==to_column) or
           (from_row-2==to_row and from_column+1==to_column)
            return true

        return false

class Bishop extends ChessPiece
    constructor: (name, color)->
        super(name, color)
        bishop='♗' if color is 'white'
        bishop='♝' if color is 'black'
        @img = ko.observable(bishop)

    is_move_valid: (from_row, from_column, to_row, to_column)->
        return false if from_row==to_row and from_column==to_column
        rise = Math.abs(to_column-from_column)
        run = Math.abs(to_row-from_row)
        return false if parseInt(rise/run) != 1
        return true

class Queen extends ChessPiece
    constructor: (name, color)->
        super(name, color)
        queen='♕' if color is 'white'
        queen='♛' if color is 'black'
        @img = ko.observable(queen)

    is_move_valid: (from_row, from_column, to_row, to_column)->
        rise = Math.abs(to_column-from_column)
        run = Math.abs(to_row-from_row)
        return false if from_row==to_row and from_column==to_column
        return false if (from_row!=to_row and from_column!=to_column) and parseInt(rise/run) !=1
        return true

class King extends ChessPiece
    constructor: (name, color)->
        super(name, color)
        king='♔' if color is 'white'
        king='♚' if color is 'black'
        @img = ko.observable(king)

    is_move_valid: (from_row, from_column, to_row, to_column)->
        rise = Math.abs(to_column-from_column)
        run = Math.abs(to_row-from_row)

        return false if from_row==to_row and from_column==to_column
        return false if (rise>1 or run >1)
        return true


console.log "applying bindings.."
window.chessboard = new Board()


add_black_pieces = ()->
    for column in [0..7]
        pawn = new Pawn('pawn', 'black', -1)
        console.log pawn, column
        window.chessboard.add_piece(pawn, column, 1)

    knight_left = new Knight('knight','black')
    knight_right = new Knight('knight','black')
    window.chessboard.add_piece(knight_left, 1, 0)
    window.chessboard.add_piece(knight_right,6,0)

    bishop_left = new Bishop('bishop', 'black')
    bishop_right = new Bishop('bishop', 'black')
    window.chessboard.add_piece(bishop_left, 2, 0)
    window.chessboard.add_piece(bishop_right,5, 0)

    rook_left = new Rook('rook', 'black')
    rook_right = new Rook('rook', 'black')
    window.chessboard.add_piece(rook_left,0, 0)
    window.chessboard.add_piece(rook_right,7,0)

    queen = new Queen('queen', 'black')
    window.chessboard.add_piece(queen,3, 0)

    king = new King('king', 'black')
    window.chessboard.add_piece(king, 4, 0)


add_white_pieces = ()->
    for column in [0..7]
        pawn = new Pawn('pawn', 'white', 1)
        console.log pawn, column
        window.chessboard.add_piece(pawn, column, 6)

    knight_left = new Knight('knight','white')
    knight_right = new Knight('knight','white')
    window.chessboard.add_piece(knight_left, 1, 7)
    window.chessboard.add_piece(knight_right,6,7)

    bishop_left = new Bishop('bishop', 'white')
    bishop_right = new Bishop('bishop', 'white')
    window.chessboard.add_piece(bishop_left, 2, 7)
    window.chessboard.add_piece(bishop_right,5, 7)

    rook_left = new Rook('rook', 'white')
    rook_right = new Rook('rook', 'white')
    window.chessboard.add_piece(rook_left,0, 7)
    window.chessboard.add_piece(rook_right,7,7)

    queen = new Queen('queen', 'white')
    window.chessboard.add_piece(queen,3, 7)

    king = new King('king', 'white')
    window.chessboard.add_piece(king, 4, 7)

add_white_pieces()
add_black_pieces()




ko.applyBindings window.chessboard
