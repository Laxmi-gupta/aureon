import type { User } from '@/types';
import { AVATAR_COLORS, CURRENT_USER_ID, getUserById } from '@/mock-data';
import { withLatency, ServiceError } from './latency';

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface Session {
  user: User;
  token: string;
}

export interface AuthService {
  login(input: LoginInput): Promise<Session>;
  signup(input: SignupInput): Promise<Session>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  logout(): Promise<void>;
}

class MockAuthService implements AuthService {
  async login(input: LoginInput): Promise<Session> {
    if (!input.email || !input.password) {
      throw new ServiceError('Email and password are required.');
    }
    if (input.password.length < 6) {
      throw new ServiceError('Incorrect email or password.');
    }
    const user = getUserById(CURRENT_USER_ID);
    if (!user) throw new ServiceError('Account not found.');
    return withLatency({ user, token: `mock-token-${Date.now()}` }, 650);
  }

  async signup(input: SignupInput): Promise<Session> {
    if (!input.name || !input.email || input.password.length < 6) {
      throw new ServiceError('Please fill every field with a valid password.');
    }
    const user: User = {
      id: `u_${Date.now()}`,
      name: input.name,
      email: input.email,
      role: 'member',
      title: 'New Member',
      department: 'Unassigned',
      color: AVATAR_COLORS[input.name.length % AVATAR_COLORS.length]!,
      activeTasks: 0,
      completedTasks: 0,
      workload: 0,
      timezone: 'PST',
      joinedAt: new Date().toISOString(),
    };
    return withLatency({ user, token: `mock-token-${Date.now()}` }, 700);
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (!email) throw new ServiceError('Enter your email address.');
    return withLatency(undefined, 600);
  }

  async resetPassword(_token: string, newPassword: string): Promise<void> {
    if (newPassword.length < 6) throw new ServiceError('Password must be at least 6 characters.');
    return withLatency(undefined, 600);
  }

  async logout(): Promise<void> {
    return withLatency(undefined, 200);
  }
}

export const authService: AuthService = new MockAuthService();
