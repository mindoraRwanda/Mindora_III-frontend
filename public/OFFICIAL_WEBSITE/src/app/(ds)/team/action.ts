// app/team/actions.ts
'use server';

import { db } from '@/db';
import { team } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface TeamMember {
  id?: number;
  name: string;
  role: string;
  bio: string;
  description: string;
  imageUrl?: string;
}

// Get all team members
export async function getTeamMembers() {
  try {
    const allTeamMembers = await db.select().from(team);
    return allTeamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw new Error('Failed to fetch team members');
  }
}

// Get a single team member by ID
export async function getTeamMember(id: number) {
  try {
    const teamMember = await db.select().from(team).where(eq(team.id, id));
    
    if (!teamMember.length) {
      throw new Error('Team member not found');
    }
    
    return teamMember[0];
  } catch (error) {
    console.error('Error fetching team member:', error);
    throw new Error('Failed to fetch team member');
  }
}

// Create a new team member
export async function createTeamMember(data: TeamMember) {
  try {
    // Validate required fields
    if (!data.name || !data.role || !data.bio || !data.description) {
      throw new Error('Missing required fields');
    }
    
    const newTeamMember = await db.insert(team).values({
      name: data.name,
      role: data.role,
      bio: data.bio,
      description: data.description,
      imageUrl: data.imageUrl || null,
    }).returning();
    
    return newTeamMember[0];
  } catch (error) {
    console.error('Error creating team member:', error);
    throw new Error('Failed to create team member');
  }
}

// Update an existing team member
export async function updateTeamMember(id: number, data: TeamMember) {
  try {
    // Validate required fields
    if (!data.name || !data.role || !data.bio || !data.description) {
      throw new Error('Missing required fields');
    }
    
    const updatedTeamMember = await db.update(team)
      .set({
        name: data.name,
        role: data.role,
        bio: data.bio,
        description: data.description,
        imageUrl: data.imageUrl || null,
      })
      .where(eq(team.id, id))
      .returning();
    
    if (!updatedTeamMember.length) {
      throw new Error('Team member not found');
    }
    
    return updatedTeamMember[0];
  } catch (error) {
    console.error('Error updating team member:', error);
    throw new Error('Failed to update team member');
  }
}

// Delete a team member
export async function deleteTeamMember(id: number) {
  try {
    const deletedTeamMember = await db.delete(team)
      .where(eq(team.id, id))
      .returning();
    
    if (!deletedTeamMember.length) {
      throw new Error('Team member not found');
    }
    
    return deletedTeamMember[0];
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw new Error('Failed to delete team member');
  }
}