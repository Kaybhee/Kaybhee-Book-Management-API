import * as bcrypt from 'bcrypt'

export async function hashPass(password: string) : Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt) 
}

export async function verifyUserPassword(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword)
}