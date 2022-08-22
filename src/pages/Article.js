import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { TimeIcon } from "@chakra-ui/icons";
import {
  Divider,
  useToast,
  Box,
  SkeletonText,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormLabel,
} from "@chakra-ui/react";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineEdit, AiOutlineFork, AiOutlineWallet } from "react-icons/ai";
import { Tooltip } from "@chakra-ui/react";
import Wallet from "../components/Wallet";
import { getUserDetails } from "../actions/loadUser";

function Article() {
  const toast = useToast();
  const user = useSelector((state) => state.user);
  const [article, updateArticle] = useState({});
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const [boostAmount, changeBoostAmount] = useState(0);

  useEffect(() => {
    const loadStory = async () => {
      try {
        const storyID =
          window.location.href.split("/")[
            window.location.href.split("/").length - 1
          ];
        // console.log(storyID);

        const res = await axios.get(
          `http://localhost:5000/api/v1/articles/getArticlesById/${storyID}`
        );
        console.log(res.data.article);
        updateArticle(res.data.article);
      } catch (error) {
        console.log(error);
        let msg = error.message;
        if (error.response.data) {
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
    loadStory();
  }, []);

  const edit = async () => {
    //navigate to edit also pass state
    navigate("/playground", {
      state: {
        id: article._id,
        title: article.title,
        description: article.description,
        content: article.content,
        wordCount: article.wordCount,
        isForked: false,
      },
    });
  };

  const fork = async () => {
    navigate("/playground", {
      state: {
        id: article._id,
        title: article.title,
        description: article.description,
        content: article.content,
        wordCount: article.wordCount,
        isForked: true,
      },
    });
  };

  const upVoteArticle = async (req, res) => {
    if (user && !user.loggedIn) {
      return toast({
        position: "top",
        title: "Login to upvote",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    try {
      if (user && user.token) {
        axios.defaults.headers.common["x-auth-token"] = user.token;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        articleID: article._id,
        upvotes: 1,
      };

      const res = await axios.post(
        "http://localhost:5000/api/v1/articles/upvote",
        body,
        config
      );
      console.log(res.data.updatedArticle);
      updateArticle(res.data.updatedArticle);
    } catch (error) {
      console.log(error);
      let msg = error.message;
      if (error.response.data) {
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

  const boostArticle = async () => {
    if (parseInt(boostAmount) < 0) {
      return toast({
        position: "top",
        title: "Tokens spent is 0!",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (parseInt(boostAmount) > 100) {
      return toast({
        position: "top",
        title: "Max amount for boosting is 100",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    try {
      if (user && user.token) {
        axios.defaults.headers.common["x-auth-token"] = user.token;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let tomorrow = new Date();
      tomorrow = tomorrow.setDate(tomorrow.getDate() + 1);

      const body = {
        articleID: article._id,
        boostAmount: boostAmount,
        boostUntil: tomorrow,
      };

      const res = await axios.post(
        "http://localhost:5000/api/v1/articles/boostArticle",
        body,
        config
      );
      console.log(res.data.updatedArticle);
      updateArticle(res.data.updatedArticle);

      await getUserDetails(user.token);

      onClose1();

      toast({
        position: "top",
        title: "Success",
        description: "Successful",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      let msg = error.message;
      if (error.response.data) {
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
    <div>
      <Navbar />
      <section className="w-full flex flex-row relative">
        <div className="fixed md:top-[20%] lg:top-[20%] bottom-4 left-4 md:left-16 lg:left-16 flex flex-row md:flex-col lg:flex-col items-center w-[40%] md:w-auto lg:w-auto justify-evenly">
          {article && article.author === user.id && article.published && (
            <Button onClick={onOpen1}>
              <span className="hidden md:inline lg:inline">Boost</span>
              &#x1F680;
            </Button>
          )}
          {article.published && (
            <Button onClick={upVoteArticle}>
              <span className="hidden md:inline lg:inline">Upvote</span>
              &#x1F44D; {article && article.upvotes}
            </Button>
          )}
        </div>
        <section className="my-16 px-8 md:px-72 lg:px-72">
          {article ? (
            <div className="flex flex-col" ket={article._id}>
              <div className="flex flex-row w-full justify-between">
                <h2 className="font-title text-3xl font-bold text-left">
                  {article.title}
                </h2>
              </div>

              <div className="flex my-4 flex-row justify-start">
                {article.author === user.id ? (
                  <Tooltip label="edit article" aria-label="edit-article">
                    <button
                      className="rounded-full p-2 border border-gray"
                      onClick={edit}
                    >
                      <AiOutlineEdit />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip label="edit article" aria-label="edit-article">
                    <button
                      className="rounded-full p-2 border border-gray"
                      onClick={fork}
                    >
                      <AiOutlineFork />
                    </button>
                  </Tooltip>
                )}
                {user && user.loggedIn && (
                  <Tooltip label="open wallet" aria-label="open wallet">
                    <button
                      ref={btnRef}
                      onClick={onOpen}
                      className="ml-2 rounded-full p-2 border border-gray"
                    >
                      <AiOutlineWallet />
                    </button>
                  </Tooltip>
                )}
              </div>

              <div className="flex md:flex-row lg:flex-row flex-col justify-between">
                <div className="flex text-slate-500 flex-row items-center justify-start">
                  <Avatar width="18px" marginRight="5px" height="18px" />
                  <p className="">
                    {article &&
                      article.authorEmail &&
                      article.authorEmail.split("@")[0]}
                  </p>
                </div>

                <div className="flex flex-row items-center justify-start">
                  <p className="mr-2 -mt-1">
                    <TimeIcon />
                  </p>
                  <p className="text-slate-500">
                    {article &&
                      article.createdAt &&
                      article.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="text-left font-description text-xl">
                {article && article.description}
              </div>
              <Divider />
              <div className="my-12 font-description text-left text-xl">
                {article &&
                  article.content &&
                  article.content
                    .split("\n")
                    .map((str) => <p className="mb-8">{str}</p>)}
              </div>

              {article && article.cidURL && (
                <>
                  <Divider />
                  <div className="my-12 font-description text-left text-xl">
                    <p className="italic">
                      This article is also stored on the decentralized web using
                      Interplanetary File System technology.{" "}
                      <a
                        className="text-blue-900"
                        target="_blank"
                        href={`https://ipfs.io/ipfs/${article.cidURL}`}
                      >
                        Click here
                      </a>{" "}
                      to view
                    </p>
                  </div>
                  <Divider />
                </>
              )}
            </div>
          ) : (
            <div>
              <Box padding="6" marginBottom="1rem" bg="white" width="70%">
                <SkeletonText mt="4" noOfLines={4} spacing="4" />
              </Box>
              <Divider />
              <Box padding="6" marginBottom="1rem" bg="white" width="70%">
                <SkeletonText mt="4" noOfLines={4} spacing="4" />
              </Box>
            </div>
          )}
        </section>
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Wallet</DrawerHeader>

            <DrawerBody>
              <Wallet />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </section>
      <Modal isOpen={isOpen1} onClose={onClose1}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Boost Article</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel htmlFor="amount">
              Enter the tokens to spend on Boosting this article for a day (100
              max)
            </FormLabel>
            <Input
              id="amount"
              name="amount"
              type="text"
              variant="filled"
              onChange={(e) => changeBoostAmount(e.target.value)}
              value={boostAmount}
              autoComplete="off"
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose1}>
              Close
            </Button>
            <Button onClick={boostArticle} variant="ghost">
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Footer />
    </div>
  );
}

export default Article;
