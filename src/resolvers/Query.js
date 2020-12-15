import getUserId from '../utils/getUserId';

const getArgs = args => ({
    first: args.first,
    skip: args.skip,
    after: args.after,
    orderBy: args.orderBy,
});

const Query = {
    users(parent, args, { prisma }, info) {
        const otherArgs = getArgs(args);
        const opArgs = {
            ...otherArgs,
        };

        if (args.query) {
            opArgs.where = {
                OR: [
                    { name_contains: args.query },
                    { email_contains: args.query },
                ]
            };
        }

        return prisma.query.users(opArgs, info);
    },
    async me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const userExists = await prisma.exists.User({ id: userId });
        if (!userExists) {
            throw new Error('User does not exist');
        }
        
        const user = await prisma.query.user({
            where: { id: userId },
        }, info);

        return user;
    },
};

export { Query as default };