import { ConflictException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/db';
import { users } from 'src/db/schema';
import type { NewUser } from 'src/db/schema';
@Injectable()
export class UsersService {
  async findAll() {
    return db.query.users.findMany();
  }

  async getByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return user;
  }

  async getById(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    return user;
  }

  async getByVerificationToken(token: string) {
    return db.query.users.findFirst({
      where: eq(users.verificationToken, token),
    });
  }

  async getByResetToken(token: string) {
    return db.query.users.findFirst({
      where: eq(users.resetToken, token),
    });
  }

  async createUser(data: NewUser) {
    const userExist = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (userExist) {
      throw new ConflictException('User with this email already exists');
    }
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  async deleteUser(id: string) {
    await db.delete(users).where(eq(users.id, id));
  }
}
