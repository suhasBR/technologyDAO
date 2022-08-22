import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SkeletonText, useToast, Box } from "@chakra-ui/react";
import { Link, Navigate } from "react-router-dom";

function Dashboard() {
  const token = useSelector((state) => state.user.token);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const dispatch = useDispatch();
  const toast = useToast();
  const [articles, updateArticles] = useState([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        if (token) {
          axios.defaults.headers.common["x-auth-token"] = token;
        }
        const res = await axios.get(
          "https://technologydao.herokuapp.com/api/v1/articles/getArticlesByOwner"
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

  if (!loggedIn) {
    return <Navigate to="/"></Navigate>;
  }

  return (
    <div>
      <Navbar />
      <section className="my-8 font-sans md:px-64 lg:px-64">
        <h1 className="text-4xl font-bold text-left ml-8">Draft Stories</h1>
        <div className="p-4 mt-4 flex flex-col h-full text-left">
          {articles ? (
            articles.filter((article) => article.published === false).length >
            0 ? (
              articles
                .filter((article) => article.published === false)
                .map((article) => {
                  return (
                    <Link key={article._id} to={"/article/" + article._id}>
                      <div className="px-4 py-4 border-b-2 flex flex-col cursor-pointer">
                        <div className="flex flex-col md:flex-row lg:flex-row justify-between md:items-center lg:items-center">
                          <h2 className="font-bold text-2xl my-2">
                            {article.title}
                          </h2>
                          <p className="text-slate-400">
                            {article.createdAt.split("T")[0]}
                          </p>
                        </div>

                        <p className="text-base font-description leading-6 font-normal text-[#292929]">
                          {article &&
                            article.content.substring(0, 300) + "...."}
                        </p>
                      </div>
                    </Link>
                  );
                })
            ) : (
              <div className="text-center text-slate-500 align-center pt-16">
                <h2 className="text-2xl">Nothing in Draft</h2>
              </div>
            )
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

      <section className="mt-32 font-sans md:px-64 lg:px-64">
        <h1 className="text-4xl font-bold text-left ml-8">Published Stories</h1>
        <div className="p-4 mt-4 flex flex-col h-full text-left">
          {articles ? (
            articles.filter((article) => article.published === true).length >
            0 ? (
              articles
                .filter((article) => article.published === true)
                .map((article) => {
                  return (
                    <Link key={article._id} to={"/article/" + article._id}>
                      <div className="px-4 py-4 border-b-2 flex flex-col cursor-pointer">
                        <div className="flex flex-col md:flex-row lg:flex-row justify-between md:items-center lg:items-center">
                          <h2 className="font-bold text-2xl my-2">
                            {article.title}
                          </h2>
                          <p className="text-slate-400">
                            {article.createdAt.split("T")[0]}
                          </p>
                        </div>

                        <p className="text-base font-description leading-6 font-normal text-[#292929]">
                          {article &&
                            article.content.substring(0, 300) + "...."}
                        </p>
                      </div>
                    </Link>
                  );
                })
            ) : (
              <div className="text-center text-slate-500 align-center pt-16">
                <h2 className="text-2xl">Nothing in published</h2>
                <Link to="/playground">
                  <button className="rounded-md px-8 py-2 bg-emerald-500 text-white my-4">
                    Write a story
                  </button>
                </Link>
              </div>
            )
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
      <Footer />
    </div>
  );
}

export default Dashboard;
