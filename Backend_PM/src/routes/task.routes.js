import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTaskByid,
  getTasks,
  updateTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from '../controllers/task.controllers.js';
import { verifyJWT, validateProjectPermission } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';

const router = Router();
router.use(verifyJWT);

router
  .route('/:projectId')
  .get(validateProjectPermission(AvailableUserRole), getTasks)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    upload.array('attachments', 5),
    createTask,
  );

router
  .route('/:projectId/t/:taskId')
  .get(validateProjectPermission(AvailableUserRole), getTaskByid)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    upload.array('attachments', 5),
    updateTask,
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    deleteTask,
  );

router
  .route('/:projectId/t/:taskId/subtasks')
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    createSubTask,
  );

router
  .route('/:projectId/st/:subTaskId')
  .put(validateProjectPermission(AvailableUserRole), updateSubTask)
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    deleteSubTask,
  );

export default router;