// Dummy database service to simulate real-time data
import { generateRandomData } from './dataGenerator';

class DatabaseService {
  constructor() {
    this.data = {};
    this.lastRefresh = new Date();
    this.refreshInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.subscribers = [];
    this.initialized = false;
  }

  // Initialize the database with initial data
  initialize() {
    if (!this.initialized) {
      this.data = generateRandomData();
      this.lastRefresh = new Date();
      this.initialized = true;
      
      // Set up automatic refresh every 5 minutes
      this.refreshTimer = setInterval(() => {
        this.refreshData();
      }, this.refreshInterval);
    }
    return this.data;
  }

  // Get the current data
  getData() {
    if (!this.initialized) {
      this.initialize();
    }
    return this.data;
  }

  // Get the last refresh time
  getLastRefreshTime() {
    return this.lastRefresh;
  }

  // Refresh the data with new random values
  refreshData() {
    this.data = generateRandomData();
    this.lastRefresh = new Date();
    
    // Notify all subscribers about the data update
    this.notifySubscribers();
    
    return this.data;
  }

  // Subscribe to data updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers about data updates
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      callback(this.data, this.lastRefresh);
    });
  }

  // Clean up resources when no longer needed
  cleanup() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    this.subscribers = [];
  }
}

// Create a singleton instance
const databaseService = new DatabaseService();

export default databaseService;
