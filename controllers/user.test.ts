import express from 'express';
import { randomUUID } from 'crypto'

import UserService from '../service/user';
import UserController from './user';

describe('register', () => {
  let req: express.Request;
  let res: express.Response;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        name: 'John Doe',
      },
    } as any;
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn();
    res = {
      status: statusMock,
      send: sendMock,
    } as any;
  });

  it('should create a new user account and return success response', async () => {
    const newUser = {
      aid: expect.any(String),
      name: 'John Doe',
      balance: 0,
      lastOperateAt: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };
    UserService.create = jest.fn().mockReturnValueOnce('created content');

    await UserController.register(req, res);

    expect(UserService.create).toHaveBeenCalledWith(newUser);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith({ success: true, data: { content: 'created content' } });
  });
});