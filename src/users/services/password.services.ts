import bcrypt from 'bcrypt'

const genSalt = 10;

export async function hashPass(password: string) : Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return await salt.hash(password, salt) 
}

export async function verifyUserPassword(password: string, hashPassword: string): Promise<string> {
    return await bcrypt.compare(password, hashPassword)
}