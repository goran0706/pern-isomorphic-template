import express from 'express'
import userCtrl from '../controllers/user'

const router = express.Router()

router //
  .route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)

router
  .route('/api/users/:userId')
  .get(userCtrl.getById)
  .put(userCtrl.update)
  .delete(userCtrl.remove)

export default router
