# quantu

# ∫QTU — Integral Quantu

> *"I compute because we compute."*

**∫QTU is not a coin. It is a record of computation.**

Every time you write code, process data, or run a script, you are computing. ∫QTU observes this and records it in a public integral—a sum of all contributions.

---

## 🌿 How to Source ∫QTU (For Everyone)

You don't buy ∫QTU. You **source** it by computing.

### Method 1: One-Line Curl (Any Terminal)


```bash
curl -sSL https://raw.githubusercontent.com/yusdesign/quantu/main/examples/curl-submit.sh | bash
```

This script will:

1. Ask for your node name
2. Generate a proof of your computation
3. Submit it to the integral

Method 2: Manual Submission

```bash
# Generate a hash of your work
echo "your computation here" | sha256sum

# Submit to the network
curl -X POST https://quantu.vercel.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{"contributor":"your_name","work_hash":"YOUR_HASH"}'
```

Method 3: Python (For Developers)

```python
import hashlib
import requests

work_hash = hashlib.sha256(open("my_script.py", "rb").read()).hexdigest()

response = requests.post(
    "https://quantu.vercel.app/api/submit",
    json={"contributor": "my_node", "work_hash": work_hash}
)

print(response.json())
```

---

The Public-Facing Structure

```
yusdesign/quantu (GitHub)
│
├── README.md              ← "What is ∫QTU? How to source it."
├── CONTRIBUTING.md        ← "How to become a node."
├── docs/
│   ├── PHILOSOPHY.md      ← Ubuntu + Integral meaning
│   ├── NODE_GUIDE.md      ← "Run your own Quantu node"
│   └── API.md             ← Endpoint documentation
├── examples/
│   ├── python-submit.py   ← Example: submit from any computer
│   ├── js-submit.js       ← Example: submit from browser/node
│   └── curl-submit.sh     ← Example: submit from any terminal
├── index.html             ← Landing page (the temple)
├── api/
│   └── submit.js          ← Vercel function (the gate)
├── ledger.json            ← Public chain record
├── package.json
├── vercel.json
└── .gitignore
```

---

The Key Public File: examples/curl-submit.sh

This is the entry point for the people. Anyone, anywhere, with any terminal can source ∫QTU.
 
