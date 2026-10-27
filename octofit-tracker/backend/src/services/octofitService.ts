import { Activity, Team, User, Workout } from '../models/index.js';
import { Types } from 'mongoose';

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  const badRequest = (message: string) => Object.assign(new Error(message), { status: 400 });
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw badRequest('Activity details are required');
  }

  const { userId, teamId, type, minutes } = input as Record<string, unknown>;
  if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
    throw badRequest('A valid userId is required');
  }
  if (typeof teamId !== 'string' || !Types.ObjectId.isValid(teamId)) {
    throw badRequest('A valid teamId is required');
  }
  if (typeof type !== 'string' || !type.trim()) {
    throw badRequest('An activity type is required');
  }
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) {
    throw badRequest('Minutes must be a positive number');
  }

  const [userExists, teamExists] = await Promise.all([
    User.exists({ _id: userId }),
    Team.exists({ _id: teamId }),
  ]);
  if (!userExists || !teamExists) {
    throw Object.assign(new Error('User or team not found'), { status: 404 });
  }

  return Activity.create({
    user: userId,
    team: teamId,
    type: type.trim(),
    minutes,
    points: minutes,
    occurredAt: new Date(),
  });
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  const badRequest = (message: string) =>
    Object.assign(new Error(message), { status: 400 });

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw badRequest('Team details are required');
  }

  const { name, mascot, members = [] } = input as Record<string, unknown>;

  if (typeof name !== 'string' || !name.trim()) {
    throw badRequest('A team name is required');
  }
  if (typeof mascot !== 'string' || !mascot.trim()) {
    throw badRequest('A team mascot is required');
  }
  if (
    !Array.isArray(members) ||
    members.some((id) => typeof id !== 'string' || !Types.ObjectId.isValid(id))
  ) {
    throw badRequest('Members must be valid user IDs');
  }

  return Team.create({
    name: name.trim(),
    mascot: mascot.trim(),
    members,
  });
}

export async function getLeaderboard() {
  return [];
}

export async function suggestWorkouts(_userEmail: string) {
  return Workout.find().limit(1).lean();
}

export { User };
