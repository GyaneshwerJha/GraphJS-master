let Data;
let visited = [];
let spotted = false;

// Implementing BFS Traversal
export function DepthFirstSearch(arrayData, startNodeId, endNodeId, SPEED) {
    Data = arrayData;
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

    graphTraversal(startNodeId, endNodeId);
    dfsAnimate(visited, endNodeId, SPEED);
}

// Recursion
function graphTraversal(node, stop) {
    if (spotted) {
        // pass
    } else {
        node.visited = true;
        visited.push(node.id);
        for (let i = 0; i < node.neighbors.length; i++) {
            if (!node.neighbors[i].visited) {
                graphTraversal(node.neighbors[i], stop);
            }
        }
        if (node == stop) {
            spotted = true;
        }
    }
}

// Animate
function dfsAnimate(data, stop, speed) {
    let notFound = true;

    for (let i = 1; i < data.length; i++) {
        const x = data[i];
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
