#!/usr/bin/env python3
"""
membridge-bridge.py
Connects MemBridge memory palace to ∫QTU compute network.
Run this in Termux to sync your contributions.
"""

import json
import sqlite3
import hashlib
import time
import urllib.request
import urllib.parse
from pathlib import Path

class QuantuBridge:
    def __init__(self, config_path="quantu-node.json"):
        self.config = self._load_config(config_path)
        self.membridge_db = Path.home() / ".membridge" / "mempalace.db"
        self.node_id = self.config["node"]["id"]
        self.api_url = self.config["node"]["endpoints"]["submit"]
        
    def _load_config(self, path):
        with open(path) as f:
            return json.load(f)
    
    def compute_proof(self, filepath):
        """Generate a proof of computation from a file."""
        with open(filepath, 'rb') as f:
            content = f.read()
        
        # The "work" is: I processed this file
        work_data = f"{filepath}:{len(content)}:{time.time()}"
        return hashlib.sha256(work_data.encode()).hexdigest()
    
    def scan_and_submit(self, wing="quantu"):
        """Scan MemBridge for files in a wing, submit each as computation proof."""
        if not self.membridge_db.exists():
            print("MemBridge database not found. Run 'membridge mine' first.")
            return
        
        conn = sqlite3.connect(str(self.membridge_db))
        cursor = conn.cursor()
        
        # Query files from the specified wing
        cursor.execute("""
            SELECT filepath, wing, room, hall 
            FROM drawers 
            WHERE wing = ?
        """, (wing,))
        
        files = cursor.fetchall()
        print(f"∫ Found {len(files)} files in wing '{wing}'")
        
        for filepath, wing, room, hall in files:
            path = Path(filepath)
            if not path.exists():
                continue
                
            work_hash = self.compute_proof(filepath)
            
            # Submit to ∫QTU
            data = json.dumps({
                "contributor": self.node_id,
                "work_hash": work_hash,
                "metadata": {
                    "wing": wing,
                    "room": room,
                    "hall": hall,
                    "file": str(path.name)
                }
            }).encode('utf-8')
            
            req = urllib.request.Request(
                self.api_url,
                data=data,
                headers={'Content-Type': 'application/json'}
            )
            
            try:
                with urllib.request.urlopen(req) as response:
                    result = json.loads(response.read())
                    print(f"  ∫ Submitted: {path.name} → {result.get('status', 'unknown')}")
            except Exception as e:
                print(f"  ✗ Failed: {path.name} - {e}")
        
        conn.close()
        print(f"∫ Bridge complete. All contributions observed.")
    
    def register_node(self):
        """Register this node with the network registry."""
        registry_url = self.config["node"]["endpoints"]["stats"].replace("/stats", "/node-registry")
        
        data = json.dumps({
            "node_id": self.node_id,
            "name": self.config["node"]["name"],
            "type": self.config["node"]["type"],
            "config": self.config
        }).encode('utf-8')
        
        req = urllib.request.Request(
            registry_url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read())
                print(f"∫ Node registered: {result.get('message')}")
        except Exception as e:
            print(f"Node registry not available: {e}")

if __name__ == "__main__":
    bridge = QuantuBridge()
    bridge.register_node()
    bridge.scan_and_submit(wing="quantu")
