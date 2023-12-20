//Importing Algorithm
import {Dijkstra} from './dijkstra.js'
import {BreadthFirstSearch} from './bfs.js'
import {DepthFirstSearch} from './dfs.js'

document.addEventListener('DOMContentLoaded', function () {
  // Set previous state
  var SIZE = 22;
  var SPEED = 3;
  var ALGORITHM = 1;
  var startid, endid;
  var isDown = false;
  var wall = [];
  var uniqueId;
  var data = new Array(2);

  // Initial Function
  displayGrid(SIZE);

  // Size, Speed, and Size
  document.querySelectorAll('[type=range]').forEach(function (input) {
      input.addEventListener('input', function () {
          var newval = this.value;
          if (this.id === 'speed') {
              document.getElementById('speed_dis').textContent = newval;
              SPEED = newval;
          } else {
              document.getElementById('size_dis').textContent = newval;
              SIZE = newval;
              startid = undefined;
              endid = undefined;
              displayGrid(SIZE);
          }
      });
  });

  // Display grid Function
  function displayGrid(x) {
      document.querySelector('.screen').innerHTML = '';
      var screenWidth = document.querySelector('.screen').offsetWidth / SIZE;

      for (var i = 0; i < x * x; i++) {
          var unit = document.createElement('div');
          unit.className = 'unit';
          unit.id = i;
          document.querySelector('.screen').appendChild(unit);
      }

      document.querySelectorAll('.unit').forEach(function (unit) {
          unit.style.width = screenWidth + 'px';
          unit.style.height = screenWidth + 'px';
      });
  }

  // Resize Event Handler
  window.addEventListener('resize', function () {
      displayGrid(SIZE);
      startid = undefined;
      endid = undefined;
  });

  // Choose Algorithm
  document.getElementById('algorithm').addEventListener('change', function () {
      var choice = parseInt(this.value, 10);
      if (choice === 1) {
          document.querySelector('.title h1').textContent = 'Breadth First Search';
      } else if (choice === 2) {
          document.querySelector('.title h1').textContent = 'Depth First Search';
      } else if (choice === 3) {
          document.querySelector('.title h1').textContent = 'Dijkstra Algorithm';
      }
      ALGORITHM = choice;
  });

  // OnClick Handle Visualization
  document.getElementById('start').addEventListener('click', function () {
      if (startid === undefined || endid === undefined) {
          alert('Select the starting and ending point.');
      } else {
          wallGenerate();
          connectArray(SIZE);
          // Disable input field
          document.getElementById('wall').disabled = true;
          document.getElementById('clear').disabled = true;
          document.getElementById('size').disabled = true;
          document.getElementById('speed').disabled = true;
          document.getElementById('start').disabled = true;
          decoder(ALGORITHM);
      }
  });

  // Handle algorithm visualization
  function decoder(algo) {
      SPEED = 6 - SPEED;
      if (algo === 1) {
          BreadthFirstSearch(data, startid, endid, SPEED);
      } else if (algo === 2) {
          DepthFirstSearch(data, startid, endid, SPEED);
      } else if (algo === 3) {
          Dijkstra(data, startid, endid, SPEED);
      }
  }

  // Display Animation Onclick
  document.body.addEventListener('dblclick', function (event) {
      var target = event.target;
      if (target.classList.contains('unit')) {
          if (startid === undefined) {
              target.classList.add('target');
              startid = target.id;
          } else if (endid === undefined) {
              target.classList.add('target');
              endid = target.id;
          }
      }
  });

  // Clear Cell
  document.getElementById('clear').addEventListener('click', function () {
      startid = undefined;
      endid = undefined;
      wall = [];
      document.querySelectorAll('.unit').forEach(function (unit) {
          unit.classList.add('restore');
          unit.classList.remove('animate', 'target', 'wall', 'path');
      });
      data = new Array(2);
  });

  // Double Click Custom WALL Mouse Event
  document.body.addEventListener('mousedown', function () {
      isDown = true;
  });

  document.body.addEventListener('mouseup', function () {
      isDown = false;
  });

  document.body.addEventListener('mouseover', function (event) {
      if (isDown && event.target.classList.contains('unit') &&
          event.target.style.backgroundColor !== 'rgb(38, 38, 38)') {
          if (event.target.style.backgroundColor === 'rgb(1, 110, 253)') {
              event.target.classList.add('restore');
              event.target.classList.remove('wall');
          } else {
              event.target.classList.add('wall');
              event.target.classList.remove('restore');
          }
      }
  });

  // Making Wall on button Press
  document.getElementById('wall').addEventListener('click', function () {
      wall = 0;
      for (var i = 0; i < SIZE * SIZE; i++) {
          if (i == startid || i == endid) {
              // pass
          } else {
              var x = Math.round(Math.random() * 10);
              if (x == 0 || x == 1 || x == 2) {
                  document.getElementById(i).classList.add('wall');
              }
          }
      }
  });

  // Generating wall array on click
  function wallGenerate() {
      wall = [];
      for (var i = 0; i < SIZE * SIZE; i++) {
          var x = document.getElementById(i).style.backgroundColor;
          if (x == 'rgb(1, 110, 253)') {
              wall.push(i);
          }
      }
  }

  // Generate Array of Given Size / Converting Array to Graph
  function connectArray(size) {
      uniqueId = 0;

      // Making 2-D Array
      for (var i = 0; i < size; i++) {
          data[i] = new Array(2);
      }

      // Initializing 2-D Array
      for (var i = 0; i < size; i++) {
          for (var j = 0; j < size; j++) {
              if (wall.indexOf(uniqueId) === -1) {
                  data[i][j] = new Spot(i, j, false, uniqueId++);
              } else {
                  data[i][j] = new Spot(i, j, true, uniqueId++);
              }
          }
      }

      for (var i = 0; i < size; i++) {
          for (var j = 0; j < size; j++) {
              data[i][j].connectFrom(data);
          }
      }
  }

  // Function to make neighbors
  function Spot(i, j, isWall, id) {
      this.i = i;
      this.j = j;
      this.id = id;
      this.isWall = isWall;
      this.neighbors = [];
      this.path = [];
      this.visited = false;
      this.distance = Infinity;
      this.heuristic = 0;
      this.function = this.distance + this.heuristic;
      this.source = '';

      this.connectFrom = function (data) {
          var i = this.i;
          var j = this.j;
          if (i > 0 && !data[i - 1][j].isWall) {
              this.neighbors.push(data[i - 1][j]);
          }
          if (i < SIZE - 1 && !data[i + 1][j].isWall) {
              this.neighbors.push(data[i + 1][j]);
          }
          if (j > 0 && !data[i][j - 1].isWall) {
              this.neighbors.push(data[i][j - 1]);
          }
          if (j < SIZE - 1 && !data[i][j + 1].isWall) {
              this.neighbors.push(data[i][j + 1]);
          }
      };
  }

});