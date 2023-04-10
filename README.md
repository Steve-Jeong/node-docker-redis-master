# node-docker-redis

How to create a Node JS API with Docker and Redis Server
--------------------------------------------------------
https://www.youtube.com/watch?v=mGJ7S2rJ7BY&ab_channel=YafizAbraham%28TechWorld%29

<br>
We will create `Dockerfile` and `docker-compose.yml` files purely hands-on from sratch to run Node API and cache the content with Redis.

<br>

## Usage
_note: first time it will load data from server and second or more times will be loaded from cache until its expired._


- http://localhost:8080/api/v1/users/Bret
- http://localhost:8080/api/v1/users/Antonette
- http://localhost:8080/api/v1/users/Samantha
- http://localhost:8080/api/v1/users/Karianne
- http://localhost:8080/api/v1/users/Kamren
- [Get list of Usernames](https://jsonplaceholder.typicode.com/users)

위의 링크를 처음 누를때는 서버에서 데이타를 가져오지만, 이 데이타가 레디스에 저장되기 때문에 두번째 이후는 cache된 값을 가져온다.
"message": "Retrieved Bret's data from the server",
"message": "Retrieved Bret's data from the cache",

```sh
docker ps -a # list of all running/stopped/exited containers
docker images -a # list of images
docker volume ls # list of volumes
docker network ls # list of networks
docker network inspect bridge # inepect about bridge network

docker-compose up -d # start container at background
docker-compose down -v # shutdown/remove container with volumes

# check logs to see error, if containers don't work
docker logs redis
docker logs api

# inspect docker bridge network
docker network inspect bridge

docker rmi -f $(docker images -aq) # remove all images if linked to stopped/removed containers
docker system prune -a --volumes # cleanup/remove everything (images, containers, volumes & etc) in one go
```

## Useful links
- [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#from)
- [docker-compose v3 reference](https://docs.docker.com/compose/compose-file/compose-file-v3/)
- [node image](https://hub.docker.com/_/node?tab=tags)
- [redis image](https://hub.docker.com/_/redis?tab=tags)
