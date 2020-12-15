import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('Red098!@#$')
    },
    user: undefined,
    jwt: undefined,
};

const userTwo = {
    input: {
        name: 'Rob',
        email: 'rob@example.com',
        password: bcrypt.hashSync('Pass1234!'),
    },
    user: undefined,
    jwt: undefined,
};

const seedDB = async () => {
    jest.setTimeout(1000000);
    // delete test data
    await prisma.mutation.deleteManyUsers();
    
    // create user one
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input,
    });
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

    // create user two
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input,
    });
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);
};

export { seedDB as default, userOne, userTwo };