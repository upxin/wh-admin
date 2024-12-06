import presetWeapp from "unocss-preset-weapp";
import {
  extractorAttributify,
  transformerClass,
} from "unocss-preset-weapp/transformer";
import { presetIcons } from "unocss";

const { presetWeappAttributify, transformerAttributify } =
  extractorAttributify();

export default {
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      designWidth: 390,
    }),
    // attributify autocomplete
    presetWeappAttributify(),
    presetIcons(),
  ],
  theme: {
    colors: {
      primary: "var(--wot-color-theme)",
      fff: "#fff",
      main: "#f5f5f5",
      second: "#f9f9f9",
    },
  },
  shortcuts: [
    {
      "border-base": "border border-[#ccc] border-1rpx  border-solid",
      "border-d": "border border-[#ccc] border-1rpx  border-dashed",
      center: "flex justify-center items-center",
      "center-col": "flex flex-col justify-center items-center",
    },
  ],
  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
};
