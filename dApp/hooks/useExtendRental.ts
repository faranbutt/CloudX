import {usePrepareContractWrite} from 'wagmi';
import {heroicusABI} from '../generated';
import {useAllowance} from './useAllowance';
import {useEffect} from 'react';
import {useContractWriteStatus} from './useContractWriteStatus';
import {CloudXAddress} from '../utils/network';

export const useExtendRental = (tokenId: number, amount: bigint) => {
  const {enough, execute: executeAllowance, status: statusAllowance, statusMsg: statusMsgAllowance, refetch} = useAllowance(amount);

  useEffect(() => {
    if (statusAllowance === 'success') {
      void refetch();
    }
  }, [statusAllowance]);

  const {config, error: prepareError} = usePrepareContractWrite({
    address: CloudXAddress,
    abi: heroicusABI,
    functionName: 'extendRental',
    args: [BigInt(tokenId), amount],
    enabled: enough
  });
  const {execute, receipt, status, statusMsg} = useContractWriteStatus(config);

  return {execute, status, statusMsg, enough, statusAllowance, statusMsgAllowance, executeAllowance, prepareError};
};
