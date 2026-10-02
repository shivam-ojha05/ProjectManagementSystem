// Member operations live under /projects/:id/members on the backend,
// so this file re-exports the relevant projectService functions under
// clearer names — keeps components readable without duplicating API logic.
import projectService from './projectService'

const memberService = {
  list: projectService.listMembers,
  add: projectService.addMember,
  updateRole: projectService.updateMemberRole,
  remove: projectService.removeMember,
}

export default memberService
