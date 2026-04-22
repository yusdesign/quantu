// Vercel Serverless Function
// Located at: /api/stats.js

// Same memory store as submit.js (shared in same deployment)
// For production: read from ledger.json on GitHub

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // This is a simplified version - in production, import shared state
    res.status(200).json({
        totalIntegrated: 0.0,  // Will be populated from submit.js state in real deployment
        nodes: 1,
        genesis: '📱 Phone Node',
        message: 'Stats endpoint ready. Deploy full version for live data.'
    });
}
