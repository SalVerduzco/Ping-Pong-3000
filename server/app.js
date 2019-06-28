const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const fetch = require('node-fetch')
const redis = require('redis')

const port = process.env.PORT || 4001

// access redis mini-database
const client = redis.createClient()

const app = express()

const server = http.createServer(app)

const io = socketio(server)

const playerRedisKey = 'players_'

const updateList = async () => {
    const playersObj = {"players" : [ ] }

    const data = await client.hgetall(playerRedisKey, (err, players) => {

		if(!players) {
            console.log('Using cache')

            for(let player in players) {
                let pPlayer = JSON.parse(players[player])
                playersObj.players.push({"name":pPlayer['name'], "rank":pPlayer['rank']})
            }
            return playersObj
		} else {
			const fetchPlayers = async () => {

				const playersObj = {"players":[]}
				const res = await fetch('http://localhost:8080/getPlayers')
					.then(response => response.json())
					.then(players => { 
						players.players.forEach(e => {
							playersObj.players.push( { "name": e.name, "rank": e.rank} )            
							client.hset(playerRedisKey , e.name, JSON.stringify(e) )
						})
						return playersObj
                    })
                    return res
            }
            fetchPlayers().then(x=> console.log('logging after fetchPlayer ',x))

		}
    } )
    return data
}


io.on('connection', socket => {
    console.log('New client connected')
    updateList()
    socket.on('disconnect', () => console.log('Client disconnected'))
})



client.on('error', (err) => {
    console.log('Error ' + err)
})



server.listen(port, () => {
    console.log(`Socket listening on port ${port}`)
})