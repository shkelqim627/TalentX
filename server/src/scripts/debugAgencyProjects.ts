import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugAgencyProjects() {
    try {
        console.log('\n=== DEBUGGING AGENCY PROJECTS ===\n');

        // Get all agencies
        const agencies = await prisma.agency.findMany({
            include: {
                user: true
            }
        });

        console.log(`Found ${agencies.length} agencies:`);
        agencies.forEach(agency => {
            console.log(`  - ${agency.agency_name} (Agency ID: ${agency.id}, User ID: ${agency.userId})`);
        });

        // Get all projects
        const projects = await prisma.project.findMany({
            include: {
                assignedAgency: {
                    include: {
                        user: true
                    }
                },
                talent: {
                    include: {
                        user: true
                    }
                },
                team: true
            }
        });

        console.log(`\n Found ${projects.length} projects:`);
        projects.forEach(project => {
            console.log(`\n  Project: ${project.name}`);
            console.log(`    - ID: ${project.id}`);
            console.log(`    - Client: ${project.client_email}`);
            console.log(`    - agencyId field: ${project.agencyId || 'NULL'}`);
            console.log(`    - talentId field: ${project.talentId || 'NULL'}`);
            console.log(`    - teamId field: ${project.teamId || 'NULL'}`);

            if (project.assignedAgency) {
                console.log(`    - Assigned Agency: ${project.assignedAgency.agency_name} (ID: ${project.assignedAgency.id})`);
            }
            if (project.talent) {
                console.log(`    - Assigned Talent: ${project.talent.user.full_name} (ID: ${project.talent.id})`);
            }
            if (project.team) {
                console.log(`    - Assigned Team: ${project.team.team_name} (ID: ${project.team.id})`);
            }
        });

        // Check what the formatted output looks like
        console.log('\n=== FORMATTED PROJECT DATA (as returned by API) ===\n');
        const formattedProjects = projects.map((p) => ({
            ...p,
            assigned_to: p.talent
                ? { id: p.talent.id, name: p.talent.user.full_name, type: 'talent', image_url: p.talent.user.avatar_url }
                : p.team
                    ? { id: p.team.id, name: p.team.team_name, type: 'team', image_url: p.team.image_url }
                    : p.assignedAgency
                        ? { id: p.assignedAgency.id, name: p.assignedAgency.agency_name, type: 'agency', image_url: p.assignedAgency.user.avatar_url }
                        : undefined,
        }));

        formattedProjects.forEach(project => {
            console.log(`\nProject: ${project.name}`);
            if (project.assigned_to) {
                console.log(`  assigned_to: { id: "${project.assigned_to.id}", type: "${project.assigned_to.type}", name: "${project.assigned_to.name}" }`);
            } else {
                console.log(`  assigned_to: UNDEFINED`);
            }
        });

        // Show filtering logic
        if (agencies.length > 0) {
            const testAgency = agencies[0];
            console.log(`\n=== TESTING FILTER FOR: ${testAgency.agency_name} ===`);
            console.log(`Agency ID: ${testAgency.id}`);

            const filteredProjects = formattedProjects.filter((p) => {
                return p.assigned_to?.type === 'agency' && p.assigned_to?.id === testAgency.id;
            });

            console.log(`\nFiltered projects for this agency: ${filteredProjects.length}`);
            filteredProjects.forEach(p => {
                console.log(`  - ${p.name}`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugAgencyProjects();
