import { ref } from "vue";
import { Contract } from "ethers";
import { useWallet } from "./useWallet.js";
import ABI from "../abi/SoulboundDiploma.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export function useContract() {
  const { signer, provider } = useWallet();
  const loading = ref(false);
  const txHash = ref(null);
  const error = ref(null);

  function getContract(withSigner = false) {
    const runner = withSigner ? signer.value : provider.value;
    if (!runner) throw new Error("Wallet not connected");
    return new Contract(CONTRACT_ADDRESS, ABI, runner);
  }

  async function issueDiploma(form) {
    loading.value = true;
    error.value = null;
    txHash.value = null;
    try {
      const contract = getContract(true);
      const tx = await contract.issueDiploma(
        form.recipient,
        form.studentName,
        form.degree,
        form.major,
        form.graduationYear,
        form.metadataURI || ""
      );
      await tx.wait();
      txHash.value = tx.hash;
      return tx.hash;
    } catch (err) {
      error.value = err.reason || err.message || "Transaction failed";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getDiploma(tokenId) {
    const contract = getContract();
    return contract.getDiploma(tokenId);
  }

  async function diplomasOf(holderAddress) {
    const contract = getContract();
    const tokenIds = await contract.diplomasOf(holderAddress);
    return Promise.all(
      tokenIds.map(async (id) => {
        const data = await contract.getDiploma(id);
        return { tokenId: Number(id), ...data };
      })
    );
  }

  async function totalIssued() {
    const contract = getContract();
    return Number(await contract.totalIssued());
  }

  async function getOwner() {
    const contract = getContract();
    return contract.owner();
  }

  return { loading, txHash, error, issueDiploma, getDiploma, diplomasOf, totalIssued, getOwner };
}
