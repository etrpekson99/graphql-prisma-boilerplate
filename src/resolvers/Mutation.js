import bycrypt from 'bcryptjs';

import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutations = {
    async signIn(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: { email: args.data.email },
        });

        if (!user) {
            throw new Error('Unable to login');
        }

        const { password } = user;

        const isMatch = await bycrypt.compare(args.data.password, password);
        if (!isMatch) {
            throw new Error('Unable to login');
        }

        return {
            user,
            token: generateToken(user.id),
        };
    },

    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email });

        if (emailTaken) {
            throw new Error('Email taken');
        }

        const password = await hashPassword(args.data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password,
            }
        });
       
        return {
            user,
            token: generateToken(user.id),
        };
    },

    async deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
    
        const deletedUser = await prisma.mutation.deleteUser({
            where: { id: userId },
        }, info);

        return deletedUser;
    },

    async updateUser(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request);

        if (typeof data.password === 'string') {
            data.password = await hashPassword(data.password);
        }

        return prisma.mutation.updateUser({
            where: { id: userId },
            data,
        }, info);
    },
};

export { Mutations as default };