import {DescribeInstancesCommand, EC2Client, Instance, TerminateInstancesCommand} from '@aws-sdk/client-ec2';
import {REGIONS} from './utils';
import {cloudXABI} from './generated';
import {createViemClient, CloudXAddress} from './network';

const expiresMap = {};

export const checkRunning = async (): Promise<void> => {
  const client = createViemClient();
  const promises = [];
  Object.values(REGIONS).forEach(([regionId]) => {
    promises.push(checkRegion(client, regionId));
  });
  await Promise.all(promises);
  console.log('completed');
};

const checkRegion = async (client, region) => {
  const ec2 = new EC2Client({region});
  const command = new DescribeInstancesCommand({
    Filters: [{Name: 'tag-key', Values: [CloudXAddress]}]
  });
  const {Reservations} = await ec2.send(command);

  const expiredInstances = [];

  for await (const Reservation of Reservations) {
    for await (const Instance of Reservation.Instances) {
      try {
        if (await isExpired(client, ec2, Instance)) {
          expiredInstances.push(Instance.InstanceId);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  await terminateInstances(ec2, expiredInstances);
};

const isExpired = async (client, ec2, instance: Instance) => {

  if (instance.State.Name === 'terminated') {
    return false;
  }

  const tokenId = instance.Tags.find(tag => tag.Key === CloudXAddress)?.Value;
  if (!tokenId) {
    throw 'No tokenId found from tag';
  }

  const expires = expiresMap[tokenId];
  if (expires) {
    if (expires > new Date().getTime()) {
      return false;
    }
  }

  const userInfo = await client.readContract({
    address: CloudXAddress,
    abi: heroicusABI,
    functionName: 'userInfo',
    args: [BigInt(tokenId)]
  });
  expiresMap[tokenId] = Number(userInfo[0].expires) * 1000;
  return userInfo[1];
};

const terminateInstances = async (ec2, ids: string[]) => {
  if (ids.length > 0) {
    console.log(`terminating: ${ids.join(',')}`);
    const cmd = new TerminateInstancesCommand({
      InstanceIds: ids
    });
    await ec2.send(cmd);
  }
};
