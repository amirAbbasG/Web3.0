import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractAddres, contractAbi } from "../utils/constants";

const TransactionContext = createContext({
  connectAccount: () => {},
  handleChange: () => {},
  sendTransaction: () => {},
  currentAccount: "",
  isLoading: false,
  formData: {},
  transactions: [],
  transactionCount: 0,
});

const { ethereum } = window;

const getEthereumContract = async () => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddres,
    contractAbi,
    signer
  );

  return transactionContract;
};

const TransactionProvider = ({ children }) => {
  const [currentAccount, setcurrentAccount] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const handleChange = (e, key) => {
    setformData({ ...formData, [key]: e.target.value });
  };

  const getAllTransactions = async () => {
    if (!ethereum) return alert("please install metamask");
    try {
      const transactionContract = await getEthereumContract();

      const availableTransactions =
        await transactionContract.getAllBlockchains();

      if (availableTransactions) {
        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              parseInt(transaction.timestamp) * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount) / 10 ** 18,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIsWalletConnected = async () => {
    try {
      if (!ethereum) return alert("please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setcurrentAccount(accounts[0]);
        await getAllTransactions();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkTransactionExist = async () => {
    try {
      const transactionContract = await getEthereumContract();

      const count = await transactionContract.getBlockchainsCount();
      if (count) {
        setTransactionCount(count);
        localStorage.setItem("transactionCount", count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIsWalletConnected();
    checkTransactionExist();
  }, []);

  const connectAccount = async () => {
    try {
      if (!ethereum) return alert("please install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setcurrentAccount(accounts?.[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = await getEthereumContract();
      const parsedAmount = ethers.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //21000 GWEI --> 0.00021 eth
            value: ethers.toBeHex(parsedAmount),
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setisLoading(true);
      console.log("loading", transactionHash);
      await transactionHash.wait();
      setisLoading(false);
      console.log("succes", transactionHash);

      const count = await transactionContract.getBlockchainsCount();
      if (count) {
        console.log(count);
        setTransactionCount(count);
        localStorage.setItem("transactionCount", count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        connectAccount,
        currentAccount,
        handleChange,
        isLoading,
        sendTransaction,
        formData,
        transactionCount,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  return useContext(TransactionContext);
};

export default TransactionProvider;
