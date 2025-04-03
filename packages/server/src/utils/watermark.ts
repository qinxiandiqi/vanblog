import Jimp from 'jimp';

export const addWaterMarkToIMG = async (srcImage: Buffer, waterMarkText: string) => {
  // 水印距离右下角百分比
  const LOGO_MARGIN_PERCENTAGE = 5 / 100;
  const logo = await generateWaterMark(waterMarkText);
  // Use type assertion to access the read method
  const image = await (Jimp as any).read(srcImage);

  // 将 logo 等比缩小 10 倍
  // logo.resize(inputGif.width / 10, Jimp.AUTO);

  const xMargin = image.bitmap.width * LOGO_MARGIN_PERCENTAGE;
  const yMargin = image.bitmap.width * LOGO_MARGIN_PERCENTAGE;

  const X = image.bitmap.width - logo.bitmap.width - xMargin;
  const Y = image.bitmap.height - logo.bitmap.height - yMargin;

  //@ts-ignore
  const newImage = image.composite(logo, X, Y, {
    mode: (Jimp as any).BLEND_SOURCE_OVER,
    opacitySource: 0.8,
    opacityDest: 1,
  });

  return await newImage.getBufferAsync(newImage.getMIME());
};

export const generateWaterMark: any = async (waterMark: string) => {
  // Use type assertion to access the font and read methods
  const font = await (Jimp as any).loadFont((Jimp as any).FONT_SANS_128_WHITE);
  const logo = await (Jimp as any).read(500, 150, 0x00000000);
  logo.print(font, 0, 0, waterMark, 500);
  //@ts-ignore
  logo.color([{ apply: 'mix', params: ['#a7a7a7', 100] }]);
  return logo;
};
