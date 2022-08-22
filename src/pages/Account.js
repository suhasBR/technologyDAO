import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { CgProfile } from "react-icons/cg";
import { BsCashCoin } from "react-icons/bs";
import {
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Button,
  ModalFooter,
} from "@chakra-ui/react";

import Footer from "../components/Footer";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import axios from "axios";
import { getUserDetails } from "../actions/loadUser";

function Account() {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.user.token);
  let toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, changeFormData] = useState({
    walletAddress: "",
    amount: "",
  });
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if (address) {
      changeFormData({ ...formData, walletAddress: address });
    }
  }, [address]);

  const onChange = (e) => {
    changeFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyText = () => {
    navigator.clipboard.writeText(user.referralID);
    return toast({
      position: "top",
      title: "Text copied to clipboard",
      description: "",
      status: "info",
      duration: 9000,
      isClosable: true,
    });
  };

  const connectWallet = async () => {
    connect();
  };

  const formSubmit = async () => {
    console.log(formData);
    if (!formData.walletAddress || !formData.amount) {
      return toast({
        position: "top",
        title: "Some fields are empty",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (formData.amount.length < 1) {
      return toast({
        position: "top",
        title: "Invalid amount",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (formData.walletAddress.length < 40) {
      return toast({
        position: "top",
        title: "Invalid Goerli Wallet Address",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    try {
      if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        amount: formData.amount,
        address: formData.walletAddress,
      };

      const res = await axios.post(
        "http://localhost:5000/api/v1/cashout/totdp",
        body,
        config
      );

      toast({
        position: "top",
        title: "Token Transfer Successful",
        description: "",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      onClose();
      await getUserDetails(token);
    } catch (error) {
      console.log(error);
      let msg = error.message;
      if (error.response && error.response.data) {
        msg = error.response.data.msg;
      }
      toast({
        position: "top",
        title: "Server Error",
        description: msg,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="font-sans">
      <Navbar />
      <section className="my-8 font-sans min-h-screen md:px-64 lg:px-64">
        <h1 className="text-4xl font-bold text-left ml-8 my-8">My Account</h1>

        <section className="mx-4 my-8 md:mx-8 md:my-16 lg:mx-8 lg:my-16">
          <div className="flex border-b-2 pb-4 flex items-center flex-row">
            <CgProfile className="text-xl mr-2" />
            <h1 className="text-xl font-bold text-left">Profile</h1>
          </div>
          <div className="my-4 flex flex-row">
            <p className="text-base">Email : </p>
            <p className="text-base ml-2">{user && user.email}</p>
          </div>
          <div className="my-4 flex flex-row">
            <p className="text-base">Referral Code : </p>
            <p className="text-base ml-2 cursor-pointer" onClick={copyText}>
              {" " + user && user.referralID}
            </p>
          </div>
          <div className="my-4 flex flex-row">
            <p className="text-base">Email verified ? : </p>
            <p className="text-base ml-2">
              {user && user.verified ? "Yes" : "No"}
            </p>
          </div>
          <div className="my-4 flex flex-row">
            <p className="text-base">AI Points Consumed : </p>
            <p className="text-base ml-2">
              {user && user.aiPoints && user.aiPoints.toFixed(2)}
            </p>
          </div>
        </section>

        <section className="mx-4 my-8 md:mx-8 md:my-16 lg:mx-8 lg:my-16">
          <div className="flex border-b-2 pb-4 flex items-center flex-row">
            <BsCashCoin className="text-xl mr-2" />
            <h1 className="text-xl font-bold text-left">Crypto Cashout</h1>
          </div>
          <div className="my-4 flex flex-row">
            <p className="text-base">TDP token balance : </p>

            <p className="text-base ml-2">{user && user.tokenReward}</p>
          </div>
          <div className="my-4 flex flex-row">
            <p className="text-base">TDP token contract : </p>
            <p className="text-base">
            0xA26261e6EB882bcd24eF164e6D066131972C1716
            </p>
          </div>
          <div className="my-4 flex flex-row">
            <p className="text-base">
              Import the above contract address using the instructions{" "}
              <a
                href="https://consensys.net/blog/metamask/how-to-add-your-custom-tokens-in-metamask/"
                target="_blank"
                className="text-blue-800"
              >
                given here
              </a>
            </p>
          </div>
          <div className="hidden md:block lg:block">
            {!address ? (
              <div className="flex flex-row justify-start">
                <Button onClick={connectWallet} marginBottom="4">
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="my-4 flex flex-row">
                <p className="text-base">Wallet Address Detected: </p>
                <p className="text-base ml-2">{address}</p>
              </div>
            )}
          </div>
          <div className="flex flex-row items-start">
            <button
              onClick={onOpen}
              className="rounded-md px-8 py-2 bg-emerald-500"
            >
              Cashout
            </button>
          </div>
        </section>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cashout Tokens</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="amount">
                    Amount of tokens (max {user.tokenReward})
                  </FormLabel>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    variant="filled"
                    onChange={(e) => onChange(e)}
                    value={formData.amount}
                    autoComplete="off"
                  />
                </FormControl>

                <FormControl>
                  <div className="flex flex-row items-center">
                    <FormLabel htmlFor="walletAddress">
                      Polygon MATIC Address
                    </FormLabel>
                  </div>
                  <Input
                    id="walletAddress"
                    name="walletAddress"
                    type="text"
                    variant="filled"
                    onChange={(e) => onChange(e)}
                    value={formData.walletAddress}
                    autoComplete="off"
                  />
                </FormControl>

                <Button onClick={formSubmit} colorScheme="green" width="full">
                  Confirm
                </Button>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Footer />
      </section>
    </div>
  );
}

export default Account;
