# ChatWave Server

Welcome to the ChatWave Server repository! This project is designed to set up and run a server environment for the ChatWave application using Docker.

## Getting Started

Follow the steps below to get your server up and running:

### Prerequisites

Ensure you have the following installed on your machine:
- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/products/docker-desktop)

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/KaifSayyad/ChatWave-server.git
    ```

2. **Navigate to the ChatWave-server folder:**

    ```sh
    cd ChatWave-server
    ```

3. **Navigate to the server folder:**

    ```sh
    cd server
    ```
4. **To install all the dependencies:**

    ```sh
    npm install
    ```


5. **Go back to the ChatWave-server folder:**

    ```sh
    cd ..
    ```

6. **Create a `.env` file:**

    ```sh
    touch .env
    ```

7. **Open the .env file and paste the following environment variables to the `.env` file:**

    ```env
    SERVER_PORT=8888
    SERVER_HOST=node-c
    NGINX_PORT=9999
    NGINX_HOST=nginx-c
    ```

7. **Build and start the Docker containers:**

    ```sh
    docker-compose up --build
    ```

8. **The server should boot up now.**

### Usage

Once the server is up and running, you can access it at `http://localhost:<NGINX_PORT>`. Replace `<NGINX_PORT>` with the port number specified in your `.env` file (default is 9999).

