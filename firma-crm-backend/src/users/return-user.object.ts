import { Prisma } from "@prisma/client";

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	email: true,
	name: true,
	passwordHash: false,
	dealer: true,
	dealerId: true,
	isActive: true,
	roles: true,

}
