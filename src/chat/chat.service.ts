import { PrismaService } from '@/prisma.service';
import { User } from '@/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
    constructor(
        private readonly prismaService: PrismaService
    ){}

    async getChat(roomID: number) {
        return this.prismaService.roomMessage.findMany({
            where: {
                roomId: roomID
            },
            select: {
                message: true,
                user: {
                    select: {
                        email: true
                    }
                }
            }
        })
    }

    async createRoom(roomName: string, user: User) {
        return this.prismaService.room.create({
            data: {
                name: roomName,
                creator: {
                    connect: {
                        id: user.userId
                    }
                },
                groupRoom: {
                    create: {
                        name: "Group_" + roomName,
                        users: {
                            connect: {
                                id: user.userId
                            }
                        }
                    }
                }
            },
            include: {
                groupRoom: true
            }
        })
    }

    async sendMessage(roomID: number, message: string, user: User) {
        return this.prismaService.roomMessage.create({
            data: {
                message: message,
                room: {
                    connect: {
                        id: roomID
                    }
                },
                user: {
                    connect: {
                        id: user.userId
                    }
                }
            }
        })
    }

    async joinRoom(roomID: number, user: User) {
        return this.prismaService.groupRoom.update({
            where: {
                id: roomID
            },
            data: {
                users: {
                    connect: {
                        id: user.userId
                    }
                }
            }
        })
    }

    async leaveRoom(roomID: number, user: User) {
        return this.prismaService.groupRoom.update({
            where: {
                id: roomID
            },
            data: {
                users: {
                    disconnect: {
                        id: user.userId
                    }
                }
            }
        })
    }
}
