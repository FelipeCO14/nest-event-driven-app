# Contents

Event-driven sample application using **NestJS**, **RabbitMQ** and **MongoDB**

![Architecture](./docs/architecture.png)

# Run the containers

```bash
docker compose up --build -V
```

# Stop the containers

```bash
docker compose down -v
```

# List the registered available queues on RabbitMQ

run the following command inside the RabbitMQ container

```bash
rabbitmqctl list_queues
```
