import { ref, computed } from "vue";
import { BrowserProvider } from "ethers";

const address = ref(null);
const provider = ref(null);
const signer = ref(null);
const chainId = ref(null);
const error = ref(null);

const isConnected = computed(() => !!address.value);
const shortAddress = computed(() =>
  address.value ? `${address.value.slice(0, 6)}…${address.value.slice(-4)}` : ""
);

async function connect() {
  error.value = null;
  if (!window.ethereum) {
    error.value = "MetaMask is not installed.";
    return;
  }
  try {
    const ethProvider = new BrowserProvider(window.ethereum);
    const accounts = await ethProvider.send("eth_requestAccounts", []);
    const network = await ethProvider.getNetwork();

    provider.value = ethProvider;
    signer.value = await ethProvider.getSigner();
    address.value = accounts[0];
    chainId.value = Number(network.chainId);

    window.ethereum.on("accountsChanged", (accs) => {
      address.value = accs[0] || null;
    });
    window.ethereum.on("chainChanged", () => window.location.reload());
  } catch (err) {
    error.value = err.message || "Connection failed";
  }
}

function disconnect() {
  address.value = null;
  provider.value = null;
  signer.value = null;
  chainId.value = null;
}

export function useWallet() {
  return { address, provider, signer, chainId, error, isConnected, shortAddress, connect, disconnect };
}
