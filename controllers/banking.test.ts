import express from 'express';

import UserService from '../service/user';
import BankingController from './banking';

describe('checkBalance', () => {
  let req: express.Request;
  let res: express.Response;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    req = {
      params: {
        aid: 'account-id',
      },
    } as any;
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn();
    res = {
      status: statusMock,
      send: sendMock,
    } as any;
  });

  it('should return account not found if account does not exist', async () => {
    UserService.getTarget = jest.fn().mockReturnValueOnce(undefined);

    await BankingController.checkBalance(req, res);

    expect(UserService.getTarget).toHaveBeenCalledWith('account-id');
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ success: false, message: 'account not found.' });
  });

  it('should return account balance if account exists', async () => {
    UserService.getTarget = jest.fn().mockReturnValueOnce({ balance: 100 });

    await BankingController.checkBalance(req, res);

    expect(UserService.getTarget).toHaveBeenCalledWith('account-id');
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith({ success: true, data: { balance: 100 } });
  });
});

describe('deposit', () => {
  let req: express.Request;
  let res: express.Response;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        aid: 'account-id',
        amount: 50,
      },
    } as any;
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn();
    res = {
      status: statusMock,
      send: sendMock,
    } as any;
  });

  it('should return amount cannot be zero or negative if deposit amount is zero', async () => {
    req.body.amount = 0;

    await BankingController.deposit(req, res);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ success: false, message: 'amount cannot be zero or negative.' });
  });

  it('should return amount cannot be zero or negative if deposit amount is negative', async () => {
    req.body.amount = -50;

    await BankingController.deposit(req, res);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ success: false, message: 'amount cannot be zero or negative.' });
  });

  it('should return account not found if account does not exist', async () => {
    UserService.getTarget = jest.fn().mockReturnValueOnce(undefined);

    await BankingController.deposit(req, res);

    expect(UserService.getTarget).toHaveBeenCalledWith('account-id');
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ success: false, message: 'account not found.' });
  });

  it('should update account balance and return success response if account exists', async () => {
    UserService.getTarget = jest.fn().mockReturnValueOnce({ balance: 100 });
    UserService.update = jest.fn().mockReturnValueOnce('updated content');

    await BankingController.deposit(req, res);

    expect(UserService.getTarget).toHaveBeenCalledWith('account-id');
    expect(UserService.update).toHaveBeenCalledWith({
      balance: 150,
      lastOperateAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith({ success: true, data: { content: 'updated content' } });
  });
});

describe('withdraw', () => {
  let req: express.Request;
  let res: express.Response;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        aid: 'account-id',
        amount: 50,
      },
    } as any;
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn();
    res = {
      status: statusMock,
      send: sendMock,
    } as any;
  });

  it('should return amount cannot be zero or negative if withdraw amount is zero', async () => {
    req.body.amount = 0;

    await BankingController.withdraw(req, res);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ success: false, message: 'amount cannot be zero or negative.' });
  });

  it('should return amount cannot be zero or negative if withdraw amount is negative', async () => {
    req.body.amount = -50;

    await BankingController.withdraw(req, res);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ success: false, message: 'amount cannot be zero or negative.' });
  });

  it('should return account not found if account does not exist', async () => {
    UserService.getTarget = jest.fn().mockReturnValueOnce(undefined);

    await BankingController.withdraw(req, res);

    expect(UserService.getTarget).toHaveBeenCalledWith('account-id');
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ success: false, message: 'account not found.' });
  });

  it('should return balance not enough if account balance is less than withdraw amount', async () => {
    UserService.getTarget = jest.fn().mockReturnValueOnce({ balance: 10 });

    await BankingController.withdraw(req, res);

    expect(UserService.getTarget).toHaveBeenCalledWith('account-id');
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ success: false, message: 'balance not enough.' });
  });

  it('should update account balance and return success response if account exists and balance is enough', async () => {
    UserService.getTarget = jest.fn().mockReturnValueOnce({ balance: 100 });
    UserService.update = jest.fn().mockReturnValueOnce('updated content');

    await BankingController.withdraw(req, res);

    expect(UserService.getTarget).toHaveBeenCalledWith('account-id');
    expect(UserService.update).toHaveBeenCalledWith({
      balance: 50,
      lastOperateAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith({ success: true, data: { content: 'updated content' } });
  });
});
