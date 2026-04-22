// /api/node-registry.js
// Tracks active nodes in the ∫QTU network

const NODES = new Map();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    // GET: List active nodes
    if (req.method === 'GET') {
        const activeNodes = Array.from(NODES.entries()).map(([id, data]) => ({
            id,
            name: data.name,
            type: data.type,
            last_seen: data.last_seen,
            contributions: data.contributions || 0
        }));
        
        return res.status(200).json({
            count: activeNodes.length,
            nodes: activeNodes,
            genesis: {
                id: 'genesis-phone-01',
                name: '∫ Genesis Phone',
                type: 'mobile',
                status: 'eternal'
            }
        });
    }
    
    // POST: Register a node
    if (req.method === 'POST') {
        const { node_id, name, type, config } = req.body;
        
        if (!node_id) {
            return res.status(400).json({ error: 'node_id required' });
        }
        
        NODES.set(node_id, {
            name: name || node_id,
            type: type || 'unknown',
            config: config || {},
            registered: new Date().toISOString(),
            last_seen: new Date().toISOString(),
            contributions: 0
        });
        
        console.log(`∫ Node registered: ${node_id} (${type})`);
        
        return res.status(200).json({
            status: 'registered',
            node_id,
            message: `Node ${node_id} is now part of the integral.`,
            network_size: NODES.size
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
