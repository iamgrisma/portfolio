import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string) {
  const result = await db.insert(users)
    .values({
      uid,
      email,
      role: email === 'baralptm@gmail.com' ? 'admin' : 'user', // Making the user email admin
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
      },
    })
    .returning();

  return result[0];
}

export async function getUser(uid: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.uid, uid)
  });
  return result;
}
