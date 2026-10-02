import { Router } from 'express';
import {
  addMembersToProject,
  deleteMember,
  updateMemberRole,
  getProjectById,
  getProjectMembers,
  deletproject,
  updateProject,
  createProjects,
  getProjects,
} from '../controllers/project.controllers.js';
import { validate } from '../middleware/validator.middleware.js';
import {
  createProjectValidator,
  addMembertoProjectValidator,
} from '../validators/index.js';
import {
  verifyJWT,
  validateProjectPermission,
} from '../middleware/auth.middleware.js';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';

const router = Router();
router.use(verifyJWT)

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProjects)

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getProjectById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createProjectValidator(),
        validate,
        updateProject
    )

    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deletproject
    )

router
    .route("/:projectId/members")
    .get(getProjectMembers)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMembertoProjectValidator(),
        validate,
        addMembersToProject
    )

router
    .route("/:projectId/members/:userId")
    .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember)

export default router;
