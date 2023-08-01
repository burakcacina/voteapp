  <h3 align="center">Vote APP</h3>
  <p align="center">
    This is project about Vote Application where you want to create vote, vote for option and display the result of votes. 
  </p>

## About The Project
Application has 2 FE, 1 BE, 2 DBs. </br> 

Table show the application urls that you can integrate with application.

|Applications| URLs  |
|---|---|
| Vote App | http://127.0.0.1:7001
| Vote Result | http://127.0.0.1:7002
| Backend | http://127.0.0.1:8089

## Built With

Application built on by using Microservice architecture.
In this project mainly NodeJS and Typescript are used.
Vote application and result pages communiate with backend by Restful services. Pages designed with Bootstrap.
Backend built on Express.
MongoDB used for save the result of vote options. 
Redis used for create new vote. 
Docker and Kubernetes used for to create images and use container and container orchestration support. 

The project built with by following tools & technologies;

- NodeJS
- NPM
- Express
- Mongo
- Redis
- Typescript
- SCSS (Bootstrap used)
- Docker
- Kubernetes


Docker engine used for kubernetes cluster. </br>
For persistent data on docker and kubernetes volumes are created. Docker volumes created inside docker folder.

## Getting Started

This is a about how you can build and run project locally.
To get a local copy up and run the following steps in below.

### Prerequisites

You need to get install Docker Engine. </br>
or </br>
You need to get install Kubernetes and use any cluster Docker/minikube.

### Installation
```
Run the application by using Docker Compose;
1. Run the command 'docker-compose -p voteapp -f .\docker\docker-compose.yml up -d --build'
2. Check application status by docker ps
3. After installation completed and containers are healthy just redicect vote application url.

Run the application by building images with Docker and Run with Kubernetes
1. Enable Kubernetes support on Docker Desktop or use minikube as a cluster.
2. Run the following code to build images. To build images go to main folder and execute to command ".\docker\docker-build-images.bat"
3. Run the command 'kubectl apply -f .\kubernetes\ --recursive'
4. Wait until the application becomes healthy. Check Status by kubectl get pods -o wide
5. After installation completed just redicect vote application url.
```

### How to use
1. Install and run the application.
2. Redirect to vote application url. (http://127.0.0.1:7001)
3. Create new vote 
4. If you want vote for option.
5. Display the vote result by redirecting vote result application url. (http://127.0.0.1:7002)
