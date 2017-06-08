var summat = function(){
  var that = this;
    this.layout = function(){
      initGrid();
      var columnWidth = this.element.offsetWidth / this.columns;
      for(var i = 0; i < this.children.length; i++){
        var child = this.children[i];
        var colspan = parseInt(child.dataset.colspan) || 1;
        var rowspan = parseInt(child.dataset.rowspan) || 1;
        child.style.margin = 0;
        child.style.width = (this.element.offsetWidth / (this.columns / colspan) - this.columns * this.margin) + "px";
        child.style.height = (this.element.offsetWidth / (this.columns / rowspan) - this.columns * this.margin) + "px";
        var gridspace = this.findGridSpace(colspan, rowspan);
        fillGrid(gridspace.col, gridspace.row, colspan, rowspan);

        child.innerHTML = i;
        child.style.left = ((this.element.offsetWidth / this.columns) * gridspace.col) + "px";
        child.style.top = ((this.element.offsetWidth / this.columns) * gridspace.row) + "px";
      }
    }

    function initGrid(){
      that.grid = new Array(that.columns);
      for(var i = 0; i < that.grid.length; i++){
        that.grid[i] = new Array();
      }
    }

    function fillGrid(col, row, colspan, rowspan){
      for(var x = col; x < col + colspan; x++){
        for(var y = row; y < row + rowspan; y++){
          if(that.grid[x][y] !== undefined){
            that.grid[x][y] = false;
          } else {
            for(var d = 0; d < y; d++){
              if(that.grid[x][d] == undefined){
                that.grid[x].push(true);
              }
            }
            that.grid[x].push(false);
          }
        }
      }
    }

    function canPlaceInColumn(colspan, col, row){
      if(colspan == 0){
        console.debug("Colspan = 0")
        return true;
      } else {
        return  col < that.grid.length &&
                that.grid[col] &&
                (that.grid[col][row] == undefined || that.grid[col][row]) &&
                canPlaceInColumn(--colspan, ++col, row);
      }
    }

    function canPlaceInRow(rowspan, col, row){
      if(rowspan == 0){
        return true;
      } else {
        return  (that.grid[col][row] == undefined || that.grid[col][row]) &&
                canPlaceInRow(--rowspan, col, ++row);

      }
    }

    this.findGridSpace = function(colspan, rowspan){
      if(colspan > this.columns) return false;
      for(var row = 0; true; row++){
        for(var col = 0; col < this.grid.length; col ++){
          if(canPlaceInColumn(colspan, col, row) && canPlaceInRow(rowspan, col, row)){
            return {col: col, row: row};
          }
        }
      }
    }

    this.init = function(options){
      var that = this;

      this.element = options.element;
      this.childSelector = options.childSelector;
      this.children = document.getElementsByClassName(this.childSelector);
      this.columns = options.columns;
      this.margin = options.margin;

      var windowResize = window.onresize || function(){};
      window.onresize = function(event){
        windowResize(event);
        that.layout();
      }
      this.layout();
      this.layout();
    }
};
