import {DescribeInstancesCommand, EC2Client,  RunInstancesCommand} from '@aws-sdk/client-ec2';
import {REGIONS} from './templates';
import {heroicusABI} from '../generated';
import {createViemClient, createViemWallet, getOwnerAccount, CloudXAddress} from './network';
import {parseBytes32String} from 'ethers/lib/utils';

export const AWS_CREDENTIALS = {
  accessKeyId: '',
  secretAccessKey: 'W9'
}

export const getClientToken = (tokenId: number): string => {
  return CloudXAddress + '_15' + tokenId;
};



export const readUserInfo = async (token: string) => {
  const client = createViemClient();

  const userInfo = await client.readContract({
    address: CloudXAddress,
    abi: heroicusABI,
    functionName: 'userInfo',
    args: [BigInt(token)]
  });

  const userStruct = userInfo[0] as any;

  return {
    token: Number(token),
    user: userStruct.user,
    expires: Number(userStruct.expires) * 1000,
    templateId: parseBytes32String(userStruct.templateId),
    expired: userInfo[1],
    region: Number(userStruct.region)
  };
};

export const startServer = async (templateId: string, token: number, region: number) => {
  const ec2 = new EC2Client({
    region: REGIONS[region][0], 
    credentials: AWS_CREDENTIALS
  });

  const command = new DescribeInstancesCommand({
    Filters: [{Name: 'client-token', Values: [getClientToken(token)]}]
  });
  const {Reservations} = await ec2.send(command);
  if (Reservations!.length > 0) {
    throw 'Server already exists';
  }

  const cmd = new RunInstancesCommand({
    LaunchTemplate: {LaunchTemplateName: templateId},
    MinCount: 1,
    MaxCount: 1,
    ClientToken: getClientToken(token),
    TagSpecifications: [{ResourceType: 'instance', Tags: [{Key: CloudXAddress, Value: String(token)}]}]
  });
  try {
    await ec2.send(cmd);
    return {success: true};
  } catch (e) {
    console.error(e);
    try {
      await refundServer(token);
      console.log('refund issued');
      return {success: false, refund: true};
    } catch (e2) {
      console.error('refund failed');
      console.error(e2);
      return {success: false, refund: false};
    }
  }
};

const refundServer = async (token: number) => {
  const client = createViemClient();
  const wallet = createViemWallet();

  // @ts-ignore
  const {request} = await client.simulateContract({
    address: CloudXAddress,
    abi: heroicusABI,
    functionName: 'provideRefund',
    args: [BigInt(token)],
    account: getOwnerAccount()
  });
  await wallet.writeContract(request);
};
