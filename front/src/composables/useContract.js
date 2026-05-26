import { ref } from "vue";
import { BrowserProvider, Contract } from "ethers";
import { useWallet } from "./useWallet.js";
import ABI from "../abi/SoulboundDiploma.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

function normalizeDiploma(tokenId, data) {
  return {
    tokenId: Number(tokenId),
    studentName: data.studentName ?? data[0],
    degree: data.degree ?? data[1],
    major: data.major ?? data[2],
    graduationYear: Number(data.graduationYear ?? data[3]),
    metadataURI: data.metadataURI ?? data[4],
  };
}

export function useContract() {
  const { signer, provider } = useWallet();
  const loading = ref(false);
  const txHash = ref(null);
  const error = ref(null);

  function getRunner(withSigner) {
    if (withSigner) {
      if (!signer.value) throw new Error("Wallet not connected");
      return signer.value;
    }
    if (provider.value) return provider.value;
    if (window.ethereum) return new BrowserProvider(window.ethereum);
    throw new Error("Wallet not connected");
  }

  function getContract(withSigner = false) {
    return new Contract(CONTRACT_ADDRESS, ABI, getRunner(withSigner));
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
    return getContract().getDiploma(tokenId);
  }

  async function diplomasOf(holderAddress) {
    const contract = getContract();
    const tokenIds = await contract.diplomasOf(holderAddress);
    return Promise.all(
      tokenIds.map(async (id) => normalizeDiploma(id, await contract.getDiploma(id)))
    );
  }

  async function totalIssued() {
    return Number(await getContract().totalIssued());
  }

  async function getOwner() {
    return getContract().owner();
  }

  return { loading, txHash, error, issueDiploma, getDiploma, diplomasOf, totalIssued, getOwner };
}
