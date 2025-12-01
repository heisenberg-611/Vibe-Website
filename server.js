const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'robusphere_secret_key'; // In production, use env var

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files from current directory

// In-memory data storage
let viewersCount = 1240; // Starting count for demo
const users = [
    { username: 'admin', password: 'admin123', role: 'admin' } // Default Admin
]; 
const timelineData = [
    {
        id: 1,
        time: "1st Hour",
        title: "Project Showcase",
        description: "Witness the innovation as teams display their projects.",
        icon: "fas fa-project-diagram",
        side: "left",
        order: 1
    },
    {
        id: 2,
        time: "2nd Hour",
        title: "Line Follower Race",
        description: "High-speed precision robotics in action.",
        icon: "fas fa-car-side",
        side: "right",
        order: 2
    },
    {
        id: 3,
        time: "3rd Hour",
        title: "Prompt Competition",
        description: "The main event: Battle of the Prompt Engineers.",
        icon: "fas fa-terminal",
        side: "left",
        order: 3
    },
    {
        id: 4,
        time: "Final Hour",
        title: "Judging & Awards",
        description: "Celebrating the champions of ROBUSPHERE.",
        icon: "fas fa-trophy",
        side: "right",
        order: 4
    }
];

// --- Routes ---

// 1. Viewers Count
app.get('/api/viewers', (req, res) => {
    res.json({ count: viewersCount });
});

app.post('/api/viewers', (req, res) => {
    viewersCount++;
    res.json({ count: viewersCount });
});

// 2. Authentication
app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body; // Allow role for admin creation (in real app, restrict this)
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
    }
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    // Default to 'user' if not specified or if trying to be sneaky (unless we allow it for this demo)
    // For this demo, we'll allow creating admins via API if 'role' is passed, 
    // but normally this should be protected.
    const newRole = role === 'admin' ? 'admin' : 'user';
    
    users.push({ username, password, role: newRole, joined: new Date().toISOString() });
    res.json({ message: 'Registration successful' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, username, role: user.role });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// 3. User & Admin APIs
// Middleware to verify token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, SECRET_KEY, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
};

app.get('/api/profile', verifyToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (user) {
        res.json({ username: user.username, role: user.role, joined: user.joined || 'N/A' });
    } else {
        res.sendStatus(404);
    }
});

app.get('/api/users', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    // Return users without passwords
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
});

app.post('/api/users', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
    if (users.find(u => u.username === username)) return res.status(400).json({ message: 'User exists' });
    
    users.push({ username, password, role: role || 'user', joined: new Date().toISOString() });
    res.json({ message: 'User added' });
});

app.delete('/api/users/:username', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { username } = req.params;
    const index = users.findIndex(u => u.username === username);
    if (index !== -1) {
        users.splice(index, 1);
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// 4. Timeline Search & Sort
app.get('/api/timeline', (req, res) => {
    const { search, sort } = req.query;
    let results = [...timelineData];

    // Search
    if (search) {
        const lowerSearch = search.toLowerCase();
        results = results.filter(item => 
            item.title.toLowerCase().includes(lowerSearch) || 
            item.description.toLowerCase().includes(lowerSearch)
        );
    }

    // Sort (by title for demo, since time is hard to sort without real dates)
    if (sort === 'asc') {
        results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'desc') {
        results.sort((a, b) => b.title.localeCompare(a.title));
    } else {
        // Default sort by order
        results.sort((a, b) => a.order - b.order);
    }

    res.json(results);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
