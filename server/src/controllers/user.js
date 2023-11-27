import validator from 'validator'
import { query } from '../../db'

// Validate and sanitize user input
const sanitizeUserId = (userId) => {
  const parsedUserId = parseInt(userId, 10) // Parse as base 10

  // Check if the parsedUserId is a positive integer
  if (Number.isInteger(parsedUserId) && parsedUserId > 0) {
    return parsedUserId
  }
  throw new Error('Invalid userId')
}

// Function to validate user input fields
const validateUserInput = (user) => {
  const errors = []

  if (!validator.isLength(user.firstName, { min: 1, max: 255 })) {
    errors.push('First name must be between 1 and 255 characters.')
  }

  if (!validator.isLength(user.lastName, { min: 1, max: 255 })) {
    errors.push('Last name must be between 1 and 255 characters.')
  }

  if (!validator.isEmail(user.email)) {
    errors.push('Invalid email address.')
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
}

export const list = async (req, res) => {
  try {
    const result = await query('SELECT * FROM USERS;')
    res.status(200).json({ users: result.rows })
  } catch (e) {
    console.log(`Error fetching users: ${e.message}`)
    res.status(500).json({ error: e.message })
  }
}

export const create = async (req, res) => {
  try {
    const user = req.body

    // Validate user input fields
    validateUserInput(user)

    const result = await query(
      `INSERT INTO users(firstName, lastName, email) VALUES ($1, $2, $3) RETURNING *`,
      [user.firstName, user.lastName, user.email],
    )

    const createdUser = result.rows[0]
    res
      .status(200)
      .json({ user: createdUser, message: 'User created successfully.' })
  } catch (e) {
    console.log(`Error fetching users: ${e.message}`)
    res.status(500).json({ error: e.message })
  }
}

export const getById = async (req, res) => {
  try {
    const sanitizedUserId = sanitizeUserId(req.params.userId)

    const result = await query('SELECT * FROM users WHERE id = $1', [
      sanitizedUserId,
    ])

    if (result.rows.length > 0) {
      console.log(result.rows[0])
      res.status(200).json({ user: result.rows[0] })
    } else {
      res.status(404).json({ error: 'User not found.' })
    }
  } catch (e) {
    console.log(`Error fetching users: ${e.message}`)
    res.status(500).json({ error: e.message })
  }
}

export const update = async (req, res) => {
  try {
    const sanitizedUserId = sanitizeUserId(req.params.userId)
    const user = req.body

    // Validate user input fields
    validateUserInput(user)

    const result = await query(
      'UPDATE USERS SET firstName = $1, lastName = $2, email = $3 WHERE id = $4 RETURNING *',
      [user.firstName, user.lastName, user.email, sanitizedUserId],
    )

    if (result.rows.length > 0) {
      const updatedUser = result.rows[0]
      res
        .status(200)
        .json({ user: updatedUser, message: 'User updated successfully.' })
    } else {
      res.status(404).json({ error: 'User not found.' })
    }
  } catch (e) {
    console.error(`Error updating user: ${e.message}`)
    res.status(400).json({ error: e.message })
  }
}

export const remove = async (req, res) => {
  try {
    const sanitizedUserId = sanitizeUserId(req.params.userId)

    const result = await query('DELETE FROM users WHERE id = $1', [
      sanitizedUserId,
    ])

    if (result.rowCount > 0) {
      res.status(200).json({ count: 1, message: 'User deleted successfully.' })
    } else {
      res.status(404).json({ error: 'User not found.' })
    }
  } catch (e) {
    console.error(`Error updating user: ${e.message}`)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

export default {
  list,
  create,
  getById,
  update,
  remove,
}
