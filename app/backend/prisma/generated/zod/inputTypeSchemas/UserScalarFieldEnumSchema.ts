import { z } from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id','name','password']);

export default UserScalarFieldEnumSchema;
