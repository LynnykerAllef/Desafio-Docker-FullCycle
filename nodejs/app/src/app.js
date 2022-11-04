const express = require('express')
const app = express()
const port = 3000


const mysql = require('mysql')
const config = {
  host: 'db',
  user: 'user',
  queryTimeout: 100000,
  password: 'secret',
  database: 'nodeappdb'

}

const createTable = async (conn, tableName, people) => {

  return new Promise(resolve => {

    const sql = `create table ${tableName}(id int not null auto_increment, name varchar(255), primary key(id))`
    conn.query(sql, (err, res) => {
      if (err) {
        resolve(false)
      }
      else {
        registerPeople(conn, tableName, people)
        resolve(true)
      }

    })

  });


}

const registerPeople = (conn, tableName,names) => {
  return new Promise(resolve => {
    const values = names.map(people => `('${people}')`).join(',')

    const sql = `INSERT INTO ${tableName}(name) values${values}`
    conn.query(sql, (err, res) => {
      if (err) {

        resolve(false)

      }
      else {
        resolve(true)

      }

    })

  });
}


(async () => {


  const people = ['Mario', 'João', 'Jeferson', 'André', 'Cleiton', 'Marcia']
  const tableName = 'people'
  const conn = mysql.createConnection(config)

  let result = await createTable(conn, tableName, people)
  if (!result) {
    console.log('A tabela já existe no banco de dados!')
  }
  else {
    console.log('A tabela foi criada com sucesso!')
  }

  conn.end()


  app.get('/', (req, res) => {

    const conn = mysql.createConnection(config)

    conn.query(`SELECT name FROM ${tableName}`, (err, result) => {
      if (!err) {

        const people = result.map(row => `<li>${row["name"]}</li>`).join('\n')

        res.send(`<h1>Full Cycle Rocks!</h1>
          <ol>
            ${people}
          </ol>  
        `)

      }

      conn.end()
    });





  })

  app.listen(port, () => {
     console.log(`\nAcesse: http://127.0.0.1:8080\n`)
  })


})()

