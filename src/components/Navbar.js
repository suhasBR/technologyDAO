import React, { useEffect } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Box,
  VStack,
  FormControl,
  FormLabel,
  useToast,
  Avatar,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Tabs, TabPanels, TabPanel, TabList, Tab } from "@chakra-ui/react";
import { useFormik } from "formik";
import axios from "axios";
import { useSelector } from "react-redux";
import { getUserDetails } from "../actions/loadUser";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineWallet } from "react-icons/ai";
import Wallet from "./Wallet";

function Navbar({ openDialog, tab }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const token = user.token;
  const memberType = user.memberType;

  const toast = useToast();
  const btnRef = React.useRef();

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const upgradeToProFunction = async (req, res) => {
    try {
      if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
      }

      const res = await axios.get(
        `https://technologydao.herokuapp.com/api/v1/users/upgradeToPro`
      );

      await getUserDetails(token);

      toast({
        position: "top",
        title: "Success",
        description: "Upgraded to pro successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      onClose2();
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

  useEffect(() => {
    // console.log("here in navbar:" + openDialog);
    if (openDialog) {
      console.log("opening the dialog");
      onOpen();
    }
  }, [openDialog]);

  //conversion tracking
  // function gtag_report_conversion(url) {
  //   var callback = function () {
  //     if (typeof(url) != 'undefined') {
  //       window.location = url;
  //     }
  //   };
  //   gtag('event', 'conversion', {
  //       'send_to': 'AW-10953385751/tFMcCOzFydcDEJfO_eYo',
  //       'event_callback': callback
  //   });
  //   return false;
  // }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const userData = JSON.stringify(values, null, 2);
      console.log("userdata", userData);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const body = {
          email: formik.values.email,
          password: formik.values.password,
        };

        console.log(body);

        const res = await axios.post(
          "https://technologydao.herokuapp.com/api/v1/users/login",
          body,
          config
        );

        //store token and user details

        await getUserDetails(res.data.token);

        toast({
          position: "top",
          title: "Success",
          description: "Login Successful",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        onClose();
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
    },
  });

  const formik2 = useFormik({
    initialValues: {
      email: "",
      password: "",
      password2: "",
      referralID: "prSpfX",
    },
    onSubmit: async (values) => {
      const userData = JSON.stringify(values, null, 2);
      console.log("userdata", userData);
      const { password, password2 } = userData;

      if (password !== password2) {
        toast({
          position: "top",
          title: "Error",
          description: "Passwords do not match !",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };

          const body = {
            email: formik2.values.email,
            password: formik2.values.password,
            referralID: formik2.values.referralID,
          };

          console.log(body);

          const res = await axios.post(
            "https://technologydao.herokuapp.com/api/v1/users/register",
            body,
            config
          );

          //conversion update for campaign
          window.gtag("event", "conversion", {
            send_to: "AW-10953385751/gBvbCO6q-tQDEJfO_eYo",
          });
          //store token and user details

          await getUserDetails(res.data.token);

          toast({
            position: "top",
            title: "Success",
            description: "Account Created",
            status: "success",
            duration: 9000,
            isClosable: true,
          });

          onClose();
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
      }
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const openDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="font-sans px-4 py-4 flex flex-row justify-between items-center shadow">
      <div className="flex flex-row justify-evenly items-center">
        <Link to="/">
          <div className="flex md:flex-row lg:flex-row flex-col">
            <img
              className="w-8 h-8 mr-2"
              src="/images/daologo.webp"
              alt="logo"
            />
            <p className="text-xs -ml-2 text-slate-500">Pre-alpha</p>
          </div>
        </Link>
        {/* <h2 className="text-xl font-center mx-2">TechnologyDAO</h2> */}
        <Link to="/">
          <h2 className="md:block lg:block text-xl font-medium font-center mx-2 text-emerald-500">
            Read
          </h2>
        </Link>
        <Link to="/playground">
          <h2 className="md:block lg:block text-xl font-medium font-center mx-2 text-emerald-500">
            Write
          </h2>
        </Link>
        {user && user.loggedIn && (
          <Link to="/dashboard">
            <h2 className="hidden md:block lg:block text-xl font-medium font-center mx-2 text-emerald-500">
              Dashboard
            </h2>
          </Link>
        )}
      </div>
      <div className="flex flex-row">
        {user && user.loggedIn ? (
          <div className="flex flex-row items-center">
            {/* <button
            onClick={onOpen}
            className="rounded-md px-8 py-2 mr-4 bg-emerald-500"
          >
            Verify Email
          </button> */}
            <button
              ref={btnRef}
              onClick={onOpen1}
              className="rounded-full px-4 mr-4"
            >
              <AiOutlineWallet fontSize="1.5rem" />
            </button>
            {memberType && memberType === "basic" && (
              <Button
                onClick={onOpen2}
                className="rounded-md px-8 py-2 bg-emerald-500 mr-4"
              >
                Upgrade to Pro
              </Button>
            )}

            <div className="">
              <Avatar width="30px" height="30px" />
            </div>
            {/* <p className="text-sm ml-2"></p> */}
            <div className="z-50">
              <Menu>
                <MenuButton
                  as={Button}
                  backgroundColor="white"
                  rightIcon={<ChevronDownIcon />}
                >
                  {isLargerThan768 ? user.email.split("@")[0] : ""}
                  {memberType && memberType === "pro" && (
                    <Badge ml="1" colorScheme="green">
                      PRO
                    </Badge>
                  )}
                </MenuButton>
                <MenuList>
                  {!isLargerThan768 && (
                    <MenuItem onClick={openDashboard}>Dashboard</MenuItem>
                  )}
                  <Link to="/account">
                    <MenuItem>My Account</MenuItem>
                  </Link>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpen}
            className="rounded-md px-8 py-2 bg-emerald-500"
          >
            Login
          </button>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login/Signup</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs defaultIndex={tab}>
              <TabList>
                <Tab>Login</Tab>
                <Tab>Signup</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Box bg="white" p={6} rounded="md">
                    <form onSubmit={formik.handleSubmit}>
                      <VStack spacing={4} align="flex-start">
                        <FormControl>
                          <FormLabel htmlFor="email">Email Address</FormLabel>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            variant="filled"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            variant="filled"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            autoComplete="off"
                          />
                        </FormControl>

                        <Button type="submit" colorScheme="green" width="full">
                          Login
                        </Button>
                      </VStack>
                    </form>
                  </Box>
                </TabPanel>

                <TabPanel>
                  <Box bg="white" p={6} rounded="md">
                    <form onSubmit={formik2.handleSubmit}>
                      <VStack spacing={4} align="flex-start">
                        <FormControl>
                          <FormLabel htmlFor="email">Email Address</FormLabel>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            variant="filled"
                            onChange={formik2.handleChange}
                            value={formik2.values.email}
                            autoComplete="off"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            variant="filled"
                            onChange={formik2.handleChange}
                            value={formik2.values.password}
                            autoComplete="off"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor="password2">
                            Re-enter Password
                          </FormLabel>
                          <Input
                            id="password2"
                            name="password2"
                            type="password"
                            variant="filled"
                            onChange={formik2.handleChange}
                            value={formik2.values.password2}
                            autoComplete="off"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor="referralID">
                            Referral ID
                          </FormLabel>
                          <Input
                            id="referralID"
                            name="referralID"
                            type="text"
                            variant="filled"
                            onChange={formik2.handleChange}
                            value={formik2.values.referralID}
                            autoComplete="off"
                          />
                        </FormControl>

                        <Button type="submit" colorScheme="green" width="full">
                          Signup
                        </Button>
                      </VStack>
                    </form>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Drawer
        isOpen={isOpen1}
        placement="right"
        onClose={onClose1}
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
            <Button variant="outline" mr={3} onClick={onClose1}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <AlertDialog
        isOpen={isOpen2}
        leastDestructiveRef={cancelRef}
        onClose={onClose2}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm
            </AlertDialogHeader>

            <AlertDialogBody>
              This costs 1000 tokens. Proceed further ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose2}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={upgradeToProFunction} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>{" "}
    </div>
  );
}

export default Navbar;
