import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

const log = (req, res, next) => {
  console.log('logging')
  // passing data to the controller from this middleware
  req.mydata = 'middleware data passing to controller'
  next()
}

app.get('/data', log, (req, res) => {
  res.send({ data: req.mydata })
})

app.post('/data', (req, res) => {
  res.send(req.body)
})

export const start = () => {
  app.listen(3000, () => {
    console.log('server listening on port http://localhost:3000')
  })
}
