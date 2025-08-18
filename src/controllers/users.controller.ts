import type { Response} from 'express';
import type { AuthRequest } from '../middlewares/authJwt';
import { registerUser } from '../services/auth.service';
import { getUserByIdPublic, listUsersPublic, blockUser, unblockUser } from '../services/users.service';
import { isNonEmptyString } from '../utils/validation';

export async function createByAdmin(req: AuthRequest, res: Response) {

    const roleNameRaw =
      typeof req.body.roleName === 'string'
        ? req.body.roleName.trim().toLowerCase()
        : typeof req.body.role === 'string'
          ? req.body.role.trim().toLowerCase()
          : 'user';

    const roleName = roleNameRaw === 'admin' || roleNameRaw === 'user' ? roleNameRaw : 'user';

    const user = await registerUser({
      firstName: String(req.body.firstName ?? '').trim(),
      lastName: String(req.body.lastName ?? '').trim(),
      middleName: isNonEmptyString(req.body.middleName) ? req.body.middleName.trim() : undefined,
      birthDate: new Date(req.body.birthDate),
      email: String(req.body.email ?? '').trim().toLowerCase(),
      password: String(req.body.password ?? ''),
      roleName, 
    });

    return res.status(201).json(user);
}

export async function getById(req: AuthRequest, res: Response) {

    const id = Number(req.params.id);
    res.json(await getUserByIdPublic(id));
}

export async function list(req: AuthRequest, res: Response) {

    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);
    const role = typeof req.query.role === 'string' ? req.query.role: undefined;
    const status = typeof req.query.status === 'string' ? req.query.status: undefined;
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    res.json(await listUsersPublic({ limit, offset, role, status, q}));

}

export async function block (req: AuthRequest, res: Response){

    const id = Number(req.params.id);
    res.json(await blockUser(id));

}

export async function unblock (req: AuthRequest, res: Response){

    const id = Number(req.params.id);
    res.json(await unblockUser(id));
}