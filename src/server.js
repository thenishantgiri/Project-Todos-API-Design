import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

export const app = express()
const router = express.Router()

// to remove the x-powered-by:Express (in the header)
app.disable('x-powered-by')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

router.get('/me', (req, res) => {
  res.send({ me: 'hello' })
})

// mounting router with app
app.use('/api', router)

// CRUD : Create, Read, Update & Destroy
// Read
app.get('/data', (req, res) => {
  res.send({ data: 'Reading values off the /data path' })
})

// Create
app.post('/data', (req, res) => {
  res.send(req.body)
})

// Update (fundamentally post & put does the same thing, it's just the convension to use put for updating the value)
app.put('/data', (req, res) => {})

// Delete
app.delete('/data', (req, res) => {})

export const start = () => {
  app.listen(3000, () => {
    console.log('server listening on port http://localhost:3000')
  })
}
