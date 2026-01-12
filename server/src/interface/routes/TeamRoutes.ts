import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';

export const createTeamRoutes = (controller: TeamController) => {
    const router = Router();

    router.get('/', controller.listTeams);
    router.get('/:id', controller.getTeam);
    router.post('/generate', controller.generateTeams);
    router.post('/hire', controller.hireTeam);

    return router;
};
