// api/submit.js - Using @upstash/redis (Native SDK)
import { Redis } from '@upstash/redis';

// Initialize Redis from environment variables
const redis = Redis.fromEnv();

// Genesis values
const GENESIS = {
    totalIntegrated: 0,
    submissions: 0,
    lastBlock: 'GENESIS',
    message: 'I compute because we compute'
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // GET: Return current ledger state
    if (req.method === 'GET') {
        try {
            const [totalIntegrated, submissions, lastBlock] = await redis.mget(
                'totalIntegrated',
                'submissions', 
                'lastBlock'
            );
            
            return res.status(200).json({
                totalIntegrated: Number(totalIntegrated) || GENESIS.totalIntegrated,
                submissions: Number(submissions) || GENESIS.submissions,
                lastBlock: lastBlock || GENESIS.lastBlock,
                message: GENESIS.message
            });
        } catch (error) {
            return res.status(500).json({ 
                error: 'Redis connection failed', 
                detail: error.message 
            });
        }
    }
    
    // POST: Submit work proof
    if (req.method === 'POST') {
        const { contributor, work_hash } = req.body;
        
        if (!contributor || !work_hash) {
            return res.status(400).json({ 
                error: 'contributor and work_hash required' 
            });
        }
        
        if (!/^[a-f0-9]{64}$/i.test(work_hash)) {
            return res.status(400).json({ 
                error: 'work_hash must be 64-character SHA256 hex' 
            });
        }
        
        try {
            // Atomic increments using Redis MULTI
            const pipeline = redis.multi();
            pipeline.incr('submissions');
            pipeline.incrbyfloat('totalIntegrated', 1.0);
            pipeline.incrbyfloat(`contributor:${contributor}`, 1.0);
            
            const [submissions, totalIntegrated, balance] = await pipeline.exec();
            
            // Store submission in recent list
            const submissionRecord = {
                contributor,
                work_hash: work_hash.slice(0, 12) + '...',
                timestamp: new Date().toISOString(),
                block: submissions
            };
            
            await redis.lpush('submissions:recent', submissionRecord);
            await redis.ltrim('submissions:recent', 0, 99);
            await redis.expire('submissions:recent', 60 * 60 * 24 * 30); // 30 days
            
            // Update last block
            await redis.set('lastBlock', submissions);
            
            return res.status(200).json({
                status: 'integrated',
                message: `Work accepted. You now have ${balance.toFixed(4)} ∫QTU.`,
                contributor,
                work_hash: work_hash.slice(0, 12) + '...',
                block: submissions,
                totalIntegrated: Number(totalIntegrated.toFixed(4))
            });
            
        } catch (error) {
            return res.status(500).json({ 
                error: 'Redis write failed', 
                detail: error.message 
            });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
