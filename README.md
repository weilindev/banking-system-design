# banking-system-design
This is a simple server about banking system.

# How to start
- clone the repo to your computer
- run the script for dev mode
```
yarn dev
```
- OR build and run
```
yarn start
```
---
# start via docker
```
# pull the image
docker pull cweilin/banking-system-design:latest
```
```
# run the image on background
docker run -p <port>:8100 --name <container_name> -d cweilin/banking-system-design
```
And, you can see the server running on http://localhost:port