import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import state from "../store";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");



  // -----------------------------
  // TAB CONTENT
  // -----------------------------
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;

      case "filepicker":
        return (
          <FilePicker
            file={file}
            setFile={setFile}
            readFile={readFile}
          />
        );

      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );

      default:
        return null;
    }
  };

  // -----------------------------
  // AI IMAGE GENERATION
  // -----------------------------
  const handleSubmit = async (type) => {
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    try {
      setGeneratingImg(true);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dalle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      // 🔥 CRITICAL SAFETY CHECK
      if (!data?.photo) {
        console.error("DALL·E failed:", data);
        alert("Image generation failed. Check server logs.");
        return;
      }

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  // -----------------------------
  // APPLY DECALS
  // -----------------------------
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    if (!decalType) return;

    state[decalType.stateProperty] = result;

    if (type === 'logo') {
        state.isLogoTexture = true;
        state.isFullTexture = false;
    } else if (type === 'full') {
        state.isLogoTexture = false;
        state.isFullTexture = true;
    }
  };

  // -----------------------------
  // FILE UPLOAD
  // -----------------------------
  const readFile = (type) => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to read file");
      });
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          {/* LEFT PANEL */}
          <motion.div
            key="customizer"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          {/* GO BACK */}
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
