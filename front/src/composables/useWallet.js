import { ref, shallowRef, computed, onMounted } from "vue";
import { BrowserProvider } from "ethers";

const address = ref(null);
// shallowRef: ethers uses private fields — Vue's Proxy breaks them ("Cannot access private method")
const provider = shallowRef(null);
const signer = shallowRef(null);
const chainId = ref(null);
const error = ref(null);

const isConnected = computed(() => !!address.value && !!provider.value);
const shortAddress = computed(() =>
  address.value ? `${address.value.slice(0, 6)}…${address.value.slice(-4)}` : ""
);

async function bindProvider(ethProvider, account) {
  provider.value = ethProvider;
  signer.value = await ethProvider.getSigner();
  address.value = account;
  const network = await ethProvider.getNetwork();
  chainId.value = Number(network.chainId);
}

async function connect() {
  error.value = null;
  if (!window.ethereum) {
    error.value = "MetaMask is not installed.";
    return;
  }
  try {
    const ethProvider = new BrowserProvider(window.ethereum);
    const accounts = await ethProvider.send("eth_requestAccounts", []);
    await bindProvider(ethProvider, accounts[0]);
  } catch (err) {
    error.value = err.message || "Connection failed";
  }
}

async function tryReconnect() {
  if (!window.ethereum || address.value) return;
  try {
    const ethProvider = new BrowserProvider(window.ethereum);
    const accounts = await ethProvider.send("eth_accounts", []);
    if (accounts.length > 0) {
      await bindProvider(ethProvider, accounts[0]);
    }
  } catch {
    /* silent — user will click Connect */
  }
}

function setupListeners() {
  if (!window.ethereum || window.ethereum._sbdListeners) return;
  window.ethereum._sbdListeners = true;

  window.ethereum.on("accountsChanged", async (accs) => {
    if (!accs[0]) {
      disconnect();
      return;
    }
    if (provider.value) {
      address.value = accs[0];
      signer.value = await provider.value.getSigner();
    }
  });

  window.ethereum.on("chainChanged", () => window.location.reload());
}

function disconnect() {
  address.value = null;
  provider.value = null;
  signer.value = null;
  chainId.value = null;
}

onMounted(() => {
  setupListeners();
  tryReconnect();
});

export function useWallet() {
  return { address, provider, signer, chainId, error, isConnected, shortAddress, connect, disconnect };
}
