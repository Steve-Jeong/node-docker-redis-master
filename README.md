# node-docker-redis

node-redis : ^3.1.2사용
redis docker images : 6.2사용

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

Postman에서 http://localhost:8083/api/v1/users/Antonette를 GET하면 첫번째 호출에는 수백ms가 걸리지만, 두번째 부터는 수ms가 걸린다. 캐쉬서버에서 데이타를 가져오기 때문이다.

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

node-redis 3.1.2기준으로 createClient를 다음과 같이 해야 node 컨테이너에서 redis컨테이너로 접속이 된다.   
const client = redis.createClient('redis://172.17.0.2:6379')   

아래와 같이 하면 redis컨테이너의 주소를 redis protocol로 호출한다.   
const client = redis.createClient('redis://redis:6379')   

docker-compose.yml에서  
redis 컨테이너에 연결하기 위한 필수 명령은 아래이다.
```docker   
    links:
      - redis   # 이것이 있어야 redis에 접속 가능
```

redis컨테이너에서 expose는 없어도 된다.   
```
expose:
      - 6379
```
       
network-mode는 없어도 redis 컨테이너는 연결 된다.
```
network-mode값에 따른, 아래 node-redis의 메시지   
```javascript
client.on('connect', () => console.log(`Redis is connected on port ${REDIS_PORT}`))
```
network-mode : bridge일 경우
Redis is connected on port tcp://172.17.0.2:6379

network-mode가 없을 경우
Redis is connected on port 6379


node-redis 4.6.5를 이용하여 redis 컨테이너 7.0.10에 연결 성공
-------------------------------------------------------------

node-redis 4.6.5는 module을 이용하므로,   
package.json에 "type" : "module",을 추가

연결부분을 다음과 같이 수정
```javascript
const client = redis.createClient({url:REDIS})

await client.connect();
```

redis함수를 async-await로 수정
```javascript
    const cache_data = await client.GET(username)

    await client.SETEX(username, 1440, JSON.stringify(api.data))
```