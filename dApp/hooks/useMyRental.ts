import {useContractRead} from 'wagmi';
import {heroicusABI} from '../generated';
import {parseBytes32String} from 'ethers/lib/utils';
import {UserInfo} from '../utils/definitions';
import {CloudXAddress} from '../utils/network';

interface Props {
  token: number;
}

export const useMyRental = ({token}: Props): { myRental: UserInfo | undefined, refetch: () => void } => {

  const {data, refetch} = useContractRead({
    address: CloudXAddress,
    abi: heroicusABI,
    functionName: 'userInfo',
    args: [BigInt(token)],
    enabled: !!token
  });

  const userStruct = data?.[0] as any;

  const formatted = data && {
    token: Number(token),
    user: userStruct.user,
    expires: Number(userStruct.expires) * 1000,
    templateId: parseBytes32String(userStruct.templateId),
    expired: data[1],
    region: Number(userStruct.region)
  };
  return {myRental: formatted, refetch};
};
