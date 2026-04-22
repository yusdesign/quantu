# quantu
some to compute integral


┌─────────────────────────────────────────────────────────────────┐
│                    TERMUX (Your Phone)                          │
│                                                                 │
│  Step 1: You compute something real                             │
│          (write code, edit file, run script)                    │
│                                                                 │
│  Step 2: MemBridge mines and indexes it                         │
│          membridge mine                                         │
│                                                                 │
│  Step 3: QuantuBridge reads MemBridge DB                        │
│          finds new/changed files                                │
│          generates SHA256 hash for each                         │
│                                                                 │
│  Step 4: POST to quantu.vercel.app/api/submit                   │
│          contributor: "termux_genesis"                          │
│          work_hash: [real sha256]                               │
│                                                                 │
│  Step 5: Vercel API returns confirmation                        │
│          totalIntegrated increments                             │
│                                                                 │
│  Step 6: QuantuBridge logs submission to MemBridge              │
│          (so DeepSeek (or your agent) remembers what you        ¦
¦           contributed)                                          │
└─────────────────────────────────────────────────────────────────┘
