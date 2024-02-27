# banking-system-design
This is a simple server about banking system.

# How to start
- prepare docker on your computer

```
# build the image
docker build -t <image_name> .
```
```
# run the image on background
docker run -p <port>:8100 --name <container_name> -d <image_name>
```
You can see the server running on http://localhost:port