import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import { SkeletonText, useToast, Box, Avatar, Tooltip} from "@chakra-ui/react";
import { Link } from "react-router-dom";

function Feed() {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user);
  const toast = useToast();
  const [showLogin, changeShowLogin] = useState(false);
  const [articles, updateArticles] = useState([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        if (token) {
          axios.defaults.headers.common["x-auth-token"] = token;
        }
        const res = await axios.get(
          `http://localhost:5000/api/v1/articles/getAllArticles`
        );
        console.log(res.data);
        updateArticles(res.data.articles);
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
    loadArticles();
  }, []);

  const handleLogin = () => {
    console.log(showLogin);
    changeShowLogin(!showLogin);
  };

  return (
    <div>
      {showLogin ? (
        <Navbar openDialog={true} tab={1} />
      ) : (
        <Navbar openDialog={false} tab={0} />
      )}
      <section className="my-8 font-sans min-h-screen">
        {user && !user.loggedIn && (
          <section className="border-b-2 pb-8 mx-4 flex px-4 flex-col w-100 justify-evenly items-center md:flex-row lg:flex-row md:px-32 lg:px-32">
            <div className="flex flex-col">
              <div className="font-sans flex flex-col items-center md:px-72 lg:px-48 my-4">
                <h1 className="text-2xl font-bold">What is Technology DAO ?</h1>
                <p className="my-4">
                  TechnologyDAO is a decentralized community / platform that
                  allows you to publish AI augmented articles. You can earn
                  money by publishing articles and contributing to the platform
                </p>
              </div>
              <div className="flex flex-col md:flex-row lg:flex-row md:justify-evenly lg:justify-evenly">
                <div className="w-64 p-8 mb-8 flex flex-col items-center border rounded-xl bg-gradient-to-r from-[#84FAB0] to-[#8FD3F4]">
                  <img
                    className="w-24 h-24"
                    src="/images/landing/first.png"
                    alt="first image"
                  />
                  <p className="text-xl font-bold mt-4">
                    An AI based tool/platform that co-writes with you
                  </p>
                </div>

                <div className="w-64 p-8 mb-8 flex flex-col items-center border rounded-xl bg-gradient-to-r from-[#D4FC79] to-[#96E6A1]">
                  <img
                    className="w-24 h-24"
                    src="/images/landing/second.png"
                    alt="first image"
                  />
                  <p className="text-xl font-bold mt-4">
                    Publish articles and write about new topics to earn tokens
                  </p>
                </div>

                <div className="w-64 p-8 mb-8 flex flex-col items-center border rounded-xl bg-gradient-to-r from-[#43E97B] to-[#38F9D7]">
                  <img
                    className="w-24 h-24"
                    src="/images/landing/third.png"
                    alt="first image"
                  />

                  <p className="text-xl font-bold mt-4">
                    Refer your friends and earn tokens when they write
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleLogin}
                  className="w-48 shadow-xl my-8 text-[#d16383] font-bold font-sans rounded-full border px-8 py-2"
                >
                  JOIN US NOW
                </button>
              </div>
            </div>
          </section>
        )}

        {user && !user.loggedIn && (
          <section className="border-b-2 py-16 mx-4 flex px-4 flex-col w-100 justify-evenly items-center md:flex-row lg:flex-row md:px-32 lg:px-32">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold font-sans">
                Create Posts in Seconds
                <br />
                Writing is now as easy as speaking
              </h2>
              <h2 className="mt-8 text-2xl font-bold font-sans">
                Join TechnologyDAO and <br />
                Earn Crypto for Using AI to Write
                <br />
                [Web3 features + crypto, DAO coming soon]
              </h2>
            </div>

            <div className="w-48 h-48 md:w-64 lg:w-64 md:h-64 lg:h-64">
              <img
                className="w-100 h-100"
                src="/images/feedimage.png"
                alt="image"
              />
            </div>
          </section>
        )}

        {user && !user.loggedIn && (
          <section className="border-b-2 py-16 mx-4 flex px-4 py-8 flex-col w-100 justify-evenly md:items-center lg:items-center md:flex-row lg:flex-row md:px-32 lg:px-32">
            <div className="flex flex-col items-center md:w-96 lg:w-96">
              <h2 className="text-2xl font-bold font-sans">
                Earn tokens for writing with our tools Truly own your content
                with NFTs.
              </h2>
              <h2 className="mt-8 text-2xl font-bold font-sans">
                Fork other people's ideas, thoughts with our writing tools and
                develop upon them Evolve a train of thoughts by forking and
                co-creating with AI
              </h2>
            </div>
            <div className="w-64 h-32 md:w-[50%] lg:w-[50%] md:h-72 lg:h-72">
              <img
                className="w-100 h-100"
                src="/images/final_v1.gif"
                alt="gif"
              ></img>
            </div>
          </section>
        )}

        <section className="md:px-64 lg:px-64">
          <h1 className="text-4xl font-bold text-left ml-8 my-8">
            All Stories
          </h1>
          <div className="p-4 my-8 flex flex-col text-left">
            {articles ? (
              articles.map((article) => {
                return (
                  <Link key={article._id} to={"/article/" + article._id}>
                    <div className="px-4 py-4 border-b-2 flex flex-col cursor-pointer">
                      <div className="flex flex-col md:flex-row lg:flex-row justify-between md:items-center lg:items-center">
                        <h2 className="font-title font-bold text-2xl mt-2">
                          {article.title}
                        </h2>
                        <div className="flex flex-row items-center">
                          {article.boostAmount > 0 && (
                            <Tooltip
                              label="boosted article"
                              aria-label="boosted article"
                            >
                              <p className="mx-2">&#x1F680;</p>
                            </Tooltip>
                          )}
                          <p className="text-slate-400">
                            {article &&
                              article.createdAt &&
                              article.createdAt.split("T")[0]}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-row items-center mb-4">
                        <Avatar
                          width="1rem"
                          height="1rem"
                          marginRight="0.5rem"
                        />
                        <p className="text-slate-400 text-sm">
                          {article &&
                            article.authorEmail &&
                            article.authorEmail.split("@")[0]}
                        </p>
                      </div>

                      <p className="text-base font-description leading-6 font-normal text-[#292929]">
                        {article && article.content.substring(0, 300) + "...."}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <>
                <Box padding="6" marginBottom="1rem" bg="white" width="70%">
                  <SkeletonText mt="4" noOfLines={4} spacing="4" />
                </Box>
                <Box padding="6" marginBottom="1rem" bg="white" width="70%">
                  <SkeletonText mt="4" noOfLines={4} spacing="4" />
                </Box>
              </>
            )}
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
}

export default Feed;
