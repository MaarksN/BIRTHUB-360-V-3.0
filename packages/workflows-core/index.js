class WorkflowDAG {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }

    addNode(id, type, config = {}) {
        if (!['AgentExecute', 'Condition', 'Delay'].includes(type)) {
            throw new Error(`Invalid node type: ${type}`);
        }
        this.nodes.set(id, { id, type, config });
    }

    addEdge(fromId, toId, condition = null) {
        if (!this.nodes.has(fromId)) throw new Error(`Node ${fromId} does not exist`);
        if (!this.nodes.has(toId)) throw new Error(`Node ${toId} does not exist`);

        const nodeEdges = this.edges.get(fromId) || [];
        nodeEdges.push({ toId, condition });
        this.edges.set(fromId, nodeEdges);
    }

    getInitialNodes() {
        const incomingEdgesCount = new Map();
        for (const nodeId of this.nodes.keys()) {
            incomingEdgesCount.set(nodeId, 0);
        }

        for (const edges of this.edges.values()) {
            for (const edge of edges) {
                incomingEdgesCount.set(edge.toId, (incomingEdgesCount.get(edge.toId) || 0) + 1);
            }
        }

        const initialNodes = [];
        for (const [nodeId, count] of incomingEdgesCount.entries()) {
            if (count === 0) {
                initialNodes.push(this.nodes.get(nodeId));
            }
        }
        return initialNodes;
    }

    getNextNodes(nodeId, context = {}) {
        const edges = this.edges.get(nodeId) || [];
        return edges.filter(edge => {
            if (!edge.condition) return true;
            // Simple string condition evaluation for now
            return typeof edge.condition === 'function' ? edge.condition(context) : true;
        }).map(edge => this.nodes.get(edge.toId));
    }
}

export { WorkflowDAG };
