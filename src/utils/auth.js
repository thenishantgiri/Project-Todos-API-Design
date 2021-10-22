import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  })
}

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'email and password required' })
  }

  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (err) {
    console.error(err)
    return res.status(500).end()
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'email and password required' })
  }

  const invalid = { message: 'Invalid email and password combination' }

  try {
    const user = await User.findOne({ email: req.body.email }).exec()

    if (!user) {
      return res.status(401).send(invalid)
    }

    const pswdMatch = await user.checkPassword(req.body.password)

    if (!pswdMatch) {
      return res.status(401).send(invalid)
    }

    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end()
  }

  let token = bearer.split('Bearer ')[1].trim()

  try {
    const payload = await verifyToken(token)
    // select ('-password') : we dont want the database to return password associated with user
    // .lean() : converts the data into json
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()

    req.user = user
    next()
  } catch (err) {
    console.error(err)
    return res.status(401).end()
  }
}
