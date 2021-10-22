import express from 'express'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'

import { connect } from './utils/db'
import { signup, signin, protect } from './utils/auth'

import userRouter from './resources/user/user.router'
import itemRouter from './resources/item/item.router'
import listRouter from './resources/list/list.router'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// User Signup & Signin
app.post('/signup', signup)
app.post('/signin', signin)

// Locking-down the API : must be implemented before Routing
app.use('/api', protect)

// Routers
app.use('/api/user', userRouter)
app.use('/api/item', itemRouter)
app.use('/api/list', listRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
