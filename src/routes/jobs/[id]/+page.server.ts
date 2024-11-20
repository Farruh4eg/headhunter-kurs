import prisma from '$lib/prisma';
import type { UserCookieInfo } from '$lib/utils/interfaces';
import * as jwt from 'jsonwebtoken';

export const load = async ({ params: { id }, cookies }) => {
  let token = cookies.get('token')?.replaceAll("'", '') as string;
  const userInfo = jwt.decode(token) as UserCookieInfo;
  const user_id = userInfo?.user_id;

  const job = await prisma.joblistings.findUnique({
    where: { job_id: +id },
    include: {
     employers: true,
    },
  });

  return { job, user_id,};
};
