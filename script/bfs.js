let Data;
let Queue = [];
let visited = [];

// Implementing BFS Traversal
export function BreadthFirstSearch(arrayData, startNodeId, endNodeId, SPEED) {
    Data = arrayData;
    Queue = [];
    visited = [];
    let found = false;

    for (let i = 0; i < Data.length; i++) {
        for (let j = 0; j < Data.length; j++) {
            if (Data[i][j].id == startNodeId) {
                startNodeId = Data[i][j];
                found = true;
                break;
            }
            if (found) {
                break;
            }
        }
    }

    Queue.push(startNodeId);
    visited.push(startNodeId);

    while (Queue.length != 0) {
        let x = Queue.shift();
        for (let i = 0; i < x.neighbors.length; i++) {
            if (checkVisitedNode(x.neighbors[i])) {
                Queue.push(x.neighbors[i]);
                visited.push(x.neighbors[i]);
            }
        }
    }

    bfsAnimate(visited, endNodeId, SPEED);
}

// Check Visited Node
function checkVisitedNode(node) {
    return !visited.some((visitedNode) => visitedNode == node);
}

// Function Animate
function bfsAnimate(data, stop, speed) {
    let notFound = true;

    for (let i = 1; i < data.length; i++) {
        const x = data[i].id;
        if (x != stop) {
            setTimeout(function () {
                document.getElementById(x).classList.add('animate');
            }, (i + 1) * 20 * speed);
        } else {
            notFound = false;
            setTimeout(function () {
                alert(`Element Found! \nNode visited after searching ${i - 1} nodes.`);
                enableButtons();
            }, (i + 3) * 20 * speed);
            break;
        }
    }

    if (notFound) {
        setTimeout(function () {
            alert('Element cannot be found!');
            enableButtons();
        }, (data.length + 3) * 20 * speed);
    }
}

function enableButtons() {
    document.getElementById('wall').removeAttribute('disabled');
    document.getElementById('clear').removeAttribute('disabled');
    document.getElementById('size').removeAttribute('disabled');
    document.getElementById('speed').removeAttribute('disabled');
    document.getElementById('start').removeAttribute('disabled');
}
