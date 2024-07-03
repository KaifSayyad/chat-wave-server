# ChatWave Server

Welcome to the ChatWave Server repository! This project is designed to set up and run a server environment for the ChatWave application using Docker.

## Getting Started

Follow the steps below to get your server up and running:

### Prerequisites

Ensure you have the following installed on your machine:
- [Git](https://git-scm.com/downloads)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

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

4. **Go back to the ChatWave-server folder:**

    ```sh
    cd ..
    ```

5. **Create a `.env` file:**

    ```sh
    touch .env
    ```

6. **Add the following environment variables to the `.env` file:**

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

### Contributing

We welcome contributions! Please fork this repository and submit pull requests.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Contact

For any questions or feedback, please open an issue or contact us at [email@example.com](mailto:email@example.com).

---

Thank you for using ChatWave Server!
