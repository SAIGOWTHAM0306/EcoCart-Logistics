const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');
const PERFORMANCE_FILE = path.join(DATA_DIR, 'performance.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
const initializeDataFiles = () => {
    if (!fs.existsSync(ORDERS_FILE)) {
        const sampleOrders = [
            {
                id: 'ORD001',
                customerId: 'CUST001',
                customerName: 'John Doe',
                customerEmail: 'john.doe@email.com',
                customerPhone: '+1-555-0123',
                items: ['Laptop', 'Mouse', 'Keyboard'],
                totalValue: 1299.99,
                status: 'in_transit',
                estimatedDelivery: '2024-01-15T14:00:00Z',
                currentLocation: 'New York Distribution Center',
                agentId: 'AGT001',
                region: 'Northeast',
                trackingHistory: [
                    { timestamp: '2024-01-10T09:00:00Z', status: 'order_placed', location: 'Warehouse' },
                    { timestamp: '2024-01-11T11:30:00Z', status: 'picked_up', location: 'Warehouse' },
                    { timestamp: '2024-01-12T08:15:00Z', status: 'in_transit', location: 'New York Distribution Center' }
                ]
            },
            {
                id: 'ORD002',
                customerId: 'CUST002',
                customerName: 'Jane Smith',
                customerEmail: 'jane.smith@email.com',
                customerPhone: '+1-555-0456',
                items: ['Smartphone', 'Case', 'Charger'],
                totalValue: 899.99,
                status: 'delivered',
                estimatedDelivery: '2024-01-12T16:00:00Z',
                actualDelivery: '2024-01-12T15:45:00Z',
                currentLocation: 'Customer Address',
                agentId: 'AGT002',
                region: 'Southwest',
                trackingHistory: [
                    { timestamp: '2024-01-08T10:00:00Z', status: 'order_placed', location: 'Warehouse' },
                    { timestamp: '2024-01-09T14:20:00Z', status: 'picked_up', location: 'Warehouse' },
                    { timestamp: '2024-01-10T16:30:00Z', status: 'in_transit', location: 'Phoenix Distribution Center' },
                    { timestamp: '2024-01-12T15:45:00Z', status: 'delivered', location: 'Customer Address' }
                ]
            }
        ];
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(sampleOrders, null, 2));
    }

    if (!fs.existsSync(AGENTS_FILE)) {
        const sampleAgents = [
            {
                id: 'AGT001',
                name: 'Mike Johnson',
                email: 'mike.johnson@ecocart.com',
                phone: '+1-555-1001',
                region: 'Northeast',
                status: 'active',
                currentLoad: 5,
                maxCapacity: 10,
                performanceRating: 4.8,
                totalDeliveries: 1247
            },
            {
                id: 'AGT002',
                name: 'Sarah Wilson',
                email: 'sarah.wilson@ecocart.com',
                phone: '+1-555-1002',
                region: 'Southwest',
                status: 'active',
                currentLoad: 3,
                maxCapacity: 8,
                performanceRating: 4.9,
                totalDeliveries: 892
            },
            {
                id: 'AGT003',
                name: 'David Brown',
                email: 'david.brown@ecocart.com',
                phone: '+1-555-1003',
                region: 'Midwest',
                status: 'active',
                currentLoad: 7,
                maxCapacity: 12,
                performanceRating: 4.7,
                totalDeliveries: 1056
            }
        ];
        fs.writeFileSync(AGENTS_FILE, JSON.stringify(sampleAgents, null, 2));
    }

    if (!fs.existsSync(PERFORMANCE_FILE)) {
        const samplePerformance = {
            regions: {
                'Northeast': {
                    totalOrders: 1247,
                    delivered: 1198,
                    pending: 49,
                    avgDeliveryTime: 2.3,
                    customerSatisfaction: 4.6
                },
                'Southwest': {
                    totalOrders: 892,
                    delivered: 864,
                    pending: 28,
                    avgDeliveryTime: 2.1,
                    customerSatisfaction: 4.8
                },
                'Midwest': {
                    totalOrders: 1056,
                    delivered: 1015,
                    pending: 41,
                    avgDeliveryTime: 2.5,
                    customerSatisfaction: 4.5
                }
            },
            dailyMetrics: [
                { date: '2024-01-08', orders: 45, delivered: 42, avgTime: 2.2 },
                { date: '2024-01-09', orders: 52, delivered: 48, avgTime: 2.4 },
                { date: '2024-01-10', orders: 38, delivered: 36, avgTime: 2.1 },
                { date: '2024-01-11', orders: 61, delivered: 58, avgTime: 2.3 },
                { date: '2024-01-12', orders: 49, delivered: 47, avgTime: 2.0 }
            ]
        };
        fs.writeFileSync(PERFORMANCE_FILE, JSON.stringify(samplePerformance, null, 2));
    }
};

// Helper functions
const readDataFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
};

const writeDataFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
};

// API Routes

// Customer tracking endpoints
app.get('/api/orders/:orderId', (req, res) => {
    const orders = readDataFile(ORDERS_FILE);
    const order = orders.find(o => o.id === req.params.orderId);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
});

app.get('/api/orders', (req, res) => {
    const orders = readDataFile(ORDERS_FILE);
    res.json(orders);
});

// Agent endpoints
app.get('/api/agents', (req, res) => {
    const agents = readDataFile(AGENTS_FILE);
    res.json(agents);
});

app.get('/api/agents/:agentId/orders', (req, res) => {
    const orders = readDataFile(ORDERS_FILE);
    const agentOrders = orders.filter(o => o.agentId === req.params.agentId);
    res.json(agentOrders);
});

app.put('/api/orders/:orderId/status', (req, res) => {
    const { status, location, notes } = req.body;
    const orders = readDataFile(ORDERS_FILE);
    const orderIndex = orders.findIndex(o => o.id === req.params.orderId);
    
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orders[orderIndex];
    order.status = status;
    order.currentLocation = location;
    
    // Add to tracking history
    order.trackingHistory.push({
        timestamp: new Date().toISOString(),
        status: status,
        location: location,
        notes: notes || ''
    });
    
    // Set actual delivery time if delivered
    if (status === 'delivered') {
        order.actualDelivery = new Date().toISOString();
    }
    
    if (writeDataFile(ORDERS_FILE, orders)) {
        res.json({ success: true, order: order });
    } else {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Manager dashboard endpoints
app.get('/api/performance', (req, res) => {
    const performance = readDataFile(PERFORMANCE_FILE);
    res.json(performance);
});

app.get('/api/dashboard/summary', (req, res) => {
    const orders = readDataFile(ORDERS_FILE);
    const agents = readDataFile(AGENTS_FILE);
    const performance = readDataFile(PERFORMANCE_FILE);
    
    const summary = {
        totalOrders: orders.length,
        activeOrders: orders.filter(o => ['pending', 'picked_up', 'in_transit'].includes(o.status)).length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'active').length,
        regions: Object.keys(performance.regions || {}),
        avgDeliveryTime: 2.3,
        customerSatisfaction: 4.6
    };
    
    res.json(summary);
});

// Automation endpoints
app.post('/api/automation/assign-agent', (req, res) => {
    const { orderId, region } = req.body;
    const orders = readDataFile(ORDERS_FILE);
    const agents = readDataFile(AGENTS_FILE);
    
    // Find order
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    // Find best available agent in region
    const availableAgents = agents.filter(a => 
        a.region === region && 
        a.status === 'active' && 
        a.currentLoad < a.maxCapacity
    );
    
    if (availableAgents.length === 0) {
        return res.status(400).json({ error: 'No available agents in region' });
    }
    
    // Select agent with lowest current load and highest rating
    const bestAgent = availableAgents.reduce((best, current) => {
        const bestScore = (best.maxCapacity - best.currentLoad) * best.performanceRating;
        const currentScore = (current.maxCapacity - current.currentLoad) * current.performanceRating;
        return currentScore > bestScore ? current : best;
    });
    
    // Assign agent to order
    orders[orderIndex].agentId = bestAgent.id;
    bestAgent.currentLoad += 1;
    
    // Update files
    writeDataFile(ORDERS_FILE, orders);
    writeDataFile(AGENTS_FILE, agents);
    
    res.json({ 
        success: true, 
        assignedAgent: bestAgent,
        order: orders[orderIndex]
    });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/agent', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agent.html'));
});

app.get('/manager', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manager.html'));
});

// Initialize data and start server
initializeDataFiles();

app.listen(PORT, () => {
    console.log(`EcoCart Logistics CRM Server running on port ${PORT}`);
    console.log(`Customer Portal: http://localhost:${PORT}`);
    console.log(`Agent Dashboard: http://localhost:${PORT}/agent`);
    console.log(`Manager Dashboard: http://localhost:${PORT}/manager`);
});

module.exports = app;