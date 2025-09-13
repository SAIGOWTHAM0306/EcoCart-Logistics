# EcoCart Logistics CRM
**Streamlining E-commerce Deliveries with Salesforce Integration**

## Overview
EcoCart Logistics CRM is a comprehensive customer relationship management system designed to address key challenges in e-commerce delivery operations. The system provides real-time visibility, automated workflows, and performance monitoring to enhance customer satisfaction and operational efficiency.

## Key Features

### 🌟 **Customer Portal**
- **Real-time Order Tracking**: Customers can track their deliveries in real-time with detailed status updates
- **Delivery Timeline**: Visual timeline showing order progression from placement to delivery
- **Estimated Delivery Times**: Accurate delivery predictions with automatic updates
- **Mobile-Responsive Design**: Optimized for all devices

### 🚛 **Agent Dashboard**
- **Order Management**: Easy-to-use interface for delivery agents to update order statuses
- **Route Optimization**: Intelligent route suggestions to minimize delivery times
- **Load Balancing**: Visual indicators of current workload vs. capacity
- **Quick Actions**: One-click status updates and emergency contact access
- **Performance Tracking**: Individual performance metrics and ratings

### 📊 **Manager Dashboard**
- **Real-time KPIs**: Key performance indicators with live updates
- **Regional Performance**: Performance monitoring across different regions
- **Agent Management**: Comprehensive view of all delivery agents and their status
- **Automated Assignment**: Intelligent order assignment based on capacity and performance
- **Analytics & Insights**: Daily trends and system alerts

### 🤖 **Automation Features**
- **Smart Agent Assignment**: Automatically assigns orders to optimal agents
- **Load Balancing**: Prevents agent overload through intelligent distribution
- **Performance-Based Routing**: Routes assignments based on agent performance ratings
- **Conflict Resolution**: Automated handling of scheduling conflicts
- **Real-time Notifications**: Instant updates for status changes and alerts

## Technical Architecture

### Backend
- **Node.js + Express.js**: RESTful API server
- **JSON Data Storage**: Lightweight data persistence (easily upgradeable to database)
- **CORS Support**: Cross-origin resource sharing for web app integration
- **UUID Generation**: Unique identifier management

### Frontend
- **Responsive HTML5/CSS3**: Modern, mobile-first design
- **Vanilla JavaScript**: Lightweight, fast client-side interactions
- **Real-time Updates**: Live data synchronization
- **Progressive Enhancement**: Works on all browsers

### API Endpoints
- `GET /api/orders` - Retrieve all orders
- `GET /api/orders/:id` - Get specific order details
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/agents` - Get all delivery agents
- `GET /api/agents/:id/orders` - Get agent's assigned orders
- `GET /api/performance` - Regional performance data
- `GET /api/dashboard/summary` - Dashboard KPIs
- `POST /api/automation/assign-agent` - Auto-assign orders

## Quick Start

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn package manager

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SAIGOWTHAM0306/EcoCart-Logistics.git
   cd EcoCart-Logistics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Access the application:
   - **Customer Portal**: http://localhost:3000
   - **Agent Dashboard**: http://localhost:3000/agent
   - **Manager Dashboard**: http://localhost:3000/manager

## Usage

### For Customers
1. Visit the Customer Portal
2. Enter your Order ID (e.g., ORD001)
3. Click "Track Order" to view real-time status
4. Monitor delivery progress through the visual timeline

### For Delivery Agents
1. Access the Agent Dashboard
2. Select your agent profile from the dropdown
3. View assigned orders and current workload
4. Update order statuses as deliveries progress
5. Use route optimization for efficient delivery planning

### For Managers
1. Open the Manager Dashboard
2. Monitor KPIs and regional performance
3. View agent workloads and performance metrics
4. Use automation panel for intelligent order assignment
5. Access analytics for data-driven decision making

## Problem Statement Addressed

### Original Challenges:
- ❌ Customers lack real-time delivery visibility
- ❌ Agents struggle with status updates
- ❌ Managers can't monitor performance effectively
- ❌ Manual processes cause delays and conflicts
- ❌ Poor customer experience due to lack of automation

### EcoCart Solutions:
- ✅ **Real-time Tracking**: Complete visibility into order status and location
- ✅ **Easy Status Updates**: One-click updates for delivery agents
- ✅ **Performance Monitoring**: Comprehensive dashboards for managers
- ✅ **Intelligent Automation**: Smart assignment and conflict resolution
- ✅ **Enhanced Customer Experience**: Proactive notifications and accurate ETAs

## Salesforce Integration Ready

The system is designed with Salesforce integration in mind:
- RESTful API endpoints compatible with Salesforce Connect
- Data models aligned with Salesforce objects
- Webhook-ready architecture for real-time sync
- OAuth 2.0 authentication framework (ready to implement)
- Custom field mapping for Salesforce synchronization

## Future Enhancements

1. **Database Integration**: PostgreSQL/MongoDB for scalable data storage
2. **Real-time WebSockets**: Live updates without page refresh
3. **Mobile Apps**: Native iOS/Android applications
4. **Machine Learning**: Predictive delivery time algorithms
5. **Advanced Analytics**: Business intelligence dashboards
6. **Multi-language Support**: Internationalization features
7. **API Rate Limiting**: Enterprise-grade security and throttling

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact:
- **Email**: support@ecocart-logistics.com
- **Documentation**: [Wiki](https://github.com/SAIGOWTHAM0306/EcoCart-Logistics/wiki)
- **Issues**: [GitHub Issues](https://github.com/SAIGOWTHAM0306/EcoCart-Logistics/issues)

---

**EcoCart Logistics CRM** - Transforming e-commerce delivery through intelligent automation and real-time visibility. 🌱
