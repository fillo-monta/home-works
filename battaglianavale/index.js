const faker = require("faker")
const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database("./data.db3")
const app = new express()
const PORT = 8080

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS teams (
    name VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    killedShips INT NOT NULL,
    bulletsFired INT NOT NULL,
    lastFiredBullet DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
})

const field = []
const ships = []

const W = process.argv[2] || 6
const H = process.argv[3] || 6
const S = process.argv[4] || 10

for (let y = 0; y < H; y++) {
  const row = []
  for (let x = 0; x < W; x++) {
    row.push({
      team: null,
      x,
      y,
      ship: null,
      hit: false
    })    
  } 
  field.push(row)
}

let id = 1
for (let i = 0; i < S; i++) {
  const maxHp = faker.random.number({ min: 1, max: 6 })
  const vertical = faker.random.boolean()
  console.log({ vertical, maxHp })

  const ship = {
    id,
    name: faker.name.firstName(),
    x: faker.random.number({ min: 0, max: vertical ? W - 1 : W - maxHp }),
    y: faker.random.number({ min: 0, max: vertical ? H - maxHp : H - 1 }),
    vertical,
    maxHp,
    curHp: maxHp,
    alive: true,
    killer: null
  }

  let found = false
  for (let e = 0; e < ship.maxHp; e++) {
    const x = ship.vertical ? ship.x : ship.x + e
    const y = ship.vertical ? ship.y + e : ship.y
    if (field[y][x].ship) {
      found = true
      break
    }
  }

  if (!found) {
    for (let e = 0; e < ship.maxHp; e++) {
      const x = ship.vertical ? ship.x : ship.x + e
      const y = ship.vertical ? ship.y + e : ship.y
      field[y][x].ship = ship
    }
  
    ships.push(ship)
    id ++
  }
}

app.get("/", ({ query: { format } }, res) => {
  const visibleField = field.map(row => row.map(cell => ({ 
    x: cell.x,
    y: cell.y,
    hit: cell.hit,
    team: cell.team,
    ship: cell.hit ? 
      cell.ship ? { id: cell.ship.id, name: cell.ship.name, alive: cell.ship.alive, killer: cell.ship.killer } : null 
      : null
  })))

  const visibleShipInfo = ships.map(ship => ({
    id: ship.id,
    name: ship.name,
    alive: ship.alive,
    killer: ship.killer
  }))

  if ( format === "json") {
    res.json({ 
      field: visibleField,
      ships: visibleShipInfo
    })
  } else {
    // html format field
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>battaglia navale</title>
      <style>
        table, td, th {
          border: 1px solid black;
        }
        td {
          width: 40px;
          height: 40px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
      </style>
    </head>
    <body>
      <table>
        <tbody>
          ${visibleField.map(row => `<tr>${row.map(cell => `<td>${cell.ship ? cell.ship.name : ""}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </body>
    </html>
    `)
  }
})

app.get("/score", (req, res) => {
  res.json([])
})

app.get("/accreditamento", ({ query: { team, password } }, res) => {
  db.get("SELECT * FROM teams WHERE name = ? AND password = ?", [team, password], (err, row) => {
    if (err) {
      throw err
    } else if (row) {
      res.status(409).json({
        message: "no homo",
      })
    } else {
      db.run("INSERT INTO teams (name, password, score, killedShips, bulletsFired) VALUES (?, ?, ?, ?, ?)", [team, password, 0, 0, 0], (err) => {
        if (err) {
          throw err
        } else {
          res.json({
            message: "accreditato",
            username: team,
            password,
            score: 0
          })
        }
      })
    }
  })
})

const POINT_VERY_LOW = -10
const POINT_LOW = -5
const POINT_ZERO = 0
const POINT_HIGH = 5
const POINT_VERY_HIGH = 10

app.get("/fire", ({ query: { x, y, team, password } }, res) => {  
  //field[y][x].hit = true
  let points = 0
  let lastSeen = new Date().getTime()
  let response = ""
  
  db.get("SELECT * FROM teams WHERE name = ? AND password = ?", [team, password], (err, row) => {
    if (err) {
      throw err
    } if (!row) {
      res.status(401).json({
        message: "credenziali errate"
      })
    //} else if ((lastSeen - row.lastFiredBullet) < 1000) {
    //  res.json({message: "troppo veloce ma uno ogni secondo te la conto"})
    //} else if ((lastSeen - row.lastFiredBullet) >= 1000) {
    }else{
      console.log("x=" + x + " y=" + y + " team:" + team + " pwd:" + password)
      if ((lastSeen - row.lastFiredBullet) < 1000) {
        res.json({message: "troppo veloce ma uno ogni secondo te la conto"})
      }else{
        db.run("UPDATE teams SET lastFiredBullet = ? WHERE name = ? AND password = ?", [lastSeen, team, password], (err) => {
          if (err) {
            throw err
          }
        })
        
        let k=0 // variabile per conteggiare se è stata affondata una nave
        if (x<W && y<H){
          const cell = field[y][x]
          cell.team = team
          if (cell.hit){  // la cella era già stata colpita
            points = POINT_LOW
            response = "hai già sparato qui"
          }else{          // la cella non era ancora stata colpita
            cell.hit = true
            if (cell.ship){   // la cella contenente una nave
              cell.ship.curHp -= 1
              if (cell.ship.curHp ===0){ // nave affondata
                cell.ship.alive = false
                cell.ship.killer = team
                points = POINT_VERY_HIGH
                response = "affondata"
                k=1
              } else {                  // nave colpita
                points = POINT_HIGH
                response = "colpito"
              }
            }else{            // acqua (la cella è vuota)
              points = POINT_ZERO
              response = "acqua"
            }
          }
        } else {
          points = POINT_VERY_LOW
          response = "sparato fuori dalla griglia"
        }

        db.run("UPDATE teams SET score = ?, killedShips = ?, bulletsFired = ? WHERE name = ? AND password = ?", [row.score + points, row.killedShips + k, row.bulletsFired +1, team, password], (err) => {
          if (err) {
            throw err
          }
        })

        res.json({
          x, y, team, response, points
        })
      }
    }
  })


  /*
    1. segnare la cella come colpita
    2. segnare eventualmente la nave come colpita (ridurre gli hp e verificare se e' morta)
    3. assegnare il team sia alla cella che alla nave (eventuale)
    4. assicurarsi che il team che chiama l'endpoint non possa chiamarlo per piu' di una volta al secondo (opzionale)
    5. definire un punteggio conseguente all'attacco:
      a. punteggio molto negativo se si spara fuori dal campo
      b. punteggio 0 se acqua
      c. punteggio negativo se spari su casella gia' colpita
      c. punteggio positivo se spari su nave ma non la uccidi
      d. punteggio molto positivo se spari su nave e la uccidi
  */
  //response = "DDDDD"
  
})

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))