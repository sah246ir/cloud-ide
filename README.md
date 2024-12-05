# Cloud IDE Project - README

Welcome to the Cloud IDE project! This repository hosts a web-based integrated development environment (IDE) that allows users to write, run, and debug code entirely within their browsers. The system is composed of three main components: a React-based frontend, a central server for backend processing, and a Docker-powered sandbox environment for secure and isolated code execution.

---

## **Project Structure**

### 1. **Client**  
The client is a React-based frontend application that provides the user interface for interacting with the IDE. It enables code editing, viewing outputs, and managing files.

### 2. **Server**  
The server is responsible for handling API requests from the client, managing user sessions, and orchestrating Docker containers for code execution. It acts as the central hub connecting the frontend to the docker-based sandbox environments.

### 3. **Docker-Server**  
The docker-server provides a secure and isolated environment for running user-submitted code. Each container is configured to support a specific programming language or runtime environment, ensuring that code execution is safe and scalable. 

---

## **Getting Started**

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- A package manager (e.g., npm or yarn)

---

### Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/cloud-ide.git
   cd cloud-ide
   ```

2. **Install and Start Client:**
   ```bash
   cd client
   npm install
   npm start
   ```

3. **Install and Start Server:**
   ```bash
   cd ../server
   npm install
   npx tsc -b
   node dist/index.js
   ```

4. **Build and Run Python Sandbox Docker-Server:**
   ```bash
   cd ../docker-server
   docker build -f Py-Dockerfile -t code-sandbox/sandbox-py .
   docker run -d --name code-sandbox/sandbox-py code-sandbox/sandbox-py
   ```

5. **Build and Run Javascript Sandbox Docker-Server:**
   ```bash
   cd ../docker-server
   docker build -f Js-Dockerfile -t code-sandbox/sandbox-js .
   docker run -d --name code-sandbox/sandbox-js code-sandbox/sandbox-js
   ```

---

## **Usage**

1. Open the client application in your browser (e.g., `http://localhost:3000`).
2. Use the IDE interface to write and execute code.
3. View the output and debug directly within the browser.

---

## **Contributing**

We welcome contributions! Feel free to submit pull requests or open issues for any bugs, feature requests, or enhancements.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **Future Work**

- Expand support for additional programming languages by adding new Docker configurations.
- Enhance the scalability and performance of the system for high-concurrency environments.
- Implement advanced debugging features.
- Add collaborative tools for multi-user editing and code sharing.

--- 

Thank you for being part of this journey! 🚀