import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyControllerLogic() {
    try {
        console.log('--- Verifying Agency Controller Logic ---');

        // 1. Find an agency that is assigned to a project
        const projectWithAgency = await prisma.project.findFirst({
            where: { agencyId: { not: null } },
            include: { assignedAgency: { include: { user: true } } }
        });

        if (!projectWithAgency || !projectWithAgency.assignedAgency) {
            console.log('No projects found with an assigned agency.');
            return;
        }

        const agency = projectWithAgency.assignedAgency;

        if (!agency) {
            console.log('No agency found to test with.');
            return;
        }

        console.log(`Testing with Agency: ${agency.agency_name} (User ID: ${agency.userId})`);

        // 2. Run the EXACT query from the controller
        const projects = await prisma.project.findMany({
            where: { agencyId: agency.id }, // mimicking the controller logic
            include: {
                talent: { include: { user: true } },
                team: true,
                assignedAgency: { include: { user: true } },
                memberships: { include: { talent: { include: { user: true } } } },
            },
        });

        console.log(`Query returned ${projects.length} projects.`);
        projects.forEach(p => console.log(` - Project: ${p.name} (Agency ID in Project: ${p.agencyId})`));

    } catch (e) {
        console.error('Error executing verification script:', e);
    } finally {
        await prisma.$disconnect();
    }
}

verifyControllerLogic();
