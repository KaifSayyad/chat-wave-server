# ChatWave Server

Welcome to the ChatWave Server repository! First Checkout [ChatWave-client](https://github.com/KaifSayyad/chat-wave-client). This project is designed to set up and run a server environment for the ChatWave application using Docker.

## Getting Started

Follow the steps below to get your server up and running:

### Prerequisites

Ensure you have the following installed on your machine:
- [Git](https://git-scm.com/downloads)
- [Nodejs](https://nodejs.org/en/download/package-manager)
- [Docker](https://www.docker.com/products/docker-desktop)


### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/KaifSayyad/chat-wave-server.git
    ```

2. **Navigate to the ChatWave-server folder:**

    ```sh
    cd chat-wave-server
    ```

3. **Run the "server-release.sh" file and specify the frontend version you wish to use, you can go checkout [build-files](https://github.com/KaifSayyad/chat-wave-client-build-files) for frontend versions.**


    **For Mac and Linux users**
        To give permission to run sh file
    ```sh
    chmod u+x server-release.sh
    ```

    ```sh
    ./server-release.sh
    ```

    **For Windows users**
        Open git bash terminal in current directory and Run
    ```sh
    sh server-release.sh
    ```

4. **Create a .env file**
   ```sh
   touch .env
   ```

5. **Paste the below config in .env file**

   ```sh
    SERVER_PORT=8888
    SERVER_HOST=node-c
    NGINX_PORT=9999
    NGINX_HOST=nginx-c
    ```

6. **Run docker-compose**

    ```sh
    docker-compose up
    ```

7. **Server should be up and running now!**
   

### Usage

Once the server is up and running, you can access it at `http://localhost:<NGINX_PORT>`. Replace `<NGINX_PORT>` with the port number specified in your `.env` file (default is 9999).

