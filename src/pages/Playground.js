import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Textarea } from "@chakra-ui/react";
import axios from "axios";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import {  updateTokens } from "../reducers/user.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Wallet from "../components/Wallet";
import { getUserDetails } from "../actions/loadUser";


function Playground() {
  let [value, setValue] = useState("");
  const [temperature, changeTemperature] = useState(0.7);
  const [length, changeLength] = useState(100);
  const [topP, changeTopP] = useState(0.7);
  const [fPenalty, changeFPenalty] = useState(1);
  const [pPenalty, changePPenalty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [title, changeTitle] = useState("");
  const [description, changeDescription] = useState("");
  const [wordCount, changeWordCount] = useState("0");
  const [fork, changeFork] = useState("");
  const [isEdit, changeEdit] = useState(false);

  let navigate = useNavigate();
  let location = useLocation();

  const handleTitleChange = (e) => {
    let text = e.target.value;
    if (text.length >= 280) {
      return toast({
        position: "top",
        title: "Title can have a maximum of 280 characters",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (text.split(" ").length >= 80) {
      return toast({
        position: "top",
        title: "Title can have a maximum of 80 words",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    changeTitle(e.target.value);
  };
  const handleDescriptionChange = (e) => changeDescription(e.target.value);

  const tokenReward = useSelector((state) => state.user.tokenReward);
  const aiPoints = useSelector((state) => state.user.aiPoints);
  const token = useSelector((state) => state.user.token);
  const referralID = useSelector((state) => state.user.referralID);
  const userEmail = useSelector((state) => state.user.email);
  const loggedIn = useSelector((state) => state.user.loggedIn);

  const toast = useToast();

  const dispatch = useDispatch();

  useEffect(() => {
    if (location && location.state) {
      setValue(location.state.content);
      changeTitle(location.state.title);
      changeDescription(location.state.description);
      changeWordCount(location.state.wordCount);
      if (location.state.isForked) {
        console.log("forked from");
        //when forked make editing mode false
        changeEdit(false);
        changeFork(location.state.id);
      } else {
        changeEdit(true);
      }
    }
  }, []);

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    changeWordCount(inputValue.split(" ").length);
    setValue(inputValue);
  };

  const generatePrompt = async () => {
    if (!loggedIn) {
      return toast({
        position: "top",
        title: "Login to continue !",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (wordCount > 2000) {
      return toast({
        position: "top",
        title: "Max word limit reached, use the text between ''' as prompt",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    //interpretor - ** check for ''' for prompt limiting**
    let prompt = value;

    prompt = title + prompt;

    if (value.includes("'''")) {
      let firstIndex = value.indexOf("'''");
      let secondIndex = value.indexOf("'''", firstIndex + 3);
      console.log(firstIndex, secondIndex);
      prompt = value.substring(firstIndex + 3, secondIndex);
    }

    if (value.includes("[")) {
      let firstIndex = value.indexOf("[");
      let secondIndex = value.indexOf("]");
      console.log(firstIndex, secondIndex);
      let substringToRemove = value.substring(firstIndex, secondIndex + 1);
      prompt = prompt.replace("[", "");
      prompt = prompt.replace("]", "");
      let currValue = value;
      currValue = currValue.replace(substringToRemove, "");
      value = value.replace(substringToRemove, "");
      console.log("substring to remove:", substringToRemove);
      console.log("current value", currValue);
      setValue(currValue);
    }
    console.log(prompt);
    prompt = prompt + " ";
    changeWordCount(value.split(" ").length);

    try {
      setLoading(true);

      if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = {
        prompt,
        temperature: temperature,
        max_tokens: length,
        top_p: topP,
        frequency_penalty: fPenalty,
        presence_penalty: pPenalty,
      };
      console.log(body);
      const res = await axios.post(
        "https://technologydao.herokuapp.com/api/v1/write/prompt",
        body,
        config
      );

      console.log(res.data);



      const tokens = res.data.aiPoints;

      console.log(tokens);

      // dispatch(updateTokens(tokens));
      getUserDetails(token);

      setValue(value + res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  const draft = async () => {

    if (!title) {
      return toast({
        position: "top",
        title: "Title is empty !",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!loggedIn) {
      return toast({
        position: "top",
        title: "Login to continue !",
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

      if (!isEdit) {
        const body = {
          title,
          description,
          content: value,
          wordCount,
          authorEmail: userEmail,
          published: false
        };

        const res = await axios.post(
          "https://technologydao.herokuapp.com/api/v1/articles/create",
          body,
          config
        );

        toast({
          position: "top",
          title: "Draft Saved Successfully",
          description: "",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        navigate("/dashboard");
      } else {
        const body = {
          id: location.state.id,
          title,
          description,
          content: value,
          wordCount,
          published: false
        };

        const res = await axios.patch(
          "https://technologydao.herokuapp.com/api/v1/articles/update",
          body,
          config
        );

        toast({
          position: "top",
          title: "Updated Successfully",
          description: "",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
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

  // const publishPaid = async () => {
  //   if (!title) {
  //     return toast({
  //       position: "top",
  //       title: "Title is empty !",
  //       description: "",
  //       status: "error",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   }

  //   if(!value){
  //     return toast({
  //       position: "top",
  //       title: "Content is empty !",
  //       description: "",
  //       status: "error",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   }
  //   if (!loggedIn) {
  //     return toast({
  //       position: "top",
  //       title: "Login to continue !",
  //       description: "",
  //       status: "error",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   }
  //   try {
  //     if (token) {
  //       axios.defaults.headers.common["x-auth-token"] = token;
  //     }

  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     if (!isEdit) {
  //       const body = {
  //         title,
  //         description,
  //         content: value,
  //         wordCount,
  //         authorEmail: userEmail,
  //         published: true,
  //         forkedFrom: fork ? fork : null
  //       };

  //       const res = await axios.post(
  //         "https://technologydao.herokuapp.com/api/v1/articles/createPaid",
  //         body,
  //         config
  //       );

  //       toast({
  //         position: "top",
  //         title: "Published Successfully",
  //         description: "",
  //         status: "success",
  //         duration: 9000,
  //         isClosable: true,
  //       });

  //       navigate("/dashboard");
  //     } else {
  //       const body = {
  //         id: location.state.id,
  //         title,
  //         description,
  //         content: value,
  //         wordCount,
  //         published: true,
  //         forkedFrom: fork ? fork : null
  //       };

  //       const res = await axios.post(
  //         "https://technologydao.herokuapp.com/api/v1/articles/updatePaid",
  //         body,
  //         config
  //       );

  //       toast({
  //         position: "top",
  //         title: "Updated Successfully",
  //         description: "",
  //         status: "success",
  //         duration: 9000,
  //         isClosable: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     let msg = error.message;
  //     if (error.response && error.response.data) {
  //       msg = error.response.data.msg;
  //     }
  //     toast({
  //       position: "top",
  //       title: "Server Error",
  //       description: msg,
  //       status: "error",
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   }
  // };


  const publish = async () => {
    if (!title) {
      return toast({
        position: "top",
        title: "Title is empty !",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if(!value){
      return toast({
        position: "top",
        title: "Content is empty !",
        description: "",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!loggedIn) {
      return toast({
        position: "top",
        title: "Login to continue !",
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

      if (!isEdit) {
        const body = {
          title,
          description,
          content: value,
          wordCount,
          authorEmail: userEmail,
          published: true,
          forkedFrom: fork ? fork : null
        };

        const res = await axios.post(
          "https://technologydao.herokuapp.com/api/v1/articles/create",
          body,
          config
        );

        toast({
          position: "top",
          title: "Published Successfully",
          description: "",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        navigate("/dashboard");
      } else {
        const body = {
          id: location.state.id,
          title,
          description,
          content: value,
          wordCount,
          published: true,
          forkedFrom: fork ? fork : null
        };

        const res = await axios.patch(
          "https://technologydao.herokuapp.com/api/v1/articles/update",
          body,
          config
        );

        toast({
          position: "top",
          title: "Updated Successfully",
          description: "",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
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
    <div>
      <Navbar />

      <section className="my-8 px-2 md:px-4 lg:px-4 flex flex-col md:flex-row lg:flex-row">
        <div className="md:w-[80%] lg:w-[80%] h-[32rem] md:px-4 lg:px-4 flex flex-col">
          {fork && (
            <Text textAlign="left" marginBottom="2rem">
              This article is forked, view{" "}
              <Link to={"/article/" + fork}>
                <Text as="span" color="green">
                  original
                </Text>
              </Link>
            </Text>
          )}
          <FormControl marginBottom="1rem">
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={handleTitleChange} type="text" />
          </FormControl>

          {/* <FormControl marginBottom="1rem">
            <FormLabel>Description</FormLabel>
            <Input
              value={description}
              onChange={handleDescriptionChange}
              type="text"
            />
          </FormControl> */}

          <FormLabel>Content</FormLabel>
          <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder="Write your story"
            size="md"
            resize="none"
            minHeight="80%"
          />
          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between">
            {loading ? (
              <>
                <button
                  onClick={generatePrompt}
                  className="my-4 rounded-md md:w-[20%] lg:w-[20%] px-8 py-2 bg-emerald-500"
                >
                  <div className="flex flex-row items-center">
                    <Spinner></Spinner>
                    <p className="ml-2">Write for me</p>
                  </div>
                </button>
              </>
            ) : (
              <button
                onClick={generatePrompt}
                className="my-4 rounded-md md:w-[20%] lg:w-[20%] px-8 py-2 bg-emerald-500"
              >
                Write for me
              </button>
            )}
            <button
              onClick={draft}
              className="my-4 rounded-md md:w-[20%] lg:w-[20%] px-8 py-2 bg-emerald-500"
            >
              Save
            </button>
            <button
              onClick={publish}
              className="my-4 rounded-md md:w-[20%] lg:w-[20%] px-8 py-2 bg-emerald-500"
            >
              Publish
            </button>
            {/* <button
              onClick={publishPaid}
              className="my-4 rounded-md md:w-[20%] lg:w-[20%] px-8 py-2 bg-emerald-500"
            >
              Publish by Paying
            </button> */}
          </div>
        </div>

        <div className="relative md:w-[20%] lg:w-[20%] mt-72 md:mt-0 ld:mt-0 flex flex-col items-center">
          {/* {loggedIn && <Wallet />} */}

          <section className="md:mt-8 lg:mt-8 md:absolute lg:absolute md:top-4 lg:top-4">
            <div className="px-2 py-4 w-full">
            <Stat>
              <StatLabel>AI Points</StatLabel>
              <StatNumber>{aiPoints ? aiPoints.toFixed(2) : 0.0}</StatNumber>
            </Stat>
          </div>

            {/* <div className="px-2 py-4 w-full">
            <Stat>
              <StatLabel>Referral Code</StatLabel>
              <StatNumber>{referralID ? referralID : "N.A"}</StatNumber>
            </Stat>
          </div> */}

            {/* <div className="flex flex-row px-2 py-4 w-full">
            <p>{referralID}</p>
            <button
              onClick={() => navigator.clipboard.writeText(referralID)}
              className="text-sm bg-[#E9C46A] rounded-xl px-2"
            >
              Copy to clipboard
            </button>
          </div> */}

            <div className="px-2 py-4 w-full">
              <div className="flex flex-row justify-between">
                <p className="text-base">Randomness</p>
                <p className="text-base">{temperature.toFixed(2)}</p>
              </div>
              <Slider
                colorScheme="green"
                max={1}
                step={0.01}
                aria-label="slider-ex-6"
                onChange={(val) => changeTemperature(val)}
                defaultValue={0.7}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </div>

            <div className="px-2 py-4 w-full">
              <div className="flex flex-row justify-between">
                <p className="text-base">Number of words</p>
                <p className="text-base">{length}</p>
              </div>
              <Slider
                colorScheme="green"
                max={768}
                aria-label="slider-ex-6"
                onChange={(val) => changeLength(val)}
                defaultValue={length}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </div>

            <div className="px-2 py-4 w-full">
              <div className="flex flex-row justify-between">
                <p className="text-base">Diversity in Thought</p>
                <p className="text-base">{topP.toFixed(2)}</p>
              </div>
              <Slider
                colorScheme="green"
                max={1}
                step={0.01}
                aria-label="slider-ex-6"
                onChange={(val) => changeTopP(val)}
                defaultValue={0.7}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </div>

            <div className="px-2 py-4 w-full">
              <div className="flex flex-row justify-between">
                <p className="text-base">Prevent Repetition Factor</p>
                <p className="text-base">{fPenalty.toFixed(2)}</p>
              </div>
              <Slider
                colorScheme="green"
                max={2}
                step={0.01}
                aria-label="slider-ex-6"
                onChange={(val) => changeFPenalty(val)}
                defaultValue={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </div>

            <div className="px-2 py-4 w-full">
              <div className="flex flex-row justify-between">
                <p className="text-base">Presence Penalty</p>
                <p className="text-base">{pPenalty.toFixed(2)}</p>
              </div>
              <Slider
                colorScheme="green"
                max={2}
                step={0.01}
                aria-label="slider-ex-6"
                onChange={(val) => changePPenalty(val)}
                defaultValue={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Playground;
