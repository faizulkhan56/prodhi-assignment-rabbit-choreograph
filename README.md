

# Choreography-Based Saga with RabbitMQ

This project implements a **Choreography Saga Pattern** using **RabbitMQ** to enable event-driven communication between **Order Service, Inventory Service, and Notification Service** in a microservices architecture.

---

## 📌 Overview
### Flow of Events
1. A **User** places an order via **Order Service (`POST /order`)**.
2. **Order Service** publishes an `OrderCreated` event to **RabbitMQ (`order_exchange`)**.
3. **RabbitMQ routes the event to `inventory_queue`**, where **Inventory Service** listens.
4. **Inventory Service** updates inventory and publishes `InventoryUpdated` to **`inventory_exchange`**.
5. **RabbitMQ routes `InventoryUpdated` event to `notification_queue`**, where **Notification Service** listens.
6. **Notification Service** logs a notification and acknowledges the event.

---

## 📁 Project Structure
```
saga-choreography/
│── order-service/
│   ├── src/
│   │   ├── server.js       # Exposes API to place orders
│   │   ├── producer.js     # Publishes OrderCreated event to RabbitMQ
│   ├── package.json
│   ├── Dockerfile
│── inventory-service/
│   ├── src/
│   │   ├── consumer.js     # Consumes OrderCreated, updates inventory
│   │   ├── producer.js     # Publishes InventoryUpdated event
│   ├── package.json
│   ├── Dockerfile
│── notification-service/
│   ├── src/
│   │   ├── consumer.js     # Listens for InventoryUpdated, logs notification
│   ├── package.json
│   ├── Dockerfile
│── docker-compose.yml       # Manages RabbitMQ and all services
│── README.md                # Project documentation
```

---

## ⚙️ Technologies Used
- **Node.js** (Backend Services)
- **Express.js** (Order API)
- **RabbitMQ** (Event Bus)
- **Docker & Docker Compose** (Containerization)

---

## 🚀 Setup & Deployment
### 1️⃣ Prerequisites
Ensure you have:
- **Docker Desktop** installed and running.
- **Postman or cURL** for API testing.

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/faizulkhan56/prodhi-assignment-rabbit-choreograph.git
cd saga-choreography
```

### 3️⃣ Start Services with Docker Compose
```sh
docker-compose up --build
```

### 4️⃣ Check RabbitMQ UI
- Open **RabbitMQ Management Console**:
  ```
  http://localhost:15672
  ```
- **Login Credentials:**
  ```
  Username: guest
  Password: guest
  ```
- Navigate to **Exchanges** & **Queues** to verify message flow.

---

## 🛠 API Usage
### 1️⃣ Place an Order (Order Service)
**Request:**
```sh
POST http://localhost:3001/order
Content-Type: application/json

{
  "orderId": "123",
  "product": "Laptop",
  "quantity": 1
}
```
**Response:**
```json
{
  "message": "Order created",
  "orderId": "123"
}
```

### 2️⃣ Verify Logs for Event Flow
```sh
docker logs -f order-service
docker logs -f inventory-service
docker logs -f notification-service
```
**Expected Logs:**
```
[x] Order Created Event Published { orderId: '123', product: 'Laptop', quantity: 1 }
[x] Inventory Updated for Order 123
[x] Inventory Updated Event Published { orderId: '123', product: 'Laptop', quantity: 1 }
[x] Notification Sent: Order 123 is updated in inventory.
```

---

## 🔄 How the System Works
```
User (Postman)
  ⬇
Order Service → Publishes `OrderCreated` → `order_exchange`
  ⬇
RabbitMQ Routes Message → `inventory_queue`
  ⬇
Inventory Service → Updates Inventory → Publishes `InventoryUpdated` → `inventory_exchange`
  ⬇
RabbitMQ Routes Message → `notification_queue`
  ⬇
Notification Service → Logs Notification
```

---

## 🛑 Stopping Services
```sh
docker-compose down
```
To remove volumes (including RabbitMQ data):
```sh
docker-compose down -v
```

---

## 🛠 Troubleshooting
### ❓ RabbitMQ Connection Error (`ECONNREFUSED`)
If Inventory/Notification Service fails to connect to RabbitMQ:
```sh
docker-compose restart inventory-service notification-service
```
Ensure **RabbitMQ is running**:
```sh
docker ps
```

### ❓ Git Push Error: `src refspec main does not match any`
Fix by running:
```sh
git checkout -b main
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

## 💡 Future Enhancements
- Add **Database Integration** for persisting orders and inventory.
- Implement **Retry Mechanisms** for failed RabbitMQ messages.
- Use **Kubernetes** for scaling services.

---

## 👨‍💻 Author
- **Faizul Khan** ([GitHub](https://github.com/faizulkhan56))

🚀 **Now your event-driven microservices system is fully functional! 🎉**

