export class Graph {
  adjacencyList: { [key: string]: string[] | undefined };

  constructor() {
    // The adjacency list.
    this.adjacencyList = {};
  }

  // Add a vertex to the graph.
  addVertex(vertexId: string) {
    const vertexExists = this.adjacencyList[vertexId];
    if (!vertexExists) {
      // Add the vertex to the adjacency list.
      this.adjacencyList[vertexId] = [];
    }
  }

  // Add an edge between vertex1 and vertex2.
  addEdge(vertexId1: string, vertexId2: string) {
    const list1 = this.adjacencyList[vertexId1];
    const list2 = this.adjacencyList[vertexId2];

    if (list1 && list2) {
      // Push vertex2 to the adjacency list of vertex1.
      if (!this.adjacencyList[vertexId1]!.includes(vertexId2)) this.adjacencyList[vertexId1]!.push(vertexId2);
      if (!this.adjacencyList[vertexId2]!.includes(vertexId1)) this.adjacencyList[vertexId2]!.push(vertexId1);
    } else {
      throw new Error(`Vertex not added 1: ${list1 ? "" : vertexId1} 2: ${list2 ? "" : vertexId2}`);
    }
  }

  // Remove an edge between vertex1 and vertex2.
  //   removeEdge(vertexId1: string, vertexId2: string) {
  //     // Filter out vertex2 from the adjacency list of vertex1.
  //     this.adjacencyList[vertexId1] = this.adjacencyList[vertexId1].filter((v) => v !== vertexId2);
  //     // Filter out vertex1 from the adjacency list of vertex2.
  //     this.adjacencyList[vertexId2] = this.adjacencyList[vertexId2].filter((v) => v !== vertexId1);
  //   }

  //   // Remove a vertex from the graph.
  //   removeVertex(vertex: string) {
  //     // While the adjacency list of vertex is not empty:
  //     while (this.adjacencyList[vertex].length) {
  //       // Pop the last element from the adjacency list of vertex.
  //       const adjacentVertex = this.adjacencyList[vertex].pop();
  //       if (adjacentVertex) {
  //         // Remove the edge between vertex and adjacentVertex.
  //         this.removeEdge(vertex, adjacentVertex);
  //       }
  //     }
  //     // Delete the adjacency list of vertex.
  //     delete this.adjacencyList[vertex];
  //   }

  // Print the adjacency list
  //   printAdjacencyList() {
  //     for (const vertex in this.adjacencyList) {
  //       console.log(`${vertex} -> ${this.adjacencyList[vertex].join(", ")}`);
  //     }
  //   }
}

export function depthFirstTraversal(graph: Graph, startingVertex: string) {
  // If the starting vertex is not in the graph, return an empty array.
  if (!graph.adjacencyList[startingVertex]) {
    return [];
  }

  //  Create an empty object to store visited vertices.
  const visited: { [key: string]: boolean } = {};
  // Create a new Stack instance.
  const stack = new Stack();
  // Create an empty array to store the result.
  const result: string[] = [];

  // Push the starting vertex onto the stack.
  stack.push(startingVertex);

  // Mark the starting vertex as visited.
  visited[startingVertex] = true;

  // While the stack is not empty:
  while (!stack.isEmpty()) {
    // Pop a vertex from the stack.
    const currentVertex = stack.pop();

    if (currentVertex) {
      // Add the vertex to the result.
      result.push(currentVertex);
      // For each neighbor of the vertex:
      graph.adjacencyList[currentVertex]?.forEach((neighbor: string) => {
        // If the neighbor has not been visited:
        if (!visited[neighbor]) {
          // Mark it as visited.
          visited[neighbor] = true;
          // Push it onto the stack.
          stack.push(neighbor);
        }
      });
    }
  }

  // Return the result.
  return result;
}

export function depthFirstTraversalBranches(graph: Graph, startingVertex: string): { [key: string]: string[] } {
  // If the starting vertex is not in the graph, return an empty array.
  if (!graph.adjacencyList[startingVertex]) {
    return {};
  }

  //  Create an empty object to store visited vertices.
  const visited: { [key: string]: boolean } = {};
  // Create a new Stack instance.
  const stack = new Stack();

  const results: { [key: string]: string[] } = {};

  // Push the starting vertex onto the stack.
  stack.push(startingVertex);

  // Mark the starting vertex as visited.
  visited[startingVertex] = true;

  let i = 1;
  results[`result${i}`] = [];

  // While the stack is not empty:
  while (!stack.isEmpty()) {
    // Pop a vertex from the stack.
    const currentVertex = stack.pop();

    if (currentVertex) {
      // Add the vertex to the result.
      results[`result${i}`].push(currentVertex);

      const neighbours = graph.adjacencyList[currentVertex];
      if (neighbours?.every((n) => visited[n])) {
        i++;
        results[`result${i}`] = [];
      } else {
        // For each neighbor of the vertex:
        neighbours?.forEach((neighbour: string) => {
          // If the neighbor has not been visited:
          if (!visited[neighbour]) {
            // Mark it as visited.
            visited[neighbour] = true;
            // Push it onto the stack.
            stack.push(neighbour);
          }
        });
      }
    }
  }

  // Filter edge connectors
  for (const key in results) {
    results[key] = results[key].filter((str) => !str.includes("-") && !str.includes("7"));
  }

  // Return the result.
  return results;
}

class Stack {
  maxSize: number;
  stack: string[];
  top: number;

  constructor() {
    this.maxSize = 100;
    this.stack = [];
    this.top = -1;
  }

  push(value: string) {
    if (this.isFull()) {
      return false;
    }
    this.top++;
    this.stack[this.top] = value;
    return true;
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }
    this.top--;

    return this.stack.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.stack[this.top];
  }

  isEmpty() {
    return this.top === -1;
  }

  isFull() {
    return this.top === this.maxSize - 1;
  }
}
