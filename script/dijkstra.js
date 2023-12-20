let Data;
let Queue = [];
let visited = [];
let gotit;

// Implementing Dijkstra Visualization
export function Dijkstra(arrayData, startNodeId, endNodeId, SPEED) {
    Data = arrayData;
    Queue = [];
    visited = [];
    gotit = false;

    let startNode, endNode;

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if (Data[i][j].id == startNodeId) {
                startNode = Data[i][j];
            }
            if (Data[i][j].id == endNodeId) {
                endNode = Data[i][j];
            }
        }
    }

    // Starting node to 0
    startNode.distance = 0;

    // Adding elements to the queue
    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            Queue.push(Data[i][j]);
        }
    }

    while (Queue.length !== 0) {
        const min = getMinDistance(Queue); // Getting the minimum path
        if (min === undefined) {
            break;
        }

        Queue = Queue.filter(item => item !== min); // Removing the current from Queue
        for (let i = 0; i < min.neighbors.length; i++) { // Looping through the neighbors of min
            if (Queue.indexOf(min.neighbors[i]) >= 0) { // Checking if its neighbor is in the queue
                const fun = min.distance + 1; // 1 is the weight
                if (fun < min.neighbors[i].distance) {
                    min.neighbors[i].distance = fun;
                    min.neighbors[i].path = min.id;

                    // Path-Find
                    if (min.neighbors[i].id == endNode.id) {
                        gotit = true;
                        break;
                    }

                    // Animate
                    if (!gotit) {
                        visited.push(min.neighbors[i].id);
                    }
                }
            }
        }
    }

    djAnimate(visited, startNode, endNode, gotit, SPEED);
}

function getMinDistance(queue) {
    // Get minimum Distance
    let min = Infinity;
    let id;

    for (let i = 0; i < Queue.length; i++) {
        if (Queue[i].distance < min) {
            min = Queue[i].distance;
            id = Queue[i];
        }
    }

    return id;
}

// Animate
function djAnimate(data, start, stop, get, speed) {
    for (let i = 0; i < data.length; i++) {
        const x = data[i];

        setTimeout(function () {
            document.getElementById(x).classList.add('animate');
        }, (i + 1) * 20 * speed);
    }

    if (!get) {
        setTimeout(function () {
            alert('Element cannot be found!');
            enableButtons();
        }, (data.length + 3) * 20 * speed);
    }

    if (gotit) {
        pathAnimate(start, stop, data.length, speed);
    }
}

function enableButtons() {
    document.getElementById('wall').removeAttribute('disabled');
    document.getElementById('clear').removeAttribute('disabled');
    document.getElementById('size').removeAttribute('disabled');
    document.getElementById('speed').removeAttribute('disabled');
    document.getElementById('start').removeAttribute('disabled');
}

function pathAnimate(start, stop, frames, speed) {
    let nodes = frames;
    let x = stop;
    let trace = [];

    while (x != start) {
        const path = x.path;
        trace.push(path);
        for (let i = 0; i < Data.length; i++) {
            for (let j = 0; j < Data.length; j++) {
                if (Data[i][j].id == path) {
                    x = Data[i][j];
                }
            }
        }
    }

    for (let i = trace.length - 2; i >= 0; i--) {
        setTimeout(function () {
            document.getElementById(trace[i]).classList.add('path');
        }, ++frames * 20 * speed);
    }

    setTimeout(function () {
        alert(`Element Found! \nPath Distance: ${trace.length - 1}\nNode visited after searching ${nodes} nodes.`);
        enableButtons();
    }, (++frames + 2) * 20 * speed);
}
