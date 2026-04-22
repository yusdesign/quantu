// Vercel Serverless Function
// Located at: /api/submit.js

// In-memory store for demo (resets on cold start)
// For production: Use GitHub API to commit to ledger.json
let submissions = [];
let totalIntegrated = 0.0;
const CONTRIBUTORS = new Map();

export default async function handler(req, res) {
    // CORS headers for open access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // GET /api/submit?action=stats
    if (req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (url.searchParams.get('action') === 'stats') {
            return res.status(200).json({
                totalIntegrated,
                submissions: submissions.length,
                lastBlock: submissions.length > 0 ? submissions[submissions.length - 1].block : 'GENESIS'
            });
        }
        return res.status(200).json({ message: '∫QTU API - POST to submit work' });
    }
    
    // POST /api/submit
    if (req.method === 'POST') {
        const { contributor, work_hash } = req.body;
        
        if (!contributor || !work_hash) {
            return res.status(400).json({ 
                error: 'Contributor and work_hash are required' 
            });
        }
        
        // Validate SHA256 format (64 hex chars)
        if (!/^[a-f0-9]{64}$/i.test(work_hash)) {
            return res.status(400).json({ 
                error: 'work_hash must be a 64-character SHA256 hex string' 
            });
        }
        
        // Create submission record
        const submission = {
            contributor,
            work_hash,
            timestamp: new Date().toISOString(),
            block: submissions.length + 1
        };
        
        submissions.push(submission);
        
        // Integrate (reward = 1.0 per submission for demo)
        const reward = 1.0;
        const currentBalance = CONTRIBUTORS.get(contributor) || 0;
        CONTRIBUTORS.set(contributor, currentBalance + reward);
        totalIntegrated += reward;
        
        // Log to console (visible in Vercel logs)
        console.log(`∫ ${contributor} integrated. Total: ${totalIntegrated}`);
        
        return res.status(200).json({
            status: 'integrated',
            message: `Work accepted. You now have ${CONTRIBUTORS.get(contributor).toFixed(4)} ∫QTU.`,
            contributor,
            work_hash: work_hash.slice(0, 12) + '...',
            block: submission.block,
            totalIntegrated
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
